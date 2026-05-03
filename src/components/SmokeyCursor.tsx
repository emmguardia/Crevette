// @ts-nocheck
// WebGL fluid simulation — Pavel Dobryakov's algorithm, ported.
// Tuned for a *very subtle* trail behind the cursor.
import { useEffect, useRef } from 'react'

export default function SmokeyCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const config = {
      SIM_RESOLUTION: 128,
      DYE_RESOLUTION: 1024,
      DENSITY_DISSIPATION: 4.5,
      VELOCITY_DISSIPATION: 3,
      PRESSURE: 0.1,
      PRESSURE_ITERATIONS: 18,
      CURL: 2,
      SPLAT_RADIUS: 0.15,
      SPLAT_FORCE: 2200,
      SHADING: true,
      COLOR_UPDATE_SPEED: 4,
      COLOR_INTENSITY: 0.05,
      TRANSPARENT: true,
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    let gl: any, ext: any
    let pointers = [{
      id: -1, texcoordX: 0, texcoordY: 0,
      prevTexcoordX: 0, prevTexcoordY: 0,
      deltaX: 0, deltaY: 0,
      down: false, moved: false,
      color: { r: 0, g: 0, b: 0 },
    }]
    let dye: any, velocity: any, divergence: any, curlFBO: any, pressureFBO: any
    let lastUpdateTime = Date.now()
    let colorUpdateTimer = 0
    let copyProgram: any, clearProgram: any, splatProgram: any, advectionProgram: any
    let divergenceProgram: any, curlProgram: any, vorticityProgram: any, pressureProgram: any
    let gradientSubtractProgram: any, displayMaterial: any
    let blit: any
    let animationId = 0

    const initWebGL = () => {
      const params = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false }
      gl = canvas.getContext('webgl2', params) || canvas.getContext('webgl', params)
      if (!gl) throw new Error('WebGL not supported')

      const isWebGL2 = 'drawBuffers' in gl
      let supportLinearFiltering = false
      let halfFloat: any = null

      if (isWebGL2) {
        gl.getExtension('EXT_color_buffer_float')
        supportLinearFiltering = !!gl.getExtension('OES_texture_float_linear')
      } else {
        halfFloat = gl.getExtension('OES_texture_half_float')
        supportLinearFiltering = !!gl.getExtension('OES_texture_half_float_linear')
      }
      gl.clearColor(0, 0, 0, 1)
      const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : (halfFloat && halfFloat.HALF_FLOAT_OES) || 0

      let formatRGBA, formatRG, formatR
      if (isWebGL2) {
        formatRGBA = getSupportedFormat(gl.RGBA16F, gl.RGBA, halfFloatTexType)
        formatRG = getSupportedFormat(gl.RG16F, gl.RG, halfFloatTexType)
        formatR = getSupportedFormat(gl.R16F, gl.RED, halfFloatTexType)
      } else {
        formatRGBA = getSupportedFormat(gl.RGBA, gl.RGBA, halfFloatTexType)
        formatRG = getSupportedFormat(gl.RGBA, gl.RGBA, halfFloatTexType)
        formatR = getSupportedFormat(gl.RGBA, gl.RGBA, halfFloatTexType)
      }
      ext = { formatRGBA, formatRG, formatR, halfFloatTexType, supportLinearFiltering }
      if (!ext.supportLinearFiltering) {
        config.DYE_RESOLUTION = 256
        config.SHADING = false
      }
    }

    const getSupportedFormat = (internalFormat: any, format: any, type: any): any => {
      if (!supportRenderTextureFormat(internalFormat, format, type)) {
        if ('drawBuffers' in gl) {
          if (internalFormat === gl.R16F) return getSupportedFormat(gl.RG16F, gl.RG, type)
          if (internalFormat === gl.RG16F) return getSupportedFormat(gl.RGBA16F, gl.RGBA, type)
        }
        return null
      }
      return { internalFormat, format }
    }

    const supportRenderTextureFormat = (internalFormat: any, format: any, type: any) => {
      const texture = gl.createTexture()
      if (!texture) return false
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null)
      const fbo = gl.createFramebuffer()
      if (!fbo) return false
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
      return gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE
    }

    const compileShader = (type: any, source: string, keywords?: string[] | null) => {
      let src = source
      if (keywords) src = keywords.map(k => `#define ${k}\n`).join('') + source
      const sh = gl.createShader(type)
      gl.shaderSource(sh, src)
      gl.compileShader(sh)
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(sh))
      return sh
    }

    const createProgram = (vs: any, fs: any) => {
      const p = gl.createProgram()
      gl.attachShader(p, vs); gl.attachShader(p, fs); gl.linkProgram(p)
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) console.error(gl.getProgramInfoLog(p))
      return p
    }

    const getUniforms = (program: any) => {
      const u: any = {}
      const n = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)
      for (let i = 0; i < n; i++) {
        const info = gl.getActiveUniform(program, i)
        if (info) u[info.name] = gl.getUniformLocation(program, info.name)
      }
      return u
    }

    class Program {
      program: any; uniforms: any
      constructor(vs: any, fs: any) {
        this.program = createProgram(vs, fs)
        this.uniforms = this.program ? getUniforms(this.program) : {}
      }
      bind() { gl.useProgram(this.program) }
    }

    class Material {
      vertexShader: any; fragmentShaderSource: string
      programs: any = {}; activeProgram: any = null; uniforms: any = {}
      constructor(vs: any, fsSource: string) { this.vertexShader = vs; this.fragmentShaderSource = fsSource }
      setKeywords(kws: string[]) {
        let hash = 0
        for (const k of kws) hash += this.hash(k)
        let p = this.programs[hash]
        if (!p) {
          const fs = compileShader(gl.FRAGMENT_SHADER, this.fragmentShaderSource, kws)
          p = createProgram(this.vertexShader, fs)
          this.programs[hash] = p
        }
        if (p === this.activeProgram) return
        this.uniforms = getUniforms(p)
        this.activeProgram = p
      }
      hash(s: string) {
        let h = 0
        for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0 }
        return h
      }
      bind() { if (this.activeProgram) gl.useProgram(this.activeProgram) }
    }

    const baseVertex = `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform vec2 texelSize;
      void main() {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }`

    const copyFrag = `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv; uniform sampler2D uTexture;
      void main() { gl_FragColor = texture2D(uTexture, vUv); }`

    const clearFrag = `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv; uniform sampler2D uTexture; uniform float value;
      void main() { gl_FragColor = value * texture2D(uTexture, vUv); }`

    const displayFragSrc = `
      precision highp float; precision highp sampler2D;
      varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform sampler2D uTexture; uniform vec2 texelSize;
      void main() {
        vec3 c = texture2D(uTexture, vUv).rgb;
        #ifdef SHADING
          vec3 lc = texture2D(uTexture, vL).rgb;
          vec3 rc = texture2D(uTexture, vR).rgb;
          vec3 tc = texture2D(uTexture, vT).rgb;
          vec3 bc = texture2D(uTexture, vB).rgb;
          float dx = length(rc) - length(lc);
          float dy = length(tc) - length(bc);
          vec3 n = normalize(vec3(dx, dy, length(texelSize)));
          vec3 l = vec3(0.0, 0.0, 1.0);
          float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
          c *= diffuse;
        #endif
        float a = max(c.r, max(c.g, c.b));
        gl_FragColor = vec4(c, a);
      }`

    const splatFrag = `
      precision highp float; precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTarget; uniform float aspectRatio;
      uniform vec3 color; uniform vec2 point; uniform float radius;
      void main() {
        vec2 p = vUv - point.xy; p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
      }`

    const advectionFrag = `
      precision highp float; precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uVelocity; uniform sampler2D uSource;
      uniform vec2 texelSize; uniform vec2 dyeTexelSize;
      uniform float dt; uniform float dissipation;
      vec4 bilerp(sampler2D sam, vec2 uv, vec2 tsize) {
        vec2 st = uv / tsize - 0.5; vec2 iuv = floor(st); vec2 fuv = fract(st);
        vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
        vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
        vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
        vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
        return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
      }
      void main() {
        #ifdef MANUAL_FILTERING
          vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
          vec4 result = bilerp(uSource, coord, dyeTexelSize);
        #else
          vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
          vec4 result = texture2D(uSource, coord);
        #endif
        float decay = 1.0 + dissipation * dt;
        gl_FragColor = result / decay;
      }`

    const divergenceFrag = `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR; varying highp vec2 vT; varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main() {
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;
        vec2 C = texture2D(uVelocity, vUv).xy;
        if (vL.x < 0.0) L = -C.x;
        if (vR.x > 1.0) R = -C.x;
        if (vT.y > 1.0) T = -C.y;
        if (vB.y < 0.0) B = -C.y;
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }`

    const curlFrag = `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR; varying highp vec2 vT; varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main() {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        gl_FragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
      }`

    const vorticityFrag = `
      precision highp float; precision highp sampler2D;
      varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform sampler2D uVelocity; uniform sampler2D uCurl;
      uniform float curl; uniform float dt;
      void main() {
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C; force.y *= -1.0;
        vec2 vel = texture2D(uVelocity, vUv).xy;
        vel += force * dt; vel = clamp(vel, -1000.0, 1000.0);
        gl_FragColor = vec4(vel, 0.0, 1.0);
      }`

    const pressureFrag = `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR; varying highp vec2 vT; varying highp vec2 vB;
      uniform sampler2D uPressure; uniform sampler2D uDivergence;
      void main() {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float divergence = texture2D(uDivergence, vUv).x;
        gl_FragColor = vec4((L + R + B + T - divergence) * 0.25, 0.0, 0.0, 1.0);
      }`

    const gradientFrag = `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR; varying highp vec2 vT; varying highp vec2 vB;
      uniform sampler2D uPressure; uniform sampler2D uVelocity;
      void main() {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 vel = texture2D(uVelocity, vUv).xy;
        vel.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(vel, 0.0, 1.0);
      }`

    const initShaders = () => {
      const baseV = compileShader(gl.VERTEX_SHADER, baseVertex)
      copyProgram = new Program(baseV, compileShader(gl.FRAGMENT_SHADER, copyFrag))
      clearProgram = new Program(baseV, compileShader(gl.FRAGMENT_SHADER, clearFrag))
      splatProgram = new Program(baseV, compileShader(gl.FRAGMENT_SHADER, splatFrag))
      advectionProgram = new Program(baseV, compileShader(gl.FRAGMENT_SHADER, advectionFrag, ext.supportLinearFiltering ? null : ['MANUAL_FILTERING']))
      divergenceProgram = new Program(baseV, compileShader(gl.FRAGMENT_SHADER, divergenceFrag))
      curlProgram = new Program(baseV, compileShader(gl.FRAGMENT_SHADER, curlFrag))
      vorticityProgram = new Program(baseV, compileShader(gl.FRAGMENT_SHADER, vorticityFrag))
      pressureProgram = new Program(baseV, compileShader(gl.FRAGMENT_SHADER, pressureFrag))
      gradientSubtractProgram = new Program(baseV, compileShader(gl.FRAGMENT_SHADER, gradientFrag))
      displayMaterial = new Material(baseV, displayFragSrc)
    }

    const initBlit = () => {
      const buf = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW)
      const ebuf = gl.createBuffer()
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebuf)
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW)
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(0)
      blit = (target: any, doClear = false) => {
        if (!target) {
          gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
          gl.bindFramebuffer(gl.FRAMEBUFFER, null)
        } else {
          gl.viewport(0, 0, target.width, target.height)
          gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo)
        }
        if (doClear) { gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT) }
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
      }
    }

    const createFBO = (w: number, h: number, internalFormat: any, format: any, type: any, param: any) => {
      gl.activeTexture(gl.TEXTURE0)
      const tex = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null)
      const fbo = gl.createFramebuffer()
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0)
      gl.viewport(0, 0, w, h); gl.clear(gl.COLOR_BUFFER_BIT)
      return {
        texture: tex, fbo, width: w, height: h,
        texelSizeX: 1 / w, texelSizeY: 1 / h,
        attach(id: number) { gl.activeTexture(gl.TEXTURE0 + id); gl.bindTexture(gl.TEXTURE_2D, tex); return id },
      }
    }

    const createDoubleFBO = (w: number, h: number, internalFormat: any, format: any, type: any, param: any) => {
      const a = createFBO(w, h, internalFormat, format, type, param)
      const b = createFBO(w, h, internalFormat, format, type, param)
      return {
        width: w, height: h, texelSizeX: a.texelSizeX, texelSizeY: a.texelSizeY,
        read: a, write: b,
        swap() { const t = this.read; this.read = this.write; this.write = t },
      }
    }

    const getResolution = (resolution: number) => {
      const w = gl.drawingBufferWidth, h = gl.drawingBufferHeight
      const aspect = w / h
      const a = aspect < 1 ? 1 / aspect : aspect
      const min = Math.round(resolution), max = Math.round(resolution * a)
      return w > h ? { width: max, height: min } : { width: min, height: max }
    }

    const scaleByPR = (n: number) => Math.floor(n * (window.devicePixelRatio || 1))

    const initFramebuffers = () => {
      const simRes = getResolution(config.SIM_RESOLUTION)
      const dyeRes = getResolution(config.DYE_RESOLUTION)
      const t = ext.halfFloatTexType
      const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST
      gl.disable(gl.BLEND)
      if (!dye) dye = createDoubleFBO(dyeRes.width, dyeRes.height, ext.formatRGBA.internalFormat, ext.formatRGBA.format, t, filtering)
      if (!velocity) velocity = createDoubleFBO(simRes.width, simRes.height, ext.formatRG.internalFormat, ext.formatRG.format, t, filtering)
      divergence = createFBO(simRes.width, simRes.height, ext.formatR.internalFormat, ext.formatR.format, t, gl.NEAREST)
      curlFBO = createFBO(simRes.width, simRes.height, ext.formatR.internalFormat, ext.formatR.format, t, gl.NEAREST)
      pressureFBO = createDoubleFBO(simRes.width, simRes.height, ext.formatR.internalFormat, ext.formatR.format, t, gl.NEAREST)
    }

    const updateKeywords = () => {
      const k: string[] = []
      if (config.SHADING) k.push('SHADING')
      displayMaterial.setKeywords(k)
    }

    const HSVtoRGB = (h: number, s: number, v: number) => {
      let r = 0, g = 0, b = 0
      const i = Math.floor(h * 6), f = h * 6 - i
      const p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s)
      switch (i % 6) {
        case 0: r = v; g = t; b = p; break
        case 1: r = q; g = v; b = p; break
        case 2: r = p; g = v; b = t; break
        case 3: r = p; g = q; b = v; break
        case 4: r = t; g = p; b = v; break
        case 5: r = v; g = p; b = q; break
      }
      return { r, g, b }
    }

    // Cyber palette: violet/cyan/pink hues
    const PALETTE_HUES = [0.72, 0.82, 0.55, 0.92] // violet, magenta, cyan, pink
    const generateColor = () => {
      const hue = PALETTE_HUES[Math.floor(Math.random() * PALETTE_HUES.length)] + (Math.random() - 0.5) * 0.05
      const c = HSVtoRGB(hue, 0.85, 1.0)
      c.r *= config.COLOR_INTENSITY
      c.g *= config.COLOR_INTENSITY
      c.b *= config.COLOR_INTENSITY
      return c
    }

    const wrap = (v: number, min: number, max: number) => {
      const r = max - min
      return r === 0 ? min : ((v - min) % r) + min
    }

    const calcDt = () => {
      const now = Date.now()
      let dt = (now - lastUpdateTime) / 1000
      dt = Math.min(dt, 0.016666)
      lastUpdateTime = now
      return dt
    }

    const resizeCanvas = () => {
      const w = scaleByPR(canvas.clientWidth)
      const h = scaleByPR(canvas.clientHeight)
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; return true }
      return false
    }

    const updateColors = (dt: number) => {
      colorUpdateTimer += dt * config.COLOR_UPDATE_SPEED
      if (colorUpdateTimer >= 1) {
        colorUpdateTimer = wrap(colorUpdateTimer, 0, 1)
        pointers.forEach(p => { p.color = generateColor() })
      }
    }

    const splat = (x: number, y: number, dx: number, dy: number, color: any) => {
      splatProgram.bind()
      gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0))
      gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height)
      gl.uniform2f(splatProgram.uniforms.point, x, y)
      gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0)
      gl.uniform1f(splatProgram.uniforms.radius, correctRadius(config.SPLAT_RADIUS / 100))
      blit(velocity.write); velocity.swap()

      gl.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0))
      gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b)
      blit(dye.write); dye.swap()
    }

    const correctRadius = (r: number) => canvas.width / canvas.height > 1 ? r * (canvas.width / canvas.height) : r

    const splatPointer = (p: any) => {
      const dx = p.deltaX * config.SPLAT_FORCE, dy = p.deltaY * config.SPLAT_FORCE
      splat(p.texcoordX, p.texcoordY, dx, dy, p.color)
    }

    const applyInputs = () => {
      for (const p of pointers) if (p.moved) { p.moved = false; splatPointer(p) }
    }

    const step = (dt: number) => {
      gl.disable(gl.BLEND)

      curlProgram.bind()
      gl.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY)
      gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0))
      blit(curlFBO)

      vorticityProgram.bind()
      gl.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY)
      gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0))
      gl.uniform1i(vorticityProgram.uniforms.uCurl, curlFBO.attach(1))
      gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL)
      gl.uniform1f(vorticityProgram.uniforms.dt, dt)
      blit(velocity.write); velocity.swap()

      divergenceProgram.bind()
      gl.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY)
      gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0))
      blit(divergence)

      clearProgram.bind()
      gl.uniform1i(clearProgram.uniforms.uTexture, pressureFBO.read.attach(0))
      gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE)
      blit(pressureFBO.write); pressureFBO.swap()

      pressureProgram.bind()
      gl.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY)
      gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0))
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(pressureProgram.uniforms.uPressure, pressureFBO.read.attach(1))
        blit(pressureFBO.write); pressureFBO.swap()
      }

      gradientSubtractProgram.bind()
      gl.uniform2f(gradientSubtractProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY)
      gl.uniform1i(gradientSubtractProgram.uniforms.uPressure, pressureFBO.read.attach(0))
      gl.uniform1i(gradientSubtractProgram.uniforms.uVelocity, velocity.read.attach(1))
      blit(velocity.write); velocity.swap()

      advectionProgram.bind()
      gl.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY)
      if (!ext.supportLinearFiltering) gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY)
      const vid = velocity.read.attach(0)
      gl.uniform1i(advectionProgram.uniforms.uVelocity, vid)
      gl.uniform1i(advectionProgram.uniforms.uSource, vid)
      gl.uniform1f(advectionProgram.uniforms.dt, dt)
      gl.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION)
      blit(velocity.write); velocity.swap()

      if (!ext.supportLinearFiltering) gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY)
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0))
      gl.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1))
      gl.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION)
      blit(dye.write); dye.swap()
    }

    const drawDisplay = () => {
      const w = gl.drawingBufferWidth, h = gl.drawingBufferHeight
      displayMaterial.bind()
      if (config.SHADING) gl.uniform2f(displayMaterial.uniforms.texelSize, 1 / w, 1 / h)
      gl.uniform1i(displayMaterial.uniforms.uTexture, dye.read.attach(0))
      blit(null, false)
    }

    const render = () => {
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
      gl.enable(gl.BLEND)
      drawDisplay()
    }

    const updateFrame = () => {
      const dt = calcDt()
      if (resizeCanvas()) initFramebuffers()
      updateColors(dt); applyInputs(); step(dt); render()
      animationId = requestAnimationFrame(updateFrame)
    }

    const updatePointerMove = (p: any, posX: number, posY: number) => {
      p.prevTexcoordX = p.texcoordX; p.prevTexcoordY = p.texcoordY
      p.texcoordX = posX / canvas.width; p.texcoordY = 1 - posY / canvas.height
      const ar = canvas.width / canvas.height
      let dx = p.texcoordX - p.prevTexcoordX
      let dy = p.texcoordY - p.prevTexcoordY
      if (ar < 1) dx *= ar
      if (ar > 1) dy /= ar
      p.deltaX = dx; p.deltaY = dy
      p.moved = Math.abs(dx) > 0 || Math.abs(dy) > 0
    }

    const onMove = (e: PointerEvent) => {
      const p = pointers[0]
      updatePointerMove(p, scaleByPR(e.clientX), scaleByPR(e.clientY))
    }

    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(animationId)
      else { lastUpdateTime = Date.now(); animationId = requestAnimationFrame(updateFrame) }
    }

    try {
      initWebGL()
      initShaders()
      initBlit()
      updateKeywords()
      initFramebuffers()
      window.addEventListener('pointermove', onMove, { passive: true })
      document.addEventListener('visibilitychange', onVisibility)
      animationId = requestAnimationFrame(updateFrame)
    } catch (e) {
      console.warn('SmokeyCursor disabled:', e)
    }

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] h-full w-full mix-blend-screen opacity-60"
    />
  )
}

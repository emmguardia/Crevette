import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})

// jsdom/happy-dom don't ship matchMedia / IntersectionObserver / ResizeObserver —
// framer-motion's `whileInView` and our `prefers-reduced-motion` check rely on them.
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })

  class IO {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  }
  // @ts-expect-error — minimal mock is enough for framer-motion's whileInView
  window.IntersectionObserver = IO

  class RO {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = RO as unknown as typeof ResizeObserver

  // happy-dom doesn't always provide scrollTo on elements
  if (!Element.prototype.scrollTo) {
    Element.prototype.scrollTo = () => {}
  }
}

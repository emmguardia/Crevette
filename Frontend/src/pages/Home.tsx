import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Shield, Network, Code2 } from 'lucide-react'

const SKILLS = [
  'Cybersécurité',
  'Réseau',
  'Pare-feu',
  'VPN',
  'Linux',
  'Python',
  'Crochet 🧶',
  'Cuisine',
  'Curiosité',
  'Documentation',
]

const STATS = [
  { value: '20', label: 'ans' },
  { value: '1ʳᵉ', label: 'année à Guardia' },
  { value: '∞', label: 'idées de projets' },
]

const FEATURES = [
  {
    icon: Shield,
    title: 'Cybersécurité',
    desc: "Sécurisation de l'infrastructure, accès distant, supervision.",
  },
  {
    icon: Network,
    title: 'Réseau',
    desc: "Conception, configuration et déploiement complet d'un réseau d'entreprise.",
  },
  {
    icon: Code2,
    title: 'Polyvalente',
    desc: "De l'analyse des besoins à la documentation finale, du début à la fin.",
  },
]

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="relative mx-auto max-w-6xl px-5 pt-20 pb-24 md:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs text-ink-200"
        >
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
          </span>
          Étudiante en cybersécurité · Guardia
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-[5.5rem]"
        >
          Salut, moi c'est
          <br />
          <span className="text-gradient">Quianne.</span>
          <span className="ml-2 inline-block h-[0.85em] w-[0.06em] translate-y-[0.08em] bg-current animate-blink" />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-6 max-w-xl text-lg text-ink-300"
        >
          20 ans, étudiante chez <span className="text-white">Guardia Cybersecurity School</span>.
          J'aime la cuisine, le crochet, parler — et apprendre tout ce qui touche aux réseaux et à
          la sécu.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-9 flex flex-wrap gap-3"
        >
          <Link
            to="/projects"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-violet-soft via-fuchsia-soft to-amber-soft px-6 py-3 font-medium text-ink-950 shadow-lg shadow-violet-soft/25 transition-transform hover:-translate-y-0.5"
          >
            Voir mes projets
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 font-medium text-white transition-colors hover:bg-white/[0.07]"
          >
            Me contacter
          </Link>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid max-w-2xl grid-cols-3 gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur"
        >
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <div className="font-display text-3xl font-bold text-white sm:text-4xl">
                {s.value}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-ink-300">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Marquee skills */}
      <section className="relative overflow-hidden border-y border-white/5 bg-white/[0.02] py-6">
        <div className="flex animate-[marquee_40s_linear_infinite] gap-3 whitespace-nowrap">
          {[...SKILLS, ...SKILLS, ...SKILLS].map((s, i) => (
            <span
              key={`${s}-${i}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-sm text-ink-200"
            >
              <Sparkles className="size-3.5 text-violet-soft" /> {s}
            </span>
          ))}
        </div>
        <style>{`@keyframes marquee { to { transform: translateX(-33.333%); } }`}</style>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <div className="grid gap-5 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-card border border-white/10 bg-white/[0.03] p-6 transition-colors hover:bg-white/[0.05]"
            >
              <div className="mb-4 grid size-11 place-items-center rounded-xl bg-gradient-to-br from-violet-soft/20 to-fuchsia-soft/10 text-violet-soft ring-1 ring-white/10">
                <f.icon className="size-5" />
              </div>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-ink-300">{f.desc}</p>
              <div className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-gradient-to-br from-violet-soft/20 to-transparent opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-violet-soft/[0.08] via-fuchsia-soft/[0.04] to-amber-soft/[0.04] p-10 sm:p-16">
          <div className="absolute -right-32 -top-32 size-72 rounded-full bg-violet-soft/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 size-72 rounded-full bg-fuchsia-soft/20 blur-3xl" />
          <div className="relative">
            <h3 className="max-w-2xl font-display text-3xl font-bold sm:text-4xl">
              Curieux·se de voir ce que je fabrique ?
            </h3>
            <p className="mt-4 max-w-xl text-ink-200">
              Mes projets, mon parcours, et même un petit jeu du pendu pour passer le temps.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-medium text-ink-950 hover:bg-ink-100"
              >
                Mes projets <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/game"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 font-medium text-white hover:bg-white/[0.08]"
              >
                Jouer au pendu
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

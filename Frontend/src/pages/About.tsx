import { motion } from 'framer-motion'
import SectionHeading from '@/components/SectionHeading'
import { GraduationCap, MapPin, Heart } from 'lucide-react'

const TIMELINE = [
  { year: '2025', title: 'Guardia Cybersecurity School', desc: '1ʳᵉ année. Cybersécurité, réseau, sécurité offensive et défensive.', icon: GraduationCap },
  { year: '2024', title: 'Bac obtenu', desc: 'Direction le supérieur, et la cybersécurité m\'a tout de suite plu.', icon: GraduationCap },
  { year: 'Toujours', title: 'Cuisine & crochet', desc: 'Mes deux activités refuges quand je veux décrocher du clavier.', icon: Heart },
]

export default function About() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <SectionHeading kicker="01 — À propos" title="Qui suis-je ?" subtitle="Étudiante en cybersécurité, fan de cuisine et de crochet, et toujours curieuse." />

      <div className="grid gap-10 md:grid-cols-[auto_1fr] md:items-center">
        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto md:mx-0"
        >
          <div className="absolute -inset-4 animate-spin-slow rounded-full opacity-50 blur-2xl"
               style={{ background: 'conic-gradient(from 180deg, #c4b5fd, #f5d0fe, #fde68a, #c4b5fd)' }} />
          <div className="relative grid size-56 place-items-center rounded-full border-2 border-white/15 bg-gradient-to-br from-violet-900/60 to-fuchsia-900/40 shadow-2xl">
            <span className="font-display text-7xl font-bold text-gradient">Q</span>
          </div>
        </motion.div>

        {/* Bio */}
        <div className="space-y-4">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xl text-white"
          >
            Bonjour ! Je m'appelle <strong className="text-gradient">Quianne</strong>. J'ai 20 ans, j'aime cuisiner, faire du crochet et parler !
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-ink-200 leading-relaxed"
          >
            Je suis actuellement étudiante chez <strong className="text-white">Guardia Cybersecurity School</strong>,
            où je développe mes compétences en cybersécurité et en infrastructure réseau.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap gap-2 pt-2"
          >
            {['Cybersécurité', 'Réseau', 'Linux', 'VPN', 'Crochet 🧶', 'Cuisine 🍳'].map(t => (
              <span key={t} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-ink-200">
                {t}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-4 pt-4 text-sm text-ink-300"
          >
            <span className="inline-flex items-center gap-1.5"><MapPin className="size-4" /> France</span>
            <span className="inline-flex items-center gap-1.5"><GraduationCap className="size-4" /> Guardia Cybersecurity School</span>
          </motion.div>
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-24">
        <h3 className="mb-8 font-display text-2xl font-semibold">Parcours</h3>
        <ol className="relative space-y-6 border-l border-white/10 pl-8">
          {TIMELINE.map((item, i) => (
            <motion.li
              key={item.title}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="relative"
            >
              <span className="absolute -left-[2.65rem] top-1 grid size-9 place-items-center rounded-full border border-white/15 bg-ink-900 text-violet-soft shadow-lg">
                <item.icon className="size-4" />
              </span>
              <div className="rounded-card border border-white/10 bg-white/[0.03] p-5">
                <div className="mb-1 font-mono text-xs uppercase tracking-wider text-violet-soft">{item.year}</div>
                <h4 className="font-display text-lg font-semibold">{item.title}</h4>
                <p className="mt-1 text-sm text-ink-300">{item.desc}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}

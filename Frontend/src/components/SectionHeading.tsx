import { motion } from 'framer-motion'

type Props = {
  kicker: string
  title: string
  subtitle?: string
}

export default function SectionHeading({ kicker, title, subtitle }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
      className="mb-10 flex flex-col gap-3"
    >
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-violet-soft">
        {kicker}
      </span>
      <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {subtitle && <p className="max-w-2xl text-ink-300">{subtitle}</p>}
    </motion.div>
  )
}

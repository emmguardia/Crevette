import { motion } from 'framer-motion'
import { ExternalLink, Globe, Network, Shield } from 'lucide-react'
import SectionHeading from '@/components/SectionHeading'
import TiltCard from '@/components/TiltCard'

const PROJECTS = [
  {
    icon: Globe,
    title: 'Site Web',
    href: 'https://nsibranly.fr/membres/quianneQ/',
    tag: 'Web · NSI',
    desc: 'Mon portfolio personnel hébergé sur mon serveur. HTML, CSS, et beaucoup de patience.',
    tech: ['HTML', 'CSS', 'JS'],
    color: 'from-violet-soft/20 to-fuchsia-soft/10',
  },
  {
    icon: Network,
    title: 'Projet Réseau',
    tag: 'Infrastructure',
    desc: 'Conception et déploiement complet de l\'infrastructure réseau d\'une entreprise : serveurs, postes clients, pare-feu, routage. Système sécurisé avec gestion des droits, accès distant via VPN, supervision réseau. De l\'analyse des besoins à la documentation finale.',
    tech: ['VPN', 'Pare-feu', 'AD', 'Supervision'],
    color: 'from-fuchsia-soft/20 to-amber-soft/10',
  },
  {
    icon: Shield,
    title: 'Cyber & sécurité',
    tag: 'Guardia',
    desc: 'Modules en cours à Guardia : sécurité offensive, défensive, hygiène et bonnes pratiques.',
    tech: ['Linux', 'Python', 'CTF'],
    color: 'from-amber-soft/20 to-violet-soft/10',
  },
] as const

export default function Projects() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <SectionHeading
        kicker="02 — Projets"
        title="Mes projets"
        subtitle="Une sélection de ce que j'ai construit et appris ces derniers temps."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((p, i) => {
          const inner = (
            <div className="relative flex h-full flex-col p-6">
              <div className={`mb-5 grid size-12 place-items-center rounded-xl bg-gradient-to-br ${p.color} text-violet-soft ring-1 ring-white/10`}>
                <p.icon className="size-5" />
              </div>
              <div className="mb-2 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-violet-soft">
                {p.tag}
              </div>
              <h3 className="font-display text-xl font-semibold">{p.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-300">{p.desc}</p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {p.tech.map(t => (
                  <span key={t} className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-xs text-ink-200">
                    {t}
                  </span>
                ))}
              </div>
              {'href' in p && p.href && (
                <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-violet-soft transition-transform group-hover:translate-x-0.5">
                  Visiter <ExternalLink className="size-3.5" />
                </div>
              )}
            </div>
          )

          return (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <TiltCard className="h-full">
                {'href' in p && p.href ? (
                  <a href={p.href} target="_blank" rel="noopener noreferrer" className="block h-full text-inherit no-underline">
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </TiltCard>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

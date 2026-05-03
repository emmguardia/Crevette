import { useEffect, useState } from 'react'
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Github } from 'lucide-react'
import AmbientBackground from './AmbientBackground'
import { cn } from '@/lib/utils'

const NAV = [
  { to: '/', label: 'Accueil' },
  { to: '/about', label: 'À propos' },
  { to: '/projects', label: 'Projets' },
  { to: '/game', label: 'Jeu' },
  { to: '/contact', label: 'Contact' },
] as const

export default function Layout() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div className="relative flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink-950 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-violet-soft"
      >
        Aller au contenu principal
      </a>
      <AmbientBackground />

      <header className="sticky top-0 z-40 border-b border-white/5 backdrop-blur-xl backdrop-saturate-150 bg-ink-950/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link to="/" className="group flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-violet-soft via-fuchsia-soft to-amber-soft text-ink-950 font-display font-bold shadow-lg shadow-violet-soft/30 transition-transform group-hover:scale-105">
              Q
            </span>
            <span className="font-display font-semibold tracking-tight">Cyberfolio</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
            {NAV.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'relative px-4 py-1.5 text-sm font-medium rounded-full transition-colors',
                    isActive ? 'text-ink-950' : 'text-ink-300 hover:text-white',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-soft via-fuchsia-soft to-amber-soft"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com/emmguardia/Crevette"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Code source du site sur GitHub"
              className="hidden md:grid size-9 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-ink-300 hover:text-white hover:bg-white/[0.07] transition-colors"
            >
              <Github className="size-4" />
            </a>
            <button
              type="button"
              onClick={() => setOpen(o => !o)}
              aria-label="Menu"
              className="md:hidden grid size-9 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden border-t border-white/5 bg-ink-950/95 backdrop-blur-xl"
            >
              <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-3">
                {NAV.map(item => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      className={({ isActive }) =>
                        cn(
                          'block rounded-xl px-4 py-3 text-base font-medium transition-colors',
                          isActive
                            ? 'bg-white/10 text-white'
                            : 'text-ink-300 hover:bg-white/5 hover:text-white',
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main id="main" className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-white/5 mt-16">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-sm text-ink-300 sm:flex-row">
          <p>&copy; 2025 Quianne · Cyberfolio</p>
          <p className="font-mono text-xs text-ink-400">
            Built with React · TypeScript · Tailwind v4
          </p>
        </div>
      </footer>
    </div>
  )
}

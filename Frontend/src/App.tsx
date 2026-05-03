import { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Layout from './components/Layout'

// Code-split each route — only the active page ships in the initial bundle.
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Projects = lazy(() => import('./pages/Projects'))
const Game = lazy(() => import('./pages/Game'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.2, 0.7, 0.2, 1] as const } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25 } },
}

function PageWrap({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="enter" exit="exit">
      {children}
    </motion.div>
  )
}

function RouteFallback() {
  return (
    <div className="mx-auto flex min-h-[40vh] max-w-6xl items-center justify-center px-5 py-20">
      <div className="size-10 animate-spin rounded-full border-2 border-white/10 border-t-violet-soft" aria-label="Chargement" role="status" />
    </div>
  )
}

/**
 * Recover the original path saved by /404.html (GitHub Pages SPA fallback)
 * and replace history with it on first paint.
 */
function SpaRedirectRecovery() {
  const navigate = useNavigate()
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('spa-redirect')
      if (saved && saved !== '/') {
        sessionStorage.removeItem('spa-redirect')
        navigate(saved, { replace: true })
      }
    } catch {
      /* sessionStorage may be unavailable in privacy modes — ignore */
    }
  }, [navigate])
  return null
}

export default function App() {
  const location = useLocation()
  return (
    <>
      <SpaRedirectRecovery />
      <Suspense fallback={<RouteFallback />}>
        <Routes location={location}>
          <Route element={<Layout />}>
            <Route
              path="/"
              element={
                <AnimatePresence mode="wait">
                  <PageWrap key="home"><Home /></PageWrap>
                </AnimatePresence>
              }
            />
            <Route path="/about" element={<PageWrap><About /></PageWrap>} />
            <Route path="/projects" element={<PageWrap><Projects /></PageWrap>} />
            <Route path="/game" element={<PageWrap><Game /></PageWrap>} />
            <Route path="/contact" element={<PageWrap><Contact /></PageWrap>} />
            <Route path="*" element={<PageWrap><NotFound /></PageWrap>} />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}

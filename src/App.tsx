import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Game from './pages/Game'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

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

export default function App() {
  const location = useLocation()
  return (
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
  )
}

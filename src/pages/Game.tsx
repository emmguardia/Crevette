import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, Heart, Trophy, Skull } from 'lucide-react'
import SectionHeading from '@/components/SectionHeading'
import { cn } from '@/lib/utils'

const VOCAB = [
  'pomme', 'alphabet', 'philippines', 'sabotage', 'largeur',
  'crochet', 'cuisine', 'reseau', 'guardia', 'cyber', 'pare-feu',
] as const
const MAX_LIVES = 6
const ALPHA = 'abcdefghijklmnopqrstuvwxyz'.split('')

function pick() {
  return VOCAB[Math.floor(Math.random() * VOCAB.length)]
}

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-zà-ÿ-]/g, '')
}

export default function Game() {
  const [word, setWord] = useState(() => pick())
  const [tried, setTried] = useState<Set<string>>(() => new Set())
  const [lives, setLives] = useState(MAX_LIVES)
  const [shake, setShake] = useState(0)

  const display = useMemo(
    () => word.split('').map(c => (c === '-' ? '-' : tried.has(c) ? c : '_')),
    [word, tried],
  )
  const won = display.every(c => c !== '_')
  const lost = lives <= 0 && !won
  const over = won || lost

  const onGuess = useCallback((raw: string) => {
    if (over) return
    const c = normalize(raw).slice(0, 1)
    if (!c || !/^[a-zà-ÿ]$/.test(c) || tried.has(c)) return
    setTried(prev => new Set(prev).add(c))
    if (!word.includes(c)) {
      setLives(l => l - 1)
      setShake(s => s + 1)
    }
  }, [word, tried, over])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'Enter' && over) reset()
      if (e.key.length === 1) onGuess(e.key)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onGuess, over])

  function reset() {
    setWord(pick())
    setTried(new Set())
    setLives(MAX_LIVES)
  }

  return (
    <section className="mx-auto max-w-4xl px-5 py-20">
      <SectionHeading
        kicker="03 — Jeu"
        title="Pendu"
        subtitle="Devine le mot. Tape une lettre au clavier ou clique. Tu as 6 vies."
      />

      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-start">
        <motion.div
          key={shake}
          animate={shake > 0 ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="rounded-card border border-white/10 bg-white/[0.03] p-8 backdrop-blur"
        >
          {/* Stats */}
          <div className="mb-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <div className="mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider text-ink-300">
                <Heart className="size-3.5" /> Vies
              </div>
              <div className="flex gap-1.5">
                {Array.from({ length: MAX_LIVES }).map((_, i) => (
                  <motion.span
                    key={i}
                    initial={false}
                    animate={i < lives ? { scale: 1, opacity: 1 } : { scale: 0.85, opacity: 0.3 }}
                    className={cn(
                      'block size-3 rounded-full',
                      i < lives ? 'bg-gradient-to-br from-rose-300 to-fuchsia-soft' : 'bg-white/10',
                    )}
                  />
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <div className="mb-2 text-xs uppercase tracking-wider text-ink-300">Mot</div>
              <div className="font-mono text-lg text-white">{word.length} lettres</div>
            </div>
          </div>

          {/* Word */}
          <div className="mb-6 flex flex-wrap justify-center gap-1.5 sm:gap-2">
            {display.map((c, i) => (
              <motion.div
                key={`${i}-${c}`}
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className={cn(
                  'flex h-14 w-10 items-end justify-center pb-1 font-display text-2xl font-bold uppercase sm:h-16 sm:w-12 sm:text-3xl',
                  'border-b-2',
                  c === '_'
                    ? 'border-white/30 text-transparent'
                    : c === '-'
                      ? 'border-transparent text-ink-300'
                      : 'border-violet-soft text-gradient',
                )}
              >
                {c === '_' ? '·' : c}
              </motion.div>
            ))}
          </div>

          {/* Status */}
          <AnimatePresence mode="wait">
            {won && (
              <motion.div
                key="won"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="mb-6 flex items-center justify-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-emerald-300"
              >
                <Trophy className="size-4" /> Bravo ! Le mot était <strong className="font-semibold">{word}</strong>.
              </motion.div>
            )}
            {lost && (
              <motion.div
                key="lost"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="mb-6 flex items-center justify-center gap-2 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-rose-300"
              >
                <Skull className="size-4" /> Perdu. Le mot était <strong className="font-semibold">{word}</strong>.
              </motion.div>
            )}
          </AnimatePresence>

          {/* Keyboard */}
          <div className="grid grid-cols-9 gap-1.5 sm:grid-cols-13">
            {ALPHA.map(letter => {
              const isTried = tried.has(letter)
              const isHit = isTried && word.includes(letter)
              const isMiss = isTried && !word.includes(letter)
              return (
                <button
                  key={letter}
                  type="button"
                  onClick={() => onGuess(letter)}
                  disabled={isTried || over}
                  className={cn(
                    'aspect-square rounded-lg border text-sm font-semibold uppercase transition-all',
                    'disabled:cursor-not-allowed',
                    !isTried && 'border-white/15 bg-white/[0.04] text-white hover:border-violet-soft/60 hover:bg-violet-soft/10',
                    isHit && 'border-emerald-400/50 bg-emerald-400/15 text-emerald-200',
                    isMiss && 'border-white/5 bg-white/[0.02] text-ink-400 line-through',
                    over && !isTried && 'opacity-40',
                  )}
                >
                  {letter}
                </button>
              )
            })}
          </div>

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/[0.1]"
            >
              <RotateCcw className="size-4" /> Nouvelle partie
            </button>
          </div>
        </motion.div>

        {/* Hangman SVG */}
        <div className="hidden w-56 md:block">
          <Hangman lives={lives} />
        </div>
      </div>
    </section>
  )
}

function Hangman({ lives }: { lives: number }) {
  const wrong = MAX_LIVES - lives
  const stroke = 'rgba(255,255,255,0.7)'
  return (
    <div className="rounded-card border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-3 font-mono text-[0.7rem] uppercase tracking-wider text-ink-300">Pendu</div>
      <svg viewBox="0 0 200 240" className="w-full" stroke={stroke} strokeWidth="4" strokeLinecap="round" fill="none">
        {/* Gallows */}
        <line x1="20" y1="220" x2="180" y2="220" />
        <line x1="50" y1="220" x2="50" y2="20" />
        <line x1="50" y1="20" x2="140" y2="20" />
        <line x1="140" y1="20" x2="140" y2="50" />
        {/* 1: head */}
        {wrong > 0 && <circle cx="140" cy="70" r="20" />}
        {/* 2: body */}
        {wrong > 1 && <line x1="140" y1="90" x2="140" y2="150" />}
        {/* 3: left arm */}
        {wrong > 2 && <line x1="140" y1="110" x2="115" y2="130" />}
        {/* 4: right arm */}
        {wrong > 3 && <line x1="140" y1="110" x2="165" y2="130" />}
        {/* 5: left leg */}
        {wrong > 4 && <line x1="140" y1="150" x2="120" y2="180" />}
        {/* 6: right leg */}
        {wrong > 5 && <line x1="140" y1="150" x2="160" y2="180" />}
      </svg>
    </div>
  )
}

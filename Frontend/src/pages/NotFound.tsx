import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-5 text-center">
      <div className="font-display text-[8rem] font-bold leading-none text-gradient sm:text-[12rem]">
        404
      </div>
      <p className="mt-2 text-xl text-white">Cette page n'existe pas.</p>
      <p className="mt-1 text-sm text-ink-300">Mais le pendu, lui, existe toujours.</p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-5 py-2.5 font-medium text-white hover:bg-white/[0.1]"
      >
        <Home className="size-4" /> Accueil
      </Link>
    </section>
  )
}

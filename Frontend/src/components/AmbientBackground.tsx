export default function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink-950">
      <div className="absolute inset-0 bg-grid" />

      <div
        className="absolute -top-32 -left-32 h-[42rem] w-[42rem] rounded-full opacity-40 blur-[120px] animate-aurora"
        style={{ background: 'radial-gradient(circle, #6d28d9 0%, transparent 60%)' }}
      />
      <div
        className="absolute top-1/3 -right-40 h-[36rem] w-[36rem] rounded-full opacity-30 blur-[120px] animate-aurora"
        style={{ background: 'radial-gradient(circle, #db2777 0%, transparent 60%)', animationDelay: '-6s' }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-[28rem] w-[28rem] rounded-full opacity-20 blur-[120px] animate-aurora"
        style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 60%)', animationDelay: '-12s' }}
      />

      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(5,5,7,0.85) 100%)' }}
      />
    </div>
  )
}

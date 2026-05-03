import { useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, MapPin, GraduationCap, Send, Check } from 'lucide-react'
import SectionHeading from '@/components/SectionHeading'

type Status = 'idle' | 'sending' | 'sent'

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle')

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const honeypot = (form.elements.namedItem('website') as HTMLInputElement | null)?.value
    if (honeypot) {
      // Almost certainly a bot — pretend success silently.
      setStatus('sent')
      form.reset()
      setTimeout(() => setStatus('idle'), 3000)
      return
    }
    setStatus('sending')
    setTimeout(() => {
      setStatus('sent')
      form.reset()
      setTimeout(() => setStatus('idle'), 3000)
    }, 700)
  }

  return (
    <section className="mx-auto max-w-5xl px-5 py-20">
      <SectionHeading
        kicker="04 — Contact"
        title="On discute ?"
        subtitle="Ne me contactez pas, je préfère être seule. Mais bon, si vraiment vous insistez…"
      />

      <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          onSubmit={onSubmit}
          className="rounded-card border border-white/10 bg-white/[0.03] p-7 backdrop-blur"
        >
          <div className="grid gap-4">
            <Field label="Nom" name="nom" type="text" autoComplete="name" required />
            <Field label="Email" name="email" type="email" autoComplete="email" required />
            <Field label="Message" name="message" autoComplete="off" textarea required />
            {/* Honeypot — bots fill it, humans don't see it. */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              className="absolute h-0 w-0 opacity-0"
              aria-hidden="true"
            />
          </div>
          <div className="mt-6 flex items-center justify-between gap-3">
            <p className="text-xs text-ink-300">
              Aucun message n'est envoyé pour de vrai (frontend only 😉)
            </p>
            <button
              type="submit"
              disabled={status !== 'idle'}
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-violet-soft via-fuchsia-soft to-amber-soft px-5 py-2.5 font-medium text-ink-950 shadow-lg shadow-violet-soft/25 transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <AnimatePresence mode="wait" initial={false}>
                {status === 'sent' ? (
                  <motion.span
                    key="sent"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="inline-flex items-center gap-2"
                  >
                    <Check className="size-4" /> Envoyé
                  </motion.span>
                ) : status === 'sending' ? (
                  <motion.span
                    key="sending"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Envoi…
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="inline-flex items-center gap-2"
                  >
                    Envoyer{' '}
                    <Send className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </motion.form>

        <motion.aside
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-3"
        >
          <InfoCard icon={GraduationCap} label="École" value="Guardia Cybersecurity School" />
          <InfoCard icon={MapPin} label="Localisation" value="France" />
          <InfoCard icon={Mail} label="Email" value="quianne@example.com" />
          <div className="rounded-card border border-white/10 bg-gradient-to-br from-violet-soft/[0.08] via-transparent to-fuchsia-soft/[0.06] p-5">
            <p className="text-sm text-ink-200">
              ✨ Disponible pour discuter de cybersécurité, projets étudiants, ou recettes de
              cookies.
            </p>
          </div>
        </motion.aside>
      </div>
    </section>
  )
}

function Field({
  label,
  name,
  type = 'text',
  textarea,
  required,
  autoComplete,
}: {
  label: string
  name: string
  type?: string
  textarea?: boolean
  required?: boolean
  autoComplete?: string
}) {
  const cls =
    'peer w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 pt-6 pb-2 text-white outline-none transition-all placeholder-transparent focus:border-violet-soft/50 focus:bg-white/[0.06] focus:ring-4 focus:ring-violet-soft/15'
  return (
    <label className="relative block">
      {textarea ? (
        <textarea
          name={name}
          rows={5}
          required={required}
          placeholder={label}
          autoComplete={autoComplete}
          maxLength={5000}
          className={`${cls} min-h-32 resize-y`}
        />
      ) : (
        <input
          type={type}
          name={name}
          required={required}
          placeholder={label}
          autoComplete={autoComplete}
          maxLength={type === 'email' ? 254 : 200}
          className={cls}
        />
      )}
      <span className="pointer-events-none absolute left-4 top-2 text-xs uppercase tracking-wider text-ink-300 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-ink-400 peer-focus:top-2 peer-focus:text-xs peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-violet-soft">
        {label}
      </span>
    </label>
  )
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-card border border-white/10 bg-white/[0.03] p-4">
      <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-violet-soft/20 to-fuchsia-soft/10 text-violet-soft ring-1 ring-white/10">
        <Icon className="size-5" />
      </span>
      <div>
        <div className="text-xs uppercase tracking-wider text-ink-300">{label}</div>
        <div className="text-sm font-medium text-white">{value}</div>
      </div>
    </div>
  )
}

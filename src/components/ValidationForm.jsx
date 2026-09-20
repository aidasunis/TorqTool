import { useState } from 'react'
import { addSubmission, computeMetrics } from '../lib/metrics'
import { isFormspreeConfigured, submitToFormspree } from '../lib/formspree'

const ROLES = ['Mecánico', 'Electricista automotriz', 'Dueño de taller', 'Otro']
const CANALES = ['Instagram', 'TikTok', 'Facebook', 'WhatsApp / recomendación', 'Google', 'Otro']
const MONTOS = ['$10', '$20', '$30', 'Otro monto']

const initialForm = {
  nombre: '',
  contacto: '',
  rol: ROLES[0],
  rolOtro: '',
  metodoActual: 'mano',
  depositoDispuesto: '',
  montoDeposito: '',
  montoOtro: '',
  canal: CANALES[0],
  canalOtro: '',
}

export default function ValidationForm({ onSubmitted }) {
  const [form, setForm] = useState(initialForm)
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(false)
  const [showMetrics, setShowMetrics] = useState(false)
  const [metrics, setMetrics] = useState(null)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    // nombre/contacto/depositoDispuesto are real required form controls now (native
    // <input required> / radio inputs) — the browser blocks submit and shows its own
    // message if any is missing, so this guard is just a defensive backstop.
    if (!form.nombre || !form.contacto || !form.depositoDispuesto) return

    setSubmitting(true)
    setSubmitError(false)

    // always kept locally too, for the demo metrics panel below
    addSubmission(form)

    const result = await submitToFormspree(form)
    setSubmitting(false)

    if (!result.ok && !result.skipped) {
      // a real send was attempted and failed (network/Formspree down) — let them retry
      // instead of silently pretending it worked
      setSubmitError(true)
      return
    }

    setSent(true)
    onSubmitted?.()
  }

  function toggleMetrics() {
    if (!showMetrics) setMetrics(computeMetrics())
    setShowMetrics((v) => !v)
  }

  if (sent) {
    return (
      <div className="bg-white border-2 border-torq-black card-hard p-8 sm:p-10 text-center flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-torq-yellow flex items-center justify-center">
          <svg className="w-8 h-8 text-torq-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h3 className="font-display font-bold uppercase text-2xl">¡Reserva registrada!</h3>
        <p className="text-torq-black/70 max-w-sm">
          Gracias, {form.nombre.split(' ')[0]}. Guardamos tu reserva — te vamos a contactar a{' '}
          <span className="font-semibold">{form.contacto}</span> en cuanto abramos el primer lote de producción.
        </p>
        <p className="text-sm text-torq-black/50 max-w-sm">
          Ayúdanos a validar más rápido: comparte TORQ con tu taller en redes.
        </p>

        <button
          type="button"
          onClick={toggleMetrics}
          className="font-mono text-xs uppercase tracking-widest underline decoration-torq-orange underline-offset-4 mt-2"
        >
          {showMetrics ? 'Ocultar panel de validación' : 'Ver panel de validación (demo)'}
        </button>

        {showMetrics && metrics && <MetricsPanel metrics={metrics} />}
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border-2 border-torq-black card-hard p-6 sm:p-10 flex flex-col gap-6"
    >
      <div>
        <h3 className="font-display font-bold uppercase text-2xl sm:text-3xl">Reserva tu lugar</h3>
        <p className="text-sm text-torq-black/60 mt-1">
          3 minutos — nos ayuda a decidir qué fabricar y para quién.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Nombre">
          <input
            required
            value={form.nombre}
            onChange={(e) => update('nombre', e.target.value)}
            placeholder="Tu nombre"
            className="input"
          />
        </Field>
        <Field label="WhatsApp o email">
          <input
            required
            value={form.contacto}
            onChange={(e) => update('contacto', e.target.value)}
            placeholder="+51 974 570 476"
            className="input"
          />
        </Field>
      </div>

      <Field label="¿Cuál es tu rol?">
        <div className="flex flex-wrap gap-2">
          {ROLES.map((r) => (
            <Pill key={r} active={form.rol === r} onClick={() => update('rol', r)}>
              {r}
            </Pill>
          ))}
        </div>
        {form.rol === 'Otro' && (
          <input
            value={form.rolOtro}
            onChange={(e) => update('rolOtro', e.target.value)}
            placeholder="¿A qué te dedicas? (opcional)"
            className="input mt-2"
          />
        )}
      </Field>

      <Field label="Hoy, ¿cómo encintas los mazos de cables?">
        <div className="flex flex-wrap gap-2">
          <Pill active={form.metodoActual === 'mano'} onClick={() => update('metodoActual', 'mano')}>
            A mano
          </Pill>
          <Pill active={form.metodoActual === 'otra_herramienta'} onClick={() => update('metodoActual', 'otra_herramienta')}>
            Con otra herramienta
          </Pill>
          <Pill active={form.metodoActual === 'no_aplica'} onClick={() => update('metodoActual', 'no_aplica')}>
            No encinto mazos
          </Pill>
        </div>
      </Field>

      <Field label="¿Pagarías un depósito para reservar tu TORQ del primer lote?" required>
        <div className="flex flex-wrap gap-2">
          <RadioPill name="depositoDispuesto" value="si" checked={form.depositoDispuesto === 'si'} onChange={update} accent>
            Sí, pagaría un depósito
          </RadioPill>
          <RadioPill name="depositoDispuesto" value="tal_vez" checked={form.depositoDispuesto === 'tal_vez'} onChange={update}>
            Tal vez
          </RadioPill>
          <RadioPill name="depositoDispuesto" value="no" checked={form.depositoDispuesto === 'no'} onChange={update}>
            No por ahora
          </RadioPill>
        </div>
      </Field>

      {form.depositoDispuesto === 'si' && (
        <Field label="¿Qué monto te parece razonable de depósito?">
          <div className="flex flex-wrap gap-2">
            {MONTOS.map((m) => (
              <Pill key={m} active={form.montoDeposito === m} onClick={() => update('montoDeposito', m)}>
                {m}
              </Pill>
            ))}
          </div>
          {form.montoDeposito === 'Otro monto' && (
            <input
              value={form.montoOtro}
              onChange={(e) => update('montoOtro', e.target.value)}
              placeholder="¿Qué monto te parece justo? (opcional)"
              className="input mt-2"
            />
          )}
        </Field>
      )}

      <Field label="¿Cómo te enteraste de TORQ?">
        <select value={form.canal} onChange={(e) => update('canal', e.target.value)} className="input">
          {CANALES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {form.canal === 'Otro' && (
          <input
            value={form.canalOtro}
            onChange={(e) => update('canalOtro', e.target.value)}
            placeholder="¿Dónde nos viste? (opcional)"
            className="input mt-2"
          />
        )}
      </Field>

      {submitError && (
        <p className="text-sm text-torq-orange-dark font-semibold">
          No pudimos enviar tu reserva (puede ser tu conexión). Tus datos siguen aquí — dale otra vez.
        </p>
      )}

      <p className="flex items-center gap-2 text-sm text-torq-black/70">
        <LockIcon className="w-4 h-4 shrink-0 text-torq-orange-dark" />
        El primer lote es limitado — reservar con depósito asegura tu unidad antes de la venta
        general.
      </p>

      <button
        type="submit"
        disabled={submitting}
        className="btn-cta bg-torq-black text-white font-display font-bold uppercase tracking-wide text-base px-8 py-4 self-start disabled:opacity-60 disabled:cursor-wait"
      >
        {submitting ? 'Enviando…' : <>Reservar mi TORQ &rarr;</>}
      </button>
    </form>
  )
}

function Field({ label, required, children }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-mono text-xs uppercase tracking-widest text-torq-black/70">
        {label} {required && <span className="text-torq-orange-dark">*</span>}
      </span>
      {children}
    </label>
  )
}

function Pill({ active, onClick, children, accent }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'px-4 py-2 text-sm font-semibold border-2 border-torq-black transition-colors',
        active
          ? accent
            ? 'bg-torq-yellow text-torq-black'
            : 'bg-torq-black text-white'
          : 'bg-transparent text-torq-black hover:bg-torq-black/5',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

// A real radio input styled as a pill — unlike Pill (a plain button), this gives the
// browser something to validate natively: leave the whole group unchecked and hitting
// submit blocks with the browser's own "please select one of these options" message,
// focused on the group, same as it already does for the Nombre/Contacto inputs.
function RadioPill({ name, value, checked, onChange, children, accent }) {
  return (
    <label
      className={[
        'px-4 py-2 text-sm font-semibold border-2 border-torq-black transition-colors cursor-pointer select-none',
        'has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-torq-orange',
        checked
          ? accent
            ? 'bg-torq-yellow text-torq-black'
            : 'bg-torq-black text-white'
          : 'bg-transparent text-torq-black hover:bg-torq-black/5',
      ].join(' ')}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(name, value)}
        required
        className="sr-only"
      />
      {children}
    </label>
  )
}

function MetricsPanel({ metrics }) {
  return (
    <div className="w-full mt-4 bg-torq-cream border-2 border-torq-black p-5 text-left">
      <p className="font-mono text-xs uppercase tracking-widest text-torq-orange-dark mb-4">
        Panel de validación — datos de este navegador
      </p>

      {!isFormspreeConfigured && (
        <p className="font-mono text-[11px] text-torq-black/50 mb-4 border-l-2 border-torq-orange/50 pl-2">
          Formspree no está configurado todavía — las reservas solo se guardan aquí (localStorage), no
          te llegan por correo. Agrega <code className="bg-torq-black/5 px-1">VITE_FORMSPREE_ENDPOINT</code>{' '}
          en tu <code className="bg-torq-black/5 px-1">.env</code> (ver <code className="bg-torq-black/5 px-1">.env.example</code>).
        </p>
      )}

      <div className="grid grid-cols-3 gap-3 mb-4">
        <Stat label="Conversión" value={`${(metrics.conversionRate * 100).toFixed(0)}%`} sub={`${metrics.total}/${metrics.visits} visitas`} />
        <Stat label="Pagaría depósito" value={`${(metrics.depositoRate * 100).toFixed(0)}%`} sub={`${metrics.dispuestos}/${metrics.total} reservas`} />
        <Stat label="Canal top" value={metrics.topChannel} sub="mejor origen" />
      </div>

      {metrics.channelBreakdown.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {metrics.channelBreakdown.map((c) => (
            <div key={c.canal} className="flex items-center gap-2 text-xs font-mono">
              <span className="w-32 truncate text-left">{c.canal}</span>
              <div className="flex-1 h-2 bg-torq-black/10">
                <div className="h-2 bg-torq-orange" style={{ width: `${c.share * 100}%` }} />
              </div>
              <span className="w-8 text-right">{c.count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function LockIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path strokeLinecap="round" d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function Stat({ label, value, sub }) {
  return (
    <div className="text-center">
      <p className="font-display font-extrabold text-2xl leading-none">{value}</p>
      <p className="font-mono text-[10px] uppercase tracking-widest text-torq-black/60 mt-1">{label}</p>
      <p className="text-[10px] text-torq-black/40">{sub}</p>
    </div>
  )
}

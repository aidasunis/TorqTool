import { motion } from 'framer-motion'
import Reveal from './Reveal'

const BENEFITS = [
  {
    text: 'Un solo movimiento encinta el mazo y corta la cinta sobrante. Sin cúter ni tijeras a la mano bajo el tablero.',
    title: 'Corte integrado',
    Icon: ScissorsIcon,
  },
  {
    text: 'Batería recargable, sin cable que estorbe en espacios reducidos del motor o debajo del tablero.',
    title: '100% inalámbrica',
    Icon: BatteryIcon,
  },
  {
    text: 'El primer lote es limitado. Reservar con depósito asegura tu unidad antes de la venta general.',
    title: 'Lugar asegurado',
    Icon: LockIcon,
  },
]

export default function HypothesisSection() {
  return (
    <section id="hipotesis" className="stripes-black text-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-24">
        <Reveal>
          <p className="font-mono text-xs sm:text-sm tracking-[0.25em] uppercase text-torq-orange mb-4">
            Tu reserva, asegurada
          </p>
          <h2 className="font-display font-extrabold uppercase text-3xl sm:text-5xl leading-[0.95] max-w-2xl">
            Esto es lo que aseguras al reservar.
          </h2>
          <p className="mt-5 max-w-2xl text-neutral-400 leading-relaxed">
            El primer lote es limitado. Así es TORQ, y así funciona tu lugar en la fila.
          </p>
        </Reveal>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {BENEFITS.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.12}>
              <motion.div
                whileHover={{ y: -6, borderColor: '#FF5722' }}
                className="bg-torq-charcoal border-2 border-torq-orange/30 p-6 flex flex-col gap-4 h-full"
              >
                <div className="flex items-center justify-between">
                  <b.Icon className="w-8 h-8 text-torq-orange" />
                  <span className="font-mono text-xs text-torq-orange">0{i + 1}</span>
                </div>
                <h3 className="font-display font-bold uppercase text-lg">{b.title}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed flex-1">{b.text}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function ScissorsIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path strokeLinecap="round" d="M8.12 8.12 20 20M20 4 8.12 15.88" />
    </svg>
  )
}

function BatteryIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="17" height="10" rx="2" />
      <path strokeLinecap="round" d="M22 10v4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.5 9.5 13H12l-2.5 3.5" />
    </svg>
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

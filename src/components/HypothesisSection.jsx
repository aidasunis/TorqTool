import { motion } from 'framer-motion'
import Reveal from './Reveal'

const BENEFITS = [
  {
    text: 'Un solo movimiento encinta y remata la cinta. Olvídate de buscar el cúter o maniobrar con tijeras a ciegas debajo del tablero.',
    title: 'Corte limpio e inmediato',
    Icon: ScissorsIcon,
  },
  {
    text: 'Aplica la tensión exacta y uniforme en cada vuelta. Elimina los reclamos por cintas sueltas, despegadas o arrugadas.',
    title: 'Acabado de nivel industrial',
    Icon: SealIcon,
  },
  {
    text: 'Sin cable de corriente ni manguera de aire que te limite. Trabaja cómodo en cualquier rincón del motor.',
    title: 'Libre de cables y mangueras',
    Icon: BatteryIcon,
  },
]

export default function HypothesisSection() {
  return (
    <section id="hipotesis" className="stripes-black text-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-24">
        <Reveal>
          <p className="font-mono text-sm sm:text-base tracking-[0.25em] uppercase text-torq-orange mb-4">
            Resultados, no promesas
          </p>
          <h2 className="font-display font-extrabold uppercase text-4xl sm:text-6xl leading-[0.95] max-w-2xl">
            Esto es lo que ganas con TORQ.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 border-2 border-torq-orange bg-torq-charcoal px-6 py-8 sm:px-10 sm:py-10 flex flex-col sm:flex-row items-center text-center sm:text-left gap-6 sm:gap-10">
            <div className="flex items-center gap-4 shrink-0">
              <BoltIcon className="w-12 h-12 sm:w-16 sm:h-16 text-torq-yellow" />
              <span className="font-display font-extrabold text-6xl sm:text-8xl text-torq-yellow leading-none">
                8X
              </span>
            </div>
            <div>
              <p className="font-display font-bold uppercase text-2xl sm:text-3xl">Más rápido</p>
              <p className="mt-2 text-neutral-400 leading-relaxed text-base sm:text-lg max-w-xl">
                En pruebas repetidas con nuestro prototipo: un tramo de 40 cm que a mano toma ~40
                segundos, con TORQ toma 5 — de forma consistente.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {BENEFITS.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.12}>
              <motion.div
                whileHover={{ y: -6, borderColor: '#FF5722' }}
                className="bg-torq-charcoal border-2 border-torq-orange/30 p-7 sm:p-8 flex flex-col gap-4 h-full"
              >
                <div className="flex items-center justify-between">
                  <b.Icon className="w-11 h-11 text-torq-orange" />
                  <span className="font-mono text-sm text-torq-orange">0{i + 1}</span>
                </div>
                <h3 className="font-display font-bold uppercase text-xl sm:text-2xl">{b.title}</h3>
                <p className="text-base text-neutral-400 leading-relaxed flex-1">{b.text}</p>
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

function SealIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12.5 11 15l4.5-5" />
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

function BoltIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
    </svg>
  )
}

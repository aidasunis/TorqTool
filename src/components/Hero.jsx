import { motion } from 'framer-motion'
import Reveal from './Reveal'

export default function Hero() {
  return (
    <section className="stripes-orange relative overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-torq-yellow/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-0 w-[28rem] h-[28rem] rounded-full bg-torq-black/10 blur-3xl" />

      <div className="max-w-4xl mx-auto px-5 sm:px-8 pt-16 pb-14 md:pt-24 md:pb-20 relative text-center">
        <Reveal y={16} scale={1}>
          <h1 className="font-display font-extrabold uppercase leading-[0.85] text-[18vw] sm:text-[7rem] text-torq-black">
            TORQ
          </h1>

          <div className="mt-3 font-display font-bold uppercase leading-[1.05] text-[8vw] sm:text-4xl text-torq-black">
            ENCINTA.{' '}
            <span className="chip-yellow inline-block px-2 -rotate-1">SUELTA.</span>
            <br className="hidden sm:block" /> SIGUIENTE.
          </div>

          <p className="mt-6 max-w-xl mx-auto font-body text-base sm:text-lg text-torq-black/80 leading-relaxed">
            La primera encintadora inalámbrica para mecánicos y electricistas automotrices. Antes de fabricarla,
            queremos confirmar contigo si vale la pena: reserva tu lugar y ayúdanos a decidir.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <motion.a
              href="#reservar"
              whileHover={{ y: -3, x: -3, boxShadow: '9px 9px 0px 0px #FBBF24' }}
              whileTap={{ y: 0, x: 0, boxShadow: '2px 2px 0px 0px #FBBF24' }}
              className="bg-torq-black text-white font-display font-bold uppercase tracking-wide text-sm sm:text-base px-8 py-4"
              style={{ boxShadow: '6px 6px 0px 0px #FBBF24' }}
            >
              Quiero reservar &rarr;
            </motion.a>
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
            <span className="flex items-center gap-2 bg-torq-black/10 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-torq-black">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 6 9 17l-5-5" />
              </svg>
              Inalámbrica
            </span>
            <span className="flex items-center gap-2 bg-torq-black/10 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-torq-black">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 6 9 17l-5-5" />
              </svg>
              Corte integrado
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

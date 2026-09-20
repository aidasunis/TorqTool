import { motion } from 'framer-motion'
import lifestyle from '../assets/torq-lifestyle.webp'

export default function ImageMoment() {
  return (
    <section className="relative h-[70vh] sm:h-[85vh] overflow-hidden">
      <motion.div
        initial={{ scale: 1.15 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <img src={lifestyle} alt="TORQ en uso en un taller automotriz" className="w-full h-full object-cover" />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-torq-black via-torq-black/40 to-transparent" />
      <div className="absolute inset-0 bg-torq-orange/10 mix-blend-multiply" />

      <div className="relative h-full max-w-7xl mx-auto px-5 sm:px-8 flex flex-col justify-end pb-14 sm:pb-20">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="font-mono text-xs sm:text-sm tracking-[0.25em] uppercase text-torq-orange mb-3"
        >
          Concepto visual &middot; ilustración
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display font-extrabold uppercase text-white leading-[0.95] text-3xl sm:text-6xl max-w-2xl"
        >
          Hecha para el taller real, no para la vitrina.
        </motion.h2>
      </div>
    </section>
  )
}

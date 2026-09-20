import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function MechanismVideo() {
  const videoRef = useRef(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = (e) => setReducedMotion(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return (
    <section className="relative h-[60vh] sm:h-[85vh] overflow-hidden bg-torq-black">
      <video
        ref={videoRef}
        src="/torq-mecanismo.mp4"
        poster="/frames/frame_140.webp"
        autoPlay={!reducedMotion}
        muted
        loop
        playsInline
        controls={reducedMotion}
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-torq-black via-torq-black/30 to-transparent pointer-events-none" />

      <div className="relative h-full max-w-7xl mx-auto px-5 sm:px-8 flex flex-col justify-end pb-14 sm:pb-20">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="font-mono text-xs sm:text-sm tracking-[0.25em] uppercase text-torq-orange mb-3"
        >
          Cómo funciona
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display font-extrabold uppercase text-white leading-[0.95] text-3xl sm:text-6xl max-w-2xl"
        >
          Míralo por dentro.
        </motion.h2>
      </div>
    </section>
  )
}

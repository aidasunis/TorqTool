import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import FrameSequence from './FrameSequence'

// Linear-interpolate p across a piecewise range, e.g. lerpRange(p, [0,0.14,0.22], [1,1,0]).
// Framer's own useTransform intermittently fails to keep a style property in sync when
// that property's value stays at its CSS default (opacity: 1) across the first segment of
// the range — the DOM style attribute simply stops updating past that point. Computing the
// interpolation by hand and pushing it through React state sidesteps that fast-path entirely.
function lerpRange(p, input, output) {
  if (p <= input[0]) return output[0]
  if (p >= input[input.length - 1]) return output[output.length - 1]
  for (let i = 0; i < input.length - 1; i++) {
    if (p >= input[i] && p <= input[i + 1]) {
      const t = (p - input[i]) / (input[i + 1] - input[i])
      return output[i] + t * (output[i + 1] - output[i])
    }
  }
  return output[output.length - 1]
}

export default function ScrollHero() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })

  const [torqOpacity, setTorqOpacity] = useState(1)
  const [hintOpacity, setHintOpacity] = useState(1)
  const [productOpacity, setProductOpacity] = useState(0)
  const [eyebrowOpacity, setEyebrowOpacity] = useState(0)
  const [sloganWrapOpacity, setSloganWrapOpacity] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    setTorqOpacity(lerpRange(p, [0, 0.14, 0.22], [1, 1, 0]))
    setHintOpacity(lerpRange(p, [0, 0.04], [1, 0]))
    setProductOpacity(lerpRange(p, [0, 0.06], [0, 1]))
    setEyebrowOpacity(lerpRange(p, [0, 0.05, 0.14, 0.2], [0, 1, 1, 0]))
    setSloganWrapOpacity(lerpRange(p, [0.42, 0.56], [0, 1]))
  })

  // full-bleed background video: fills the whole screen edge to edge (object-fit: cover),
  // just a slow cinematic zoom, no rotation, no shrinking to a card.
  const productScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.28])

  // big TORQ wordmark
  const torqScale = useTransform(scrollYProgress, [0, 0.18], [1, 0.42])
  const torqY = useTransform(scrollYProgress, [0, 0.2], ['0vh', '-32vh'])

  // slogan, staggered word reveal — overlaid on the video with a scrim behind it
  const line1X = useTransform(scrollYProgress, [0.42, 0.58], ['-14%', '0%'])
  const line2X = useTransform(scrollYProgress, [0.44, 0.6], ['14%', '0%'])
  const line3X = useTransform(scrollYProgress, [0.46, 0.62], ['-10%', '0%'])

  return (
    <section ref={sectionRef} className="relative h-[340vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-torq-black flex items-center justify-center">
        {/* full-bleed video background — contrast/saturation pushed up a bit so it doesn't
            read as washed out next to the solid orange of the TORQ wordmark */}
        <motion.div
          style={{ opacity: productOpacity, scale: productScale, filter: 'contrast(1.18) saturate(1.2) brightness(1.04)' }}
          className="absolute inset-0"
        >
          <FrameSequence scrollYProgress={scrollYProgress} range={[0.14, 0.58]} className="w-full h-full" fit="cover" />
        </motion.div>

        {/* light scrim — just enough for text contrast, not enough to dull the video */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/0 to-black/30 pointer-events-none" />

        <motion.div style={{ opacity: eyebrowOpacity }} className="absolute top-24 sm:top-28 left-0 right-0 text-center">
          <p className="font-mono text-xs sm:text-sm tracking-[0.3em] uppercase text-white/70">
            Etapa de validación &middot; MVP
          </p>
        </motion.div>

        <motion.h1
          style={{ scale: torqScale, y: torqY, opacity: torqOpacity, textShadow: '0 8px 40px rgba(0,0,0,0.65)' }}
          className="absolute font-display font-extrabold uppercase leading-none text-[22vw] sm:text-[16vw] text-torq-orange select-none pointer-events-none"
        >
          TORQ
        </motion.h1>

        <motion.div
          style={{ opacity: sloganWrapOpacity, textShadow: '0 4px 24px rgba(0,0,0,0.7)' }}
          className="absolute bottom-[8vh] sm:bottom-[10vh] left-0 right-0 px-6 text-center"
        >
          <motion.div
            style={{ x: line1X }}
            className="font-display font-bold uppercase leading-[0.95] text-[9vw] sm:text-[4.2vw] text-white"
          >
            ENCINTA.
          </motion.div>
          <motion.div style={{ x: line2X }} className="inline-block">
            <span className="chip-yellow inline-block px-3 -rotate-1 font-display font-bold uppercase leading-[0.95] text-[9vw] sm:text-[4.2vw]">
              SUELTA.
            </span>
          </motion.div>
          <motion.div
            style={{ x: line3X }}
            className="font-display font-bold uppercase leading-[0.95] text-[9vw] sm:text-[4.2vw] text-white"
          >
            SIGUIENTE.
          </motion.div>
        </motion.div>

        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-2 text-white/60"
        >
          <span className="font-mono text-[10px] uppercase tracking-widest">Desplázate</span>
          <motion.svg
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M6 13l6 6 6-6" />
          </motion.svg>
        </motion.div>
      </div>
    </section>
  )
}

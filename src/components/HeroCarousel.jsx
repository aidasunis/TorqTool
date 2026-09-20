import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Reveal from './Reveal'
import lifestyle from '../assets/torq-lifestyle.webp'

// Los videos/posters viven en public/, así que Vite no los procesa como imports —
// hay que anteponer BASE_URL a mano, o quedan rotos en cuanto el sitio no vive en la
// raíz del dominio (p. ej. GitHub Pages en /TorqTool/).
const BASE = import.meta.env.BASE_URL

// Duración de cada diapositiva en ms. Las de video usan la duración real del
// archivo para que nunca se corten a medias.
const SLIDES = [
  { type: 'video', src: `${BASE}torq-mecanismo.mp4`, poster: `${BASE}frames/frame_140.webp`, duration: 14025 },
  { type: 'image', duration: 6000 },
  { type: 'video-caption', src: `${BASE}torq-harness.mp4`, poster: `${BASE}harness-poster.jpg`, duration: 16255 },
]

export default function HeroCarousel() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const activeVideoRef = useRef(null)
  const elapsedRef = useRef(0)
  const lastIndexRef = useRef(-1)

  // Si el visitante tiene "reducir movimiento" activado, arranca en pausa: nada se
  // reproduce ni avanza solo hasta que el propio visitante le da play.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) setPaused(true)
    const onChange = (e) => {
      if (e.matches) setPaused(true)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % SLIDES.length)
  }, [])
  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length)
  }, [])

  // Reloj de avance + barra de progreso, unificado con un solo requestAnimationFrame.
  // Persiste el tiempo transcurrido en un ref para que pausar/reanudar no reinicie
  // el progreso, y solo lo resetea cuando la diapositiva activa realmente cambia.
  useEffect(() => {
    if (lastIndexRef.current !== index) {
      elapsedRef.current = 0
      setProgress(0)
      lastIndexRef.current = index
    }
    if (paused) return

    const frameStart = performance.now()
    let raf
    function tick(now) {
      const elapsed = elapsedRef.current + (now - frameStart)
      const duration = SLIDES[index].duration
      const p = Math.min(elapsed / duration, 1)
      setProgress(p)
      if (p >= 1) {
        next()
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      elapsedRef.current += performance.now() - frameStart
    }
  }, [index, paused, next])

  // Pausar/reanudar también pausa o reanuda el video activo, si la diapositiva es un video.
  useEffect(() => {
    const video = activeVideoRef.current
    if (!video) return
    if (paused) {
      video.pause()
    } else {
      const p = video.play()
      if (p?.catch) p.catch(() => {})
    }
  }, [paused, index])

  // Callback ref en vez de un useEffect atado a `videoRef.current`: se dispara justo
  // cuando React monta el nodo <video> real, sin depender de un ciclo de render
  // adicional — más directo y sin ventanas donde la ref todavía esté en null.
  const setVideoRef = useCallback(
    (el) => {
      activeVideoRef.current = el
      if (el && !paused) {
        const p = el.play()
        if (p?.catch) p.catch(() => {})
      }
    },
    [paused],
  )

  const slide = SLIDES[index]

  return (
    <section id="inicio" className="relative h-[85vh] sm:h-screen sm:max-h-[880px] overflow-hidden bg-torq-black">
      <>
        {slide.type === 'video' ? (
          <motion.div
            key="slide-video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            <video
              ref={setVideoRef}
              src={slide.src}
              poster={slide.poster}
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-torq-black/90 via-torq-black/55 to-torq-black/15" />

            <div className="relative h-full max-w-7xl mx-auto px-5 sm:px-8 flex items-center">
              <Reveal y={16} scale={1} className="max-w-xl lg:max-w-2xl">
                <h1 className="font-display font-extrabold uppercase leading-[0.85] text-[18vw] sm:text-[clamp(4.5rem,9vw,10rem)] text-white">
                  TORQ
                </h1>
                <div className="mt-[4vw] sm:mt-[clamp(1rem,2vw,2rem)] font-display font-bold uppercase leading-[1.05] text-[8vw] sm:text-[clamp(2rem,4vw,3.5rem)] text-white">
                  ENCINTA.{' '}
                  <span className="chip-yellow inline-block px-2 -rotate-1">SUELTA.</span>
                  <br className="hidden sm:block" /> SIGUIENTE.
                </div>
                <p className="mt-6 font-body text-base sm:text-lg lg:text-xl text-white/80 leading-relaxed">
                  La primera encintadora inalámbrica para mecánicos y electricistas automotrices. Antes de
                  fabricarla, queremos confirmar contigo si vale la pena: reserva tu lugar y ayúdanos a decidir.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <motion.a
                    href="#reservar"
                    whileHover={{ y: -3, x: -3, boxShadow: '9px 9px 0px 0px #FBBF24' }}
                    whileTap={{ y: 0, x: 0, boxShadow: '2px 2px 0px 0px #FBBF24' }}
                    className="bg-torq-orange text-torq-black font-display font-bold uppercase tracking-wide text-sm sm:text-base lg:text-lg px-8 py-4 lg:px-10 lg:py-5"
                    style={{ boxShadow: '6px 6px 0px 0px #FBBF24' }}
                  >
                    Quiero reservar &rarr;
                  </motion.a>
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/25 px-3 py-1.5 font-mono text-xs sm:text-sm font-bold uppercase tracking-widest text-white">
                    <CheckIcon />
                    Inalámbrica
                  </span>
                  <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/25 px-3 py-1.5 font-mono text-xs sm:text-sm font-bold uppercase tracking-widest text-white">
                    <CheckIcon />
                    Corte integrado
                  </span>
                </div>
              </Reveal>
            </div>
          </motion.div>
        ) : slide.type === 'image' ? (
          <motion.div
            key="slide-image"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            <img
              src={lifestyle}
              alt="TORQ en uso en un taller automotriz"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-torq-black via-torq-black/40 to-transparent" />

            <div className="relative h-full max-w-7xl mx-auto px-5 sm:px-8 flex flex-col justify-end pb-24 sm:pb-28">
              <p className="font-mono text-xs sm:text-sm tracking-[0.25em] uppercase text-torq-orange mb-3">
                Concepto visual &middot; ilustración
              </p>
              <h2 className="font-display font-extrabold uppercase text-white leading-[0.95] text-3xl sm:text-6xl max-w-2xl">
                Más velocidad. Menos esfuerzo. Mejor acabado.
              </h2>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="slide-harness"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            <video
              ref={setVideoRef}
              src={slide.src}
              poster={slide.poster}
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-torq-black via-torq-black/40 to-transparent" />

            <div className="relative h-full max-w-7xl mx-auto px-5 sm:px-8 flex flex-col justify-end pb-24 sm:pb-28">
              <p className="font-mono text-xs sm:text-sm tracking-[0.25em] uppercase text-torq-orange mb-3">
                Resultado final
              </p>
              <h2 className="font-display font-extrabold uppercase text-white leading-[0.95] text-3xl sm:text-6xl max-w-2xl">
                Un acabado limpio, listo para instalar.
              </h2>
            </div>
          </motion.div>
        )}
      </>

      <div className="absolute bottom-6 left-5 sm:left-8 z-10 flex items-center gap-4">
        <button type="button" onClick={prev} aria-label="Diapositiva anterior" className="text-white/70 hover:text-white transition-colors">
          <ChevronIcon direction="left" />
        </button>

        <div className="flex items-center gap-4">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ir a la diapositiva ${i + 1}`}
              aria-current={i === index}
              className="flex flex-col items-center gap-1.5 font-mono text-sm"
            >
              <span className={i === index ? 'text-white font-bold' : 'text-white/45'}>{i + 1}</span>
              <span className="w-6 h-[2px] bg-white/20 overflow-hidden block">
                {i === index && <span className="block h-full bg-torq-orange" style={{ width: `${progress * 100}%` }} />}
              </span>
            </button>
          ))}
        </div>

        <button type="button" onClick={next} aria-label="Siguiente diapositiva" className="text-white/70 hover:text-white transition-colors">
          <ChevronIcon direction="right" />
        </button>

        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? 'Reanudar' : 'Pausar'}
          className="ml-2 w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition-colors border border-white/25 rounded-full"
        >
          {paused ? <PlayIcon /> : <PauseIcon />}
        </button>
      </div>
    </section>
  )
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function ChevronIcon({ direction }) {
  const d = direction === 'left' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <rect x="5" y="4" width="5" height="16" />
      <rect x="14" y="4" width="5" height="16" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 4l14 8-14 8V4z" />
    </svg>
  )
}

import { useCallback, useEffect, useRef, useState } from 'react'
import Reveal from './Reveal'

const TESTIMONIALS = [
  {
    quote: 'Encintar un arnés completo a mano me tomaba 20 minutos. Si esto lo baja a la mitad, lo compro sin pensarlo.',
    name: 'J. Ramírez',
    role: 'Mecánico automotriz, 12 años de experiencia',
    rating: 5,
  },
  {
    quote: 'Los cortes con cutter son el pan de cada día en el taller. Una herramienta que corte sola ya vale la pena.',
    name: 'L. Torres',
    role: 'Electricista automotriz',
    rating: 4,
  },
  {
    quote: 'Lo que más nos cuesta son los reclamos por cinta floja. Si TORQ estandariza eso, cambia el juego para el taller.',
    name: 'M. Delgado',
    role: 'Dueña de taller multimarca',
    rating: 5,
  },
]

const N = TESTIMONIALS.length
const CYCLES = 5 // copias renderizadas para el buffer del loop infinito
const MIDDLE_CYCLE = Math.floor(CYCLES / 2)
const EXTENDED = Array.from({ length: CYCLES }, () => TESTIMONIALS).flat()

const SLIDE_DURATION = 5500
const CARD_WIDTH = 360
const CARD_GAP = 28
const STEP = CARD_WIDTH + CARD_GAP
const WINDOW_WIDTH = 1120 // ancho visible de la tira — recorta cuántas tarjetas asoman a la vez (~3)

export default function SocialProof() {
  const [virtualIndex, setVirtualIndex] = useState(MIDDLE_CYCLE * N)
  const [noTransition, setNoTransition] = useState(false)
  const [paused, setPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const elapsedRef = useRef(0)
  const lastIndexRef = useRef(-1)

  const realIndex = ((virtualIndex % N) + N) % N

  // Si el visitante tiene "reducir movimiento" activado, arranca en pausa.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) setPaused(true)
    const onChange = (e) => {
      if (e.matches) setPaused(true)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const next = useCallback(() => setVirtualIndex((v) => v + 1), [])
  const prev = useCallback(() => setVirtualIndex((v) => v - 1), [])
  const goTo = useCallback((i) => {
    setVirtualIndex((v) => {
      let best = i
      let bestDist = Math.abs(i - v)
      for (let c = 1; c < CYCLES; c++) {
        const candidate = i + c * N
        const dist = Math.abs(candidate - v)
        if (dist < bestDist) {
          best = candidate
          bestDist = dist
        }
      }
      return best
    })
  }, [])

  // Loop infinito de verdad: en vez de calcular posiciones circulares (que con pocos
  // testimonios hace que alguno "salte" por el camino largo), se renderizan varias
  // copias seguidas de la lista y se desliza sobre ellas como una tira normal. Cuando
  // el índice se aleja del "carril" central, se reubica en la copia equivalente más
  // cercana sin transición — como esa copia muestra exactamente los mismos vecinos,
  // el salto es invisible para quien mira.
  useEffect(() => {
    const middleStart = MIDDLE_CYCLE * N
    if (virtualIndex < middleStart || virtualIndex >= middleStart + N) {
      setNoTransition(true)
      setVirtualIndex(realIndex + middleStart)
    }
  }, [virtualIndex, realIndex])

  useEffect(() => {
    if (!noTransition) return
    const id = requestAnimationFrame(() => setNoTransition(false))
    return () => cancelAnimationFrame(id)
  }, [noTransition])

  // Reloj de avance + barra de progreso: un solo requestAnimationFrame, con el tiempo
  // transcurrido guardado en un ref para que pausar/reanudar no reinicie el progreso.
  useEffect(() => {
    if (lastIndexRef.current !== realIndex) {
      elapsedRef.current = 0
      setProgress(0)
      lastIndexRef.current = realIndex
    }
    if (paused) return

    const frameStart = performance.now()
    let raf
    function tick(now) {
      const elapsed = elapsedRef.current + (now - frameStart)
      const p = Math.min(elapsed / SLIDE_DURATION, 1)
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
  }, [realIndex, paused, next])

  return (
    <section className="bg-torq-cream overflow-hidden">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 pt-16 md:pt-20">
        <Reveal>
          <p className="font-mono text-sm sm:text-base tracking-[0.25em] uppercase text-torq-orange-dark mb-3">
            Lo que dicen los talleres
          </p>
          <h2 className="font-display font-extrabold uppercase text-3xl sm:text-5xl leading-[0.95] max-w-xl mb-10">
            Entrevistamos mecánicos antes de diseñar TORQ.
          </h2>
        </Reveal>
      </div>

      {/* Tira en cascada: la tarjeta activa se ve nítida y a color, centrada; las
          vecinas asoman en gris y más chicas a los costados — la atención se queda en
          la que se está leyendo. Loop infinito de verdad, sin salto visible al pasar
          de la última a la primera. La "ventana" visible se recorta a WINDOW_WIDTH
          (en vez de todo el ancho de la pantalla) para que en monitores anchos no se
          vean 6-7 tarjetas de golpe — con esto se ven unas 4. */}
      <div
        className="relative mx-auto overflow-hidden"
        style={{ maxWidth: WINDOW_WIDTH, height: 300 + 24 * 2 }}
      >
        <div
          className="absolute top-6 left-1/2 flex items-stretch gap-7 w-max"
          style={{
            transform: `translateX(-${virtualIndex * STEP + CARD_WIDTH / 2}px)`,
            transition: noTransition ? 'none' : 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          {EXTENDED.map((testimonial, i) => {
            const active = i === virtualIndex
            return (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i % N)}
                style={{ width: CARD_WIDTH }}
                className={[
                  'shrink-0 bg-white border-2 border-torq-black card-hard p-8 flex flex-col items-center text-center gap-4 min-h-[300px] justify-center transition-all duration-500',
                  active ? 'opacity-100 grayscale-0 scale-100' : 'opacity-80 grayscale scale-90 cursor-pointer',
                ].join(' ')}
              >
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <StarIcon key={s} filled={s < testimonial.rating} />
                  ))}
                </div>
                <blockquote className="text-base sm:text-lg text-torq-black/80 leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <figcaption className="font-mono text-xs uppercase tracking-widest text-torq-black/60">
                  {testimonial.name} &middot; {testimonial.role}
                </figcaption>
              </button>
            )
          })}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 sm:px-8 pb-16 md:pb-20">
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={prev}
            aria-label="Testimonio anterior"
            className="text-torq-black/50 hover:text-torq-black transition-colors"
          >
            <ChevronIcon direction="left" />
          </button>

          <div className="flex items-center gap-4">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ir al testimonio ${i + 1}`}
                aria-current={i === realIndex}
                className="flex flex-col items-center gap-1.5 font-mono text-sm"
              >
                <span className={i === realIndex ? 'text-torq-black font-bold' : 'text-torq-black/35'}>{i + 1}</span>
                <span className="w-6 h-[2px] bg-torq-black/15 overflow-hidden block">
                  {i === realIndex && (
                    <span className="block h-full bg-torq-orange" style={{ width: `${progress * 100}%` }} />
                  )}
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            aria-label="Siguiente testimonio"
            className="text-torq-black/50 hover:text-torq-black transition-colors"
          >
            <ChevronIcon direction="right" />
          </button>

          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? 'Reanudar' : 'Pausar'}
            className="ml-2 w-8 h-8 flex items-center justify-center text-torq-black/50 hover:text-torq-black transition-colors border border-torq-black/25 rounded-full"
          >
            {paused ? <PlayIcon /> : <PauseIcon />}
          </button>
        </div>

        <p className="mt-8 font-mono text-[11px] uppercase tracking-widest text-torq-black/40 text-center">
          Ejemplos ilustrativos de la etapa de entrevistas de descubrimiento — se sustituyen por testimonios reales conforme entren reservas.
        </p>
      </div>
    </section>
  )
}

function StarIcon({ filled }) {
  return (
    <svg className={`w-4 h-4 ${filled ? 'text-torq-yellow' : 'text-torq-black/15'}`} viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.2 1.3 6-5.4-3.1L4.6 18l1.3-6L1.3 7.7l6.1-.6L10 1.5z" />
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

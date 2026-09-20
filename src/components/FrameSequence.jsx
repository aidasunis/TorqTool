import { useEffect, useRef, useState } from 'react'
import { useMotionValueEvent, useTransform } from 'framer-motion'

const FRAME_COUNT = 154
const frameUrl = (i) => `/frames/frame_${String(i).padStart(3, '0')}.webp`

/**
 * Draws a preloaded PNG/WebP frame sequence to a <canvas>, scrubbing the
 * current frame from a Framer Motion scrollYProgress value. This is the
 * "scroll assembles the product" technique (canvas + image sequence, not a
 * compressed <video>) that product sites like Apple's use for buttery-smooth
 * scroll scrubbing — seeking a real video is limited by keyframes and looks
 * choppy at this frame count.
 */
export default function FrameSequence({ scrollYProgress, range = [0, 1], className = '', style, fit = 'contain' }) {
  const canvasRef = useRef(null)
  const imagesRef = useRef([])
  const [ready, setReady] = useState(false)
  const frameIndex = useTransform(scrollYProgress, range, [0, FRAME_COUNT - 1], { clamp: true })

  useEffect(() => {
    let cancelled = false
    const images = new Array(FRAME_COUNT)
    let loaded = 0
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image()
      img.src = frameUrl(i + 1)
      img.onload = () => {
        loaded++
        if (!cancelled && loaded === FRAME_COUNT) setReady(true)
      }
      images[i] = img
    }
    imagesRef.current = images
    return () => {
      cancelled = true
    }
  }, [])

  const draw = (index) => {
    const canvas = canvasRef.current
    const img = imagesRef.current[Math.round(index)]
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr
      canvas.height = h * dpr
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)
    const scale =
      fit === 'cover'
        ? Math.max(w / img.naturalWidth, h / img.naturalHeight)
        : Math.min(w / img.naturalWidth, h / img.naturalHeight)
    const dw = img.naturalWidth * scale
    const dh = img.naturalHeight * scale
    ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh)
  }

  useMotionValueEvent(frameIndex, 'change', (v) => {
    if (ready) draw(v)
  })

  useEffect(() => {
    if (ready) draw(frameIndex.get())
    const onResize = () => draw(frameIndex.get())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  return <canvas ref={canvasRef} className={className} style={style} />
}

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import HeroCarousel from './components/HeroCarousel'
import HypothesisSection from './components/HypothesisSection'
import SocialProof from './components/SocialProof'
import ValidationForm from './components/ValidationForm'
import SocialLinks from './components/SocialLinks'
import Footer from './components/Footer'
import Reveal from './components/Reveal'
import { trackVisit } from './lib/metrics'

export default function App() {
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current) return
    tracked.current = true
    trackVisit()
  }, [])

  return (
    <div className="bg-torq-cream text-torq-black antialiased min-h-screen">
      <header className="sticky top-0 z-50 bg-torq-black/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
          <motion.a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display font-extrabold text-2xl tracking-tight text-white"
          >
            TORQ<span className="text-torq-orange">.</span>
          </motion.a>
          <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest text-neutral-300">
            <a href="#hipotesis" className="hover:text-torq-yellow transition-colors">
              Por qué reservar
            </a>
            <a href="#reservar" className="hover:text-torq-yellow transition-colors">
              Reservar
            </a>
          </nav>
          <SocialLinks className="scale-90" dark />
        </div>
      </header>

      <HeroCarousel />
      <HypothesisSection />
      <SocialProof />

      <section id="reservar" className="bg-torq-cream">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 md:py-24">
          <Reveal>
            <ValidationForm />
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  )
}

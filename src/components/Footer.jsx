import SocialLinks from './SocialLinks'
import Reveal from './Reveal'

export default function Footer() {
  return (
    <footer className="stripes-orange">
      <Reveal className="max-w-7xl mx-auto px-5 sm:px-8 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <span className="font-display font-extrabold uppercase text-xl text-torq-black">
          TORQ<span className="text-white">.</span>
        </span>
        <span className="font-mono text-xs uppercase tracking-widest text-torq-black/60 text-center">
          Encinta. Suelta. Siguiente. &middot; &copy; 2026
        </span>
        <SocialLinks />
      </Reveal>
    </footer>
  )
}

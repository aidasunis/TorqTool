import torqAnimation from '../assets/torq-animation.webm'

export default function HeroVideo() {
  return (
    <video
      className="w-full h-[340px] sm:h-[420px] object-contain"
      src={torqAnimation}
      autoPlay
      muted
      loop
      playsInline
    />
  )
}

const LINKS = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/torq.pe/?hl=en',
    icon: (
      <path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.22.6 1.77 1.15.5.5.9 1.11 1.15 1.77.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.22 1.15-1.77A4.9 4.9 0 0 1 5.45 2.53c.64-.25 1.37-.42 2.43-.47C8.94 2.01 9.28 2 12 2Zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4ZM18.4 5.6a1.17 1.17 0 1 0 0 2.34 1.17 1.17 0 0 0 0-2.34Z" />
    ),
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61594406014718',
    icon: (
      <path d="M13.5 21v-7.7h2.6l.4-3h-3V8.3c0-.87.24-1.46 1.5-1.46H16.6V4.14C16.3 4.1 15.36 4 14.26 4c-2.3 0-3.87 1.4-3.87 3.97v2.33H7.8v3h2.59V21h3.1Z" />
    ),
  },
  {
    name: 'X',
    href: 'https://x.com/Torq_pe',
    icon: (
      <path d="M18.9 2H22l-7.4 8.5L23 22h-6.8l-5.3-6.9L5 22H2l7.9-9L1 2h6.9l4.8 6.3L18.9 2Zm-1.2 18h1.9L7.4 4H5.4l12.3 16Z" />
    ),
  },
]

export default function SocialLinks({ className = '', dark = false }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {LINKS.map((l) => (
        <a
          key={l.name}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={l.name}
          className={[
            'w-10 h-10 flex items-center justify-center border-2 transition-colors hover:bg-torq-yellow hover:border-torq-yellow hover:text-torq-black',
            dark ? 'border-white/70 text-white' : 'border-torq-black text-torq-black',
          ].join(' ')}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            {l.icon}
          </svg>
        </a>
      ))}
    </div>
  )
}

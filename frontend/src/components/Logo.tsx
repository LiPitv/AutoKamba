export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <span
      className="flex items-center justify-center rounded-xl bg-primary text-white"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 24 24" style={{ width: size * 0.55, height: size * 0.55 }} fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
        <path d="M2 12h4M18 12h4M12 2v4M12 18v4" strokeLinecap="round" />
      </svg>
    </span>
  )
}

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark />
      <span className={`text-lg font-extrabold tracking-tight ${dark ? 'text-white' : 'text-ink'}`}>
        Auto<span className="text-primary">Kamba</span>
      </span>
    </span>
  )
}
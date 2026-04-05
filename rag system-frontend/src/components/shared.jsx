// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner({ size = 'md' }) {
  const s = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
  return (
    <svg className={`${s} animate-spin-slow text-amber-400`} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// ── Typing dots ───────────────────────────────────────────────────────────────
export function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse-dot"
          style={{ animationDelay: `${i * 0.16}s` }}
        />
      ))}
    </span>
  )
}

// ── Score bar ─────────────────────────────────────────────────────────────────
export function ScoreBar({ score }) {
  const pct = Math.round(score * 100)
  const color = score > 0.7 ? 'bg-green-500' : score > 0.4 ? 'bg-amber-400' : 'bg-ink-500'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-ink-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-mono text-ink-400">{pct}%</span>
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────
export function Empty({ icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <div className="text-3xl opacity-30">{icon}</div>
      <p className="text-ink-300 font-display text-sm font-medium">{title}</p>
      {subtitle && <p className="text-ink-500 text-xs max-w-xs">{subtitle}</p>}
    </div>
  )
}

// ── Status pill ───────────────────────────────────────────────────────────────
export function StatusPill({ status, provider }) {
  const ok = status === 'ok'
  return (
    <span className={`tag text-xs ${ok
      ? 'bg-green-500/10 border-green-500/30 text-green-400'
      : status === null
        ? 'bg-ink-800 border-ink-700 text-ink-400'
        : 'bg-red-500/10 border-red-500/30 text-red-400'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${ok ? 'bg-green-400' : status === null ? 'bg-ink-500' : 'bg-red-400'}`} />
      {status === null ? 'checking…' : ok ? `online · ${provider}` : 'offline'}
    </span>
  )
}

// ── Method badge ──────────────────────────────────────────────────────────────
export function MethodBadge({ method }) {
  const colors = {
    GET:    'bg-green-500/15 text-green-400 border-green-500/30',
    POST:   'bg-amber-400/15 text-amber-400 border-amber-400/30',
    DELETE: 'bg-red-500/15 text-red-400 border-red-500/30',
  }
  return <span className={`tag font-mono text-xs ${colors[method]}`}>{method}</span>
}

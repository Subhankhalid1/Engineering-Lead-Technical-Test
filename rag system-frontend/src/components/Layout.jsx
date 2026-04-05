import { NavLink, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useHealthStore } from '../store'
import { StatusPill } from './shared'

const NAV = [
  { to: '/',        label: 'Dashboard',  icon: '◈' },
  { to: '/ingest',  label: 'Ingest',     icon: '⊕' },
  { to: '/ask',     label: 'Ask',        icon: '◎' },
  { to: '/docs',    label: 'Documents',  icon: '≡' },
]

export default function Layout({ children }) {
  const { status, provider, check } = useHealthStore()

  useEffect(() => { check() }, [])

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col glass-strong border-r border-ink-800 sticky top-0 h-screen">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-ink-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center">
              <span className="text-ink-950 text-xs font-bold font-mono">R</span>
            </div>
            <span className="font-display font-700 text-ink-100 tracking-tight">RAG</span>
            <span className="font-display text-ink-500 text-xs tracking-widest uppercase">System</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          {NAV.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
                    : 'text-ink-400 hover:text-ink-200 hover:bg-ink-800/50 border border-transparent'
                }`
              }
            >
              <span className="font-mono text-base leading-none">{icon}</span>
              <span className="font-display font-medium">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Status */}
        <div className="px-4 py-4 border-t border-ink-800/60">
          <p className="text-xs text-ink-600 mb-2 font-mono">backend</p>
          <StatusPill status={status} provider={provider} />
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}

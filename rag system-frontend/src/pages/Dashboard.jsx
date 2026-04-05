import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentStore, useHealthStore } from '../store'
import { Spinner } from '../components/shared'

function StatCard({ label, value, sub }) {
  return (
    <div className="glass rounded-xl p-5 flex flex-col gap-1.5 animate-fade-up">
      <p className="text-xs font-mono text-ink-500 uppercase tracking-widest">{label}</p>
      <p className="text-3xl font-display font-700 text-ink-100">{value ?? '—'}</p>
      {sub && <p className="text-xs text-ink-500">{sub}</p>}
    </div>
  )
}

const PIPELINE = [
  { step: '01', label: 'Ingest', desc: 'Upload or paste text', color: 'text-amber-400', to: '/ingest' },
  { step: '02', label: 'Chunk', desc: '500-char overlapping splits', color: 'text-ink-400', to: null },
  { step: '03', label: 'Embed', desc: 'TF-IDF / OpenAI vectors', color: 'text-ink-400', to: null },
  { step: '04', label: 'Search', desc: 'Cosine similarity top-K', color: 'text-ink-400', to: null },
  { step: '05', label: 'Ask', desc: 'LLM answers from context', color: 'text-amber-400', to: '/ask' },
]

export default function Dashboard() {
  const { documents, stats, loading, fetchDocuments } = useDocumentStore()
  const { status, provider } = useHealthStore()

  useEffect(() => { fetchDocuments() }, [])

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-10 animate-fade-up">
        <h1 className="font-display text-3xl font-700 text-ink-100 mb-1 tracking-tight">
          Document Intelligence
        </h1>
        <p className="text-ink-400 text-sm">
          Retrieval-Augmented Generation — ingest documents, ask questions, get grounded answers.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <StatCard
          label="Documents"
          value={loading ? <Spinner size="sm" /> : stats?.totalDocuments ?? 0}
          sub="ingested"
        />
        <StatCard
          label="Chunks"
          value={loading ? <Spinner size="sm" /> : stats?.totalChunks ?? 0}
          sub="in vector store"
        />
        <StatCard
          label="Backend"
          value={status === null ? '…' : status === 'ok' ? 'Online' : 'Down'}
          sub={provider ? `provider: ${provider}` : 'check connection'}
        />
      </div>

      {/* Pipeline */}
      <div className="glass rounded-xl p-6 mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <p className="text-xs font-mono text-ink-500 uppercase tracking-widest mb-5">
          RAG Pipeline
        </p>
        <div className="flex items-stretch gap-0">
          {PIPELINE.map(({ step, label, desc, color, to }, i) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex-1">
                {to ? (
                  <Link to={to} className="group block p-3 rounded-lg hover:bg-ink-800/50 transition-colors">
                    <p className="font-mono text-xs text-ink-600 mb-0.5">{step}</p>
                    <p className={`font-display font-600 text-sm ${color} group-hover:text-amber-300 transition-colors`}>{label}</p>
                    <p className="text-xs text-ink-500">{desc}</p>
                  </Link>
                ) : (
                  <div className="p-3">
                    <p className="font-mono text-xs text-ink-700 mb-0.5">{step}</p>
                    <p className={`font-display font-600 text-sm ${color}`}>{label}</p>
                    <p className="text-xs text-ink-600">{desc}</p>
                  </div>
                )}
              </div>
              {i < PIPELINE.length - 1 && (
                <div className="text-ink-700 font-mono text-xs px-1">→</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
        <Link to="/ingest" className="glass rounded-xl p-5 hover:border-amber-400/30 transition-colors group">
          <div className="text-2xl mb-3 text-amber-400 group-hover:scale-110 transition-transform origin-left">⊕</div>
          <p className="font-display font-600 text-ink-100 mb-1">Ingest document</p>
          <p className="text-xs text-ink-500">Upload a .txt, .pdf, .docx or paste raw text</p>
        </Link>
        <Link to="/ask" className="glass rounded-xl p-5 hover:border-amber-400/30 transition-colors group">
          <div className="text-2xl mb-3 text-amber-400 group-hover:scale-110 transition-transform origin-left">◎</div>
          <p className="font-display font-600 text-ink-100 mb-1">Ask a question</p>
          <p className="text-xs text-ink-500">Query your documents with natural language</p>
        </Link>
      </div>
    </div>
  )
}

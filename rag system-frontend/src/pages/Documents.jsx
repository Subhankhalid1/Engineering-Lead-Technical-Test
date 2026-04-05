import { useEffect, useState } from 'react'
import { useDocumentStore } from '../store'
import { Spinner, Empty } from '../components/shared'

function DocRow({ doc, onDelete }) {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirming) { setConfirming(true); return }
    setDeleting(true)
    try { await onDelete(doc.id) } finally { setDeleting(false); setConfirming(false) }
  }

  return (
    <div className="glass rounded-xl p-4 flex items-start gap-4 animate-fade-up group">
      {/* Icon */}
      <div className="w-9 h-9 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center flex-shrink-0">
        <span className="text-amber-400 font-mono text-xs">
          {doc.filename?.split('.').pop()?.toUpperCase() || 'TXT'}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-display font-600 text-ink-200 text-sm truncate">{doc.filename}</p>
        <p className="font-mono text-xs text-ink-600 truncate mt-0.5">{doc.id}</p>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs text-ink-500 font-mono">{doc.chunkCount} chunks</span>
          <span className="text-ink-700">·</span>
          <span className="text-xs text-ink-500 font-mono">{doc.characterCount?.toLocaleString()} chars</span>
          <span className="text-ink-700">·</span>
          <span className="text-xs text-ink-600 font-mono">
            {new Date(doc.ingestedAt).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={handleDelete}
        disabled={deleting}
        className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-lg border transition-all ${
          confirming
            ? 'border-red-500/50 bg-red-500/10 text-red-400 hover:bg-red-500/20'
            : 'border-ink-700 text-ink-500 hover:border-red-500/40 hover:text-red-400 opacity-0 group-hover:opacity-100'
        }`}
      >
        {deleting ? <Spinner size="sm" /> : confirming ? 'Confirm?' : 'Delete'}
      </button>
    </div>
  )
}

export default function Documents() {
  const { documents, stats, loading, error, fetchDocuments, deleteDocument } = useDocumentStore()

  useEffect(() => { fetchDocuments() }, [])

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-up">
        <div>
          <h1 className="font-display text-2xl font-700 text-ink-100 mb-1">Documents</h1>
          <p className="text-ink-400 text-sm">All ingested documents in the vector store.</p>
        </div>
        <button
          onClick={fetchDocuments}
          disabled={loading}
          className="btn-ghost flex items-center gap-2"
        >
          {loading && <Spinner size="sm" />}
          Refresh
        </button>
      </div>

      {/* Stats bar */}
      {stats && (
        <div className="flex gap-4 mb-6 animate-fade-up">
          {[
            { label: 'Documents', value: stats.totalDocuments },
            { label: 'Chunks', value: stats.totalChunks },
          ].map(({ label, value }) => (
            <div key={label} className="glass rounded-lg px-4 py-2 flex items-center gap-3">
              <p className="text-xs font-mono text-ink-500">{label}</p>
              <p className="text-sm font-display font-700 text-ink-100">{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="glass rounded-xl p-4 border-red-500/30 mb-5">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* List */}
      {loading && documents.length === 0 ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : documents.length === 0 ? (
        <Empty
          icon="≡"
          title="No documents yet"
          subtitle="Go to the Ingest page to add your first document."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {documents.map(doc => (
            <DocRow key={doc.id} doc={doc} onDelete={deleteDocument} />
          ))}
        </div>
      )}
    </div>
  )
}

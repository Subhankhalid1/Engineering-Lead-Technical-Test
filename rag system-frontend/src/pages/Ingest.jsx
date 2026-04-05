import { useState, useRef } from 'react'
import { useDocumentStore } from '../store'
import { Spinner } from '../components/shared'

export default function Ingest() {
  const { ingestText, ingestFile, loading, error, clearError } = useDocumentStore()

  const [tab, setTab] = useState('text')   // 'text' | 'file'
  const [text, setText] = useState('')
  const [name, setName] = useState('')
  const [file, setFile] = useState(null)
  const [drag, setDrag] = useState(false)
  const [success, setSuccess] = useState(null)
  const fileRef = useRef()

  const reset = () => { setText(''); setName(''); setFile(null); setSuccess(null); clearError() }

  const handleText = async () => {
    if (!text.trim()) return
    clearError()
    setSuccess(null)
    try {
      const result = await ingestText(text.trim(), name.trim() || 'text-input')
      setSuccess(result)
      setText(''); setName('')
    } catch {}
  }

  const handleFile = async () => {
    if (!file) return
    clearError()
    setSuccess(null)
    try {
      const result = await ingestFile(file)
      setSuccess(result)
      setFile(null)
    } catch {}
  }

  const onDrop = (e) => {
    e.preventDefault(); setDrag(false)
    const f = e.dataTransfer.files[0]
    if (f) setFile(f)
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8 animate-fade-up">
        <h1 className="font-display text-2xl font-700 text-ink-100 mb-1">Ingest Document</h1>
        <p className="text-ink-400 text-sm">Add content to the vector store for retrieval.</p>
      </div>

      <div className="flex gap-1 mb-6 glass rounded-lg p-1 w-fit animate-fade-up">
        {['text', 'file'].map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); reset() }}
            className={`px-5 py-2 rounded-md text-sm font-display font-medium transition-all ${
              tab === t
                ? 'bg-amber-400 text-ink-950'
                : 'text-ink-400 hover:text-ink-200'
            }`}
          >
            {t === 'text' ? 'Raw Text' : 'File Upload'}
          </button>
        ))}
      </div>

      {success && (
        <div className="mb-5 glass rounded-xl p-4 border-green-500/30 animate-fade-up">
          <p className="text-green-400 font-display font-600 text-sm mb-2">Ingested successfully</p>
          <div className="grid grid-cols-2 gap-2 font-mono text-xs text-ink-400">
            <span>ID</span><span className="text-ink-300 truncate">{success.documentId}</span>
            <span>Chunks</span><span className="text-ink-300">{success.chunkCount}</span>
            <span>Characters</span><span className="text-ink-300">{success.characterCount?.toLocaleString()}</span>
            <span>Time</span><span className="text-ink-300">{success.elapsedMs}ms</span>
          </div>
        </div>
      )}

   
      {error && (
        <div className="mb-5 glass rounded-xl p-4 border-red-500/30 animate-fade-up">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {tab === 'text' && (
        <div className="glass rounded-xl p-5 flex flex-col gap-4 animate-fade-up">
          <div>
            <label className="block text-xs font-mono text-ink-500 mb-1.5">Label (optional)</label>
            <input
              className="input-base"
              placeholder="e.g. company-faq"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-ink-500 mb-1.5">
              Content <span className="text-ink-700">({text.length} chars)</span>
            </label>
            <textarea
              className="input-base resize-none"
              rows={10}
              placeholder="Paste your document text here..."
              value={text}
              onChange={e => setText(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3">
            <button className="btn-ghost" onClick={reset} disabled={loading}>Clear</button>
            <button
              className="btn-primary flex items-center gap-2"
              onClick={handleText}
              disabled={loading || !text.trim()}
            >
              {loading ? <Spinner size="sm" /> : null}
              Ingest Text
            </button>
          </div>
        </div>
      )}

  
      {tab === 'file' && (
        <div className="glass rounded-xl p-5 flex flex-col gap-4 animate-fade-up">
          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDrag(true) }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center gap-3 cursor-pointer transition-all ${
              drag
                ? 'border-amber-400 bg-amber-400/5'
                : file
                  ? 'border-green-500/50 bg-green-500/5'
                  : 'border-ink-700 hover:border-ink-500 bg-ink-900/30'
            }`}
          >
            <div className="text-3xl">{file ? '✓' : '⬆'}</div>
            {file ? (
              <>
                <p className="font-display font-600 text-ink-200 text-sm">{file.name}</p>
                <p className="text-xs text-ink-500">{(file.size / 1024).toFixed(1)} KB</p>
              </>
            ) : (
              <>
                <p className="font-display font-600 text-ink-300 text-sm">Drop a file or click to browse</p>
                <p className="text-xs text-ink-600">Supports .txt · .pdf · .docx (max 10MB)</p>
              </>
            )}
            <input
              ref={fileRef}
              type="file"
              accept=".txt,.pdf,.docx,.doc"
              className="hidden"
              onChange={e => setFile(e.target.files[0] || null)}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button className="btn-ghost" onClick={reset} disabled={loading}>Clear</button>
            <button
              className="btn-primary flex items-center gap-2"
              onClick={handleFile}
              disabled={loading || !file}
            >
              {loading ? <Spinner size="sm" /> : null}
              Ingest File
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

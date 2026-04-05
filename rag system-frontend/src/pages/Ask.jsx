import { useState, useRef, useEffect } from 'react'
import { useChatStore, useDocumentStore } from '../store'
import { TypingDots, ScoreBar } from '../components/shared'
import { Link } from 'react-router-dom'

function UserBubble({ content }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-xl bg-amber-400/10 border border-amber-400/20 rounded-2xl rounded-tr-sm px-4 py-3">
        <p className="text-sm text-ink-100 leading-relaxed">{content}</p>
      </div>
    </div>
  )
}

function AssistantBubble({ content, sources, error }) {
  const [showSources, setShowSources] = useState(false)

  return (
    <div className="flex justify-start">
      <div className="max-w-2xl w-full">
        <div className={`glass rounded-2xl rounded-tl-sm px-4 py-3 mb-2 ${error ? 'border-red-500/30' : ''}`}>
          <p className={`text-sm leading-relaxed ${error ? 'text-red-400' : 'text-ink-100'} whitespace-pre-wrap`}>
            {content}
          </p>
        </div>
        {sources && sources.length > 0 && (
          <div>
            <button
              onClick={() => setShowSources(v => !v)}
              className="text-xs font-mono text-ink-500 hover:text-amber-400 transition-colors ml-1 mb-1"
            >
              {showSources ? '▼' : '▶'} {sources.length} source{sources.length > 1 ? 's' : ''}
            </button>
            {showSources && (
              <div className="flex flex-col gap-2">
                {sources.map((s, i) => (
                  <div key={i} className="glass rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-mono text-ink-500">
                        chunk {s.metadata?.chunkIndex + 1}/{s.metadata?.totalChunks}
                        {s.metadata?.filename && ` · ${s.metadata.filename}`}
                      </span>
                      <div className="w-28"><ScoreBar score={s.score} /></div>
                    </div>
                    <p className="text-xs text-ink-400 leading-relaxed line-clamp-3">{s.excerpt}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Ask() {
  const { messages, loading, ask, clearChat } = useChatStore()
  const { stats } = useDocumentStore()
  const [input, setInput] = useState('')
  const [topK, setTopK] = useState(3)
  const bottomRef = useRef()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const submit = () => {
    if (!input.trim() || loading) return
    ask(input.trim(), topK)
    setInput('')
  }

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() }
  }

  const noDocuments = stats && stats.totalDocuments === 0

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="px-6 py-4 glass-strong border-b border-ink-800 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="font-display font-700 text-ink-100">Ask</h1>
          <p className="text-xs text-ink-500 font-mono">
            {stats ? `${stats.totalDocuments} doc · ${stats.totalChunks} chunks indexed` : 'loading…'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs text-ink-500 font-mono flex items-center gap-2">
            top-K
            <select
              value={topK}
              onChange={e => setTopK(Number(e.target.value))}
              className="bg-ink-800 border border-ink-700 rounded-md text-ink-200 text-xs px-2 py-1 outline-none"
            >
              {[1,2,3,5,8].map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </label>
          {messages.length > 0 && (
            <button onClick={clearChat} className="btn-ghost text-xs py-1.5">Clear chat</button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4">
        {noDocuments && (
          <div className="glass rounded-xl p-5 border-amber-400/20 text-center animate-fade-up">
            <p className="text-amber-400 font-display font-600 text-sm mb-1">No documents ingested yet</p>
            <p className="text-ink-500 text-xs mb-3">You need to ingest at least one document before asking questions.</p>
            <Link to="/ingest" className="btn-primary inline-block text-xs">Go to Ingest →</Link>
          </div>
        )}

        {messages.length === 0 && !noDocuments && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20 animate-fade-up">
            <div className="text-4xl opacity-20 font-mono">◎</div>
            <p className="text-ink-400 text-sm font-display">Ask anything about your documents</p>
            <div className="flex flex-wrap gap-2 justify-center max-w-md">
              {['Summarise the main topics', 'What are the key findings?', 'List the important dates'].map(q => (
                <button
                  key={q}
                  onClick={() => { setInput(q) }}
                  className="text-xs px-3 py-1.5 glass rounded-full text-ink-400 hover:text-amber-400 hover:border-amber-400/30 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} className="animate-fade-up">
            {msg.role === 'user'
              ? <UserBubble content={msg.content} />
              : <AssistantBubble content={msg.content} sources={msg.sources} error={msg.error} />
            }
          </div>
        ))}

        {loading && (
          <div className="flex justify-start animate-fade-up">
            <div className="glass rounded-2xl rounded-tl-sm px-4 py-3">
              <TypingDots />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 glass-strong border-t border-ink-800 flex-shrink-0">
        <div className="flex gap-3 items-end">
          <textarea
            className="input-base flex-1 resize-none"
            rows={1}
            placeholder="Ask a question about your documents…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKey}
            style={{ maxHeight: '120px', overflowY: 'auto' }}
          />
          <button
            className="btn-primary flex-shrink-0"
            onClick={submit}
            disabled={loading || !input.trim()}
          >
            Send
          </button>
        </div>
        <p className="text-xs text-ink-600 mt-1.5 font-mono">Enter to send · Shift+Enter for newline</p>
      </div>
    </div>
  )
}

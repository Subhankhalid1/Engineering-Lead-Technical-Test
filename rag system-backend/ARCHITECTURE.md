# ARCHITECTURE.md

## System Design

```
┌─────────────────────────────────────────────────────────┐
│                     RAG System                          │
│                                                         │
│  ┌──────────┐   ┌────────────────────────────────────┐  │
│  │  Client  │   │           Express Server            │  │
│  │(Postman/ │──▶│  /ingest         /ask              │  │
│  │ Browser) │   │     │               │               │  │
│  └──────────┘   │     ▼               ▼               │  │
│                 │  IngestService  QueryService         │  │
│                 │     │               │               │  │
│                 │  ┌──┴──────────────┴──┐             │  │
│                 │  │   RAG Pipeline     │             │  │
│                 │  │                   │             │  │
│                 │  │  Embedder ◀────── │             │  │
│                 │  │      │    Retriever│             │  │
│                 │  │      ▼            │             │  │
│                 │  │  VectorStore ─────┘             │  │
│                 │  │      │                          │  │
│                 │  │      ▼                          │  │
│                 │  │    LLM                          │  │
│                 │  └────────────────────────────────┘  │  
│                 └────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | Interface |
|---|---|---|
| `api/documents.js` | HTTP parsing, validation, response formatting | Express Router |
| `api/query.js` | HTTP parsing, validation, response formatting | Express Router |
| `services/rag/ingestService.js` | Pipeline orchestration (parse→chunk→embed→store) | `ingestDocument(buffer, mime, name)` |
| `services/rag/queryService.js` | Pipeline orchestration (embed→retrieve→context→LLM) | `answerQuestion(question, topK)` |
| `services/rag/embedder.js` | Text → vector conversion | `generateEmbeddings(texts[])` |
| `services/rag/retriever.js` | Embed query + search store | `retrieve(query, topK)` |
| `services/rag/llm.js` | LLM prompt execution | `askLLM(context, question)` |
| `models/vectorStore.js` | In-memory cosine similarity store | `addChunks()`, `search()` |
| `models/documentRegistry.js` | Document metadata tracking | `register()`, `list()`, `get()` |
| `utils/chunker.js` | Sentence-aware text splitting | `chunkText(text)` |
| `utils/documentParser.js` | txt/pdf/docx → plain text | `parseDocument(buffer, mime)` |

---

## Data Flow Detail

### Ingest Pipeline

```
User uploads file
       │
       ▼
multer (memory storage, type filter, size limit)
       │
       ▼
documentParser.parseDocument(buffer, mimeType)
  • txt  → Buffer.toString('utf-8')
  • pdf  → pdf-parse extracts text layer
  • docx → mammoth extracts raw text
       │
       ▼
chunker.chunkText(rawText)
  • Tries sentence boundary (. ! ? \n\n) first
  • Falls back to word boundary
  • Falls back to hard cut
  • Default: 500 chars, 50 char overlap
       │
       ▼
embedder.generateEmbeddings(chunks[])
  • mock:    TF-IDF hash → 256-dim normalised vector
  • openai:  text-embedding-3-small → 1536-dim
       │
       ▼
vectorStore.addChunks(items[])
  • Stored as: { id, documentId, text, embedding, metadata }
       │
       ▼
documentRegistry.register(documentId, meta)
```

### Query Pipeline

```
User posts { question }
       │
       ▼
embedder.generateEmbedding(question)
       │
       ▼
vectorStore.search(queryEmbedding, topK)
  • Computes cosine similarity against all stored chunks
  • Returns top-K sorted by score descending
       │
       ▼
Build context string: "[1] chunk1\n\n---\n\n[2] chunk2..."
       │
       ▼
llm.askLLM(context, question)
  • System prompt: "Answer ONLY from the context below"
  • Returns natural language answer
       │
       ▼
Response: { answer, sources[{ score, excerpt, metadata }] }
```

---

## Production Improvements

### Vector Store
| Current | Production |
|---|---|
| In-memory JS array | Pinecone, Weaviate, Qdrant, or pgvector |
| Lost on restart | Persistent, queryable at scale |
| O(n) linear scan | ANN index (HNSW, IVF) |

```js
// Swap-in adapter pattern — same interface:
class PineconeVectorStore {
  async addChunks(items) { ... }
  async search(queryEmbedding, topK) { ... }
}
```

### Embeddings
| Current | Production |
|---|---|
| Mock TF-IDF hashing | OpenAI text-embedding-3-small/large |
| 256 dims, no semantics | 1536/3072 dims, true semantic search |
| Free | ~$0.02 / million tokens |

### Chunking
- **Current:** Character-count splitting with sentence-boundary detection  
- **Better:** Semantic chunking (embed sentences, split where similarity drops)  
- **Better:** Markdown/HTML structure-aware splitting  
- **Better:** Overlap based on sentences rather than characters  

### LLM
- Add streaming responses (`stream: true`) for better UX  
- Add prompt caching (Anthropic) for repeated context  
- Add response grounding / citation extraction  

### Scalability
```
Current (single process):            Production:
─────────────────────────           ──────────────────────────────
Express → in-memory store           Load Balancer
                                          │
                                    ┌─────┴─────┐
                                    │  Express  │  (multiple instances)
                                    └─────┬─────┘
                                          │
                                    ┌─────┴─────┐
                                    │  Redis    │  (job queue for ingest)
                                    └─────┬─────┘
                                          │
                                    ┌─────┴─────┐
                                    │  pgvector │  (persistent vector store)
                                    └───────────┘
```

### Reliability
- Rate limiting on `/ask` (prevent LLM cost abuse)  
- Request queuing for ingest (large documents)  
- Retry logic with exponential backoff for LLM calls  
- Health check with vector store connectivity check  

### Observability
- Structured JSON logging (Winston / Pino)  
- OpenTelemetry tracing across pipeline steps  
- Metrics: ingest latency, retrieval scores, LLM latency  
- Alerting on low retrieval scores (indicates poor chunking or embeddings)  

### Security
- API key authentication middleware  
- File type validation (magic bytes, not just MIME)  
- Input sanitisation before LLM prompts  
- Rate limiting per user/IP  

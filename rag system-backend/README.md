# RAG System — Retrieval-Augmented Generation

A clean, modular RAG (Retrieval-Augmented Generation) system built with **Node.js + Express**.  
Upload documents, ask questions, get AI-powered answers grounded in your content.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Environment Configuration](#environment-configuration)
- [API Reference](#api-reference)
- [Design Decisions](#design-decisions)

---

## Architecture Overview

```
POST /ingest-doc
GET /ingest all docs
DELETE /ingest doc


POST /ask-question

```


## Quick Start

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd rag-system
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` — the system works out-of-the-box with `LLM_PROVIDER=mock` (no API key needed):

```env
LLM_PROVIDER=mock      # no API key needed for testing
PORT=8080
```

To use a real LLM:
```env
# OpenAI
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-...

# OR Anthropic
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Run

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Server starts at `http://localhost:8080`

### 4. Docker

```bash
docker build -t rag-system .
docker run -p 8080:8080 --env-file .env rag-system
```

---



## API Reference

### `GET /health`
Check server status.

**Response:**
```json
{
  "status": "ok",
  "llmProvider": "mock",
  "uptime": 42.3,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### `POST /ingest` — Upload a File

Ingest a `.txt`, `.pdf`, or `.docx` file.

**Request:** `multipart/form-data`
- Key: `file`
- Value: your document file

**Response:**
```json
{
  "success": true,
  "message": "Document ingested successfully.",
  "data": {
    "documentId": "a1b2c3d4-...",
    "filename": "my-doc.txt",
    "chunkCount": 12,
    "characterCount": 5840,
    "elapsedMs": 43
  }
}
```


---

### `POST /ask`

Ask a question answered from ingested documents.

**Request:** `application/json`
```json
{
  "question": "What is ai",
  "topK": 3
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "question": "What is artificial intelligence?",
    "answer": "Artificial intelligence refers to...",
    "sources": [
      {
        "documentId": "a1b2c3d4-...",
        "score": 0.9142,
        "excerpt": "Artificial intelligence (AI) is intelligence demonstrated by machines...",
        "metadata": {
          "filename": "ai-overview",
          "chunkIndex": 0,
          "totalChunks": 3
        }
      }
    ]
  }
}
```

---

### `GET /ingest`

List all ingested documents and vector store statistics.

---

### `DELETE /ingest/:documentId`

Remove a document and all its chunks from the vector store.



## Design Decisions

### In-Memory Vector Store
Chosen for zero-dependency simplicity. Cosine similarity is computed in nodejs.  
For production: swap `models/vectorStore.js` for a FAISS, Pinecone, or pgvector adapter — the interface is identical.

### Mock Embeddings
The mock embedder uses TF-IDF-style hashing into 256-dim vectors. Cosine similarity still works correctly — useful tokens will cluster. For real semantic search, switch to `LLM_PROVIDER=openai`.

### Sentence-Aware Chunking
The chunker tries sentence boundaries before word boundaries before hard cuts, preserving semantic coherence within chunks.

### Separation of Concerns
- **Routes** 
- **Services**
- **Models** 
- **Utils** 

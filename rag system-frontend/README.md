# RAG UI — React Frontend



## Quick Start

```bash
# 1. Make sure the RAG backend is running on port 8080
cd ../rag-system && npm run dev

# 2. Install and run the UI
cd rag-ui
npm install
npm run dev
# → http://localhost:5173
```

The Vite dev server proxies `/ingest`, `/ask`, `/health` to `http://localhost:3000` automatically — no CORS setup needed.

## Pages

| Route | Page | API calls |
|---|---|---|
| `/` | Dashboard | `GET /health`, `GET /ingest` |
| `/ingest` | Ingest | `POST /ingest` (text + file) |
| `/ask` | Ask / Chat | `POST /ask` |
| `/docs` | Documents | `GET /ingest`, `DELETE /ingest/:id` |

## Project Structure


```



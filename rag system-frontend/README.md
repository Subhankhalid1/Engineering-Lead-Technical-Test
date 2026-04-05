# RAG UI — React Frontend

A clean React frontend for the RAG backend. Built with Vite, Tailwind CSS, Zustand, Axios, and React Router.

## Stack

| Library | Role |
|---|---|
| React 18 | UI framework |
| React Router v6 | Client-side routing (4 pages) |
| Zustand | Global state (documents, chat, health) |
| Axios | HTTP client with interceptors |
| Tailwind CSS | Utility-first styling |
| Vite | Dev server + bundler |

## Quick Start

```bash
# 1. Make sure the RAG backend is running on port 3000
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
src/
├── api/
│   └── client.js       # Axios instance + all API functions
├── store/
│   └── index.js        # Zustand stores (documents, chat, health)
├── components/
│   ├── Layout.jsx      # Sidebar + navigation
│   └── shared.jsx      # Reusable UI atoms (Spinner, ScoreBar, etc.)
├── pages/
│   ├── Dashboard.jsx   # Stats + pipeline overview
│   ├── Ingest.jsx      # Text paste + drag-and-drop file upload
│   ├── Ask.jsx         # Chat interface with source display
│   └── Documents.jsx   # Document list with delete
├── App.jsx             # Route definitions
├── main.jsx            # Entry point
└── index.css           # Tailwind + global styles
```

## Features

- Live backend health status in sidebar
- Drag-and-drop file upload (txt, pdf, docx)
- Chat interface with typing indicator
- Collapsible source citations with similarity score bars
- Adjustable top-K retrieval slider
- One-click document deletion (with confirmation)
- Vite proxy — no CORS issues in development

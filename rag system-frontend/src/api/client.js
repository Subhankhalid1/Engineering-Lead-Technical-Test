import axios from 'axios'

const api = axios.create({
  baseURL: '/',
  timeout: 30000,
})

api.interceptors.response.use(
  res => res,
  err => {
    const message =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

// ── /ingest ──────────────────────────────────────────────────────────────────

/** Ingest a raw text string */
export const ingestText = (text, name = 'text-input') =>
  api.post('/ingest', { text, name }).then(r => r.data.data)

/** Ingest a file (multipart) */
export const ingestFile = (file) => {
  const form = new FormData()
  form.append('file', file)
  return api.post('/ingest', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data.data)
}

/** List all ingested documents */
export const listDocuments = () =>
  api.get('/ingest').then(r => r.data.data)

/** Delete a document by ID */
export const deleteDocument = (id) =>
  api.delete(`/ingest/${id}`).then(r => r.data)

// ── /ask ─────────────────────────────────────────────────────────────────────

/** Ask a question */
export const askQuestion = (question, topK = 3) =>
  api.post('/ask', { question, topK }).then(r => r.data.data)

// ── /health ──────────────────────────────────────────────────────────────────

export const getHealth = () =>
  api.get('/health').then(r => r.data)

export default api

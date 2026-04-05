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

export const ingestText = (text, name = 'text-input') =>
  api.post('/ingest', { text, name }).then(r => r.data.data)

export const ingestFile = (file) => {
  const form = new FormData()
  form.append('file', file)
  return api.post('/ingest', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data.data)
}

export const listDocuments = () =>
  api.get('/ingest').then(r => r.data.data)

export const deleteDocument = (id) =>
  api.delete(`/ingest/${id}`).then(r => r.data)

export const askQuestion = (question, topK = 3) =>
  api.post('/ask', { question, topK }).then(r => r.data.data)



export const getHealth = () =>
  api.get('/health').then(r => r.data)

export default api

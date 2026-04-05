import { create } from 'zustand'
import {
  ingestText,
  ingestFile,
  listDocuments,
  deleteDocument,
  askQuestion,
  getHealth,
} from '../api/client'

export const useDocumentStore = create((set, get) => ({
  documents: [],
  stats: null,
  loading: false,
  error: null,

  fetchDocuments: async () => {
    set({ loading: true, error: null })
    try {
      const data = await listDocuments()
      set({ documents: data.documents, stats: data.vectorStoreStats, loading: false })
    } catch (e) {
      set({ error: e.message, loading: false })
    }
  },

  ingestText: async (text, name) => {
    set({ loading: true, error: null })
    try {
      const result = await ingestText(text, name)
      await get().fetchDocuments()
      return result
    } catch (e) {
      set({ error: e.message, loading: false })
      throw e
    }
  },

  ingestFile: async (file) => {
    set({ loading: true, error: null })
    try {
      const result = await ingestFile(file)
      await get().fetchDocuments()
      return result
    } catch (e) {
      set({ error: e.message, loading: false })
      throw e
    }
  },

  deleteDocument: async (id) => {
    set({ error: null })
    try {
      await deleteDocument(id)
      set(state => ({
        documents: state.documents.filter(d => d.id !== id),
        stats: state.stats
          ? { ...state.stats, totalDocuments: state.stats.totalDocuments - 1 }
          : null,
      }))
    } catch (e) {
      set({ error: e.message })
      throw e
    }
  },

  clearError: () => set({ error: null }),
}))


export const useChatStore = create((set) => ({
  messages: [],       // { id, role:'user'|'assistant', content, sources?, error? }
  loading: false,

  ask: async (question, topK = 3) => {
    const userMsg = { id: Date.now(), role: 'user', content: question }
    set(s => ({ messages: [...s.messages, userMsg], loading: true }))

    try {
      const data = await askQuestion(question, topK)
      const assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.answer,
        sources: data.sources,
      }
      set(s => ({ messages: [...s.messages, assistantMsg], loading: false }))
    } catch (e) {
      const errMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: e.message,
        error: true,
      }
      set(s => ({ messages: [...s.messages, errMsg], loading: false }))
    }
  },

  clearChat: () => set({ messages: [] }),
}))


export const useHealthStore = create((set) => ({
  status: null,  // null | 'ok' | 'error'
  provider: null,

  check: async () => {
    try {
      const data = await getHealth()
      set({ status: 'ok', provider: data.llmProvider })
    } catch {
      set({ status: 'error', provider: null })
    }
  },
}))

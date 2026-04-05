import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/ingest': 'http://localhost:3000',
      '/ask': 'http://localhost:3000',
      '/health': 'http://localhost:3000',
    }
  }
})

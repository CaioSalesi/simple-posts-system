import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/posts': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log(`[PROXY] ${req.method} ${req.url} → http://localhost:3000${req.url}`)
          })
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log(`[PROXY] Response ${proxyRes.statusCode} for ${req.url}`)
          })
          proxy.on('error', (err, req) => {
            console.error(`[PROXY] Error for ${req.url}:`, err.message)
          })
        }
      }
    }
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    // ngrok sirve la app bajo un dominio *.ngrok-free.app
    allowedHosts: true,
    // El navegador remoto no ve localhost:8080, asi que Vite reenvia /api al gateway.
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        configure: (proxy) => {
          // El navegador manda Origin en todo POST (aunque sea same-origin). Con ngrok ese
          // Origin es el dominio publico, que no esta en los allowed-origins del gateway y
          // Spring Cloud Gateway responde 403. Sin Origin no lo trata como peticion CORS.
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.removeHeader('origin')
            proxyReq.removeHeader('referer')
          })
        }
      }
    }
  },
  preview: {
    port: 5173,
    strictPort: true
  }
})

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// Backend'de CORS kapalı olduğu için geliştirme sırasında istekler Vite proxy'si üzerinden gider.
// Tarayıcı için her şey aynı origin'dir (localhost:5173), bu yüzden backend'e dokunmaya gerek kalmaz.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const target = env.VITE_API_PROXY_TARGET || 'http://localhost:8080'

  return {
    plugins: [react()],
    resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
    server: {
      port: 5173,
      proxy: { '/intelliCar': { target, changeOrigin: true } },
    },
  }
})

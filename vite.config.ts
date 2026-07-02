import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, sb-2b4462m7qe2d.vercel.run
    port: 5173
  }
})

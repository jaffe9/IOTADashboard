import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    chunkSizeWarningLimit: 3000,
    target: "esnext",
  },
  server: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '8080'), // ✅ Use dynamic port from .env or fallback
    // hmr: {
    //   overlay: false,
    // },
  },
  logLevel: 'info',
})

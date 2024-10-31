import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "",
  build: {
    chunkSizeWarningLimit: 3000,
    target: "esnext",
  },
  server: {
    host: '0.0.0.0',
    port: 8080 // change here
  },
})

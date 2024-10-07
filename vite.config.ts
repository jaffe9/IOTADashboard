import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/IOTADashboard/",
  build: {
    chunkSizeWarningLimit: 3000,
    target: "esnext",
  },
  server: {
    port: 5173 // change here
  },
})

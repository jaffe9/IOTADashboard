import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dotenv from 'dotenv'
import path from 'path' //changed here

// Load environment variables from .env file
dotenv.config()

export default defineConfig({
  plugins: [react()],
  base: "",
  build: {
    chunkSizeWarningLimit: 3000,
    target: "esnext",
  },
  server: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '8080'), // ✅ Use dynamic port from .env or fallback
    hmr: {
      overlay: false,
    },
    //changes start here =============================
    fs: {
      
      allow: [
        process.cwd(), 
        path.resolve(process.cwd(), '..'), 
        path.resolve(process.cwd(), '../..'), 
        '/root/iwtDashboard' 
      ]
    }
    // end here =======================================
  },
  logLevel: 'info',
})

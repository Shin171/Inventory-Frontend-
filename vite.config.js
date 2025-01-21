import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'  // Add this line to import the path module

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7194/api/Product',  // Your .NET Web API URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

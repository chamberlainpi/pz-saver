import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],

  server: {
    port: 3333,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        // cors: false,
        changeOrigin: true,
        // ws: true, ////////////////////
        rewrite: p => p.replace(/^\/api/, ''),
      },
    },
  },
})

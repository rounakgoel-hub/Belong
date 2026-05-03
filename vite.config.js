import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/search': {
        target: 'https://itunes.apple.com',
        changeOrigin: true,
        rewrite: path => {
          const url = new URL(path, 'http://localhost')
          const q = url.searchParams.get('q') || ''
          return `/search?term=${encodeURIComponent(q)}&media=music&entity=song&limit=8&country=in`
        },
      },
    },
  },
})

import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import feed from './plugins/feed.js'

export default defineConfig({
  plugins: [tailwindcss(), feed()],
})

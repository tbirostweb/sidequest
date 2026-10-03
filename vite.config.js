import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { gamesPlugin } from './scripts/games-plugin.js'
export default defineConfig({ plugins: [vue(), gamesPlugin()], optimizeDeps: { include: ['vue', '@lucide/vue'] } })

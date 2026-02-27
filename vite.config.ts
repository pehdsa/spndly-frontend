import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
const proxyTarget = process.env.VITE_API_URL || 'https://spndly-backend.test'

export default defineConfig({
  plugins: [vue(), tailwindcss(), tsconfigPaths()],
  server: {
    proxy: {
      '/api': {
        target: proxyTarget,
        changeOrigin: true,
        secure: false,
      },
      '/oauth': {
        target: proxyTarget,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    chunkSizeWarningLimit: 700,
    rolldownOptions: {
      output: {
        advancedChunks: {
          groups: [
            { name: 'vue-core', test: /node_modules\/(vue|vue-router|pinia)\// },
            { name: 'tanstack-table', test: /node_modules\/@tanstack\/(vue-table|table-core)\// },
            { name: 'tanstack-query', test: /node_modules\/@tanstack\/(vue-query|query-core)\// },
            { name: 'tanstack-form', test: /node_modules\/@tanstack\/(vue-form|form-core)\// },
            { name: 'charts', test: /node_modules\/@unovis\// },
            { name: 'datepicker', test: /node_modules\/@vuepic\// },
            { name: 'icons', test: /node_modules\/lucide-vue-next\// },
            { name: 'ui-vendors', test: /node_modules\/(reka-ui|vaul-vue)\// },
            { name: 'utils', test: /node_modules\/(axios|zod|@vueuse)\// },
            { name: 'vendor', test: /node_modules\// },
          ],
        },
      },
    },
  },
})
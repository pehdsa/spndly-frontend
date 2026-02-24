import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss(), tsconfigPaths()],
  server: {
    proxy: {
      '/api': {
        target: 'https://spndly-backend.test',
        changeOrigin: true,
        secure: false, // ignora certificado auto-assinado em domínios .test
      },
      '/oauth': {
        target: 'https://spndly-backend.test',
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
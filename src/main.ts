import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import router from './router'
import { useAuthStore } from '@/stores/auth'
import './assets/css/main.css'
import App from './App.vue'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

app.use(VueQueryPlugin)

// Carregar tokens ANTES de registrar o router
// para garantir que guards tenham acesso ao estado de autenticação
const authStore = useAuthStore()
authStore.loadFromStorage()

app.use(router)

app.mount('#app')

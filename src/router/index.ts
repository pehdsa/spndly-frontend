import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { requiresGuest, requiresAdmin, requiresClient } from './guards'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Aplicar guards baseado em meta
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Propagar meta do pai para filhos
  const requiresAuthMeta = to.matched.some((record) => record.meta.requiresAuth)
  const requiresGuestMeta = to.matched.some((record) => record.meta.requiresGuest)
  const requiresAdminMeta = to.matched.some((record) => record.meta.requiresAdmin)

  if (requiresAuthMeta) {
    // Primeiro verifica se está autenticado (tem tokens)
    if (!authStore.isAuthenticated) {
      return next({ name: 'auth.login', query: { redirect: to.fullPath } })
    }

    // Fetch user apenas se ainda não validado nesta sessão
    if (!authStore.isUserValidated) {
      try {
        await authStore.fetchUser()
      } catch {
        // Se falhar ao buscar usuário, já foi limpo pelo fetchUser
        return next({ name: 'auth.login', query: { redirect: to.fullPath } })
      }
    }

    // Verifica se requer admin
    if (requiresAdminMeta) {
      return requiresAdmin(to, from, next)
    }

    // Verifica se requer client
    const requiresClientMeta = to.matched.some((record) => record.meta.requiresClient)
    if (requiresClientMeta) {
      return requiresClient(to, from, next)
    }

    return next()
  }

  if (requiresGuestMeta) {
    return requiresGuest(to, from, next)
  }

  next()
})

export default router

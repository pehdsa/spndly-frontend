import type { NavigationGuard } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

/**
 * Guard que requer autenticação
 * Redireciona para login se não autenticado
 */
export const requiresAuth: NavigationGuard = (to, _from, next) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    next({ name: 'auth.login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
}

/**
 * Guard que requer visitante (não autenticado)
 * Redireciona para home se autenticado
 */
export const requiresGuest: NavigationGuard = (_to, _from, next) => {
  const authStore = useAuthStore()

  if (authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
}

/**
 * Guard que requer role de administrador
 * Redireciona para home se não for admin
 */
export const requiresAdmin: NavigationGuard = (_to, _from, next) => {
  const authStore = useAuthStore()

  if (!authStore.isAdmin) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
}

/**
 * Guard que requer role de cliente (CLIENT)
 * Redireciona para 404 se não for client
 */
export const requiresClient: NavigationGuard = (_to, _from, next) => {
  const authStore = useAuthStore()

  if (!authStore.isClient) {
    next({ name: 'not-found' })
  } else {
    next()
  }
}

/**
 * Guard que verifica permissão específica
 * Uso: meta: { permission: 'users.create' }
 */
export const requiresPermission = (permission: string): NavigationGuard => {
  return (_to, _from, next) => {
    const authStore = useAuthStore()

    // TODO: Implementar hasPermission no authStore quando necessário
    const hasPermission = authStore.isAuthenticated // Placeholder

    if (!hasPermission) {
      next({ name: 'forbidden' })
    } else {
      next()
    }

    // Silencia warning de variável não usada
    void permission
  }
}

import { useMutation } from '@tanstack/vue-query'
import { useAuthStore } from '@/stores/auth'
import { logout } from '../services'

export function useLogout() {
  const authStore = useAuthStore()

  return useMutation({
    mutationFn: async () => {
      const token = authStore.accessToken
      if (token) {
        await logout(token)
      }
    },
    onSuccess: () => {
      authStore.clearAuth()
    },
  })
}

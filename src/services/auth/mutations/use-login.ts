import { useMutation } from '@tanstack/vue-query'
import { useAuthStore } from '@/stores/auth'
import { login, getUser } from '../services'
import type { LoginCredentials } from '../types'

export function useLogin() {
  const authStore = useAuthStore()

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const tokens = await login(credentials)
      const user = await getUser(tokens.access_token)
      return { user, tokens }
    },
    onSuccess: ({ user, tokens }) => {
      authStore.setAuth(user, tokens)
    },
  })
}

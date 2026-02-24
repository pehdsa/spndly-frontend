import { useMutation } from '@tanstack/vue-query'
import { useAuthStore } from '@/stores/auth'
import { register } from '../services'
import type { RegisterData } from '../types'

export function useRegister() {
  const authStore = useAuthStore()

  return useMutation({
    mutationFn: (data: RegisterData) => register(data),
    onSuccess: ({ user, access_token, refresh_token, expires_in }) => {
      authStore.setAuth(user, {
        access_token,
        refresh_token,
        expires_in,
        token_type: 'Bearer',
      })
    },
  })
}

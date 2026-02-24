import { useMutation } from '@tanstack/vue-query'
import { forgotPassword } from '../services'
import type { ForgotPasswordData } from '../types'

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordData) => forgotPassword(data),
  })
}

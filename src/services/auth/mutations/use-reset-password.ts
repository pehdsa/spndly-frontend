import { useMutation } from '@tanstack/vue-query'
import { resetPassword } from '../services'
import type { ResetPasswordData } from '../types'

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: ResetPasswordData) => resetPassword(data),
  })
}

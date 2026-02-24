import type { ApiResponse } from '@/services'
import { authApi } from '../api'
import type { ResetPasswordData } from '../types'

export async function resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
  const response = await authApi.post<ApiResponse<{ message: string }>>('/auth/reset-password', data)
  return response.data.data
}

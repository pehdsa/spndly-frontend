import type { ApiResponse } from '@/services'
import { authApi } from '../api'
import type { ForgotPasswordData } from '../types'

export async function forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
  const response = await authApi.post<ApiResponse<{ message: string }>>('/auth/forgot-password', data)
  return response.data.data
}

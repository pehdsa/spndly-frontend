import { http } from '@/services/http'
import type { ApiResponse } from '@/services'
import type { User, UpdateUserRoleData } from '../types'

export async function updateUserRole(userId: number, data: UpdateUserRoleData): Promise<User> {
  const response = await http.patch<ApiResponse<User>>(`/users/${userId}/role`, data)
  return response.data.data
}

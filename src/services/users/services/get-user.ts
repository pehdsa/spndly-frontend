import { http } from '@/services/http'
import type { ApiResponse } from '@/services'
import type { User } from '../types'

export async function getUser(userId: number): Promise<User> {
  const { data } = await http.get<ApiResponse<User>>(`/users/${userId}`)
  return data.data
}

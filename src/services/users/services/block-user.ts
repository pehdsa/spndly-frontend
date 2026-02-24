import { http } from '@/services/http'
import type { ApiResponse } from '@/services'

export async function blockUser(userId: number): Promise<string> {
  const { data } = await http.post<ApiResponse<{ message: string }>>(`/users/${userId}/block`)
  return data.data.message
}

import { http } from '@/services/http'
import type { ApiResponse } from '@/services'

export async function deleteUser(userId: number): Promise<string> {
  const { data } = await http.delete<ApiResponse<{ message: string }>>(`/users/${userId}`)
  return data.data.message
}

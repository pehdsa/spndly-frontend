import { http } from '@/services/http'
import type { ApiResponse } from '@/services'

export async function unblockUser(userId: number): Promise<string> {
  const { data } = await http.post<ApiResponse<{ message: string }>>(`/users/${userId}/unblock`)
  return data.data.message
}

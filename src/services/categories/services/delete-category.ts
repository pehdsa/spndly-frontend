import { http } from '@/services/http'
import type { ApiResponse } from '@/services'

export async function deleteCategory(id: number): Promise<string> {
  const { data } = await http.delete<ApiResponse<{ message: string }>>(`/categories/${id}`)
  return data.data.message
}

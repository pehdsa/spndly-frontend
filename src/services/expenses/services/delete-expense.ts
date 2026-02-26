import { http } from '@/services/http'
import type { ApiResponse } from '@/services'

export async function deleteExpense(id: number): Promise<string> {
  const { data } = await http.delete<ApiResponse<{ message: string }>>(`/expenses/${id}`)
  return data.data.message
}

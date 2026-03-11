import { http } from '@/services/http'
import type { ApiResponse } from '@/services'

export async function deletePaymentMethod(id: number): Promise<string> {
  const { data } = await http.delete<ApiResponse<{ message: string }>>(`/payment-methods/${id}`)
  return data.data.message
}

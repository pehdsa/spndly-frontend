import { http } from '@/services/http'
import type { ApiResponse } from '@/services'
import type { PaymentMethod } from '../types'

export async function getPaymentMethod(id: number): Promise<PaymentMethod> {
  const { data } = await http.get<ApiResponse<PaymentMethod>>(`/payment-methods/${id}`)
  return data.data
}

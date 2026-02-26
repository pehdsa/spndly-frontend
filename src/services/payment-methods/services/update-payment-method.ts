import { http } from '@/services/http'
import type { ApiResponse } from '@/services'
import type { PaymentMethod, UpdatePaymentMethodData } from '../types'

export async function updatePaymentMethod(id: number, payload: UpdatePaymentMethodData): Promise<PaymentMethod> {
  const { data } = await http.patch<ApiResponse<PaymentMethod>>(`/payment-methods/${id}`, payload)
  return data.data
}

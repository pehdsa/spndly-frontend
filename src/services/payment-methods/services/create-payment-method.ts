import { http } from '@/services/http'
import type { ApiResponse } from '@/services'
import type { PaymentMethod, CreatePaymentMethodData } from '../types'

export async function createPaymentMethod(payload: CreatePaymentMethodData): Promise<PaymentMethod> {
  const { data } = await http.post<ApiResponse<PaymentMethod>>('/payment-methods', payload)
  return data.data
}

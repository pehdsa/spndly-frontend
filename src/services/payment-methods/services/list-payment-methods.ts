import { http } from '@/services/http'
import type { ApiPaginatedResponse, PaginationParams } from '@/services'
import type { PaymentMethod } from '../types'

export async function listPaymentMethods(params?: PaginationParams): Promise<ApiPaginatedResponse<PaymentMethod>> {
  const { data } = await http.get<ApiPaginatedResponse<PaymentMethod>>('/payment-methods', { params })
  return data
}

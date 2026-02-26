import { http } from '@/services/http'
import type { ApiPaginatedResponse, PaginationParams } from '@/services'
import type { Expense } from '../types'

export async function listExpenses(params?: PaginationParams): Promise<ApiPaginatedResponse<Expense>> {
  const { data } = await http.get<ApiPaginatedResponse<Expense>>('/expenses', { params })
  return data
}

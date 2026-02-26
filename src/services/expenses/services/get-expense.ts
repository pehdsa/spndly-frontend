import { http } from '@/services/http'
import type { ApiResponse } from '@/services'
import type { Expense } from '../types'

export async function getExpense(id: number): Promise<Expense> {
  const { data } = await http.get<ApiResponse<Expense>>(`/expenses/${id}`)
  return data.data
}

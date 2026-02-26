import { http } from '@/services/http'
import type { ApiResponse } from '@/services'
import type { Expense, UpdateExpenseData } from '../types'

export async function updateExpense(id: number, payload: UpdateExpenseData): Promise<Expense> {
  const { data } = await http.patch<ApiResponse<Expense>>(`/expenses/${id}`, payload)
  return data.data
}

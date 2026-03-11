import { http } from '@/services/http'
import type { ApiResponse } from '@/services'
import type { Expense, CreateExpenseData } from '../types'

export async function createExpense(payload: CreateExpenseData): Promise<Expense> {
  const { data } = await http.post<ApiResponse<Expense>>('/expenses', payload)
  return data.data
}

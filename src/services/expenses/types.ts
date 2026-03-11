import type { Category } from '@/services/categories'
import type { PaymentMethod } from '@/services/payment-methods'

// Entidades
export interface Expense {
  id: number
  description: string | null
  amount_cents: number
  category: Category
  payment_method: PaymentMethod
  created_at: string
}

// DTOs
export interface CreateExpenseData {
  category_id: number
  payment_method_id: number
  description?: string | null
  amount_cents: number
}

export interface UpdateExpenseData {
  category_id?: number
  payment_method_id?: number
  description?: string | null
  amount_cents?: number
}

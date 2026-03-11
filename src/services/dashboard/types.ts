import type { Expense } from '@/services/expenses'

export interface DashboardTotals {
  total_amount: number
  total_count: number
}

export interface TopCategory {
  id: number
  name: string
  total_amount: number
  total_count: number
}

export interface TopPaymentMethod {
  id: number
  name: string
  total_amount: number
  total_count: number
}

export interface DashboardData {
  totals: DashboardTotals
  top_categories: TopCategory[]
  top_payment_methods: TopPaymentMethod[]
  recent_expenses: Expense[]
}

export type DashboardPeriod = '7d' | '30d' | '90d' | '12m'

export interface DashboardParams {
  period?: DashboardPeriod
  start_date?: string
  end_date?: string
  user_id?: number
}

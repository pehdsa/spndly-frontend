import type { PaginationParams } from '@/services'

export const expenseKeys = {
  all: ['expenses'] as const,
  lists: () => [...expenseKeys.all, 'list'] as const,
  list: (params?: PaginationParams) => [...expenseKeys.lists(), params] as const,
  detail: (id: number) => [...expenseKeys.all, 'detail', id] as const,
}

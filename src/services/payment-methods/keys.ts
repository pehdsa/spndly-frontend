import type { PaginationParams } from '@/services'

export const paymentMethodKeys = {
  all: ['payment-methods'] as const,
  lists: () => [...paymentMethodKeys.all, 'list'] as const,
  list: (params?: PaginationParams) => [...paymentMethodKeys.lists(), params] as const,
  detail: (id: number) => [...paymentMethodKeys.all, 'detail', id] as const,
}

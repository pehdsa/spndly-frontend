import { useQuery, type UseQueryOptions } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useStaleTime } from '@/composables'
import type { ApiPaginatedResponse, PaginationParams } from '@/services'
import { expenseKeys } from '../keys'
import { listExpenses } from '../services'
import type { Expense } from '../types'

type Response = ApiPaginatedResponse<Expense>

interface UseExpensesProps {
  params?: MaybeRefOrGetter<PaginationParams | undefined>
  options?: Omit<UseQueryOptions<Response, Error>, 'queryKey' | 'queryFn'>
}

export function useExpenses({ params, options }: UseExpensesProps = {}) {
  const computedParams = computed(() => toValue(params))

  return useQuery<Response>({
    queryKey: computed(() => expenseKeys.list(computedParams.value)),
    queryFn: () => listExpenses(computedParams.value),
    staleTime: useStaleTime({ minutes: 5 }),
    ...options,
  })
}

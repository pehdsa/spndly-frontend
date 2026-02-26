import { useQuery, type UseQueryOptions } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useStaleTime } from '@/composables'
import type { ApiPaginatedResponse, PaginationParams } from '@/services'
import { categoryKeys } from '../keys'
import { listCategories } from '../services'
import type { Category } from '../types'

type Response = ApiPaginatedResponse<Category>

interface UseCategoriesProps {
  params?: MaybeRefOrGetter<PaginationParams | undefined>
  options?: Omit<UseQueryOptions<Response, Error>, 'queryKey' | 'queryFn'>
}

export function useCategories({ params, options }: UseCategoriesProps = {}) {
  const computedParams = computed(() => toValue(params))

  return useQuery<Response>({
    queryKey: computed(() => categoryKeys.list(computedParams.value)),
    queryFn: () => listCategories(computedParams.value),
    staleTime: useStaleTime({ minutes: 5 }),
    ...options,
  })
}

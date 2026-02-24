import { useQuery, type UseQueryOptions } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useStaleTime } from '@/composables'
import type { ApiPaginatedResponse, PaginationParams } from '@/services'
import { userKeys } from '../keys'
import { listUsers } from '../services'
import type { User } from '../types'

type Response = ApiPaginatedResponse<User>

interface UseUsersProps {
  params?: MaybeRefOrGetter<PaginationParams | undefined>
  options?: Omit<UseQueryOptions<Response, Error>, 'queryKey' | 'queryFn'>
}

export function useUsers({ params, options }: UseUsersProps = {}) {
  const computedParams = computed(() => toValue(params))

  return useQuery<Response>({
    queryKey: computed(() => userKeys.list(computedParams.value)),
    queryFn: () => listUsers(computedParams.value),
    staleTime: useStaleTime({ minutes: 5 }),
    ...options,
  })
}

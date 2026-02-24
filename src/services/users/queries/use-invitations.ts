import { useQuery, type UseQueryOptions } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useStaleTime } from '@/composables'
import type { ApiPaginatedResponse, PaginationParams } from '@/services'
import { userKeys } from '../keys'
import { listInvitations } from '../services'
import type { Invitation } from '../types'

type Response = ApiPaginatedResponse<Invitation>

interface UseInvitationsProps {
  params?: MaybeRefOrGetter<PaginationParams | undefined>
  options?: Omit<UseQueryOptions<Response, Error>, 'queryKey' | 'queryFn'>
}

export function useInvitations({ params, options }: UseInvitationsProps = {}) {
  const computedParams = computed(() => toValue(params))

  return useQuery<Response>({
    queryKey: computed(() => userKeys.invitations(computedParams.value)),
    queryFn: () => listInvitations(computedParams.value),
    staleTime: useStaleTime({ minutes: 5 }),
    ...options,
  })
}

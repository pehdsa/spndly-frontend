import { useQuery, type UseQueryOptions } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useStaleTime } from '@/composables'
import type { ApiPaginatedResponse, PaginationParams } from '@/services'
import { paymentMethodKeys } from '../keys'
import { listPaymentMethods } from '../services'
import type { PaymentMethod } from '../types'

type Response = ApiPaginatedResponse<PaymentMethod>

interface UsePaymentMethodsProps {
  params?: MaybeRefOrGetter<PaginationParams | undefined>
  options?: Omit<UseQueryOptions<Response, Error>, 'queryKey' | 'queryFn'>
}

export function usePaymentMethods({ params, options }: UsePaymentMethodsProps = {}) {
  const computedParams = computed(() => toValue(params))

  return useQuery<Response>({
    queryKey: computed(() => paymentMethodKeys.list(computedParams.value)),
    queryFn: () => listPaymentMethods(computedParams.value),
    staleTime: useStaleTime({ minutes: 5 }),
    ...options,
  })
}

import { useQuery, type UseQueryOptions } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useStaleTime } from '@/composables'
import { dashboardKeys } from '../keys'
import { getDashboard } from '../services'
import type { DashboardData, DashboardParams } from '../types'

interface UseDashboardProps {
  params?: MaybeRefOrGetter<DashboardParams | undefined>
  options?: Omit<UseQueryOptions<DashboardData, Error>, 'queryKey' | 'queryFn'>
}

export function useDashboard({ params, options }: UseDashboardProps = {}) {
  const computedParams = computed(() => toValue(params))

  return useQuery<DashboardData>({
    queryKey: computed(() => dashboardKeys.data(computedParams.value)),
    queryFn: () => getDashboard(computedParams.value),
    staleTime: useStaleTime({ minutes: 2 }),
    ...options,
  })
}

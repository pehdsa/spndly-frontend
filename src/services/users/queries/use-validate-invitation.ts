import { useQuery } from '@tanstack/vue-query'
import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'
import { userKeys } from '../keys'
import { validateInvitation } from '../services'

export function useValidateInvitation(token: MaybeRefOrGetter<string | undefined>) {
  return useQuery({
    queryKey: userKeys.validateInvitation(toValue(token) ?? ''),
    queryFn: () => validateInvitation(toValue(token)!),
    enabled: () => !!toValue(token),
    retry: false,
    staleTime: Infinity,
  })
}

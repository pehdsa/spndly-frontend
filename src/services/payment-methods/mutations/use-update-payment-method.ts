import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { paymentMethodKeys } from '../keys'
import { updatePaymentMethod } from '../services'
import type { UpdatePaymentMethodData } from '../types'

export function useUpdatePaymentMethod() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePaymentMethodData }) => updatePaymentMethod(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentMethodKeys.all })
    },
  })
}

import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { paymentMethodKeys } from '../keys'
import { createPaymentMethod } from '../services'
import type { CreatePaymentMethodData } from '../types'

export function useCreatePaymentMethod() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePaymentMethodData) => createPaymentMethod(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentMethodKeys.all })
    },
  })
}

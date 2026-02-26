import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { paymentMethodKeys } from '../keys'
import { deletePaymentMethod } from '../services'

export function useDeletePaymentMethod() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deletePaymentMethod(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentMethodKeys.lists() })
    },
  })
}

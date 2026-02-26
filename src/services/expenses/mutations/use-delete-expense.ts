import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { expenseKeys } from '../keys'
import { deleteExpense } from '../services'

export function useDeleteExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() })
    },
  })
}

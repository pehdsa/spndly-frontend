import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { expenseKeys } from '../keys'
import { updateExpense } from '../services'
import type { UpdateExpenseData } from '../types'

export function useUpdateExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateExpenseData }) => updateExpense(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.all })
    },
  })
}

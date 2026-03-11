import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { expenseKeys } from '../keys'
import { createExpense } from '../services'
import type { CreateExpenseData } from '../types'

export function useCreateExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateExpenseData) => createExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.all })
    },
  })
}

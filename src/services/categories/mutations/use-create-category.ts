import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { categoryKeys } from '../keys'
import { createCategory } from '../services'
import type { CreateCategoryData } from '../types'

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCategoryData) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all })
    },
  })
}

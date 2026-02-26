import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { categoryKeys } from '../keys'
import { updateCategory } from '../services'
import type { UpdateCategoryData } from '../types'

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCategoryData }) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all })
    },
  })
}

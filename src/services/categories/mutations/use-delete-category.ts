import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { categoryKeys } from '../keys'
import { deleteCategory } from '../services'

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
    },
  })
}

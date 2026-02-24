import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { userKeys } from '../keys'
import { deleteUser } from '../services'

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: number) => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

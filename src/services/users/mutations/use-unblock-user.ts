import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { userKeys } from '../keys'
import { unblockUser } from '../services'

export function useUnblockUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: number) => unblockUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

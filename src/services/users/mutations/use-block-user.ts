import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { userKeys } from '../keys'
import { blockUser } from '../services'

export function useBlockUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: number) => blockUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

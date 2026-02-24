import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { userKeys } from '../keys'
import { deleteInvitation } from '../services'

export function useDeleteInvitation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (invitationId: number) => deleteInvitation(invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.invitationsAll() })
    },
  })
}

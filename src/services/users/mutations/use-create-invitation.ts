import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { userKeys } from '../keys'
import { createInvitation } from '../services'
import type { CreateBulkInvitationData, BulkInvitationResponse } from '../types'

export function useCreateInvitation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateBulkInvitationData) => createInvitation(data),
    onSuccess: (response: BulkInvitationResponse) => {
      if (response.summary.total_created > 0) {
        queryClient.invalidateQueries({ queryKey: userKeys.invitationsAll() })
      }
    },
  })
}

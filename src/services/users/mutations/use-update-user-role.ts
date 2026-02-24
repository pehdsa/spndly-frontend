import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { userKeys } from '../keys'
import { updateUserRole } from '../services'
import type { UpdateUserRoleData } from '../types'

interface UpdateUserRoleParams {
  userId: number
  data: UpdateUserRoleData
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, data }: UpdateUserRoleParams) => updateUserRole(userId, data),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) })
    },
  })
}

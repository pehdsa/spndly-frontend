import type { PaginationParams } from '@/services'

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params?: PaginationParams) => [...userKeys.lists(), params] as const,
  detail: (id: number) => [...userKeys.all, 'detail', id] as const,
  invitationsAll: () => [...userKeys.all, 'invitations'] as const,
  invitations: (params?: PaginationParams) => [...userKeys.invitationsAll(), params] as const,
  validateInvitation: (token: string) => [...userKeys.all, 'validate-invitation', token] as const,
}

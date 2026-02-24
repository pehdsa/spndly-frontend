import { http } from '@/services/http'
import type { ApiPaginatedResponse, PaginationParams } from '@/services'
import type { Invitation } from '../types'

export async function listInvitations(params?: PaginationParams): Promise<ApiPaginatedResponse<Invitation>> {
  const { data } = await http.get<ApiPaginatedResponse<Invitation>>('/invitations', { params })
  return data
}

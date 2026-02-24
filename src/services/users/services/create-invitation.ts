import { http } from '@/services/http'
import type { ApiResponse } from '@/services'
import type { CreateBulkInvitationData, BulkInvitationResponse } from '../types'

export async function createInvitation(data: CreateBulkInvitationData): Promise<BulkInvitationResponse> {
  const response = await http.post<ApiResponse<BulkInvitationResponse>>('/invitations', data)
  return response.data.data
}

import { http } from '@/services/http'

export async function deleteInvitation(invitationId: number): Promise<void> {
  await http.delete(`/invitations/${invitationId}`)
}

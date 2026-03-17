// Entidades
export type UserStatus = 'ACTIVE' | 'BLOCKED'
export type UserRole = 'ADMIN' | 'CLIENT'
export type InvitationStatus = 'VALID' | 'USED' | 'EXPIRED'

export interface User {
  id: number
  name: string
  email: string
  phone_number: string | null
  role: UserRole
  status: UserStatus
  viewed_at: string | null
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

export interface Invitation {
  id: number
  phone_number: string
  token: string
  role: UserRole
  status: InvitationStatus
  expires_at: string
  used_at: string | null
  invited_by: number
  created_at: string
}

// DTOs
export interface UpdateUserRoleData {
  role: UserRole
}

// DTOs para criação em lote
export interface CreateBulkInvitationData {
  phone_numbers: string[]
  role: string
}

// Resposta de criação em lote
export interface BulkInvitationFailed {
  phone_number: string
  reason: string
}

export interface BulkInvitationResponse {
  sent: Invitation[]
  failed: BulkInvitationFailed[]
}

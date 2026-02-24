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
  email: string
  token: string
  role: UserRole
  status: InvitationStatus
  expires_at: string
  used_at: string | null
  invited_by: number
  created_at: string
}

// DTOs
export interface CreateInvitationData {
  email: string
  role: string
}

export interface UpdateUserRoleData {
  role: UserRole
}

// DTOs para criação em lote
export interface CreateBulkInvitationData {
  emails: string[]
  role: string
}

// Resposta de criação em lote
export interface BulkInvitationFailed {
  email: string
  reason: string
}

export interface BulkInvitationResponse {
  sent: Invitation[]
  failed: BulkInvitationFailed[]
}

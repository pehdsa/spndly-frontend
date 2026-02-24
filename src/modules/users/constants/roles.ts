export const USER_ROLES = {
  ADMIN: 'ADMIN',
  CLIENT: 'CLIENT',
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [USER_ROLES.ADMIN]: 'Administrador',
  [USER_ROLES.CLIENT]: 'Cliente',
}

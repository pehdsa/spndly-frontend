/**
 * Query keys para o domínio de autenticação
 * Usadas para invalidação e cache do TanStack Query
 */
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
}

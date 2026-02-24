// Re-export TanStack Form
export { useForm } from '@tanstack/vue-form'

type StandardSchemaError = { message: string } | string

/**
 * Helper para verificar se um campo está inválido
 */
export function isFieldInvalid(field: { state: { meta: { isTouched: boolean; errors: unknown[] } } }) {
  return field.state.meta.isTouched && field.state.meta.errors.length > 0
}

/**
 * Helper para obter a primeira mensagem de erro de um campo
 * Suporta tanto strings quanto objetos de erro do Standard Schema (Zod v4)
 */
export function getFieldError(field: { state: { meta: { errors: StandardSchemaError[] } } }): string | null {
  const error = field.state.meta.errors[0]
  if (!error) return null
  return typeof error === 'string' ? error : error.message
}

/**
 * Remove tudo que não for dígito.
 */
export function normalizePhoneDigits(value: string): string {
  return value.replace(/\D/g, '')
}

/**
 * Valida celular BR: exatamente 11 dígitos, DDD de 2 dígitos, número iniciando com 9.
 * Espera receber apenas dígitos (usar normalizePhoneDigits antes se necessário).
 */
export function isValidBrCellphone(digits: string): boolean {
  return digits.length === 11 && digits[2] === '9'
}

/**
 * Formata telefone BR para exibição.
 * - 13 dígitos (com 55): 5567999999999 → +55 (67) 99999-9999
 * - 11 dígitos (sem 55): 67999999999 → (67) 99999-9999
 * - Valor inesperado: retorna os dígitos crus ou string vazia
 */
export function formatBrPhone(phone: string | null | undefined): string {
  if (!phone) return ''

  const digits = normalizePhoneDigits(phone)

  if (digits.length === 13 && digits.startsWith('55')) {
    const ddd = digits.slice(2, 4)
    const part1 = digits.slice(4, 9)
    const part2 = digits.slice(9, 13)
    return `+55 (${ddd}) ${part1}-${part2}`
  }

  if (digits.length === 11) {
    const ddd = digits.slice(0, 2)
    const part1 = digits.slice(2, 7)
    const part2 = digits.slice(7, 11)
    return `(${ddd}) ${part1}-${part2}`
  }

  return digits
}

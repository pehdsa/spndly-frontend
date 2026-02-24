export interface MaskaConfig {
  mask: string | string[]
  tokens: Record<string, { pattern: RegExp; repeated?: boolean; optional?: boolean }>
  reversed?: boolean
  eager?: boolean
}

export type MaskaType = 'money:2' | 'money:4' | 'cep' | 'phone' | 'phone_intl' | 'cpf' | 'cnpj' | 'cpf_cnpj'

/**
 * Composable para configurações de máscaras do Maska
 */
export function useMaska() {
  /**
   * Retorna a configuração do Maska para o tipo especificado
   */
  function getMaskaConfig(type: MaskaType): MaskaConfig {
    const configs: Record<MaskaType, MaskaConfig> = {
      'money:2': {
        mask: '#.##0,00',
        tokens: {
          '#': { pattern: /[0-9]/, repeated: true, optional: true },
          '0': { pattern: /[0-9]/ },
        },
        reversed: true,
      },
      'money:4': {
        mask: '#.##0,0000',
        tokens: {
          '#': { pattern: /[0-9]/, repeated: true, optional: true },
          '0': { pattern: /[0-9]/ },
        },
        reversed: true,
      },
      cep: {
        mask: '00000-000',
        tokens: {
          '0': { pattern: /[0-9]/ },
        },
      },
      cpf: {
        mask: '000.000.000-00',
        tokens: {
          '0': { pattern: /[0-9]/ },
        },
      },
      phone: {
        mask: ['(00) 0000-0000', '(00) 00000-0000'],
        tokens: {
          '0': { pattern: /[0-9]/ },
        },
      },
      phone_intl: {
        // E.164 format with country code
        mask: [
          '+1 (000) 000-0000', // US/Canada
          '+55 (00) 00000-0000', // BR mobile
          '+00 000 000 00000', // International fallback
        ],
        tokens: {
          '0': { pattern: /[0-9]/ },
        },
      },
      cnpj: {
        mask: '00.000.000/0000-00',
        tokens: {
          '0': { pattern: /[0-9]/ },
        },
      },
      cpf_cnpj: {
        mask: ['000.000.000-00', '00.000.000/0000-00'],
        tokens: {
          '0': { pattern: /[0-9]/ },
        },
      },
    }

    return configs[type]
  }

  /**
   * Formata um valor de acordo com o tipo
   */
  function formatValue(value: unknown, type: string): string {
    if (value === null || value === undefined) return ''

    // Money
    if (type.startsWith('money:')) {
      const decimals = parseInt(type.split(':')[1] ?? '2', 10)
      const numValue = typeof value === 'number' ? value : parseFloat(String(value))
      if (isNaN(numValue)) return ''

      return numValue.toLocaleString('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    }

    // CEP
    if (type === 'cep') {
      const cleaned = String(value).replace(/\D/g, '')
      if (cleaned.length !== 8) return String(value)
      return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2')
    }

    // CPF
    if (type === 'cpf') {
      const cleaned = String(value).replace(/\D/g, '')
      if (cleaned.length !== 11) return String(value)
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }

    // CNPJ
    if (type === 'cnpj') {
      const cleaned = String(value).replace(/\D/g, '')
      if (cleaned.length !== 14) return String(value)
      return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    }

    // CPF ou CNPJ (detecta automaticamente)
    if (type === 'cpf_cnpj') {
      const cleaned = String(value).replace(/\D/g, '')
      if (cleaned.length === 11) {
        return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
      }
      if (cleaned.length === 14) {
        return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
      }
      return String(value)
    }

    // Phone BR
    if (type === 'phone') {
      const cleaned = String(value).replace(/\D/g, '')
      if (cleaned.length === 10) {
        return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
      }
      if (cleaned.length === 11) {
        return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
      }
      return String(value)
    }

    // Phone International E.164 (US + BR)
    if (type === 'phone_intl') {
      const cleaned = String(value).replace(/\D/g, '')
      // US/Canada: 11 digits starting with 1 -> +1 (XXX) XXX-XXXX
      if (cleaned.length === 11 && cleaned[0] === '1') {
        return cleaned.replace(/1(\d{3})(\d{3})(\d{4})/, '+1 ($1) $2-$3')
      }
      // BR mobile: 13 digits starting with 55 -> +55 (XX) XXXXX-XXXX
      if (cleaned.length === 13 && cleaned.startsWith('55')) {
        return cleaned.replace(/55(\d{2})(\d{5})(\d{4})/, '+55 ($1) $2-$3')
      }
      // Fallback: just add + prefix
      if (cleaned.length > 0) {
        return '+' + cleaned
      }
      return String(value)
    }

    return String(value)
  }

  /**
   * Remove a formatação e retorna o valor puro
   */
  function parseValue(value: string, type: string): unknown {
    if (!value) return null

    if (type.startsWith('money:')) {
      const cleaned = value.replace(/\./g, '').replace(',', '.').trim()

      if (!cleaned) return null

      const parsed = parseFloat(cleaned)
      return Number.isNaN(parsed) ? null : parsed
    }

    if (['cep', 'cpf', 'cnpj', 'cpf_cnpj'].includes(type)) {
      const cleaned = value.replace(/\D/g, '')
      return cleaned || null
    }

    return value || null
  }

  return {
    getMaskaConfig,
    formatValue,
    parseValue,
  }
}

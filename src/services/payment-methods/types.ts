// Entidades
export interface PaymentMethod {
  id: number
  name: string
  description: string | null
  created_at: string
}

// DTOs
export interface CreatePaymentMethodData {
  name: string
  description?: string | null
}

export interface UpdatePaymentMethodData {
  name?: string
  description?: string | null
}

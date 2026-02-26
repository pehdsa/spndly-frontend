import { z } from 'zod'

export const expenseSchema = z.object({
  amount: z.string().min(1, 'Valor é obrigatório'),
  description: z.string().max(255, 'Descrição deve ter no máximo 255 caracteres').optional().or(z.literal('')),
  category_id: z.number({ message: 'Categoria é obrigatória' }).int().positive('Categoria é obrigatória'),
  payment_method_id: z.number({ message: 'Método de pagamento é obrigatório' }).int().positive('Método de pagamento é obrigatório'),
})

export type ExpenseInput = z.infer<typeof expenseSchema>

import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(255, 'Nome deve ter no máximo 255 caracteres'),
  description: z.string().max(255, 'Descrição deve ter no máximo 255 caracteres').optional().or(z.literal('')),
})

export type CategoryInput = z.infer<typeof categorySchema>

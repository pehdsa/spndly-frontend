import { z } from 'zod'
import { USER_ROLES } from '@/modules/users/constants'

export const invitationSchema = z.object({
  emails: z
    .array(z.string().email('Email inválido'))
    .min(1, 'Adicione pelo menos um email'),
  role: z.enum([USER_ROLES.ADMIN, USER_ROLES.CLIENT], {
    error: 'Selecione uma função válida',
  }),
})

export type InvitationInput = z.infer<typeof invitationSchema>

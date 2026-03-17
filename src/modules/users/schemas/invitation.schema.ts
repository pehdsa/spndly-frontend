import { z } from 'zod'
import { USER_ROLES } from '@/modules/users/constants'
import { isValidBrCellphone, normalizePhoneDigits } from '@/lib/phone'

export const invitationSchema = z.object({
  phone_numbers: z
    .array(
      z.string().refine(
        (val) => isValidBrCellphone(normalizePhoneDigits(val)),
        'Telefone celular inválido',
      ),
    )
    .min(1, 'Adicione pelo menos um telefone')
    .refine(
      (arr) => {
        const normalized = arr.map(normalizePhoneDigits)
        return new Set(normalized).size === normalized.length
      },
      'Telefone duplicado',
    ),
  role: z.enum([USER_ROLES.ADMIN, USER_ROLES.CLIENT], {
    error: 'Selecione uma função válida',
  }),
})

export type InvitationInput = z.infer<typeof invitationSchema>

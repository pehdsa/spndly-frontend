import { z } from 'zod'

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  password: z
    .string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

export const registerSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(255, 'Nome deve ter no máximo 255 caracteres'),
  phone_number: z
    .string()
    .min(1, 'Telefone celular é obrigatório')
    .refine(
      (val) => {
        const digits = val.replace(/\D/g, '')
        return digits.length === 11 && digits[2] === '9'
      },
      'Telefone celular inválido',
    ),
  password: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .max(255, 'Senha deve ter no máximo 255 caracteres'),
  password_confirmation: z
    .string()
    .min(8, 'Confirmação de senha deve ter no mínimo 8 caracteres'),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'As senhas não coincidem',
  path: ['password_confirmation'],
})

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
})

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  token: z
    .string()
    .min(1, 'Token é obrigatório'),
  password: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .max(255, 'Senha deve ter no máximo 255 caracteres'),
  password_confirmation: z
    .string()
    .min(8, 'Confirmação de senha deve ter no mínimo 8 caracteres'),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'As senhas não coincidem',
  path: ['password_confirmation'],
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>

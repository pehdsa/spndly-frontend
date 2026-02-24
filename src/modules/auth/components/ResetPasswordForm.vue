<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useForm } from '@/composables/useForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AppFormInput } from '@/components/shared/app-form-input'
import { useResetPassword } from '@/services/auth'
import { resetPasswordSchema, type ResetPasswordInput } from '../schemas/auth.schema'

const route = useRoute()
const router = useRouter()
const { mutate: resetPassword, isPending, error, isSuccess } = useResetPassword()

const token = computed(() => route.query.token as string)
const emailParam = computed(() => route.query.email as string)

const form = useForm({
  defaultValues: {
    email: emailParam.value || '',
    token: token.value || '',
    password: '',
    password_confirmation: '',
  } as ResetPasswordInput,
  validators: {
    onSubmit: resetPasswordSchema,
  },
  onSubmit: async ({ value }) => {
    resetPassword(value, {
      onSuccess: () => {
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
      },
    })
  },
})

const errorMessage = computed(() => {
  if (error.value) {
    return 'Erro ao redefinir senha. O link pode ter expirado.'
  }
  return null
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <Card>
      <CardHeader class="text-center">
        <CardTitle class="text-xl">
          Redefinir senha
        </CardTitle>
        <CardDescription>
          Digite sua nova senha
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent.stop="form.handleSubmit">
          <div class="flex flex-col gap-6">
            <!-- Success Message -->
            <div v-if="isSuccess" class="rounded-md bg-green-50 p-3 text-sm text-green-700">
              Senha redefinida com sucesso! Redirecionando para login...
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {{ errorMessage }}
            </div>

            <!-- Email Field (readonly) -->
            <form.Field name="email">
              <template #default="{ field }">
                <AppFormInput
                  id="email"
                  type="email"
                  label="Email"
                  readonly
                  disabled
                  :model-value="field.state.value"
                />
              </template>
            </form.Field>

            <!-- Password Field -->
            <form.Field name="password">
              <template #default="{ field }">
                <AppFormInput
                  id="password"
                  type="password"
                  label="Nova senha"
                  placeholder="Mínimo 6 caracteres"
                  :disabled="isPending || isSuccess"
                  :model-value="field.state.value"
                  :error="field.state.meta.errors[0]?.message"
                  @update:model-value="(val: unknown) => field.handleChange(val as string)"
                  @blur="field.handleBlur"
                />
              </template>
            </form.Field>

            <!-- Password Confirmation Field -->
            <form.Field name="password_confirmation">
              <template #default="{ field }">
                <AppFormInput
                  id="password_confirmation"
                  type="password"
                  label="Confirmar nova senha"
                  placeholder="Digite a senha novamente"
                  :disabled="isPending || isSuccess"
                  :model-value="field.state.value"
                  :error="field.state.meta.errors[0]?.message"
                  @update:model-value="(val: unknown) => field.handleChange(val as string)"
                  @blur="field.handleBlur"
                />
              </template>
            </form.Field>

            <!-- Submit Button -->
            <div class="flex flex-col gap-2">
              <Button type="submit" :disabled="isPending || isSuccess">
                {{ isPending ? 'Redefinindo...' : 'Redefinir senha' }}
              </Button>
              <p class="text-center text-sm text-muted-foreground">
                <router-link
                  to="/auth/login"
                  class="underline underline-offset-4 hover:text-primary"
                >
                  Voltar para login
                </router-link>
              </p>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

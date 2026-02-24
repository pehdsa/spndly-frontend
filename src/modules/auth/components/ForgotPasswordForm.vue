<script setup lang="ts">
import { computed } from 'vue'
import { useForm } from '@/composables/useForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AppFormInput } from '@/components/shared/app-form-input'
import { useForgotPassword } from '@/services/auth'
import { forgotPasswordSchema, type ForgotPasswordInput } from '../schemas/auth.schema'

const { mutate: forgotPassword, isPending, error, isSuccess } = useForgotPassword()

const form = useForm({
  defaultValues: {
    email: '',
  } as ForgotPasswordInput,
  validators: {
    onSubmit: forgotPasswordSchema,
  },
  onSubmit: async ({ value }) => {
    forgotPassword(value)
  },
})

const errorMessage = computed(() => {
  if (error.value) {
    return 'Erro ao enviar email. Verifique o endereço e tente novamente.'
  }
  return null
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <Card>
      <CardHeader class="text-center">
        <CardTitle class="text-xl">
          Esqueceu sua senha?
        </CardTitle>
        <CardDescription>
          Digite seu email e enviaremos um link para redefinir sua senha
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent.stop="form.handleSubmit">
          <div class="flex flex-col gap-6">
            <!-- Success Message -->
            <div v-if="isSuccess" class="rounded-md bg-green-50 p-3 text-sm text-green-700">
              Email enviado com sucesso! Verifique sua caixa de entrada.
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {{ errorMessage }}
            </div>

            <!-- Email Field -->
            <form.Field name="email">
              <template #default="{ field }">
                <AppFormInput
                  id="email"
                  type="email"
                  label="Email"
                  placeholder="seu@email.com"
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
                {{ isPending ? 'Enviando...' : 'Enviar link de recuperação' }}
              </Button>
              <p class="text-center text-sm text-muted-foreground">
                Lembrou sua senha?
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

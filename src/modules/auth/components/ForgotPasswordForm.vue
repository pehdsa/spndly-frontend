<script setup lang="ts">
import { useForm } from '@/composables/useForm'
import { useErrorHandler } from '@/composables'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AppFormInput } from '@/components/shared/app-form-input'
import { useForgotPassword } from '@/services/auth'
import { forgotPasswordSchema, type ForgotPasswordInput } from '../schemas/auth.schema'

const { showSuccessToast, watchError } = useErrorHandler()

const { mutate: forgotPassword, isPending, error, isSuccess } = useForgotPassword()

watchError(error)

const form = useForm({
  defaultValues: {
    email: '',
  } as ForgotPasswordInput,
  validators: {
    onSubmit: forgotPasswordSchema,
  },
  onSubmit: async ({ value }) => {
    forgotPassword(value, {
      onSuccess: () => {
        showSuccessToast('Email enviado', 'Verifique sua caixa de entrada para redefinir sua senha.')
      },
    })
  },
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

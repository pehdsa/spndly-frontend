<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Loader2 } from 'lucide-vue-next'
import { useForm } from '@/composables/useForm'
import { useErrorHandler } from '@/composables'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AppFormInput } from '@/components/shared/app-form-input'
import { useRegister } from '@/services/auth'
import { useValidateInvitation } from '@/services/users'
import { registerSchema, type RegisterInput } from '../schemas/auth.schema'

const router = useRouter()
const route = useRoute()
const { showErrorToast, showSuccessToast, watchError } = useErrorHandler()

const token = computed(() => route.query.token as string | undefined)

// Valida o token ao carregar a página
const {
  data: validationData,
  isLoading: isValidating,
  isError: isValidationError,
} = useValidateInvitation(token)

const { mutate: register, isPending, error } = useRegister()

watchError(error)

// Redireciona se não tiver token ou se o token for inválido
watchEffect(() => {
  if (!token.value) {
    router.replace({ name: 'auth.login' })
    return
  }

  if (isValidationError.value) {
    showErrorToast('Convite inválido', 'O link de convite expirou ou já foi utilizado.')
    router.replace({ name: 'auth.login' })
  }
})

const form = useForm({
  defaultValues: {
    name: '',
    phone_number: '',
    password: '',
    password_confirmation: '',
  } as RegisterInput,
  validators: {
    onSubmit: registerSchema,
  },
  onSubmit: async ({ value }) => {
    if (!token.value) return

    register(
      {
        token: token.value,
        ...value,
        phone_number: value.phone_number.replace(/\D/g, ''),
      },
      {
        onSuccess: () => {
          showSuccessToast('Conta criada com sucesso!')
          router.push('/')
        },
      },
    )
  },
})

const isFormDisabled = computed(() => isPending.value || isValidating.value)
</script>

<template>
  <!-- Loading state -->
  <div v-if="isValidating" class="flex flex-col items-center justify-center gap-4">
    <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
    <p class="text-sm text-muted-foreground">Validando convite...</p>
  </div>

  <!-- Form -->
  <div v-else-if="validationData" class="flex flex-col gap-6">
    <Card>
      <CardHeader class="text-center">
        <CardTitle class="text-xl">
          Criar conta
        </CardTitle>
        <CardDescription>
          Complete seu cadastro para <strong>{{ validationData.email }}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent.stop="form.handleSubmit">
          <div class="flex flex-col gap-6">
            <!-- Name Field -->
            <form.Field name="name">
              <template #default="{ field }">
                <AppFormInput
                  id="name"
                  type="text"
                  label="Nome completo"
                  placeholder="Seu nome"
                  :disabled="isFormDisabled"
                  :model-value="field.state.value"
                  :error="field.state.meta.errors[0]?.message"
                  @update:model-value="(val: unknown) => field.handleChange(val as string)"
                  @blur="field.handleBlur"
                />
              </template>
            </form.Field>

            <!-- Phone Number Field -->
            <form.Field name="phone_number">
              <template #default="{ field }">
                <AppFormInput
                  id="phone_number"
                  label="Telefone Celular"
                  placeholder="(00) 00000-0000"
                  mask="phone"
                  :disabled="isFormDisabled"
                  :model-value="field.state.value"
                  :error="field.state.meta.errors[0]?.message"
                  @update:model-value="(val: unknown) => field.handleChange(val as string)"
                  @blur="field.handleBlur"
                />
              </template>
            </form.Field>

            <!-- Password Field -->
            <form.Field name="password">
              <template #default="{ field }">
                <AppFormInput
                  id="password"
                  type="password"
                  label="Senha"
                  placeholder="Mínimo 6 caracteres"
                  :disabled="isFormDisabled"
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
                  label="Confirmar senha"
                  placeholder="Digite a senha novamente"
                  :disabled="isFormDisabled"
                  :model-value="field.state.value"
                  :error="field.state.meta.errors[0]?.message"
                  @update:model-value="(val: unknown) => field.handleChange(val as string)"
                  @blur="field.handleBlur"
                />
              </template>
            </form.Field>

            <!-- Submit Button -->
            <div class="flex flex-col gap-2">
              <Button type="submit" :disabled="isFormDisabled">
                {{ isPending ? 'Criando conta...' : 'Criar conta' }}
              </Button>
              <p class="text-center text-sm text-muted-foreground">
                Já tem uma conta?
                <router-link
                  to="/auth/login"
                  class="underline underline-offset-4 hover:text-primary"
                >
                  Entrar
                </router-link>
              </p>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>

    <p class="px-8 text-center text-xs text-muted-foreground">
      Ao continuar, você concorda com nossos
      <a href="#" class="underline underline-offset-4 hover:text-primary">
        Termos de Serviço
      </a>
      e
      <a href="#" class="underline underline-offset-4 hover:text-primary">
        Política de Privacidade
      </a>.
    </p>
  </div>
</template>

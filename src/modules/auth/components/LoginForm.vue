<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from '@/composables/useForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Separator } from '@/components/ui/separator'
import { AppFormInput } from '@/components/shared/app-form-input'
import { useLogin } from '@/services/auth'
import { loginSchema, type LoginInput } from '@/modules/auth'

const router = useRouter()
const { mutate: login, isPending, error } = useLogin()

const form = useForm({
  defaultValues: {
    username: '',
    password: '',
  } as LoginInput,
  validators: {
    onSubmit: loginSchema,
  },
  onSubmit: async ({ value }) => {
    login(value, {
      onSuccess: () => {
        router.push('/')
      },
    })
  },
})

// const handleGoogleLogin = () => {
//   const API_URL = import.meta.env.VITE_API_URL
//   window.location.href = `${API_URL}/auth/google/redirect`
// }

const errorMessage = computed(() => {
  if (error.value) {
    return 'Email ou senha inválidos. Tente novamente.'
  }
  return null
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <Card>
      <CardHeader class="text-center">
        <CardTitle class="text-xl">
          Bem-vindo de volta
        </CardTitle>
        <CardDescription>
          Entre com seu email e senha
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent.stop="form.handleSubmit">
          <div class="flex flex-col gap-6">
            <!-- Google Auth Button -->
            <!-- <div class="flex flex-col gap-3">
              <Button
                variant="outline"
                type="button"
                @click="handleGoogleLogin"
                class="w-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="mr-2 h-4 w-4">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Entrar com Google
              </Button>
            </div> -->

            <!-- Separator -->
            <!-- <div class="relative">
              <Separator />
              <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 dark:bg-card bg-white px-2 text-xs text-muted-foreground">
                Ou continue com
              </div>
            </div> -->

            <!-- Error Message -->
            <div v-if="errorMessage" class="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {{ errorMessage }}
            </div>

            <!-- Email Field -->
            <form.Field name="username">
              <template #default="{ field }">
                <AppFormInput
                  id="email"
                  type="email"
                  label="Email"
                  placeholder="seu@email.com"
                  :disabled="isPending"
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
                  :disabled="isPending"
                  :model-value="field.state.value"
                  :error="field.state.meta.errors[0]?.message"
                  @update:model-value="(val: unknown) => field.handleChange(val as string)"
                  @blur="field.handleBlur"
                >
                  <template #label-right>
                    <router-link
                      to="/auth/forgot-password"
                      class="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Esqueceu a senha?
                    </router-link>
                  </template>
                </AppFormInput>
              </template>
            </form.Field>

            <!-- Submit Button -->
            <Button type="submit" :disabled="isPending">
              {{ isPending ? 'Entrando...' : 'Entrar' }}
            </Button>
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

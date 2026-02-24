<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getUser } from '@/services/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

onMounted(async () => {
  try {
    const token = route.query.token as string
    const refreshToken = route.query.refresh_token as string

    if (!token || !refreshToken) {
      throw new Error('Token não fornecido')
    }

    const user = await getUser(token)

    authStore.setAuth(user, {
      access_token: token,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: 3600,
    })

    router.push('/')
  } catch (error) {
    console.error('Erro no callback do Google:', error)
    router.push('/auth/login')
  }
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <div class="text-center">
      <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
      <p class="mt-4 text-sm text-muted-foreground">
        Autenticando com Google...
      </p>
    </div>
  </div>
</template>

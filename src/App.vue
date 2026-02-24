<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { Toaster } from '@/components/ui/sonner'

// Layouts
const GuestLayout = defineAsyncComponent(() => import('@/components/layouts/GuestLayout.vue'))
const AuthLayout = defineAsyncComponent(() => import('@/components/layouts/AuthLayout.vue'))

// Mapa de layouts disponíveis
const layouts: Record<string, ReturnType<typeof defineAsyncComponent>> = {
  guest: GuestLayout,
  auth: AuthLayout,
}

const route = useRoute()

// Layout atual baseado em meta.layout da rota
const currentLayout = computed(() => {
  // Busca o layout na rota ou em seus pais
  const layoutMeta = route.matched.find((record) => record.meta.layout)?.meta.layout as string | undefined

  // Retorna o layout ou null para 'none' ou undefined
  if (!layoutMeta || layoutMeta === 'none') {
    return null
  }

  return layouts[layoutMeta] ?? null
})
</script>

<template>
  <!-- Com layout -->
  <component :is="currentLayout" v-if="currentLayout">
    <router-view />
  </component>

  <!-- Sem layout (404, etc) -->
  <router-view v-else />

  <!-- Toast notifications -->
  <Toaster position="top-right" :expand="true" rich-colors :duration="4000" />
</template>

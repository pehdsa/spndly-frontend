<script setup lang="ts">
import { computed } from 'vue'
  import { useTheme } from '@/composables/useTheme'
  import logoLight from '@/assets/svg/logo_light_mode.svg'
  import logoDark from '@/assets/svg/logo_dark_mode.svg'

  const { isDark } = useTheme()

  const currentLogo = computed(() => {
    return isDark.value ? logoDark : logoLight
  })

</script>

<template>
  <div class="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
    <div class="flex w-full max-w-sm flex-col gap-6">
      <router-link to="/" class="flex items-center gap-2 self-center font-medium">
        <img :src="currentLogo" alt="Doublelist" class="h-7.5" />
      </router-link>

      <slot />
    </div>
  </div>
</template>

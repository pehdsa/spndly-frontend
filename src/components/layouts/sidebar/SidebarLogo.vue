<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { useSidebar } from '@/components/ui/sidebar'
import logoLight from '@/assets/svg/logo_light_mode.svg'
import logoDark from '@/assets/svg/logo_dark_mode.svg'
import icon from '@/assets/svg/icon.svg'

const { isDark } = useTheme()
const { state } = useSidebar()

const isCollapsed = computed(() => state.value === 'collapsed')

const currentLogo = computed(() => {
  if (isCollapsed.value) {
    return icon
  }
  return isDark.value ? logoDark : logoLight
})
</script>

<template>
  <img :src="currentLogo" alt="DoubleList" class="h-6" />
</template>

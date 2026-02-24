import { useColorMode, usePreferredDark, useStorage } from '@vueuse/core'
import { computed } from 'vue'
import type { SidebarProps } from '@/components/ui/sidebar'

interface ThemeConfig {
  sidebarVariant: SidebarProps['variant']
  sidebarCollapsible: SidebarProps['collapsible']
}

const mode = useColorMode({
  storageKey: 'app-theme',
  emitAuto: true,
  selector: 'html',
  attribute: 'class',
  initialValue: 'auto',
})

const preferredDark = usePreferredDark()

const themeConfig = useStorage<ThemeConfig>('theme-config', {
  sidebarVariant: 'sidebar',
  sidebarCollapsible: 'icon',
})

export function useTheme() {
  const sidebarVariant = computed({
    get: () => themeConfig.value.sidebarVariant,
    set: (value) => {
      themeConfig.value.sidebarVariant = value
    },
  })

  const sidebarCollapsible = computed({
    get: () => themeConfig.value.sidebarCollapsible,
    set: (value) => {
      themeConfig.value.sidebarCollapsible = value
    },
  })

  const setSidebarVariant = (variant: SidebarProps['variant']) => {
    themeConfig.value.sidebarVariant = variant
  }

  const setSidebarCollapsible = (collapsible: SidebarProps['collapsible']) => {
    themeConfig.value.sidebarCollapsible = collapsible
  }

  const setTheme = (newTheme: 'light' | 'dark' | 'auto') => {
    mode.value = newTheme
  }

  const isDark = computed(() => {
    if (mode.value === 'auto') {
      return preferredDark.value
    }
    return mode.value === 'dark'
  })

  return {
    theme: mode,
    isDark,
    setTheme,
    sidebarVariant,
    sidebarCollapsible,
    setSidebarVariant,
    setSidebarCollapsible,
  }
}

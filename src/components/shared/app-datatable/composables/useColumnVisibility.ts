import { ref } from 'vue'
import type { VisibilityState, Updater } from '@tanstack/vue-table'
import { valueUpdater } from '@/lib/utils'

export function useColumnVisibility() {
  const columnVisibility = ref<VisibilityState>({})

  const onColumnVisibilityChange = (updater: Updater<VisibilityState>) => {
    valueUpdater(updater, columnVisibility)
  }

  return {
    columnVisibility,
    onColumnVisibilityChange,
  }
}

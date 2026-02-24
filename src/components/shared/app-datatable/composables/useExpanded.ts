import { ref } from 'vue'
import type { ExpandedState, Updater } from '@tanstack/vue-table'
import { valueUpdater } from '@/lib/utils'

export function useExpanded() {
  const expanded = ref<ExpandedState>({})

  const onExpandedChange = (updater: Updater<ExpandedState>) => {
    valueUpdater(updater, expanded)
  }

  return {
    expanded,
    onExpandedChange,
  }
}

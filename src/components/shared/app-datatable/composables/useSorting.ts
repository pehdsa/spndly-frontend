import { ref } from 'vue'
import type { SortingState, Updater } from '@tanstack/vue-table'
import { valueUpdater } from '@/lib/utils'

export function useSorting() {
  const sorting = ref<SortingState>([])

  const onSortingChange = (updater: Updater<SortingState>) => {
    valueUpdater(updater, sorting)
  }

  return {
    sorting,
    onSortingChange,
  }
}

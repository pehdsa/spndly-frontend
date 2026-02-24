import { ref } from 'vue'
import type { RowSelectionState, Updater } from '@tanstack/vue-table'
import { valueUpdater } from '@/lib/utils'

export function useRowSelection() {
  const rowSelection = ref<RowSelectionState>({})

  const onRowSelectionChange = (updater: Updater<RowSelectionState>) => {
    valueUpdater(updater, rowSelection)
  }

  return {
    rowSelection,
    onRowSelectionChange,
  }
}

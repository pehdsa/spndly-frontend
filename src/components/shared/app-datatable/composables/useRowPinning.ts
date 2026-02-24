import { ref } from 'vue'
import type { RowPinningState, Updater } from '@tanstack/vue-table'
import { valueUpdater } from '@/lib/utils'

export function useRowPinning() {
  const rowPinning = ref<RowPinningState>({ top: [], bottom: [] })

  const onRowPinningChange = (updater: Updater<RowPinningState>) => {
    valueUpdater(updater, rowPinning)
  }

  return {
    rowPinning,
    onRowPinningChange,
  }
}

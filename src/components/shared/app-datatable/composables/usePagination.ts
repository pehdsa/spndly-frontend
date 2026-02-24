import { ref } from 'vue'
import type { PaginationState, Updater } from '@tanstack/vue-table'
import { valueUpdater } from '@/lib/utils'

export interface UsePaginationOptions {
  initialPagination?: PaginationState
}

export function usePagination(options: UsePaginationOptions = {}) {
  const pagination = ref<PaginationState>(
    options.initialPagination ?? { pageIndex: 0, pageSize: 10 }
  )

  const onPaginationChange = (updater: Updater<PaginationState>) => {
    valueUpdater(updater, pagination)
  }

  return {
    pagination,
    onPaginationChange,
  }
}

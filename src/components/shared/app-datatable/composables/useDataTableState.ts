import { computed } from 'vue'
import {
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
  type PaginationState,
} from '@tanstack/vue-table'

import type { AppDataTableProps, AppDataTableEmits, PaginationMeta } from '../types'
import { useSorting } from './useSorting'
import { usePagination } from './usePagination'
import { useRowPinning } from './useRowPinning'
import { useColumnVisibility } from './useColumnVisibility'
import { useRowSelection } from './useRowSelection'
import { useExpanded } from './useExpanded'

export function useDataTableState<TData>(
  props: AppDataTableProps<TData>,
  emit: AppDataTableEmits<TData>
) {
  // Composables modulares
  const { sorting, onSortingChange } = useSorting()
  const { pagination, onPaginationChange } = usePagination({
    initialPagination: props.pagination,
  })
  const { rowPinning, onRowPinningChange } = useRowPinning()
  const { columnVisibility, onColumnVisibilityChange } = useColumnVisibility()
  const { rowSelection, onRowSelectionChange } = useRowSelection()
  const { expanded, onExpandedChange } = useExpanded()

  const metaData = computed<PaginationMeta>(() => props.meta ?? ({} as PaginationMeta))

  const emitTableChange = () => {
    emit('table-change', {
      sorting: sorting.value,
      visibility: columnVisibility.value,
      pagination: pagination.value,
    })
  }

  const handlePaginationChange = (v: PaginationState) => {
    emit('pagination-change', v)
    emit('table-change', {
      sorting: sorting.value,
      visibility: columnVisibility.value,
      pagination: v,
    })
  }

  const table = useVueTable({
    get data() {
      return props.data
    },
    get columns() {
      return props.columns
    },
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),

    // Sorting
    manualSorting: props.manualSorting,
    ...(props.manualSorting ? {} : { getSortedRowModel: getSortedRowModel() }),

    // Row Pinning
    enableRowPinning: props.enableRowPinning,

    // Pagination
    ...(props.withoutPagination
      ? {}
      : props.manualPagination
        ? {
            manualPagination: true,
            pageCount: metaData.value?.last_page || -1,
          }
        : {
            getPaginationRowModel: getPaginationRowModel(),
          }),

    // State
    state: {
      get sorting() {
        return sorting.value
      },
      get columnVisibility() {
        return columnVisibility.value
      },
      get rowSelection() {
        return rowSelection.value
      },
      get expanded() {
        return expanded.value
      },
      get pagination() {
        return pagination.value
      },
      get rowPinning() {
        return rowPinning.value
      },
    },

    // Handlers
    onSortingChange: (updater) => {
      onSortingChange(updater)
      emit('sorting-change', updater)
      emitTableChange()
    },
    onColumnVisibilityChange: (updater) => {
      onColumnVisibilityChange(updater)
      emit('visibility-change', columnVisibility.value)
      emitTableChange()
    },
    onRowSelectionChange,
    onExpandedChange,
    onRowPinningChange,
    onPaginationChange: props.withoutPagination
      ? undefined
      : (updater) => {
          onPaginationChange(updater)
          handlePaginationChange(pagination.value)
        },
  })

  return {
    table,
    metaData,
    handlePaginationChange,
    // Expose individual states if needed
    sorting,
    pagination,
    rowPinning,
    columnVisibility,
    rowSelection,
    expanded,
  }
}

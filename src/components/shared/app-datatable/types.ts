import type {ColumnDef, ColumnMeta, PaginationState, SortingState, Updater, VisibilityState} from '@tanstack/vue-table'

export interface PaginationMeta {
  current_page: number
  from: number | null
  last_page: number
  per_page: number
  to: number | null
  total: number
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
  sort?: string;
}

export interface ExtendedColumnMeta<TData> extends ColumnMeta<TData, unknown> {
  columnName?: string;
}

export interface AppDataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[]
  data: TData[]

  // Paginação
  withoutPagination?: boolean
  manualPagination?: boolean
  pagination?: PaginationState
  meta?: PaginationMeta

  // Ordenação
  manualSorting?: boolean

  // Estados
  isLoadingData?: boolean
  isFetchingData?: boolean

  // Visual
  variant?: 'default' | 'striped' | 'bordered' | 'minimal'
  containerClass?: string | string[]
  textWrap?: boolean
  pinHeader?: boolean
  minWidth?: string

  // Interação
  enableRowClick?: boolean
  rowClassName?: (row: TData) => string
  enableRowPinning?: boolean,
  showMeta?: boolean
}

export interface TableChangeData {
  sorting: SortingState
  visibility: VisibilityState
  pagination: PaginationState
}

export type AppDataTableEmits<TData> = {
  (e: 'sorting-change', v: Updater<SortingState>): void
  (e: 'visibility-change', v: VisibilityState): void
  (e: 'pagination-change', v: PaginationState): void
  (e: 'table-change', v: TableChangeData): void
  (e: 'row-click', v: TData): void
}

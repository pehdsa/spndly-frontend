import type { PaginationState, SortingState, VisibilityState, ColumnDef } from '@tanstack/vue-table'
import type { PaginationParams, ExtendedColumnMeta } from './types'

export { default as AppDataTable } from './AppDataTable.vue'
export type { AppDataTableProps, AppDataTableEmits, PaginationMeta, PaginationParams, ExtendedColumnMeta, TableChangeData } from './types'

// Re-export composables for advanced usage
export {
    useDataTableState,
    useSorting,
    usePagination,
    useRowPinning,
    useColumnVisibility,
    useRowSelection,
    useExpanded,
} from './composables'

// Re-export sub-components for custom implementations
export {
    AppDataTableHeader,
    AppDataTableBody,
    AppDataTablePinnedRow,
    AppDataTableEmpty,
    AppDataTableSkeleton,
    AppDataTablePaginationClient,
    AppDataTablePaginationServer,
    AppDataTableColumnHeader,
    AppTableCell,
} from './components'


/**
 * Função auxiliar para converter estado da tabela em query params
 */
export function buildTableQueryParams(e: {
    sorting: SortingState;
    visibility: VisibilityState;
    pagination: PaginationState
}): PaginationParams {
    const params: PaginationParams = {};

    // Paginação
    if (e.pagination) {
        params.page = e.pagination.pageIndex + 1;
        params.per_page = e.pagination.pageSize;
    }

    // Ordenação
    if (e.sorting && e.sorting.length > 0) {
        const sortItem = e.sorting[0];
        const sortDirection = sortItem?.desc ? 'desc' : 'asc';
        params.sort = `${sortItem?.id}:${sortDirection}`;
    }

    return params;
}


/**
 * Helper para criar meta de coluna com type-safety
 */
export function createColumnMeta<TData = unknown>(meta: ExtendedColumnMeta<TData>): ExtendedColumnMeta<TData> {
    return meta;
}

/**
 * Helper para criar definição de coluna com meta tipada
 */
export function createColumn<TData = unknown>(column: ColumnDef<TData>): ColumnDef<TData> {
    return column;
}
import type { PaginationMeta } from '@/components/shared/app-datatable'

/**
 * Tipo genérico para respostas da API (Laravel Resource pattern)
 */
export interface ApiResponse<T> {
  data: T
}

/**
 * Resposta paginada da API (Laravel Pagination)
 * Estrutura: { data: T[], meta: PaginationMeta }
 */
export interface ApiPaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

/**
 * Parâmetros de paginação para requisições
 */
export interface PaginationParams {
  page?: number
  per_page?: number
  sort?: string // formato "field:direction" (ex: "name:asc")
  search?: string
}

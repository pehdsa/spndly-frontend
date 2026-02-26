import { http } from '@/services/http'
import type { ApiPaginatedResponse, PaginationParams } from '@/services'
import type { Category } from '../types'

export async function listCategories(params?: PaginationParams): Promise<ApiPaginatedResponse<Category>> {
  const { data } = await http.get<ApiPaginatedResponse<Category>>('/categories', { params })
  return data
}

import { http } from '@/services/http'
import type { ApiResponse } from '@/services'
import type { Category, UpdateCategoryData } from '../types'

export async function updateCategory(id: number, payload: UpdateCategoryData): Promise<Category> {
  const { data } = await http.patch<ApiResponse<Category>>(`/categories/${id}`, payload)
  return data.data
}

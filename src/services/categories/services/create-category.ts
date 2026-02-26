import { http } from '@/services/http'
import type { ApiResponse } from '@/services'
import type { Category, CreateCategoryData } from '../types'

export async function createCategory(payload: CreateCategoryData): Promise<Category> {
  const { data } = await http.post<ApiResponse<Category>>('/categories', payload)
  return data.data
}

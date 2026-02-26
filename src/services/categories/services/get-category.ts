import { http } from '@/services/http'
import type { ApiResponse } from '@/services'
import type { Category } from '../types'

export async function getCategory(id: number): Promise<Category> {
  const { data } = await http.get<ApiResponse<Category>>(`/categories/${id}`)
  return data.data
}

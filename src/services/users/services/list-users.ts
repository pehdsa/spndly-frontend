import { http } from '@/services/http'
import type { ApiPaginatedResponse, PaginationParams } from '@/services'
import type { User } from '../types'

export async function listUsers(params?: PaginationParams): Promise<ApiPaginatedResponse<User>> {
  const { data } = await http.get<ApiPaginatedResponse<User>>('/users', { params })
  return data
}

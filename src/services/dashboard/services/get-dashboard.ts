import { http } from '@/services/http'
import type { ApiResponse } from '@/services'
import type { DashboardData, DashboardParams } from '../types'

export async function getDashboard(params?: DashboardParams): Promise<DashboardData> {
  const { data } = await http.get<ApiResponse<DashboardData>>('/dashboard', { params })
  return data.data
}

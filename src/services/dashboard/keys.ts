import type { DashboardParams } from './types'

export const dashboardKeys = {
  all: ['dashboard'] as const,
  data: (params?: DashboardParams) => [...dashboardKeys.all, 'data', params] as const,
}

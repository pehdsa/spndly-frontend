import type { RouteRecordRaw } from 'vue-router'

export const expensesRoutes: RouteRecordRaw = {
  path: 'expenses',
  name: 'expenses.list',
  component: () => import('./pages/expenses-list-page/ExpensesListPage.vue'),
}

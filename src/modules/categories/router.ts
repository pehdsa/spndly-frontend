import type { RouteRecordRaw } from 'vue-router'

export const categoriesRoutes: RouteRecordRaw = {
  path: 'categories',
  name: 'categories.list',
  component: () => import('./pages/categories-list-page/CategoriesListPage.vue'),
}

import type { RouteRecordRaw } from 'vue-router'

export const paymentMethodsRoutes: RouteRecordRaw = {
  path: 'payment-methods',
  name: 'payment-methods.list',
  component: () => import('./pages/payment-methods-list-page/PaymentMethodsListPage.vue'),
}

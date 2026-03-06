import type { RouteRecordRaw } from 'vue-router'

import { authRoutes } from '@/modules/auth/router'
import { categoriesRoutes } from '@/modules/categories'
import { dashboardRoutes } from '@/modules/dashboard'
import { expensesRoutes } from '@/modules/expenses'
import { paymentMethodsRoutes } from '@/modules/payment-methods'
import { usersRoutes } from '@/modules/users'
// [MODULE-IMPORTS]

// Rotas protegidas (layout auth)
const protectedRoutes: RouteRecordRaw = {
  path: '/',
  meta: {
    layout: 'auth',
    requiresAuth: true,
  },
  children: [
    {
      path: '',
      redirect: { name: 'dashboard' },
    },
    dashboardRoutes,
    expensesRoutes,
    categoriesRoutes,
    paymentMethodsRoutes,
    usersRoutes,
    // [MODULE-ROUTES]
  ],
}

// Rotas públicas sem layout
const publicRoutes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    meta: { layout: 'none' },
    component: () => import('@/pages/NotFoundPage.vue'),
  },
]

// Merge de todas as rotas
export const routes: RouteRecordRaw[] = [
  ...authRoutes,
  protectedRoutes,
  ...publicRoutes,
]

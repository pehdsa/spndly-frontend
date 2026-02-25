import type { RouteRecordRaw } from 'vue-router'

import { authRoutes } from '@/modules/auth/router'
import { dashboardRoutes } from '@/modules/dashboard'
import { usersRoutes } from '@/modules/users'

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
    usersRoutes,
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

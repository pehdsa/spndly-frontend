import type { RouteRecordRaw } from 'vue-router'

// Rotas de autenticação (prefixo /auth)
const authPrefixedRoutes: RouteRecordRaw = {
  path: '/auth',
  meta: {
    layout: 'guest',
    requiresGuest: true,
  },
  children: [
    {
      path: 'login',
      name: 'auth.login',
      component: () => import('./pages/LoginPage.vue'),
    },
    {
      path: 'forgot-password',
      name: 'auth.forgot-password',
      component: () => import('./pages/ForgotPasswordPage.vue'),
    },
    {
      path: 'reset-password',
      name: 'auth.reset-password',
      component: () => import('./pages/ResetPasswordPage.vue'),
    },
    {
      path: 'google/callback',
      name: 'auth.google-callback',
      component: () => import('./pages/GoogleCallbackPage.vue'),
    },
  ],
}

// Rota de registro via convite (sem prefixo /auth)
const registerRoute: RouteRecordRaw = {
  path: '/register',
  name: 'auth.register',
  meta: {
    layout: 'guest',
    requiresGuest: true,
  },
  component: () => import('./pages/RegisterPage.vue'),
}

// Rota de reset de senha (sem prefixo /auth - URL enviada por email)
const resetPasswordRoute: RouteRecordRaw = {
  path: '/reset-password',
  name: 'auth.reset-password-root',
  meta: {
    layout: 'guest',
    requiresGuest: true,
  },
  component: () => import('./pages/ResetPasswordPage.vue'),
}

export const authRoutes: RouteRecordRaw[] = [authPrefixedRoutes, registerRoute, resetPasswordRoute]

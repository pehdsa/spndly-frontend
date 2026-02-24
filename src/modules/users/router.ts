import type { RouteRecordRaw } from 'vue-router'

export const usersRoutes: RouteRecordRaw = {
  path: 'users',
  meta: { requiresAdmin: true },
  component: () => import('./pages/UsersLayout.vue'),
  children: [
    {
      path: '',
      name: 'users.list',
      component: () => import('./pages/users-list-page/UsersListPage.vue'),
    },
    {
      path: 'invitations',
      name: 'users.invitations',
      component: () => import('./pages/invitations-list-page/InvitationsListPage.vue'),
    },
  ],
}

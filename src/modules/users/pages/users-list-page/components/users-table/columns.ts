import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import { Badge } from '@/components/ui/badge'
import { AppDataTableColumnHeader, AppTableCell } from '@/components/shared/app-datatable'
import type { User, UserStatus, UserRole } from '@/services/users'
import { USER_ROLE_LABELS } from '@/modules/users/constants'
import { useAuthStore } from '@/stores/auth'
import UserActions from './UserActions.vue'

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => h(AppDataTableColumnHeader, { column, title: 'Nome' }),
    cell: ({ row }) => h(AppTableCell, { value: row.original.name, class: 'font-medium' }),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => h(AppDataTableColumnHeader, { column, title: 'Email' }),
    cell: ({ row }) => h(AppTableCell, { value: row.original.email }),
  },
  {
    accessorKey: 'role',
    header: ({ column }) => h(AppDataTableColumnHeader, { column, title: 'Função' }),
    cell: ({ row }) => {
      const role = row.getValue('role') as UserRole
      return h(AppTableCell, { value: USER_ROLE_LABELS[role], class: 'font-medium' })
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => h(AppDataTableColumnHeader, { column, title: 'Status' }),
    cell: ({ row }) => {
      const status = row.getValue('status') as UserStatus
      return h(
        Badge,
        { variant: status === 'ACTIVE' ? 'success' : 'destructive' },
        () => (status === 'ACTIVE' ? 'Ativo' : 'Bloqueado'),
      )
    },
  },
  {
    accessorKey: 'viewed_at',
    header: ({ column }) => h(AppDataTableColumnHeader, { column, title: 'Última visualização' }),
    cell: ({ row }) => {
      const value = row.getValue('viewed_at') as string | null
      if (!value) return h('span', { class: 'text-muted-foreground' }, '-')
      const date = new Date(value)
      return h('span', {}, date.toLocaleString('pt-BR'))
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => h(AppDataTableColumnHeader, { column, title: 'Criado em' }),
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'))
      return h('span', {}, date.toLocaleDateString('pt-BR'))
    },
  },
  {
    id: 'actions',
    header: () => h('div', { class: 'text-center' }, 'Ações'),
    cell: ({ row }) => {
      const authStore = useAuthStore()
      const isCurrentUser = row.original.id === authStore.user?.id
      if (isCurrentUser) return h('div', { class: 'flex justify-center items-center text-muted-foreground' }, '-')
      return h('div', { class: "flex justify-center items-center" }, h(UserActions, { user: row.original }))
    },
  },
]

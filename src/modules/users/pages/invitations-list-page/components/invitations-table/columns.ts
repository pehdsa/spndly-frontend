import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import { Badge } from '@/components/ui/badge'
import { AppDataTableColumnHeader, AppTableCell } from '@/components/shared/app-datatable'
import type { Invitation, UserRole } from '@/services/users'
import { USER_ROLE_LABELS } from '@/modules/users/constants'
import InvitationActions from './InvitationActions.vue'

export const columns: ColumnDef<Invitation>[] = [
  {
    accessorKey: 'email',
    header: ({ column }) => h(AppDataTableColumnHeader, { column, title: 'Email' }),
    cell: ({ row }) => h(AppTableCell, { value: row.original.email, class: 'font-medium' }),
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
    accessorKey: 'expires_at',
    header: ({ column }) => h(AppDataTableColumnHeader, { column, title: 'Expira em' }),
    cell: ({ row }) => {
      const date = new Date(row.getValue('expires_at'))
      return h('span', {}, date.toLocaleString('pt-BR'))
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => h(AppDataTableColumnHeader, { column, title: 'Status' }),
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const variants = {
        VALID: 'success',
        USED: 'secondary',
        EXPIRED: 'destructive',
      } as const
      const labels: Record<string, string> = {
        VALID: 'Válido',
        USED: 'Usado',
        EXPIRED: 'Expirado',
      }
      const variant = variants[status as keyof typeof variants] ?? 'secondary'
      return h(Badge, { variant }, () => labels[status] ?? status)
    },
  },
  {
    id: 'actions',
    header: () => h('div', { class: 'text-center' }, 'Ações'),
    cell: ({ row }) => h('div', { class: "flex justify-center items-center" }, h(InvitationActions, { invitation: row.original })),
  },
]

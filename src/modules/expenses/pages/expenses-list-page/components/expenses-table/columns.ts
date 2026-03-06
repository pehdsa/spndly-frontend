import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import { AppDataTableColumnHeader, AppTableCell } from '@/components/shared/app-datatable'
import { ColorBadge } from '@/components/shared/color-badge'
import type { Expense } from '@/services/expenses'
import ExpenseActions from './ExpenseActions.vue'

function formatCurrency(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export const columns: ColumnDef<Expense>[] = [
  {
    accessorKey: 'description',
    header: ({ column }) => h(AppDataTableColumnHeader, { column, title: 'Descrição' }),
    cell: ({ row }) => {
      const value = row.original.description
      if (!value) return h('span', { class: 'text-muted-foreground' }, '-')
      return h(AppTableCell, { value })
    },
  },
  {
    accessorKey: 'amount_cents',
    header: ({ column }) => h(AppDataTableColumnHeader, { column, title: 'Valor' }),
    cell: ({ row }) =>
      h(AppTableCell, { value: formatCurrency(row.original.amount_cents), class: 'font-medium' }),
  },
  {
    id: 'category',
    header: 'Categoria',
    enableSorting: false,
    cell: ({ row }) =>
      h(ColorBadge, { label: row.original.category.name, colorId: row.original.category.id }),
  },
  {
    id: 'payment_method',
    header: 'Método de Pagamento',
    enableSorting: false,
    cell: ({ row }) =>
      h(ColorBadge, { label: row.original.payment_method.name, colorId: row.original.payment_method.id }),
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => h(AppDataTableColumnHeader, { column, title: 'Data' }),
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'))
      return h('span', {}, date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }))
    },
  },
  {
    id: 'actions',
    header: () => h('div', { class: 'text-center' }, 'Ações'),
    enableSorting: false,
    cell: ({ row }) =>
      h('div', { class: 'flex justify-center items-center' }, h(ExpenseActions, { expense: row.original })),
  },
]

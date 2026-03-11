import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import { AppDataTableColumnHeader, AppTableCell } from '@/components/shared/app-datatable'
import type { Category } from '@/services/categories'
import CategoryActions from './CategoryActions.vue'

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => h(AppDataTableColumnHeader, { column, title: 'Nome' }),
    cell: ({ row }) => h(AppTableCell, { value: row.original.name, class: 'font-medium' }),
  },
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
    enableSorting: false,
    cell: ({ row }) =>
      h('div', { class: 'flex justify-center items-center' }, h(CategoryActions, { category: row.original })),
  },
]

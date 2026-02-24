<script setup lang="ts">
import { AppDataTable, type PaginationMeta, type TableChangeData } from '@/components/shared/app-datatable'
import type { User } from '@/services/users'
import { columns } from './columns'

interface Props {
  data: User[]
  meta?: PaginationMeta
  isLoading?: boolean
  isFetching?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'table-change', value: TableChangeData): void
}>()

</script>

<template>
  <AppDataTable
    :columns="columns"
    :data="data"
    :meta="meta"
    :is-loading-data="isLoading"
    :is-fetching-data="isFetching"
    manual-pagination
    manual-sorting
    @table-change="emit('table-change', $event)"
  >
    <template #toolbar="{ isFetching }">
      <slot name="toolbar" :is-fetching="isFetching" />
    </template>
  </AppDataTable>
</template>

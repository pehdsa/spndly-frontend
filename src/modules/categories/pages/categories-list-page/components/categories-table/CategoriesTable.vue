<script setup lang="ts">
import { computed } from 'vue'
import { AppDataTable, type PaginationMeta, type TableChangeData } from '@/components/shared/app-datatable'
import type { Category } from '@/services/categories'
import { useAuthStore } from '@/stores/auth'
import { columns } from './columns'

interface Props {
  data: Category[]
  meta?: PaginationMeta
  isLoading?: boolean
  isFetching?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'table-change', value: TableChangeData): void
}>()

const authStore = useAuthStore()

const visibleColumns = computed(() =>
  authStore.isAdmin ? columns : columns.filter((c) => c.id !== 'actions'),
)
</script>

<template>
  <AppDataTable
    :columns="visibleColumns"
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

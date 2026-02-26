<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus } from 'lucide-vue-next'
import { buildTableQueryParams, type TableChangeData } from '@/components/shared/app-datatable'
import { Button } from '@/components/ui/button'
import { AppPageHeader } from '@/components/shared/app-page-header'
import { useQueryParams } from '@/composables'
import { useExpenses } from '@/services/expenses'
import { ExpensesTable } from './components/expenses-table'
import { ExpenseDialog } from '@/modules/expenses/components/expense-dialog'

const createDialogOpen = ref(false)

const { params, syncToUrl } = useQueryParams({
  page: 1,
  per_page: 10,
  sort: undefined as string | undefined,
})

const apiParams = computed(() => ({
  page: params.page,
  per_page: params.per_page,
  sort: params.sort || undefined,
}))

const { data, isLoading, isFetching } = useExpenses({ params: apiParams })

function handleTableChange(e: TableChangeData) {
  Object.assign(params, buildTableQueryParams(e))
  syncToUrl()
}
</script>

<template>
  <div class="flex flex-col gap-4 sm:gap-6">
    <AppPageHeader
      title="Despesas"
      subtitle="Gerencie suas despesas"
    >
      <template #actions>
        <Button class="w-full md:w-auto" @click="createDialogOpen = true">
          <Plus class="mr-2 h-4 w-4" />
          Nova Despesa
        </Button>
      </template>
    </AppPageHeader>

    <ExpensesTable
      :data="data?.data ?? []"
      :meta="data?.meta"
      :is-loading="isLoading"
      :is-fetching="isFetching"
      @table-change="handleTableChange"
    />

    <ExpenseDialog v-model:open="createDialogOpen" />
  </div>
</template>

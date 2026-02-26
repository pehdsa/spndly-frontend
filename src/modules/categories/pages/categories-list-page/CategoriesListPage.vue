<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Search } from 'lucide-vue-next'
import { buildTableQueryParams, type TableChangeData } from '@/components/shared/app-datatable'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Button } from '@/components/ui/button'
import { AppPageHeader } from '@/components/shared/app-page-header'
import { useQueryParams } from '@/composables'
import { useAuthStore } from '@/stores/auth'
import { useCategories } from '@/services/categories'
import { CategoriesTable } from './components/categories-table'
import { CategoryDialog } from '@/modules/categories/components/category-dialog'

const authStore = useAuthStore()
const createDialogOpen = ref(false)

const { params, syncToUrl } = useQueryParams({
  page: 1,
  per_page: 10,
  sort: undefined as string | undefined,
  search: undefined as string | undefined,
})

const searchInputValue = ref(params.search || '')

const apiParams = computed(() => ({
  page: params.page,
  per_page: params.per_page,
  sort: params.sort || undefined,
  search: params.search || undefined,
}))

const { data, isLoading, isFetching } = useCategories({ params: apiParams })

function handleTableChange(e: TableChangeData) {
  Object.assign(params, buildTableQueryParams(e))
  syncToUrl()
}

function handleSearch() {
  params.search = searchInputValue.value || undefined
  params.page = 1
  syncToUrl()
}
</script>

<template>
  <div class="flex flex-col gap-4 sm:gap-6">
    <AppPageHeader
      title="Categorias"
      subtitle="Gerencie as categorias de despesas"
    >
      <template #actions>
        <Button v-if="authStore.isAdmin" class="w-full md:w-auto" @click="createDialogOpen = true">
          <Plus class="mr-2 h-4 w-4" />
          Nova Categoria
        </Button>
      </template>
    </AppPageHeader>

    <CategoriesTable
      :data="data?.data ?? []"
      :meta="data?.meta"
      :is-loading="isLoading"
      :is-fetching="isFetching"
      @table-change="handleTableChange"
    >
      <template #toolbar>
        <div class="flex flex-col sm:flex-row gap-4 mb-4">
          <InputGroup class="w-full sm:max-w-sm">
            <InputGroupAddon>
              <Search class="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              v-model="searchInputValue"
              placeholder="Buscar por nome"
              @blur="handleSearch"
              @keyup.enter="handleSearch"
            />
          </InputGroup>
        </div>
      </template>
    </CategoriesTable>

    <CategoryDialog v-model:open="createDialogOpen" />
  </div>
</template>

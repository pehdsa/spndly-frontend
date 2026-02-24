<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search } from 'lucide-vue-next'
import { buildTableQueryParams, type TableChangeData } from '@/components/shared/app-datatable'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useQueryParams } from '@/composables'
import { useUsers, type UserStatus } from '@/services/users'
import { UsersTable } from './components/users-table'

const { params, syncToUrl } = useQueryParams({
  page: 1,
  per_page: 10,
  sort: undefined as string | undefined,
  search: undefined as string | undefined,
  status: undefined as string | undefined,
})

const searchInputValue = ref(params.search || '')
const statusFilter = ref<UserStatus | 'ALL'>(
  (params.status as UserStatus) || 'ALL'
)

const apiParams = computed(() => ({
  page: params.page,
  per_page: params.per_page,
  sort: params.sort || undefined,
  search: params.search || undefined,
  status: params.status || undefined,
}))

const { data, isLoading, isFetching } = useUsers({ params: apiParams })

function handleTableChange(e: TableChangeData) {
  Object.assign(params, buildTableQueryParams(e))
  syncToUrl()
}

function handleSearch() {
  params.search = searchInputValue.value || undefined
  params.page = 1
  syncToUrl()
}

function handleStatusChange(value: unknown) {
  if (value === 'ACTIVE' || value === 'BLOCKED' || value === 'ALL') {
    statusFilter.value = value
    params.status = value === 'ALL' ? undefined : value
    params.page = 1
    syncToUrl()
  }
}
</script>

<template>
  <UsersTable
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

        <Select :model-value="statusFilter" @update:model-value="handleStatusChange">
          <SelectTrigger class="w-full sm:w-45">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos</SelectItem>
            <SelectItem value="ACTIVE">Ativo</SelectItem>
            <SelectItem value="BLOCKED">Bloqueado</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </template>
  </UsersTable>
</template>

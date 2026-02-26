<script setup lang="ts">
import type { AcceptableValue } from 'reka-ui'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuthStore } from '@/stores/auth'
import { useUsers } from '@/services/users'
import type { DashboardPeriod } from '@/services/dashboard'

const period = defineModel<DashboardPeriod>('period', { required: true })
const userId = defineModel<number | undefined>('userId')

const authStore = useAuthStore()

const periodOptions: { value: DashboardPeriod; label: string }[] = [
  { value: '7d', label: '7 dias' },
  { value: '30d', label: '30 dias' },
  { value: '90d', label: '90 dias' },
  { value: '12m', label: '12 meses' },
]

const { data: usersData } = useUsers({
  params: { per_page: 100 },
  options: { enabled: authStore.isAdmin },
})

function handleUserChange(value: AcceptableValue) {
  userId.value = value === 'all' ? undefined : Number(value)
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <Select v-model="period">
      <SelectTrigger class="w-[160px]">
        <SelectValue placeholder="Período" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          v-for="option in periodOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </SelectItem>
      </SelectContent>
    </Select>

    <Select
      v-if="authStore.isAdmin"
      :model-value="userId === undefined ? 'all' : String(userId)"
      @update:model-value="handleUserChange"
    >
      <SelectTrigger class="w-[220px]">
        <SelectValue placeholder="Filtrar por usuário" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos os usuários</SelectItem>
        <SelectItem
          v-if="authStore.user"
          :value="String(authStore.user.id)"
        >
          Minhas despesas
        </SelectItem>
        <template v-if="usersData?.data">
          <SelectItem
            v-for="user in usersData.data.filter((u) => u.id !== authStore.user?.id)"
            :key="user.id"
            :value="String(user.id)"
          >
            {{ user.name }}
          </SelectItem>
        </template>
      </SelectContent>
    </Select>
  </div>
</template>

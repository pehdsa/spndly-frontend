<script setup lang="ts">
import { DollarSign, Receipt } from 'lucide-vue-next'
import { AppSummaryCard } from '@/components/shared/app-summary-card'
import { Skeleton } from '@/components/ui/skeleton'
import type { DashboardTotals } from '@/services/dashboard'

interface Props {
  totals?: DashboardTotals
  isLoading?: boolean
}

const props = defineProps<Props>()

function formatCurrency(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2">
    <template v-if="props.isLoading">
      <Skeleton class="h-[72px] rounded-xl" />
      <Skeleton class="h-[72px] rounded-xl" />
    </template>
    <template v-else>
      <AppSummaryCard
        title="Total Gasto"
        :description="formatCurrency(props.totals?.total_amount ?? 0)"
        :icon="DollarSign"
        icon-color="text-emerald-600"
        icon-bg-color="bg-emerald-100 dark:bg-emerald-950"
      />
      <AppSummaryCard
        title="Total de Despesas"
        :description="String(props.totals?.total_count ?? 0)"
        :icon="Receipt"
        icon-color="text-blue-600"
        icon-bg-color="bg-blue-100 dark:bg-blue-950"
      />
    </template>
  </div>
</template>

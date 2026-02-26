<script setup lang="ts">
import { computed, ref } from 'vue'
import { AppPageHeader } from '@/components/shared/app-page-header'
import { useDashboard, type DashboardPeriod } from '@/services/dashboard'
import DashboardFilters from './components/DashboardFilters.vue'
import DashboardSummaryCards from './components/DashboardSummaryCards.vue'
import TopCategoriesChart from './components/TopCategoriesChart.vue'
import TopPaymentMethodsChart from './components/TopPaymentMethodsChart.vue'
import RecentExpensesList from './components/RecentExpensesList.vue'

const period = ref<DashboardPeriod>('30d')
const userId = ref<number | undefined>(undefined)

const dashboardParams = computed(() => ({
  period: period.value,
  user_id: userId.value || undefined,
}))

const { data, isLoading } = useDashboard({ params: dashboardParams })
</script>

<template>
  <div class="flex flex-col gap-6">
    <AppPageHeader title="Dashboard" subtitle="Visão geral das suas despesas" />

    <DashboardFilters v-model:period="period" v-model:user-id="userId" />

    <DashboardSummaryCards :totals="data?.totals" :is-loading="isLoading" />

    <div class="grid gap-4 lg:grid-cols-2">
      <TopCategoriesChart :data="data?.top_categories" :is-loading="isLoading" />
      <TopPaymentMethodsChart :data="data?.top_payment_methods" :is-loading="isLoading" />
    </div>

    <RecentExpensesList :expenses="data?.recent_expenses" :is-loading="isLoading" />
  </div>
</template>

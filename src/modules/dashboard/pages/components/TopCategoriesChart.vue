<script setup lang="ts">
import { computed } from 'vue'
import { VisXYContainer, VisStackedBar, VisStackedBarSelectors, VisAxis, VisTooltip } from '@unovis/vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { TopCategory } from '@/services/dashboard'

interface Props {
  data?: TopCategory[]
  isLoading?: boolean
}

const props = defineProps<Props>()

const chartData = computed(() => props.data ?? [])

const CHART_COLORS = ['#4D8CFD', '#FF6B7E', '#F4B83E', '#A6CC74', '#00C19A', '#6859BE']

function formatCurrency(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

const x = (_: TopCategory, i: number) => i

const yAccessors = computed(() =>
  chartData.value.map((item, idx) => (_d: TopCategory, i: number) => i === idx ? item.total_amount / 100 : 0),
)

const tickFormat = (i: number) => chartData.value[i]?.name ?? ''

const tooltipTemplate = (barDatum: { datum: TopCategory }) => {
  const d = barDatum.datum
  return `<div class="rounded-lg border bg-background px-3 py-2 text-xs shadow-md">
    <p class="font-medium text-foreground">${d.name}</p>
    <p class="text-muted-foreground">${formatCurrency(d.total_amount)}</p>
    <p class="text-muted-foreground">${d.total_count} despesa${d.total_count !== 1 ? 's' : ''}</p>
  </div>`
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-base">Top Categorias</CardTitle>
    </CardHeader>
    <CardContent class="pb-12">
      <Skeleton v-if="props.isLoading" class="h-[300px]" />
      <div v-else-if="chartData.length === 0" class="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
        Nenhum dado disponível
      </div>
      <div v-else class="h-[250px]">
        <VisXYContainer :data="chartData" :padding="{ top: 10, right: 10, bottom: 0, left: 0 }">
          <VisStackedBar
            :x="x"
            :y="yAccessors"
            :color="CHART_COLORS"
            :bar-padding="0.3"
            :rounded-corners="4"
          />
          <VisAxis
            type="x"            
            :tick-line="true"
            :domain-line="true"
            :tick-format="tickFormat"
            :num-ticks="chartData.length"
          />
          <VisAxis type="y" />
          <VisTooltip class="tooltip-chart" :triggers="{ [VisStackedBarSelectors.bar]: tooltipTemplate }" />
        </VisXYContainer>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { VisXYContainer, VisGroupedBar, VisGroupedBarSelectors, VisAxis, VisTooltip } from '@unovis/vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { TopCategory } from '@/services/dashboard'

interface Props {
  data?: TopCategory[]
  isLoading?: boolean
}

const props = defineProps<Props>()

const chartData = computed(() => props.data ?? [])

function formatCurrency(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

const x = (_: TopCategory, i: number) => i
const y = (d: TopCategory) => d.total_amount / 100

const tickFormat = (i: number) => chartData.value[i]?.name ?? ''

const tooltipTemplate = (d: TopCategory) => {
  return `<div class="rounded-lg border bg-background px-3 py-2 text-xs shadow-md">
    <p class="font-medium">${d.name}</p>
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
    <CardContent>
      <Skeleton v-if="props.isLoading" class="h-[250px]" />
      <div v-else-if="chartData.length === 0" class="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
        Nenhum dado disponível
      </div>
      <div v-else class="h-[250px]">
        <VisXYContainer :data="chartData" :padding="{ top: 10, right: 10, bottom: 0, left: 0 }">
          <VisGroupedBar
            :x="x"
            :y="y"
            :bar-padding="0.3"
            :rounded-corners="4"
            color="var(--color-primary)"
          />
          <VisAxis
            type="x"
            :tick-format="tickFormat"
            :num-ticks="chartData.length"
          />
          <VisAxis type="y" />
          <VisTooltip :triggers="{ [VisGroupedBarSelectors.bar]: tooltipTemplate }" />
        </VisXYContainer>
      </div>
    </CardContent>
  </Card>
</template>

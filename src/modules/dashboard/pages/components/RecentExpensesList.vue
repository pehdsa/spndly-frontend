<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ArrowRight } from 'lucide-vue-next'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { Expense } from '@/services/expenses'

interface Props {
  expenses?: Expense[]
  isLoading?: boolean
}

const props = defineProps<Props>()

function formatCurrency(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('pt-BR')
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-base">Despesas Recentes</CardTitle>
    </CardHeader>
    <CardContent>
      <template v-if="props.isLoading">
        <div class="space-y-4">
          <Skeleton v-for="i in 5" :key="i" class="h-12" />
        </div>
      </template>
      <div v-else-if="!props.expenses?.length" class="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
        Nenhuma despesa recente
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="expense in props.expenses"
          :key="expense.id"
          class="flex items-center justify-between gap-4 rounded-lg border p-3"
        >
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium">
              {{ expense.description || '-' }}
            </p>
            <p class="text-xs text-muted-foreground">
              {{ expense.category.name }} &middot; {{ formatDate(expense.created_at) }}
            </p>
          </div>
          <p class="shrink-0 text-sm font-semibold">
            {{ formatCurrency(expense.amount_cents) }}
          </p>
        </div>
      </div>
    </CardContent>
    <CardFooter v-if="props.expenses?.length" class="justify-center">
      <Button variant="ghost" size="sm" as-child>
        <RouterLink to="/expenses" class="flex items-center gap-1">
          Ver todas
          <ArrowRight class="size-4" />
        </RouterLink>
      </Button>
    </CardFooter>
  </Card>
</template>

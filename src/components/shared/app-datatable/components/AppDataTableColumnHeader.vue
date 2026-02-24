<script setup lang="ts">
import { computed } from 'vue'
import type { Column } from '@tanstack/vue-table'
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  column: Column<any, any>
  title: string
}

const props = defineProps<Props>()

const sortDirection = computed(() => props.column.getIsSorted())

const handleSort = () => {
  if (!props.column.getCanSort()) return
  props.column.toggleSorting(sortDirection.value === 'asc')
}

const SortIcon = computed(() => {
  if (sortDirection.value === 'asc') return ArrowUp
  if (sortDirection.value === 'desc') return ArrowDown
  return ArrowUpDown
})
</script>

<template>
  <Button
    variant="ghost"
    size="sm"
    class="-ml-3 h-8 data-[state=open]:bg-accent group"
    @click="handleSort"
  >
    <span>{{ title }}</span>
    <component
      :is="SortIcon"
      v-if="column.getCanSort()"
      :class="
        cn(
          'ml-2 h-4 w-4 transition-opacity',
          sortDirection ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )
      "
    />
  </Button>
</template>

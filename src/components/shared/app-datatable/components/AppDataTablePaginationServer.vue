<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next'
import { Spinner } from '@/components/ui/spinner'
import type { PaginationState } from '@tanstack/vue-table'
import type { PaginationMeta } from '../types'

const emit = defineEmits<{
  'pagination-change': [pagination: PaginationState]
}>()

withDefaults(defineProps<{ meta?: PaginationMeta; isLoadingData?: boolean, showMeta: boolean }>(), {
  meta: () => ({}) as PaginationMeta,
  isLoadingData: false,
  showMeta: true,
})

const handlePaginationChange = (newPagination: PaginationState) => {
  emit('pagination-change', newPagination)
}
</script>

<template>
  <div class="flex items-center justify-between p-2">
    <div v-if="showMeta" class="hidden lg:flex flex-1 text-sm text-muted-foreground">
      <Spinner v-if="isLoadingData" />
      <span v-else-if="meta">
        Exibindo {{ meta.from }} a {{ meta.to }} de {{ meta.total }} itens.
      </span>
    </div>
    <div :class="`flex items-center justify-between w-full ${ showMeta ? 'lg:justify-start lg:w-fit' : '' } space-x-6 lg:space-x-8`">
      <div class="flex items-center space-x-2">
        <p class="hidden lg:block text-sm font-medium">Itens por página</p>
        <Select
          :model-value="`${meta?.per_page || 10}`"
          :disabled="isLoadingData"
          @update:model-value="
            (value) =>
              handlePaginationChange({
                pageIndex: 0,
                pageSize: Number(value),
              } as PaginationState)
          "
        >
          <SelectTrigger class="h-8 w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent side="top">
            <SelectItem v-for="size in [5, 10, 20, 30, 40, 50]" :key="size" :value="`${size}`">
              {{ size }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div :class="`hidden lg:flex ${ showMeta ? 'w-[100px]' : '' } items-center justify-center text-sm font-medium`">
        Página {{ meta?.current_page || 1 }} de
        <Spinner v-if="isLoadingData" class="ml-1" />
        <template v-else>{{ meta?.last_page || 1 }}</template>
      </div>
      <div class="flex items-center space-x-2">
        <Button
          variant="outline"
          class="h-8 w-8 p-0"
          :disabled="!meta?.current_page || meta.current_page <= 1 || isLoadingData"
          @click="handlePaginationChange({ pageIndex: 0, pageSize: meta?.per_page || 10 })"
        >
          <ChevronsLeft class="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          class="h-8 w-8 p-0"
          :disabled="!meta?.current_page || meta.current_page <= 1 || isLoadingData"
          @click="
            handlePaginationChange({
              pageIndex: (meta?.current_page || 1) - 2,
              pageSize: meta?.per_page || 10,
            })
          "
        >
          <ChevronLeft class="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          class="h-8 w-8 p-0"
          :disabled="!meta?.last_page || meta.current_page >= meta.last_page || isLoadingData"
          @click="
            handlePaginationChange({
              pageIndex: meta?.current_page || 0,
              pageSize: meta?.per_page || 10,
            })
          "
        >
          <ChevronRight class="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          class="h-8 w-8 p-0"
          :disabled="!meta?.last_page || meta.current_page >= meta.last_page || isLoadingData"
          @click="
            handlePaginationChange({
              pageIndex: (meta?.last_page || 1) - 1,
              pageSize: meta?.per_page || 10,
            })
          "
        >
          <ChevronsRight class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
</template>

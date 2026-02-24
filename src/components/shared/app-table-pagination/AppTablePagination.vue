<script setup lang="ts">
import { computed } from 'vue'
import {
  Pagination,
  PaginationFirst,
  PaginationLast,
  PaginationNext,
  PaginationPrev,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Props {
  page: number
  totalPages: number
  total: number
  perPage: number
  perPageOptions?: number[]
}

const props = withDefaults(defineProps<Props>(), {
  perPageOptions: () => [10, 20, 50, 100],
})

const emit = defineEmits<{
  'update:page': [page: number]
  'update:perPage': [perPage: number]
}>()

const isFirstPage = computed(() => props.page <= 1)
const isLastPage = computed(() => props.page >= props.totalPages)

function goToPage(page: number) {
  if (page >= 1 && page <= props.totalPages) {
    emit('update:page', page)
  }
}

function handlePerPageChange(value: unknown) {
  const numValue = Number(value)
  if (props.perPageOptions.includes(numValue)) {
    emit('update:perPage', numValue)
  }
}
</script>

<template>
  <div class="flex items-center justify-between">
    <!-- Left side: Total results + Items per page -->
    <div class="flex items-center gap-4">
      <span class="text-muted-foreground text-sm">
        {{ total }} {{ total === 1 ? 'resultado' : 'resultados' }}
      </span>

      <div class="flex items-center gap-2">
        <label class="text-muted-foreground text-sm">Itens por página:</label>
        <Select :model-value="String(perPage)" @update:model-value="handlePerPageChange">
          <SelectTrigger class="w-20 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="option in perPageOptions"
              :key="option"
              :value="String(option)"
            >
              {{ option }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <!-- Right side: Navigation buttons -->
    <Pagination
      :page="page"
      :total="total"
      :items-per-page="perPage"
      @update:page="goToPage"
    >
      <div class="flex items-center gap-1">
        <PaginationFirst
          :disabled="isFirstPage"
          @click="goToPage(1)"
        />
        <PaginationPrev
          :disabled="isFirstPage"
          @click="goToPage(page - 1)"
        />

        <span class="text-muted-foreground text-sm px-3">
          Página {{ page }} de {{ totalPages }}
        </span>

        <PaginationNext
          :disabled="isLastPage"
          @click="goToPage(page + 1)"
        />
        <PaginationLast
          :disabled="isLastPage"
          @click="goToPage(totalPages)"
        />
      </div>
    </Pagination>
  </div>
</template>

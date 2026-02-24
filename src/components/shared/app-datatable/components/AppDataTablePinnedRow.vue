<script setup lang="ts" generic="TData">
import { computed, ref, onMounted, nextTick } from 'vue'
import { FlexRender, type Table, type Row } from '@tanstack/vue-table'
import { TableCell } from '@/components/ui/table'
import { cn } from '@/lib/utils'

interface Props {
  row: Row<TData>
  table: Table<TData>
  rowClassName?: (row: TData) => string
  enableRowClick?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  enableRowClick: false,
  rowClassName: () => '',
})

const emit = defineEmits<{
  'row-click': [data: TData]
}>()

const rowRef = ref<HTMLTableRowElement | null>(null)
const rowHeight = ref(0)

onMounted(() => {
  nextTick(() => {
    rowHeight.value = rowRef.value?.getBoundingClientRect().height ?? 37
  })
})

const handleRowClick = (rowData: TData) => {
  if (props.enableRowClick) {
    emit('row-click', rowData)
  }
}

const topOffset = computed(() => {
  if (props.row.getIsPinned() !== 'top') return undefined

  const pinnedRows = props.table.getTopRows()
  const index = pinnedRows.findIndex((r) => r.id === props.row.id)
  if (index === -1) return undefined

  let offset = 39

  for (let i = 0; i < index; i++) {
    const pinned = pinnedRows[i]
    if (!pinned) continue

    const el = document.querySelector(`[data-row-id="${pinned.id}"]`) as HTMLTableRowElement | null
    const height = el?.getBoundingClientRect().height
    offset += (height ?? 37) - 1
  }

  return `${offset}px`
})

const bottomOffset = computed(() => {
  if (props.row.getIsPinned() !== 'bottom') return undefined

  const pinnedRows = props.table.getBottomRows()
  const index = pinnedRows.findIndex((r) => r.id === props.row.id)
  if (index === -1) return undefined

  let offset = 0

  for (let i = pinnedRows.length - 1; i > index; i--) {
    const pinned = pinnedRows[i]
    if (!pinned) continue

    const el = document.querySelector(`[data-row-id="${pinned.id}"]`) as HTMLTableRowElement | null
    const height = el?.getBoundingClientRect().height
    offset += height ?? 37
  }

  return `${offset}px`
})
</script>

<template>
  <tr
    ref="rowRef"
    :data-row-id="row.id"
    data-slot="table-row"
    :data-state="row.getIsSelected() ? 'selected' : undefined"
    :style="{
      position: row.getIsPinned() ? 'sticky' : undefined,
      top: topOffset,
      bottom: bottomOffset,
      zIndex: row.getIsPinned() ? 6 : undefined,
    }"
    :class="
      cn('hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors', [
        'data-table-row',
        { 'data-table-row-selected': row.getIsSelected() },
        { 'cursor-pointer': enableRowClick },
        rowClassName ? rowClassName(row.original) : '',
      ])
    "
    @click="handleRowClick(row.original)"
  >
    <TableCell
      v-for="cell in row.getVisibleCells()"
      :key="cell.id"
      class="data-table-cell"
    >
      <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
    </TableCell>
  </tr>
</template>

<style scoped>
.data-table-cell {
  vertical-align: top;
}
</style>

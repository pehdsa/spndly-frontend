<script setup lang="ts" generic="TData">
import { TableBody, TableCell, TableRow } from '@/components/ui/table'
import { FlexRender, type ColumnDef, type Table } from '@tanstack/vue-table'
import AppDataTablePinnedRow from './AppDataTablePinnedRow.vue'
import AppDataTableEmpty from './AppDataTableEmpty.vue'
import AppDataTableSkeleton from './AppDataTableSkeleton.vue'

const props = defineProps<{
  table: Table<TData>
  columns: ColumnDef<TData, unknown>[]
  enableRowClick?: boolean
  rowClassName?: (row: TData) => string
  isLoading?: boolean
}>()

const emit = defineEmits<{
  (e: 'row-click', row: TData): void
}>()

const handleRowClick = (rowData: TData) => {
  if (props.enableRowClick) {
    emit('row-click', rowData)
  }
}
</script>

<template>
  <TableBody class="data-table-body">
    <!-- Linhas fixadas no topo -->
    <template v-for="row in table.getTopRows()" :key="row.id">
      <AppDataTablePinnedRow
        :row="row"
        :table="table"
        class="data-table-row-pinned-top"
        :row-class-name="rowClassName"
        :enable-row-click="enableRowClick"
        @row-click="emit('row-click', $event)"
      />
    </template>

    <!-- Linhas centrais -->
    <template v-if="table.getCenterRows().length">
      <TableRow
        v-for="row in table.getCenterRows()"
        :key="row.id"
        :data-row-id="row.id"
        :data-row-index="row.index"
        :data-state="row.getIsSelected() ? 'selected' : undefined"
        :class="[
          'data-table-row',
          { 'data-table-row-selected': row.getIsSelected() },
          { 'cursor-pointer': enableRowClick },
          rowClassName ? rowClassName(row.original) : '',
        ]"
        @click="handleRowClick(row.original)"
      >
        <TableCell
          v-for="cell in row.getVisibleCells()"
          :key="cell.id"
          :data-col-id="cell.column.id"
          class="data-table-cell"
        >
          <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
        </TableCell>
      </TableRow>
    </template>

    <!-- Linhas fixadas no rodapé -->
    <template v-for="row in table.getBottomRows()" :key="row.id">
      <AppDataTablePinnedRow
        :row="row"
        :table="table"
        class="data-table-row-pinned-bottom"
        :row-class-name="rowClassName"
        :enable-row-click="enableRowClick"
        @row-click="emit('row-click', $event)"
      />
    </template>

    <!-- Skeleton durante loading -->
    <AppDataTableSkeleton v-if="isLoading" :columns="columns.length" :rows="5" />

    <!-- Empty state quando não há dados e não está loading -->
    <AppDataTableEmpty v-else-if="!table.getRowModel().rows?.length" :colspan="columns.length" />
  </TableBody>
</template>

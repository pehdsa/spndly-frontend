<script setup lang="ts" generic="TData">
import { computed } from 'vue'
import { TableHeader, TableRow, TableHead } from '@/components/ui/table'
import { FlexRender, type Table } from '@tanstack/vue-table'

const props = defineProps<{
  table: Table<TData>
  pinHeader?: boolean
}>()

const headerGroups = computed(() => props.table.getHeaderGroups())
const hasPinnedRows = computed(() => props.table.getTopRows().length > 0)
</script>

<template>
  <TableHeader
    :style="hasPinnedRows || pinHeader ? { position: 'sticky', top: 0, zIndex: 10 } : undefined"
  >
    <TableRow v-for="headerGroup in headerGroups" :key="headerGroup.id" class="data-table-header">
      <TableHead
        v-for="header in headerGroup.headers"
        :key="header.id"
        :data-column-id="header.column.id"
        class="data-table-header-cell"
      >
        <FlexRender
          v-if="!header.isPlaceholder"
          :render="header.column.columnDef.header"
          :props="header.getContext()"
        />
      </TableHead>
    </TableRow>
  </TableHeader>
</template>

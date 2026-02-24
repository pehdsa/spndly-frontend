<script setup lang="ts" generic="TData">
import type { AppDataTableProps, AppDataTableEmits } from './types'
import { useDataTableState } from './composables'
import {
  AppDataTableHeader,
  AppDataTableBody,
  AppDataTablePaginationClient,
  AppDataTablePaginationServer,
} from './components'

const emit = defineEmits<AppDataTableEmits<TData>>()

const props = withDefaults(defineProps<AppDataTableProps<TData>>(), {
  isLoadingData: false,
  isFetchingData: false,
  manualPagination: false,
  manualSorting: false,
  withoutPagination: false,
  pagination: () => ({ pageIndex: 0, pageSize: 10 }),
  enableRowClick: false,
  variant: 'default',
  containerClass: '',
  textWrap: false,
  pinHeader: false,
  enableRowPinning: false,
  showMeta: true,
  minWidth: '800px',
})

const { table, metaData, handlePaginationChange } = useDataTableState(props, emit)

function onRowClick(e: TData) {
  if (props.enableRowClick) {
    emit('row-click', e)
  }
}

defineExpose({ table })

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <slot name="toolbar" :table="table" :is-fetching="isFetchingData" />
  <div :class="['data-table-wrapper', `data-table-${variant}`]">
    <div data-slot="table-container" :class="['data-table-container border overflow-x-auto', containerClass]">
      <table data-slot="table" :class="['w-full caption-bottom text-sm', { 'cell-text-wrap': textWrap }]" :style="{ minWidth }">
        <AppDataTableHeader :table="table" :pin-header="pinHeader" />
        <AppDataTableBody
          :table="table"
          :columns="columns"
          :enable-row-click="enableRowClick"
          :row-class-name="rowClassName"
          :is-loading="isLoadingData"
          @row-click="onRowClick"
        />
      </table>
    </div>

    <template v-if="!withoutPagination">
      <AppDataTablePaginationServer
        v-if="manualPagination"
        :meta="metaData"
        :is-loading-data="isLoadingData"
        :show-meta="showMeta"
        @pagination-change="handlePaginationChange"
      />
      <AppDataTablePaginationClient v-else :table="table" :is-loading-data="isLoadingData" />
    </template>
  </div>
</template>

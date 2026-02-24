<script setup lang="ts">
import { TableRow, TableCell } from '@/components/ui/table'

defineProps<{ colspan: number }>()
</script>

<template>
  <TableRow>
    <TableCell :colspan="colspan" class="h-24 text-center data-table-empty">
      Nenhum resultado encontrado.
    </TableCell>
  </TableRow>
</template>

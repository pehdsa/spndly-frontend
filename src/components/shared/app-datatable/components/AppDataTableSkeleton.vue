<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

interface Props {
  rows?: number
  columns?: number
}

withDefaults(defineProps<Props>(), {
  rows: 5,
  columns: 5,
})
</script>

<template>
  <TableRow v-for="row in rows" :key="row">
    <TableCell v-for="col in columns" :key="col">
      <Skeleton class="h-4 w-full" />
    </TableCell>
  </TableRow>
</template>

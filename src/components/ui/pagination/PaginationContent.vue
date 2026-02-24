<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { PaginationList, PaginationListItem } from "reka-ui"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <PaginationList
    v-slot="{ items }"
    data-slot="pagination-content"
    :class="cn('flex flex-row items-center gap-1', props.class)"
  >
    <template v-for="(item, index) in items" :key="index">
      <PaginationListItem
        v-if="item.type === 'page'"
        :value="item.value"
        as-child
      >
        <slot name="page" :item="item" />
      </PaginationListItem>
      <slot v-else name="ellipsis" />
    </template>
  </PaginationList>
</template>

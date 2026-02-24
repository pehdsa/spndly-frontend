<script setup lang="ts">
import type { PaginationRootProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { PaginationRoot, useForwardProps } from "reka-ui"
import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<PaginationRootProps & { class?: HTMLAttributes["class"] }>(),
  {
    showEdges: true,
    defaultPage: 1,
  },
)

const forwardedProps = useForwardProps(props)
</script>

<template>
  <PaginationRoot
    v-slot="{ page }"
    data-slot="pagination"
    v-bind="forwardedProps"
    :class="cn('flex justify-center', props.class)"
  >
    <slot :page="page" />
  </PaginationRoot>
</template>

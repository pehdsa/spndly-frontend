<script setup lang="ts">
import type { PaginationFirstProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { ChevronsLeft } from "lucide-vue-next"
import { PaginationFirst, useForwardProps } from "reka-ui"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const props = defineProps<PaginationFirstProps & { class?: HTMLAttributes["class"] }>()

const forwardedProps = useForwardProps(props)
</script>

<template>
  <PaginationFirst
    data-slot="pagination-first"
    v-bind="forwardedProps"
    :class="cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'size-9', props.class)"
  >
    <slot>
      <ChevronsLeft class="size-4" />
    </slot>
  </PaginationFirst>
</template>

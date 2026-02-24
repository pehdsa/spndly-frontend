<script setup lang="ts">
import type { PaginationPrevProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { ChevronLeft } from "lucide-vue-next"
import { PaginationPrev, useForwardProps } from "reka-ui"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const props = defineProps<PaginationPrevProps & { class?: HTMLAttributes["class"] }>()

const forwardedProps = useForwardProps(props)
</script>

<template>
  <PaginationPrev
    data-slot="pagination-prev"
    v-bind="forwardedProps"
    :class="cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'size-9', props.class)"
  >
    <slot>
      <ChevronLeft class="size-4" />
    </slot>
  </PaginationPrev>
</template>

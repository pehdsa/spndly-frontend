<script setup lang="ts">
import type { PaginationLastProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { ChevronsRight } from "lucide-vue-next"
import { PaginationLast, useForwardProps } from "reka-ui"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const props = defineProps<PaginationLastProps & { class?: HTMLAttributes["class"] }>()

const forwardedProps = useForwardProps(props)
</script>

<template>
  <PaginationLast
    data-slot="pagination-last"
    v-bind="forwardedProps"
    :class="cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'size-9', props.class)"
  >
    <slot>
      <ChevronsRight class="size-4" />
    </slot>
  </PaginationLast>
</template>

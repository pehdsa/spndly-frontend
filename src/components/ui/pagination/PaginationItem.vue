<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const props = defineProps<{
  class?: HTMLAttributes["class"]
  isActive?: boolean
}>()
</script>

<template>
  <button
    data-slot="pagination-item"
    :class="cn(
      buttonVariants({ variant: isActive ? 'outline' : 'ghost', size: 'icon' }),
      'size-9',
      props.class,
    )"
  >
    <slot />
  </button>
</template>

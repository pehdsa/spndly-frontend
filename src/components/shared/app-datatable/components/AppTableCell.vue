<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { ref, computed } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

const props = defineProps<{
  value: string | number | null | undefined
  class?: HTMLAttributes['class']
}>()

const cellRef = ref<HTMLElement | null>(null)
const isOverflowing = ref(false)

// Recalcula overflow quando o elemento muda de tamanho (resize da janela, etc)
useResizeObserver(cellRef, () => {
  if (cellRef.value) {
    isOverflowing.value = cellRef.value.scrollWidth > cellRef.value.clientWidth
  }
})

const displayValue = computed(() => String(props.value ?? ''))
</script>

<template>
  <!-- Estrutura DOM constante - evita "pulo" visual e perda de referência -->
  <TooltipProvider :delay-duration="300">
    <Tooltip>
      <TooltipTrigger as-child>
        <span
          ref="cellRef"
          :class="cn('block truncate', props.class)"
        >
          {{ displayValue }}
        </span>
      </TooltipTrigger>
      <!-- Tooltip só renderiza conteúdo quando há overflow -->
      <TooltipContent
        v-if="isOverflowing"
        side="top"
        class="max-w-sm break-all"
      >
        {{ displayValue }}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>

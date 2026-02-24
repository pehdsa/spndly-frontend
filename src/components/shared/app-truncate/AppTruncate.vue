<script setup lang="ts">
import { ref, watch, nextTick, useTemplateRef, useAttrs, computed } from 'vue'
import { useResizeObserver, useMediaQuery, onClickOutside } from '@vueuse/core'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })

interface Props {
  /** Tag HTML a ser renderizada */
  as?: string
  /** Número máximo de linhas (1 = truncate simples, 2+ = line-clamp) */
  lines?: number
  /** Quebra linha em qualquer ponto (útil para textos sem espaços como URLs) */
  breakAll?: boolean
  /** Conteúdo HTML a ser renderizado com v-html */
  html?: string
}

const props = withDefaults(defineProps<Props>(), {
  as: 'span',
  lines: 1,
  breakAll: false,
  html: undefined,
})

const attrs = useAttrs()

const breakAllClass = computed(() =>
  cn('block min-w-0 break-all', attrs.class as string)
)

const truncateClass = computed(() =>
  cn(
    'block min-w-0',
    props.lines === 1 ? 'truncate' : `line-clamp-${props.lines}`,
    attrs.class as string
  )
)

// Remove tags HTML para exibir texto limpo no tooltip
const plainText = computed(() => {
  if (!props.html) return ''
  return props.html.replace(/<[^>]*>/g, '')
})

const elementRef = useTemplateRef<HTMLElement>('elementRef')
const isTruncated = ref(false)
const isOpen = ref(false)
const isMobile = useMediaQuery('(max-width: 768px)')

function checkTruncation() {
  if (!elementRef.value) return

  if (props.lines === 1) {
    isTruncated.value = elementRef.value.scrollWidth > elementRef.value.clientWidth
  } else {
    isTruncated.value = elementRef.value.scrollHeight > elementRef.value.clientHeight
  }
}

// Verifica truncation quando o elemento é redimensionado
useResizeObserver(elementRef, checkTruncation)

// Verifica quando o conteúdo muda
watch(() => props.lines, () => {
  nextTick(checkTruncation)
})

// Mobile: abre/fecha com tap
function handleClick() {
  if (isMobile.value && isTruncated.value) {
    isOpen.value = !isOpen.value
  }
}

// Mobile: fecha ao clicar fora
onClickOutside(elementRef, () => {
  if (isMobile.value) {
    isOpen.value = false
  }
})
</script>

<template>
  <!-- Modo break-all: apenas quebra linha, sem truncate -->
  <template v-if="breakAll">
    <component v-if="html" :is="as" :class="breakAllClass" v-html="html" />
    <component v-else :is="as" :class="breakAllClass">
      <slot />
    </component>
  </template>

  <!-- Modo truncate: com tooltip -->
  <TooltipProvider v-else :delay-duration="300">
    <Tooltip
      :disabled="!isTruncated"
      :open="isMobile ? isOpen : undefined"
      :disable-hoverable-content="isMobile"
    >
      <TooltipTrigger as-child>
        <component
          v-if="html"
          :is="as"
          ref="elementRef"
          :class="truncateClass"
          @click="handleClick"
          v-html="html"
        />
        <component
          v-else
          :is="as"
          ref="elementRef"
          :class="truncateClass"
          @click="handleClick"
        >
          <slot />
        </component>
      </TooltipTrigger>
      <TooltipContent
        v-if="isTruncated"
        side="top"
        class="max-w-md break-words"
        :side-offset="isMobile ? 8 : 4"
      >
        <template v-if="html">{{ plainText }}</template>
        <slot v-else />
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>

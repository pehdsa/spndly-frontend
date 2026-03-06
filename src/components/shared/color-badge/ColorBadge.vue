<script setup lang="ts">
import { computed } from 'vue'
import { getColorById } from '@/lib/colors'

interface Props {
  label: string
  colorId: number
}

const props = defineProps<Props>()

const color = computed(() => getColorById(props.colorId))

const style = computed(() => ({
  backgroundColor: `${color.value}15`,
  borderColor: `${color.value}33`,
  color: color.value,
}))
</script>

<template>
  <span
    :style="style"
    class="inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap"
  >
    {{ label }}
  </span>
</template>

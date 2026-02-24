<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  country?: string
  countryName?: string
}

const props = defineProps<Props>()

const flagUrl = computed(() => {
  if (!props.country) return ''
  return `https://flagcdn.com/w40/${props.country.toLowerCase()}.png`
})
</script>

<template>
  <span class="bg-foreground/20 flex h-4 w-6 overflow-hidden rounded-sm">
    <img v-if="country" :src="flagUrl" :alt="countryName" :title="countryName" />
  </span>
</template>

<script setup lang="ts">
    import type { Component } from 'vue'
    import { Card } from '@/components/ui/card'
    import { cn } from '@/lib/utils'

    interface AppSummaryCardProps {
    title: string
    description: string
    icon?: Component | null
    iconColor?: string
    iconBgColor?: string
    }

    const props = withDefaults(defineProps<AppSummaryCardProps>(), {
    iconColor: 'text-muted-foreground',
    iconBgColor: 'bg-muted',
    })

    const iconBgClass = cn('flex size-10 items-center justify-center rounded-lg', props.iconBgColor)
    const iconClass = cn('size-5', props.iconColor)
</script>

<template>
  <Card class="flex flex-row items-center gap-4 p-4">
    <div v-if="icon" :class="iconBgClass">
      <component :is="icon" :class="iconClass" />
    </div>
    <div>
      <p class="text-sm text-muted-foreground leading-3">{{ title }}</p>
      <p class="text-2xl font-semibold leading-7">{{ description }}</p>
    </div>
  </Card>
</template>
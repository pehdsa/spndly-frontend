<script setup lang="ts">
import { computed, useSlots } from 'vue'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'

interface Props {
  open: boolean
  loading?: boolean
  title: string
  description?: string
  confirmText?: string
  confirmLoadingText?: string
  cancelText?: string
  variant?: 'default' | 'destructive'
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  variant: 'destructive',
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  'confirm': []
}>()

const slots = useSlots()

const displayConfirmText = computed(() => {
  if (props.loading) {
    if (props.confirmLoadingText) {
      return props.confirmLoadingText
    }
    // Auto-generate loading text: "Excluir" -> "Excluindo...", "Remover" -> "Removendo..."
    const text = props.confirmText
    if (text.endsWith('ir')) {
      return text.slice(0, -2) + 'indo...'
    }
    if (text.endsWith('ar')) {
      return text.slice(0, -2) + 'ando...'
    }
    if (text.endsWith('er')) {
      return text.slice(0, -2) + 'endo...'
    }
    return text + '...'
  }
  return props.confirmText
})

const hasContent = computed(() => props.description || slots.default)
</script>

<template>
  <AlertDialog :open="open" @update:open="emit('update:open', $event)">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ title }}</AlertDialogTitle>
        <AlertDialogDescription v-if="hasContent" as="div">
          <span v-if="description">{{ description }}</span>
          <slot />
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel :disabled="loading">
          {{ cancelText }}
        </AlertDialogCancel>
        <AlertDialogAction
          :disabled="loading"
          :class="cn(
            variant === 'destructive' && 'bg-destructive text-white dark:text-destructive-foreground hover:bg-destructive/90'
          )"
          @click="emit('confirm')"
        >
          {{ displayConfirmText }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

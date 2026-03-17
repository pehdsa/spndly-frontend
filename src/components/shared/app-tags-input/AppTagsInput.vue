<script setup lang="ts">
import { ref, computed } from 'vue'
import type { AcceptableInputValue } from 'reka-ui'
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from '@/components/ui/tags-input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { isValidBrCellphone, normalizePhoneDigits, formatBrPhone } from '@/lib/phone'

interface Props {
  id: string
  label?: string | null
  placeholder?: string | null
  error?: string | null
  disabled?: boolean
  mode?: 'email' | 'phone' | 'text'
}

const props = withDefaults(defineProps<Props>(), {
  label: null,
  placeholder: 'Digite e pressione Enter',
  error: null,
  disabled: false,
  mode: 'email',
})

const emit = defineEmits<{
  blur: []
}>()

const modelValue = defineModel<string[]>({ default: () => [] })
const localError = ref<string | null>(null)

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function showLocalError(message: string) {
  localError.value = message
  setTimeout(() => {
    localError.value = null
  }, 3000)
}

function validateAndNormalize(raw: string): { valid: boolean; normalized: string } {
  if (props.mode === 'phone') {
    const digits = normalizePhoneDigits(raw)
    if (!isValidBrCellphone(digits)) {
      showLocalError('Telefone inválido')
      return { valid: false, normalized: '' }
    }
    return { valid: true, normalized: digits }
  }

  if (props.mode === 'email') {
    const normalized = raw.trim().toLowerCase()
    if (!isValidEmail(normalized)) {
      showLocalError('Email inválido')
      return { valid: false, normalized: '' }
    }
    return { valid: true, normalized }
  }

  // mode === 'text'
  const trimmed = raw.trim()
  if (!trimmed) return { valid: false, normalized: '' }
  return { valid: true, normalized: trimmed }
}

function isDuplicate(normalized: string): boolean {
  if (props.mode === 'phone') {
    return modelValue.value.some((v) => normalizePhoneDigits(v) === normalized)
  }
  if (props.mode === 'email') {
    return modelValue.value.some((v) => v.toLowerCase() === normalized)
  }
  return modelValue.value.includes(normalized)
}

function getDuplicateMessage(): string {
  if (props.mode === 'phone') return 'Telefone já adicionado'
  if (props.mode === 'email') return 'Email já adicionado'
  return 'Item já adicionado'
}

function formatForDisplay(value: string): string {
  if (props.mode === 'phone') return formatBrPhone(value)
  return value
}

function handleUpdateModelValue(newValue: AcceptableInputValue[]) {
  const stringValues = newValue.map(String)

  if (stringValues.length > modelValue.value.length) {
    const addedValue = stringValues[stringValues.length - 1]
    if (!addedValue) return

    const { valid, normalized } = validateAndNormalize(addedValue)
    if (!valid) return

    if (isDuplicate(normalized)) {
      showLocalError(getDuplicateMessage())
      return
    }

    modelValue.value = [...modelValue.value, normalized]
  } else {
    modelValue.value = stringValues
  }
}

const displayError = computed(() => props.error || localError.value)
</script>

<template>
  <div>
    <div v-if="label" class="flex items-center">
      <Label
        :for="id"
        :class="
          cn({ 'text-red-500': displayError }, 'text-brand-gray dark:text-white text-sm font-inter mb-1')
        "
      >
        {{ label }}
      </Label>
      <slot name="label-right" />
    </div>

    <TagsInput
      :model-value="modelValue"
      :disabled="disabled"
      :add-on-blur="true"
      :class="cn({ 'border-red-500 focus-within:border-red-500': displayError })"
      @update:model-value="handleUpdateModelValue"
    >
      <TagsInputItem v-for="item in modelValue" :key="item" :value="item">
        <TagsInputItemText>{{ formatForDisplay(item) }}</TagsInputItemText>
        <TagsInputItemDelete />
      </TagsInputItem>

      <TagsInputInput
        :id="id"
        :placeholder="modelValue.length === 0 ? (placeholder ?? undefined) : undefined"
        :disabled="disabled"
        @blur="emit('blur')"
      />
    </TagsInput>

    <span v-if="displayError" class="text-red-500 text-xs block pt-1 px-1">
      {{ displayError }}
    </span>
  </div>
</template>

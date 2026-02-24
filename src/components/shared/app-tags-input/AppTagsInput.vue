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

interface Props {
  id: string
  label?: string | null
  placeholder?: string | null
  error?: string | null
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: null,
  placeholder: 'Digite e pressione Enter',
  error: null,
  disabled: false,
})

const emit = defineEmits<{
  blur: []
}>()

const modelValue = defineModel<string[]>({ default: () => [] })
const localError = ref<string | null>(null)

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function handleUpdateModelValue(newValue: AcceptableInputValue[]) {
  const stringValues = newValue.map(String)

  // Verifica se houve adição de novo valor
  if (stringValues.length > modelValue.value.length) {
    const addedEmail = stringValues[stringValues.length - 1]
    if (!addedEmail) return

    const normalizedEmail = addedEmail.trim().toLowerCase()

    // Valida email
    if (!isValidEmail(normalizedEmail)) {
      localError.value = 'Email inválido'
      setTimeout(() => {
        localError.value = null
      }, 3000)
      return // Não atualiza o model
    }

    // Verifica duplicado (com normalização)
    const existingEmails = modelValue.value.map((e) => e.toLowerCase())
    if (existingEmails.includes(normalizedEmail)) {
      localError.value = 'Email já adicionado'
      setTimeout(() => {
        localError.value = null
      }, 3000)
      return // Não atualiza o model
    }

    // Atualiza com email normalizado
    modelValue.value = [...modelValue.value, normalizedEmail]
  } else {
    // Remoção de tag - apenas atualiza
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
        <TagsInputItemText />
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

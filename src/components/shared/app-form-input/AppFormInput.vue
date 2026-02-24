<script setup lang="ts">
import { InputGroup, InputGroupInput } from '@/components/ui/input-group'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { computed, type HTMLAttributes, useAttrs } from 'vue'
import { vMaska } from 'maska/vue'
import { type MaskaConfig, type MaskaType, useMaska } from '@/composables/useMaska'

interface Props {
  id: string
  label?: string | null
  type?: string
  placeholder?: string | null
  error?: string | null
  mask?: MaskaType | MaskaConfig
  groupClass?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  label: null,
  type: 'text',
  placeholder: null,
  error: null,
  mask: undefined,
  groupClass: '',
})

const emit = defineEmits<{
  blur: [event: FocusEvent]
}>()

const modelValue = defineModel<string | number>()

const { getMaskaConfig } = useMaska()
const getMask = computed(() => {
  if (props.mask && typeof props.mask === 'object') {
    return props.mask
  }

  if (typeof props.mask === 'string') {
    return getMaskaConfig(props.mask as MaskaType)
  }

  return undefined
})

// Get attrs excluding onBlur to avoid duplicate event handling
const attrs = useAttrs()
const filteredAttrs = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onBlur, ...rest } = attrs
  return rest
})

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <div>
    <div v-if="label" class="flex items-center">
      <Label
        :for="id"
        :class="cn({ 'text-red-500': error }, 'text-brand-gray dark:text-white text-sm font-inter mb-1')"
      >
        {{ label }}
      </Label>
      <slot name="label-right" />
    </div>
    <InputGroup :class="groupClass">
      <InputGroupInput
        :id="id"
        v-model="modelValue"
        v-maska="getMask"
        :placeholder="placeholder ?? undefined"
        :aria-invalid="!!error"
        :class="cn({ 'text-red-500': error }, 'font-inter')"
        :type="type"
        v-bind="filteredAttrs"
        @blur="handleBlur"
      />
      <slot name="addons" />
    </InputGroup>
    <span v-if="error" class="text-red-500 text-xs block pt-1 px-1">{{ error }}</span>
  </div>
</template>

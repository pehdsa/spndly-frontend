<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import { ptBR } from 'date-fns/locale'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useTheme } from '@/composables/useTheme'

type ModelValue = Date | Date[] | string | string[] | null | undefined

interface Props {
  id: string
  label?: string | null
  placeholder?: string | null
  error?: string | null
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  autoApply?: boolean
  range?: boolean
  multiDates?: boolean
  monthPicker?: boolean
  yearPicker?: boolean
  timePicker?: boolean
  enableTimePicker?: boolean
  textInput?: boolean
  inline?: boolean
  format?: string
  formats?: {
    month?: string, 
    year?: string, 
    weekDay?: string,
    quarter?: string,
    day?: string,
    input?: string,
    preview?: string,
  }
  modelType?: 'timestamp' | 'format' | 'iso' | string
  minDate?: Date | string
  maxDate?: Date | string
  weekStart?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  teleport?: boolean | string | HTMLElement
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  label: null,
  placeholder: 'Selecione uma data',
  error: null,
  disabled: false,
  readonly: false,
  clearable: true,
  autoApply: true,
  range: false,
  multiDates: false,
  monthPicker: false,
  yearPicker: false,
  timePicker: false,
  enableTimePicker: false,
  textInput: false,
  inline: false,
  format: 'dd/MM/yyyy',
  formats: undefined,
  modelType: undefined,
  minDate: undefined,
  maxDate: undefined,
  weekStart: 0,
  teleport: 'body',
  class: '',
})

const emit = defineEmits<{
  blur: []
  focus: []
  open: []
  closed: []
  cleared: []
}>()

const modelValue = defineModel<ModelValue>()

const { theme } = useTheme()
const isDark = computed(() => theme.value === 'dark')

const inputFormat = computed(() => {
  if (props.timePicker) return 'HH:mm'
  if (props.monthPicker) return 'MM/yyyy'
  if (props.yearPicker) return 'yyyy'
  if (props.enableTimePicker) return 'dd/MM/yyyy HH:mm'
  return props.format
})

const timeConfig = computed(() => ({
  enableTimePicker: props.timePicker || props.enableTimePicker,
}))
</script>

<template>
  <div :class="cn('w-full', props.class)">
    <div v-if="label" class="flex items-center">
      <Label
        :for="id"
        :class="cn({ 'text-red-500': error }, 'text-brand-gray dark:text-white text-sm font-inter mb-1')"
      >
        {{ label }}
      </Label>
      <slot name="label-right" />
    </div>
    <VueDatePicker
      :uid="id"
      v-model="modelValue"
      :locale="ptBR"
      :dark="isDark"
      :placeholder="placeholder ?? undefined"
      :disabled="disabled"
      :readonly="readonly"
      :clearable="clearable"
      :auto-apply="autoApply"
      :range="range"
      :multi-dates="multiDates"
      :month-picker="monthPicker"
      :year-picker="yearPicker"
      :time-picker="timePicker"
      :time-config="timeConfig"
      :text-input="textInput"
      :inline="inline"
      :format="inputFormat"
      :formats="formats"
      :model-type="modelType"
      :min-date="minDate"
      :max-date="maxDate"
      :week-start="weekStart"
      :teleport="teleport"
      :no-today="false"
      :input-class-name="error ? 'dp-input-error' : ''"
      @blur="emit('blur')"
      @focus="emit('focus')"
      @open="emit('open')"
      @closed="emit('closed')"
      @cleared="emit('cleared')"
    />
    <!-- Slots disponíveis se precisar customizar:
      #input-icon, #clear-icon, #action-row
    -->
    <span v-if="error" class="text-red-600 text-xs block pt-1 px-1">{{ error }}</span>
  </div>
</template>

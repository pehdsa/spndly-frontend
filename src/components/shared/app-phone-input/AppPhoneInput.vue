<script setup lang="ts">
import { ref } from 'vue'
import PhoneInput from 'base-vue-phone-input'
import { useFocus } from '@vueuse/core'
import { ChevronsUpDown } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import FlagIcon from './FlagIcon.vue'

interface Props {
  id: string
  label?: string | null
  placeholder?: string | null
  error?: string | null
  disabled?: boolean
  defaultCountry?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: null,
  placeholder: null,
  error: null,
  disabled: false,
  defaultCountry: 'US',
})

const emit = defineEmits<{
  blur: [event: FocusEvent]
}>()

const modelValue = defineModel<string>()

const open = ref(false)
const phoneInput = ref<HTMLInputElement | null>(null)
const { focused } = useFocus(phoneInput)

// Extrai o código do país e número nacional do valor E.164
function parseE164(value: string): { country?: string; nationalNumber: string } {
  if (!value) return { nationalNumber: '' }

  // Remove o + inicial
  const digits = value.replace(/\D/g, '')

  // Detecta país pelo prefixo
  // US/Canada: +1 (1 dígito DDI, 10 dígitos número)
  if (digits.startsWith('1') && digits.length === 11) {
    return { country: 'US', nationalNumber: digits.slice(1) }
  }
  // Brasil: +55 (2 dígitos DDI, 10-11 dígitos número)
  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) {
    return { country: 'BR', nationalNumber: digits.slice(2) }
  }

  // Fallback: retorna o valor original sem o +
  return { nationalNumber: digits }
}

const parsed = parseE164(modelValue.value || '')

// Valor interno para a biblioteca (apenas número nacional)
const internalValue = ref(parsed.nationalNumber)

// Inicializa com país detectado do E.164 ou defaultCountry
const countryCode = ref(parsed.country || props.defaultCountry)

interface PhoneResult {
  e164?: string
  formatInternational?: string
  formatNational?: string
  countryCallingCode?: string
  nationalNumber?: string
  isValid?: boolean
  country?: string
}

const handleUpdate = (result: PhoneResult) => {
  // Se tem e164 válido, usa ele
  if (result.e164) {
    modelValue.value = result.e164
  } else if (internalValue.value) {
    // Se usuário digitou algo mas não é válido, passa valor inválido para falhar validação
    modelValue.value = 'invalid'
  } else {
    // Campo vazio
    modelValue.value = ''
  }
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

// Bloqueia teclas que não são números
const handleKeyPress = (e: KeyboardEvent) => {
  // Permite apenas números (0-9)
  if (!/^\d$/.test(e.key)) {
    e.preventDefault()
  }
}
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

    <PhoneInput
      v-model="internalValue"
      v-model:country-code="countryCode"
      no-use-browser-locale
      class="flex"
      country-locale="en-EN"
      :ignored-countries="['AC']"
      :disabled="disabled"
      @update="handleUpdate"
    >
      <template #selector="{ inputValue, updateInputValue, countries }">
        <Popover v-model:open="open">
          <PopoverTrigger as-child>
            <Button
              variant="outline"
              :disabled="disabled"
              class="flex gap-1 rounded-e-none rounded-s-lg px-3 border-r-0"
            >
              <FlagIcon :country="inputValue || defaultCountry" />
              <ChevronsUpDown class="-mr-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-[300px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search country..." />
              <CommandList>
                <CommandEmpty>No country found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    v-for="option in countries"
                    :key="option.iso2"
                    :value="option.name"
                    class="gap-2"
                    @select="
                      () => {
                        updateInputValue(option.iso2)
                        open = false
                        focused = true
                      }
                    "
                  >
                    <FlagIcon :country="option?.iso2" />
                    <span class="flex-1 text-sm">{{ option.name }}</span>
                    <span class="text-foreground/50 text-sm">{{ option.dialCode }}</span>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </template>

      <template #input="{ inputValue, updateInputValue, placeholder: phonePlaceholder }">
        <Input
          :id="id"
          ref="phoneInput"
          class="rounded-e-lg rounded-s-none font-inter"
          :class="cn({ 'text-red-500 border-red-500': error })"
          type="tel"
          inputmode="numeric"
          :model-value="inputValue"
          :placeholder="placeholder ?? phonePlaceholder?.replace('Example: ', '')"
          :disabled="disabled"
          :aria-invalid="!!error"
          @input="updateInputValue"
          @keypress="handleKeyPress"
          @blur="handleBlur"
        />
      </template>
    </PhoneInput>

    <span v-if="error" class="text-red-500 text-xs block pt-1 px-1">{{ error }}</span>
  </div>
</template>

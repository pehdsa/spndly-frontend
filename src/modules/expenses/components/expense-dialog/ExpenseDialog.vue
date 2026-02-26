<script setup lang="ts">
import { watch, computed } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { AppFormInput } from '@/components/shared/app-form-input'
import { cn } from '@/lib/utils'
import { toast } from 'vue-sonner'
import type { AxiosError } from 'axios'
import { useForm, useErrorHandler, type ErrorResponse } from '@/composables'
import { useMaska } from '@/composables/useMaska'
import { useCreateExpense, useUpdateExpense, type Expense } from '@/services/expenses'
import { useCategories } from '@/services/categories'
import { usePaymentMethods } from '@/services/payment-methods'
import { expenseSchema, type ExpenseInput } from './schema'

interface Props {
  expense?: Expense
}

const props = defineProps<Props>()

const open = defineModel<boolean>('open', { default: false })

const isEditing = () => !!props.expense

const { mutate: createExpense, isPending: isCreating } = useCreateExpense()
const { mutate: updateExpense, isPending: isUpdating } = useUpdateExpense()
const { handleError } = useErrorHandler()
const { formatValue, parseValue } = useMaska()

const isPending = () => isCreating.value || isUpdating.value

const { data: categoriesData } = useCategories({
  params: { per_page: 100, sort: 'name:asc' },
})

const { data: paymentMethodsData } = usePaymentMethods({
  params: { per_page: 100, sort: 'name:asc' },
})

const categoryOptions = computed(() =>
  categoriesData.value?.data.map((c) => ({ label: c.name, value: String(c.id) })) ?? [],
)

const paymentMethodOptions = computed(() =>
  paymentMethodsData.value?.data.map((pm) => ({ label: pm.name, value: String(pm.id) })) ?? [],
)

function centsToDisplay(cents: number): string {
  return formatValue(cents / 100, 'money:2')
}

function displayToCents(display: string): number {
  const parsed = parseValue(display, 'money:2') as number | null
  if (parsed === null || parsed <= 0) return 0
  return Math.round(parsed * 100)
}

const form = useForm({
  defaultValues: {
    amount: '',
    description: '',
    category_id: 0,
    payment_method_id: 0,
  } as ExpenseInput,
  validators: {
    onSubmit: expenseSchema,
  },
  onSubmit: async ({ value }) => {
    const amountCents = displayToCents(value.amount)

    if (amountCents <= 0) {
      toast.error('Valor inválido', { description: 'O valor deve ser maior que zero' })
      return
    }

    const payload = {
      category_id: value.category_id,
      payment_method_id: value.payment_method_id,
      description: value.description || null,
      amount_cents: amountCents,
    }

    if (isEditing()) {
      updateExpense(
        { id: props.expense!.id, data: payload },
        {
          onSuccess: () => {
            open.value = false
            toast.success('Despesa atualizada com sucesso')
          },
          onError: (error) => {
            handleError(error as AxiosError<ErrorResponse>)
          },
        },
      )
    } else {
      createExpense(payload, {
        onSuccess: () => {
          open.value = false
          toast.success('Despesa criada com sucesso')
        },
        onError: (error) => {
          handleError(error as AxiosError<ErrorResponse>)
        },
      })
    }
  },
})

watch(open, (isOpen) => {
  if (isOpen && props.expense) {
    form.setFieldValue('amount', centsToDisplay(props.expense.amount_cents))
    form.setFieldValue('description', props.expense.description ?? '')
    form.setFieldValue('category_id', props.expense.category.id)
    form.setFieldValue('payment_method_id', props.expense.payment_method.id)
  } else if (!isOpen) {
    form.reset()
  }
})
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{{ isEditing() ? 'Editar despesa' : 'Nova despesa' }}</DialogTitle>
        <DialogDescription>
          {{ isEditing() ? 'Altere os dados da despesa.' : 'Preencha os dados para registrar uma nova despesa.' }}
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent.stop="form.handleSubmit">
        <div class="flex flex-col gap-4 pb-4">
          <form.Field name="amount">
            <template #default="{ field }">
              <AppFormInput
                id="expense-amount"
                label="Valor *"
                placeholder="0,00"
                mask="money:2"
                :disabled="isPending()"
                :model-value="field.state.value"
                :error="field.state.meta.errors[0]?.message"
                @update:model-value="(val) => field.handleChange(val as string)"
                @blur="field.handleBlur"
              />
            </template>
          </form.Field>

          <form.Field name="description">
            <template #default="{ field }">
              <AppFormInput
                id="expense-description"
                label="Descrição"
                placeholder="Descrição da despesa (opcional)"
                :disabled="isPending()"
                :model-value="field.state.value"
                :error="field.state.meta.errors[0]?.message"
                @update:model-value="(val) => field.handleChange(val as string)"
                @blur="field.handleBlur"
              />
            </template>
          </form.Field>

          <form.Field name="category_id">
            <template #default="{ field }">
              <div>
                <Label
                  for="expense-category"
                  :class="cn({ 'text-red-500': field.state.meta.errors[0]?.message }, 'text-brand-gray dark:text-white text-sm font-inter mb-1')"
                >
                  Categoria *
                </Label>
                <Select
                  :model-value="field.state.value ? String(field.state.value) : undefined"
                  :disabled="isPending()"
                  @update:model-value="(val) => field.handleChange(Number(val))"
                >
                  <SelectTrigger
                    id="expense-category"
                    class="w-full"
                    :class="cn({ 'border-red-500': field.state.meta.errors[0]?.message })"
                  >
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="option in categoryOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <span v-if="field.state.meta.errors[0]?.message" class="text-red-500 text-xs block pt-1 px-1">
                  {{ field.state.meta.errors[0]?.message }}
                </span>
              </div>
            </template>
          </form.Field>

          <form.Field name="payment_method_id">
            <template #default="{ field }">
              <div>
                <Label
                  for="expense-payment-method"
                  :class="cn({ 'text-red-500': field.state.meta.errors[0]?.message }, 'text-brand-gray dark:text-white text-sm font-inter mb-1')"
                >
                  Método de Pagamento *
                </Label>
                <Select
                  :model-value="field.state.value ? String(field.state.value) : undefined"
                  :disabled="isPending()"
                  @update:model-value="(val) => field.handleChange(Number(val))"
                >
                  <SelectTrigger
                    id="expense-payment-method"
                    class="w-full"
                    :class="cn({ 'border-red-500': field.state.meta.errors[0]?.message })"
                  >
                    <SelectValue placeholder="Selecione um método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="option in paymentMethodOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <span v-if="field.state.meta.errors[0]?.message" class="text-red-500 text-xs block pt-1 px-1">
                  {{ field.state.meta.errors[0]?.message }}
                </span>
              </div>
            </template>
          </form.Field>
        </div>

        <DialogFooter class="pt-2">
          <Button type="button" variant="outline" :disabled="isPending()" @click="open = false">
            Cancelar
          </Button>
          <Button type="submit" :disabled="isPending()">
            {{ isPending() ? 'Salvando...' : isEditing() ? 'Salvar' : 'Criar' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

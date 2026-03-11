<script setup lang="ts">
import { watch } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AppFormInput } from '@/components/shared/app-form-input'
import { toast } from 'vue-sonner'
import type { AxiosError } from 'axios'
import { useForm, useErrorHandler, type ErrorResponse } from '@/composables'
import {
  useCreatePaymentMethod,
  useUpdatePaymentMethod,
  type PaymentMethod,
} from '@/services/payment-methods'
import { paymentMethodSchema, type PaymentMethodInput } from './schema'

interface Props {
  paymentMethod?: PaymentMethod
}

const props = defineProps<Props>()

const open = defineModel<boolean>('open', { default: false })

const isEditing = () => !!props.paymentMethod

const { mutate: createPaymentMethod, isPending: isCreating } = useCreatePaymentMethod()
const { mutate: updatePaymentMethod, isPending: isUpdating } = useUpdatePaymentMethod()
const { handleError } = useErrorHandler()

const isPending = () => isCreating.value || isUpdating.value

const form = useForm({
  defaultValues: {
    name: '',
    description: '',
  } as PaymentMethodInput,
  validators: {
    onSubmit: paymentMethodSchema,
  },
  onSubmit: async ({ value }) => {
    const payload = {
      name: value.name,
      description: value.description || null,
    }

    if (isEditing()) {
      updatePaymentMethod(
        { id: props.paymentMethod!.id, data: payload },
        {
          onSuccess: () => {
            open.value = false
            toast.success('Método de pagamento atualizado com sucesso')
          },
          onError: (error) => {
            handleError(error as AxiosError<ErrorResponse>)
          },
        },
      )
    } else {
      createPaymentMethod(payload, {
        onSuccess: () => {
          open.value = false
          toast.success('Método de pagamento criado com sucesso')
        },
        onError: (error) => {
          handleError(error as AxiosError<ErrorResponse>)
        },
      })
    }
  },
})

watch(open, (isOpen) => {
  if (isOpen && props.paymentMethod) {
    form.setFieldValue('name', props.paymentMethod.name)
    form.setFieldValue('description', props.paymentMethod.description ?? '')
  } else if (!isOpen) {
    form.reset()
  }
})
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{{ isEditing() ? 'Editar método de pagamento' : 'Novo método de pagamento' }}</DialogTitle>
        <DialogDescription>
          {{ isEditing() ? 'Altere os dados do método de pagamento.' : 'Preencha os dados para criar um novo método de pagamento.' }}
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent.stop="form.handleSubmit">
        <div class="flex flex-col gap-4 pb-4">
          <form.Field name="name">
            <template #default="{ field }">
              <AppFormInput
                id="payment-method-name"
                label="Nome *"
                placeholder="Nome do método de pagamento"
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
                id="payment-method-description"
                label="Descrição"
                placeholder="Descrição do método (opcional)"
                :disabled="isPending()"
                :model-value="field.state.value"
                :error="field.state.meta.errors[0]?.message"
                @update:model-value="(val) => field.handleChange(val as string)"
                @blur="field.handleBlur"
              />
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

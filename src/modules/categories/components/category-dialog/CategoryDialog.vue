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
  useCreateCategory,
  useUpdateCategory,
  type Category,
} from '@/services/categories'
import { categorySchema, type CategoryInput } from './schema'

interface Props {
  category?: Category
}

const props = defineProps<Props>()

const open = defineModel<boolean>('open', { default: false })

const isEditing = () => !!props.category

const { mutate: createCategory, isPending: isCreating } = useCreateCategory()
const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory()
const { handleError } = useErrorHandler()

const isPending = () => isCreating.value || isUpdating.value

const form = useForm({
  defaultValues: {
    name: '',
    description: '',
  } as CategoryInput,
  validators: {
    onSubmit: categorySchema,
  },
  onSubmit: async ({ value }) => {
    const payload = {
      name: value.name,
      description: value.description || null,
    }

    if (isEditing()) {
      updateCategory(
        { id: props.category!.id, data: payload },
        {
          onSuccess: () => {
            open.value = false
            toast.success('Categoria atualizada com sucesso')
          },
          onError: (error) => {
            handleError(error as AxiosError<ErrorResponse>)
          },
        },
      )
    } else {
      createCategory(payload, {
        onSuccess: () => {
          open.value = false
          toast.success('Categoria criada com sucesso')
        },
        onError: (error) => {
          handleError(error as AxiosError<ErrorResponse>)
        },
      })
    }
  },
})

watch(open, (isOpen) => {
  if (isOpen && props.category) {
    form.setFieldValue('name', props.category.name)
    form.setFieldValue('description', props.category.description ?? '')
  } else if (!isOpen) {
    form.reset()
  }
})
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{{ isEditing() ? 'Editar categoria' : 'Nova categoria' }}</DialogTitle>
        <DialogDescription>
          {{ isEditing() ? 'Altere os dados da categoria.' : 'Preencha os dados para criar uma nova categoria.' }}
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent.stop="form.handleSubmit">
        <div class="flex flex-col gap-4 pb-4">
          <form.Field name="name">
            <template #default="{ field }">
              <AppFormInput
                id="category-name"
                label="Nome *"
                placeholder="Nome da categoria"
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
                id="category-description"
                label="Descrição"
                placeholder="Descrição da categoria (opcional)"
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

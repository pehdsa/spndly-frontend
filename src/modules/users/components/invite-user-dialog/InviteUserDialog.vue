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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { AppTagsInput } from '@/components/shared/app-tags-input'
import { cn } from '@/lib/utils'
import { formatBrPhone, normalizePhoneDigits } from '@/lib/phone'
import { toast } from 'vue-sonner'
import type { AxiosError } from 'axios'
import { useForm, useErrorHandler, type ErrorResponse } from '@/composables'
import { useCreateInvitation, type BulkInvitationResponse } from '@/services/users'
import { invitationSchema, type InvitationInput } from '@/modules/users/schemas/invitation.schema'
import { USER_ROLES, USER_ROLE_LABELS, type UserRole } from '@/modules/users/constants'

const roleOptions = [
  { value: USER_ROLES.ADMIN, label: USER_ROLE_LABELS[USER_ROLES.ADMIN] },
  { value: USER_ROLES.CLIENT, label: USER_ROLE_LABELS[USER_ROLES.CLIENT] },
]

const open = defineModel<boolean>('open', { default: false })

const { mutate: createInvitation, isPending } = useCreateInvitation()
const { handleError } = useErrorHandler()

function formatFailedPhones(failed: BulkInvitationResponse['failed']): string {
  const maxErrors = 10
  const displayedErrors = failed.slice(0, maxErrors)
  const lines = displayedErrors.map((f) => `${formatBrPhone(f.phone_number)} - ${f.reason}`)

  if (failed.length > maxErrors) {
    lines.push(`... e mais ${failed.length - maxErrors} erro(s)`)
  }

  return lines.join('\n')
}

function isBulkInvitationResponse(data: unknown): data is BulkInvitationResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'sent' in data &&
    'failed' in data &&
    Array.isArray((data as BulkInvitationResponse).failed)
  )
}

function handleBulkError(error: AxiosError<ErrorResponse>): boolean {
  const responseData = error.response?.data as { data?: unknown } | undefined
  const data = responseData?.data

  if (isBulkInvitationResponse(data)) {
    handleBulkResponse(data)
    return true
  }

  return false
}

function handleBulkResponse(response: BulkInvitationResponse) {
  const { sent, failed } = response

  if (failed.length === 0) {
    open.value = false
    form.reset()
    const msg =
      sent.length === 1
        ? 'Convite enviado com sucesso'
        : `${sent.length} convites enviados com sucesso`
    toast.success(msg)
    return
  }

  if (sent.length === 0) {
    toast.error('Falha ao enviar convites', {
      description: formatFailedPhones(failed),
      duration: 8000,
    })
    return
  }

  open.value = false
  form.reset()
  toast.success(`${sent.length} convite(s) enviado(s)`)
  toast.warning('Alguns telefones falharam', {
    description: formatFailedPhones(failed),
    duration: 8000,
  })
}

function onMutationError(error: Error) {
  const axiosError = error as AxiosError<ErrorResponse>
  if (!handleBulkError(axiosError)) {
    handleError(axiosError)
  }
}

const form = useForm({
  defaultValues: {
    phone_numbers: [] as string[],
    role: undefined as unknown as UserRole,
  } as InvitationInput,
  validators: {
    onSubmit: invitationSchema,
  },
  onSubmit: async ({ value }) => {
    createInvitation(
      {
        phone_numbers: value.phone_numbers.map(normalizePhoneDigits),
        role: value.role,
      },
      {
        onSuccess: handleBulkResponse,
        onError: onMutationError,
      },
    )
  },
})

watch(open, (isOpen) => {
  if (!isOpen) {
    form.reset()
  }
})
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Convidar usuários</DialogTitle>
        <DialogDescription>
          Envie convites por telefone para novos usuários.
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent.stop="form.handleSubmit">
        <div class="flex flex-col gap-4 pb-4">
          <form.Field name="phone_numbers">
            <template #default="{ field }">
              <AppTagsInput
                id="invitation-phones"
                label="Telefones *"
                placeholder="Digite um telefone e pressione Enter"
                mode="phone"
                :disabled="isPending"
                :model-value="field.state.value"
                :error="field.state.meta.errors[0]?.message"
                @update:model-value="(val) => field.handleChange(val)"
                @blur="field.handleBlur"
              />
            </template>
          </form.Field>

          <form.Field name="role">
            <template #default="{ field }">
              <div>
                <Label
                  for="invitation-role"
                  :class="cn({ 'text-red-500': field.state.meta.errors[0]?.message }, 'text-brand-gray dark:text-white text-sm font-inter mb-1')"
                >
                  Função *
                </Label>
                <Select
                  :model-value="field.state.value"
                  :disabled="isPending"
                  @update:model-value="(val) => field.handleChange(val as UserRole)"
                >
                  <SelectTrigger
                    id="invitation-role"
                    class="w-full"
                    :class="cn({ 'border-red-500': field.state.meta.errors[0]?.message })"
                  >
                    <SelectValue placeholder="Selecione uma função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="option in roleOptions" :key="option.value" :value="option.value">
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
          <Button type="button" variant="outline" :disabled="isPending" @click="open = false">
            Cancelar
          </Button>
          <Button type="submit" :disabled="isPending">
            {{ isPending ? 'Enviando...' : 'Enviar convites' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

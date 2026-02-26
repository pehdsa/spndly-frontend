<script setup lang="ts">
import { ref } from 'vue'
import { Pencil, Trash2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { AppConfirmDialog } from '@/components/shared/app-confirm-dialog'
import { toast } from 'vue-sonner'
import type { AxiosError } from 'axios'
import { useErrorHandler, type ErrorResponse } from '@/composables'
import { useDeletePaymentMethod, type PaymentMethod } from '@/services/payment-methods'
import { PaymentMethodDialog } from '@/modules/payment-methods/components/payment-method-dialog'

interface Props {
  paymentMethod: PaymentMethod
}

const props = defineProps<Props>()

const deleteDialogOpen = ref(false)
const editDialogOpen = ref(false)

const { handleError } = useErrorHandler()
const { mutate: deletePaymentMethod, isPending: isDeleting } = useDeletePaymentMethod()

function handleDelete() {
  deletePaymentMethod(props.paymentMethod.id, {
    onSuccess: () => {
      deleteDialogOpen.value = false
      toast.success('Método de pagamento excluído com sucesso')
    },
    onError: (error) => {
      handleError(error as AxiosError<ErrorResponse>)
    },
  })
}
</script>

<template>
  <div class="flex items-center gap-1">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger as-child>
          <Button
            variant="ghost"
            size="icon"
            class="h-8 w-8 p-0 text-accent-foreground hover:text-foreground"
            aria-label="Editar método de pagamento"
            @click="editDialogOpen = true"
          >
            <Pencil class="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Editar</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger as-child>
          <Button
            variant="ghost"
            size="icon"
            class="h-8 w-8 text-red-500 hover:text-red-500"
            aria-label="Excluir método de pagamento"
            @click="deleteDialogOpen = true"
          >
            <Trash2 class="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Excluir</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>

  <AppConfirmDialog
    v-model:open="deleteDialogOpen"
    title="Excluir método de pagamento?"
    confirm-text="Excluir"
    :loading="isDeleting"
    @confirm="handleDelete"
  >
    Esta ação não pode ser desfeita. O método de pagamento
    <strong>{{ paymentMethod.name }}</strong> será removido permanentemente.
  </AppConfirmDialog>

  <PaymentMethodDialog v-model:open="editDialogOpen" :payment-method="paymentMethod" />
</template>

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
import { useDeleteExpense, type Expense } from '@/services/expenses'
import { ExpenseDialog } from '@/modules/expenses/components/expense-dialog'

interface Props {
  expense: Expense
}

const props = defineProps<Props>()

const deleteDialogOpen = ref(false)
const editDialogOpen = ref(false)

const { handleError } = useErrorHandler()
const { mutate: deleteExpense, isPending: isDeleting } = useDeleteExpense()

function handleDelete() {
  deleteExpense(props.expense.id, {
    onSuccess: () => {
      deleteDialogOpen.value = false
      toast.success('Despesa excluída com sucesso')
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
            aria-label="Editar despesa"
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
            aria-label="Excluir despesa"
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
    title="Excluir despesa?"
    confirm-text="Excluir"
    :loading="isDeleting"
    @confirm="handleDelete"
  >
    Esta ação não pode ser desfeita. A despesa será removida permanentemente.
  </AppConfirmDialog>

  <ExpenseDialog v-model:open="editDialogOpen" :expense="expense" />
</template>

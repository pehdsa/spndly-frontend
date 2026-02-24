<script setup lang="ts">
import { ref } from 'vue'
import { Trash2, Copy, Check } from 'lucide-vue-next'
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
import type { Invitation } from '@/services/users'
import { useDeleteInvitation } from '@/services/users'

interface Props {
  invitation: Invitation
}

const props = defineProps<Props>()

const deleteDialogOpen = ref(false)
const copied = ref(false)

const { handleError } = useErrorHandler()

const { mutate: deleteInvitation, isPending: isDeleting } = useDeleteInvitation()

function getInvitationUrl() {
  return `${window.location.origin}/register?token=${props.invitation.token}`
}

async function handleCopyLink() {
  await navigator.clipboard.writeText(getInvitationUrl())
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

function handleDelete() {
  deleteInvitation(props.invitation.id, {
    onSuccess: () => {
      deleteDialogOpen.value = false
      toast.success('Convite excluído com sucesso')
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
      <!-- Copy Link Button -->
      <Tooltip>
        <TooltipTrigger as-child>
          <Button
            variant="ghost"
            size="icon"
            class="h-8 w-8 p-0 text-accent-foreground hover:text-foreground"
            @click="handleCopyLink"
          >
            <Check v-if="copied" class="h-4 w-4 text-green-500" />
            <Copy v-else class="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{{ copied ? 'Copiado!' : 'Copiar link' }}</p>
        </TooltipContent>
      </Tooltip>

      <!-- Delete Button -->
      <Tooltip>
        <TooltipTrigger as-child>
          <Button
            variant="ghost"
            size="icon"
            class="h-8 w-8 text-red-500 hover:text-red-500 group-disabled:text-muted-foreground group-disabled:opacity-55"
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

  <!-- Delete Dialog -->
  <AppConfirmDialog
    v-model:open="deleteDialogOpen"
    title="Excluir convite?"
    confirm-text="Excluir"
    :loading="isDeleting"
    @confirm="handleDelete"
  >
    Esta ação não pode ser desfeita. O convite para
    <strong>{{ invitation.email }}</strong> será removido permanentemente.
  </AppConfirmDialog>
</template>

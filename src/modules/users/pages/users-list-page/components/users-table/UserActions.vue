<script setup lang="ts">
import { ref, watch } from 'vue'
import { Ban, CheckCircle, Trash2, UserCog } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { AppConfirmDialog } from '@/components/shared/app-confirm-dialog'
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
import { toast } from 'vue-sonner'
import type { AxiosError } from 'axios'
import { useErrorHandler, type ErrorResponse } from '@/composables'
import type { User, UserRole } from '@/services/users'
import { useBlockUser, useUnblockUser, useDeleteUser, useUpdateUserRole } from '@/services/users'
import { USER_ROLES, USER_ROLE_LABELS } from '@/modules/users/constants'

interface Props {
  user: User
}

const props = defineProps<Props>()

const blockDialogOpen = ref(false)
const unblockDialogOpen = ref(false)
const deleteDialogOpen = ref(false)
const roleDialogOpen = ref(false)
const selectedRole = ref<UserRole>(props.user.role)

const roleOptions = [
  { value: USER_ROLES.ADMIN, label: USER_ROLE_LABELS[USER_ROLES.ADMIN] },
  { value: USER_ROLES.CLIENT, label: USER_ROLE_LABELS[USER_ROLES.CLIENT] },
]

const { handleError } = useErrorHandler()

const { mutate: blockUser, isPending: isBlocking } = useBlockUser()
const { mutate: unblockUser, isPending: isUnblocking } = useUnblockUser()
const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser()
const { mutate: updateUserRole, isPending: isUpdatingRole } = useUpdateUserRole()

// Reset selected role when dialog opens
watch(roleDialogOpen, (isOpen) => {
  if (isOpen) {
    selectedRole.value = props.user.role
  }
})

function handleBlock() {
  blockUser(props.user.id, {
    onSuccess: () => {
      blockDialogOpen.value = false
      toast.success('Usuário bloqueado com sucesso')
    },
    onError: (error) => {
      handleError(error as AxiosError<ErrorResponse>)
    },
  })
}

function handleUnblock() {
  unblockUser(props.user.id, {
    onSuccess: () => {
      unblockDialogOpen.value = false
      toast.success('Usuário desbloqueado com sucesso')
    },
    onError: (error) => {
      handleError(error as AxiosError<ErrorResponse>)
    },
  })
}

function handleDelete() {
  deleteUser(props.user.id, {
    onSuccess: () => {
      deleteDialogOpen.value = false
      toast.success('Usuário excluído com sucesso')
    },
    onError: (error) => {
      handleError(error as AxiosError<ErrorResponse>)
    },
  })
}

function handleRoleChange() {
  if (selectedRole.value === props.user.role) {
    roleDialogOpen.value = false
    return
  }

  updateUserRole(
    { userId: props.user.id, data: { role: selectedRole.value } },
    {
      onSuccess: () => {
        roleDialogOpen.value = false
        toast.success('Função do usuário alterada com sucesso')
      },
      onError: (error) => {
        handleError(error as AxiosError<ErrorResponse>)
      },
    },
  )
}
</script>

<template>
  <div class="flex items-center gap-1">
    <TooltipProvider>
      <!-- Change Role Button -->
      <Tooltip>
        <TooltipTrigger as-child>
          <Button
            variant="ghost"
            size="icon"
            class="h-8 w-8 p-0 text-accent-foreground hover:text-foreground"
            @click="roleDialogOpen = true"
          >
            <UserCog class="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Alterar função</p>
        </TooltipContent>
      </Tooltip>

      <!-- Block/Unblock Button -->
      <Tooltip v-if="user.status === 'ACTIVE'">
        <TooltipTrigger as-child>
          <Button
            variant="ghost"
            size="icon"
            class="h-8 w-8 p-0 text-accent-foreground hover:text-foreground"
            @click="blockDialogOpen = true"
          >
            <Ban class="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Bloquear</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip v-else>
        <TooltipTrigger as-child>
          <Button
            variant="ghost"
            size="icon"
            class="h-8 w-8 p-0 text-accent-foreground hover:text-foreground"
            @click="unblockDialogOpen = true"
          >
            <CheckCircle class="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Desbloquear</p>
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

  <!-- Block Dialog -->
  <AppConfirmDialog
    v-model:open="blockDialogOpen"
    title="Bloquear usuário?"
    confirm-text="Bloquear"
    variant="destructive"
    :loading="isBlocking"
    @confirm="handleBlock"
  >
    O usuário <strong>{{ user.name }}</strong> será bloqueado e não poderá
    acessar o sistema até ser desbloqueado.
  </AppConfirmDialog>

  <!-- Unblock Dialog -->
  <AppConfirmDialog
    v-model:open="unblockDialogOpen"
    title="Desbloquear usuário?"
    confirm-text="Desbloquear"
    variant="default"
    :loading="isUnblocking"
    @confirm="handleUnblock"
  >
    O usuário <strong>{{ user.name }}</strong> será desbloqueado e poderá
    acessar o sistema novamente.
  </AppConfirmDialog>

  <!-- Delete Dialog -->
  <AppConfirmDialog
    v-model:open="deleteDialogOpen"
    title="Excluir usuário?"
    confirm-text="Excluir"
    :loading="isDeleting"
    @confirm="handleDelete"
  >
    Esta ação não pode ser desfeita. O usuário
    <strong>{{ user.name }}</strong> será removido permanentemente.
  </AppConfirmDialog>

  <!-- Change Role Dialog -->
  <Dialog v-model:open="roleDialogOpen">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Alterar função do usuário</DialogTitle>
        <DialogDescription>
          Selecione a nova função para <strong>{{ user.name }}</strong>.
        </DialogDescription>
      </DialogHeader>

      <div class="py-4">
        <Label for="user-role" class="text-brand-gray dark:text-white text-sm font-inter mb-1">
          Função *
        </Label>
        <Select v-model="selectedRole" :disabled="isUpdatingRole">
          <SelectTrigger id="user-role" class="w-full">
            <SelectValue placeholder="Selecione uma função" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="option in roleOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" :disabled="isUpdatingRole" @click="roleDialogOpen = false">
          Cancelar
        </Button>
        <Button type="button" :disabled="isUpdatingRole || selectedRole === user.role" @click="handleRoleChange">
          {{ isUpdatingRole ? 'Salvando...' : 'Salvar' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

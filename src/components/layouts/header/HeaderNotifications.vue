<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Bell,
  Check,
  Trash2,
  UserPlus,
  AlertCircle,
  CheckCircle2,
  Info,
  Settings,
  BellOff,
  type LucideIcon,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'

type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'user' | 'system'

interface Notification {
  id: string
  title: string
  description: string
  time: string
  date: Date
  read: boolean
  type: NotificationType
}

const typeConfig: Record<NotificationType, { icon: LucideIcon; color: string; bg: string }> = {
  info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  success: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
  warning: { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  error: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
  user: { icon: UserPlus, color: 'text-violet-500', bg: 'bg-violet-500/10' },
  system: { icon: Settings, color: 'text-slate-500', bg: 'bg-slate-500/10' },
}

const notifications = ref<Notification[]>([
  {
    id: '1',
    title: 'Novo usuário cadastrado',
    description: 'João Silva acabou de se cadastrar no sistema.',
    time: '5 min atrás',
    date: new Date(),
    read: false,
    type: 'user',
  },
  {
    id: '2',
    title: 'Relatório gerado com sucesso',
    description: 'O relatório mensal de vendas foi gerado.',
    time: '1 hora atrás',
    date: new Date(),
    read: false,
    type: 'success',
  },
  {
    id: '3',
    title: 'Atenção: Limite próximo',
    description: 'Você atingiu 90% do limite de armazenamento.',
    time: '2 horas atrás',
    date: new Date(),
    read: false,
    type: 'warning',
  },
  {
    id: '4',
    title: 'Atualização do sistema',
    description: 'Uma nova versão v2.1.0 está disponível para instalação.',
    time: 'Ontem',
    date: new Date(Date.now() - 86400000),
    read: true,
    type: 'system',
  },
  {
    id: '5',
    title: 'Backup concluído',
    description: 'O backup automático foi realizado com sucesso.',
    time: 'Ontem',
    date: new Date(Date.now() - 86400000),
    read: true,
    type: 'info',
  },
])

const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length)

const isToday = (date: Date) => {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

const todayNotifications = computed(() =>
  notifications.value.filter((n) => isToday(n.date))
)

const olderNotifications = computed(() =>
  notifications.value.filter((n) => !isToday(n.date))
)

const markAsRead = (id: string) => {
  const notification = notifications.value.find((n) => n.id === id)
  if (notification) {
    notification.read = true
  }
}

const markAllAsRead = () => {
  notifications.value.forEach((n) => {
    n.read = true
  })
}

const removeNotification = (id: string, event: Event) => {
  event.stopPropagation()
  notifications.value = notifications.value.filter((n) => n.id !== id)
}

const getTypeConfig = (type: NotificationType) => typeConfig[type]
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon" class="relative h-9 w-9">
        <Bell class="h-4 w-4" />
        <span
          v-if="unreadCount > 0"
          class="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground"
        >
          {{ unreadCount > 9 ? '9+' : unreadCount }}
        </span>
        <span class="sr-only">Notificações</span>
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent class="w-96 p-0" align="end">
      <!-- Header -->
      <div class="flex items-center justify-between border-b px-4 py-3">
        <div class="flex items-center gap-2">
          <h4 class="text-sm font-semibold">Notificações</h4>
          <span
            v-if="unreadCount > 0"
            class="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground"
          >
            {{ unreadCount }}
          </span>
        </div>
        <Button
          v-if="unreadCount > 0"
          variant="ghost"
          size="sm"
          class="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          @click="markAllAsRead"
        >
          <Check class="h-3 w-3" />
          Marcar todas
        </Button>
      </div>

      <!-- Content -->
      <ScrollArea class="h-[400px]">
        <div v-if="notifications.length > 0" class="divide-y">
          <!-- Today -->
          <div v-if="todayNotifications.length > 0">
            <div class="sticky top-0 z-10 bg-muted/80 px-4 py-2 backdrop-blur-sm">
              <span class="text-xs font-medium text-muted-foreground">Hoje</span>
            </div>
            <div class="divide-y">
              <div
                v-for="notification in todayNotifications"
                :key="notification.id"
                class="group relative flex gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
                :class="{ 'bg-primary/5': !notification.read }"
                role="button"
                @click="markAsRead(notification.id)"
              >
                <!-- Unread indicator -->
                <div
                  v-if="!notification.read"
                  class="absolute left-1.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-primary"
                />

                <!-- Icon -->
                <div
                  class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                  :class="[getTypeConfig(notification.type).bg, getTypeConfig(notification.type).color]"
                >
                  <component :is="getTypeConfig(notification.type).icon" class="h-4 w-4" />
                </div>

                <!-- Content -->
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-medium leading-tight" :class="{ 'text-foreground': !notification.read }">
                    {{ notification.title }}
                  </p>
                  <p class="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                    {{ notification.description }}
                  </p>
                  <p class="mt-1 text-[11px] text-muted-foreground/70">
                    {{ notification.time }}
                  </p>
                </div>

                <!-- Actions -->
                <div class="flex shrink-0 items-start gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    v-if="!notification.read"
                    variant="ghost"
                    size="icon"
                    class="h-7 w-7 text-muted-foreground hover:text-foreground"
                    title="Marcar como lida"
                    @click.stop="markAsRead(notification.id)"
                  >
                    <Check class="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    class="h-7 w-7 text-muted-foreground hover:text-destructive"
                    title="Remover"
                    @click="removeNotification(notification.id, $event)"
                  >
                    <Trash2 class="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <!-- Older -->
          <div v-if="olderNotifications.length > 0">
            <div class="sticky top-0 z-10 bg-muted/80 px-4 py-2 backdrop-blur-sm">
              <span class="text-xs font-medium text-muted-foreground">Anteriores</span>
            </div>
            <div class="divide-y">
              <div
                v-for="notification in olderNotifications"
                :key="notification.id"
                class="group relative flex gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
                :class="{ 'bg-primary/5': !notification.read }"
                role="button"
                @click="markAsRead(notification.id)"
              >
                <!-- Unread indicator -->
                <div
                  v-if="!notification.read"
                  class="absolute left-1.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-primary"
                />

                <!-- Icon -->
                <div
                  class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                  :class="[getTypeConfig(notification.type).bg, getTypeConfig(notification.type).color]"
                >
                  <component :is="getTypeConfig(notification.type).icon" class="h-4 w-4" />
                </div>

                <!-- Content -->
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-medium leading-tight" :class="{ 'text-foreground': !notification.read }">
                    {{ notification.title }}
                  </p>
                  <p class="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                    {{ notification.description }}
                  </p>
                  <p class="mt-1 text-[11px] text-muted-foreground/70">
                    {{ notification.time }}
                  </p>
                </div>

                <!-- Actions -->
                <div class="flex shrink-0 items-start gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    v-if="!notification.read"
                    variant="ghost"
                    size="icon"
                    class="h-7 w-7 text-muted-foreground hover:text-foreground"
                    title="Marcar como lida"
                    @click.stop="markAsRead(notification.id)"
                  >
                    <Check class="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    class="h-7 w-7 text-muted-foreground hover:text-destructive"
                    title="Remover"
                    @click="removeNotification(notification.id, $event)"
                  >
                    <Trash2 class="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="flex h-[300px] flex-col items-center justify-center gap-3 text-center">
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <BellOff class="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p class="text-sm font-medium">Nenhuma notificação</p>
            <p class="text-xs text-muted-foreground">Você está em dia!</p>
          </div>
        </div>
      </ScrollArea>

      <!-- Footer -->
      <Separator />
      <div class="p-2">
        <Button variant="ghost" class="w-full justify-center text-xs text-muted-foreground">
          Ver todas as notificações
        </Button>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

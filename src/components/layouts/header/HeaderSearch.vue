<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Plus, type LucideIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { navigation } from '../sidebar/sidebar'
import { useAuthStore } from '@/stores/auth'

interface QuickAction {
  title: string
  icon: LucideIcon
  to: string
  requiresAdmin?: boolean
}

const router = useRouter()
const authStore = useAuthStore()
const open = ref(false)

// Flatten navigation items for command, filtered by role
const navigationItems = computed(() => {
  return navigation
    .flatMap((section) =>
      section.items
        .filter((item) => {
          if (item.requiresAdmin && !authStore.isAdmin) {
            return false
          }
          return true
        })
        .map((item) => ({
          ...item,
          section: section.label ?? 'Principal',
        }))
    )
})

// Quick actions
const allQuickActions: QuickAction[] = [
  { title: 'Novo Cliente', icon: Plus, to: '/clients/new', requiresAdmin: true },
  { title: 'Convidar Usuário', icon: Plus, to: '/users/invitations', requiresAdmin: true },
  // { title: 'Exportar Dados', icon: FileDown, to: '/export', requiresAdmin: true },
  // { title: 'Importar Dados', icon: Upload, to: '/import', requiresAdmin: true },
]

// Filter quick actions by role
const quickActions = computed(() => {
  return allQuickActions.filter((action) => {
    if (action.requiresAdmin && !authStore.isAdmin) {
      return false
    }
    return true
  })
})

const handleSelect = (to: string) => {
  open.value = false
  router.push(to)
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
    e.preventDefault()
    open.value = !open.value
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div>
    <Button
      variant="outline"
      class="relative h-9 w-9 p-0 md:h-9 md:w-100 md:justify-start md:px-3 md:py-2"
      @click="open = true"
    >
      <Search class="h-4 w-4 md:mr-2" />
      <span class="hidden md:inline-flex">Buscar...</span>
      <kbd
        class="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 md:flex"
      >
        <span class="text-xs">⌘</span>K
      </kbd>
    </Button>

    <CommandDialog v-model:open="open">
      <CommandInput placeholder="Digite para buscar..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

        <CommandGroup heading="Navegação">
          <CommandItem
            v-for="item in navigationItems"
            :key="item.to"
            :value="item.title"
            @select="handleSelect(item.to)"
          >
            <component :is="item.icon" class="mr-2 h-4 w-4" />
            <span>{{ item.title }}</span>
          </CommandItem>
        </CommandGroup>

        <template v-if="quickActions.length > 0">
          <CommandSeparator />

          <CommandGroup heading="Ações Rápidas">
            <CommandItem
              v-for="action in quickActions"
              :key="action.to"
              :value="action.title"
              @select="handleSelect(action.to)"
            >
              <component :is="action.icon" class="mr-2 h-4 w-4" />
              <span>{{ action.title }}</span>
            </CommandItem>
          </CommandGroup>
        </template>
      </CommandList>
    </CommandDialog>
  </div>
</template>

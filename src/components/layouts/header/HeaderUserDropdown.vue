<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { LogOut, Sun, Moon, Monitor } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useLogout } from '@/services/auth'
import { useTheme } from '@/composables/useTheme'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  DropdownMenu,
  DropdownMenuContent,
  // DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const authStore = useAuthStore()
const router = useRouter()
const { mutate: logout } = useLogout()
const { theme, setTheme } = useTheme()

const userName = computed(() => authStore.userName)
const userEmail = computed(() => authStore.user?.email ?? '')
const userInitials = computed(() => {
  const name = userName.value ?? ''
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
})

const handleLogout = () => {
  logout(undefined, {
    onSuccess: () => {
      router.push({ name: 'auth.login' })
    },
  })
}

// const handleProfile = () => {
//   router.push('/profile')
// }

const handleThemeChange = (value: unknown) => {
  if (typeof value !== 'string') return
  setTheme(value as 'light' | 'dark' | 'auto')
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="relative h-9 w-9 rounded-full">
        <Avatar class="h-9 w-9">
          <AvatarFallback class="bg-primary/10">
            {{ userInitials }}
          </AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56" align="end">
      <DropdownMenuLabel class="font-normal">
        <div class="flex flex-col space-y-1">
          <p class="text-sm font-medium leading-none">{{ userName }}</p>
          <p class="text-xs leading-none text-muted-foreground">{{ userEmail }}</p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <!-- <DropdownMenuGroup>
        <DropdownMenuItem @click="handleProfile">
          <User class="mr-2 h-4 w-4" />
          <span>Perfil</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator /> -->
      <div class="">
        <ToggleGroup
          type="single"
          :model-value="theme"
          class="w-full justify-start p-1"
          size="sm"
          @update:model-value="handleThemeChange"
        >
          <ToggleGroupItem value="light" aria-label="Tema claro" class="flex-1">
            <Sun class="size-3" />
          </ToggleGroupItem>
          <ToggleGroupItem value="dark" aria-label="Tema escuro" class="flex-1">
            <Moon class="size-3" />
          </ToggleGroupItem>
          <ToggleGroupItem value="auto" aria-label="Tema do sistema" class="flex-1">
            <Monitor class="size-3" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <DropdownMenuSeparator />
      <DropdownMenuItem class="text-destructive focus:text-destructive" @click="handleLogout">
        <LogOut class="mr-2 h-4 w-4" />
        <span>Sair</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

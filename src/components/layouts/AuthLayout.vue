<script setup lang="ts">
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from './sidebar'
import { Header } from './header'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <div class="flex min-h-svh flex-col">
    <SidebarProvider
      :default-open="authStore.isClient ? false : true"
      class="flex-1"
    >
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main class="flex-1 p-4 md:p-6 min-w-0">
          <slot />
        </main>
        <footer class="border-t bg-background px-4 py-4 md:px-6">
          <p class="text-center text-sm text-muted-foreground md:text-left">
            © 2026 DoubleList. Todos os direitos reservados.
          </p>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  </div>
</template>

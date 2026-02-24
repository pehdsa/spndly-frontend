<script setup lang="ts">
import { SidebarTrigger } from '@/components/ui/sidebar'
import { HeaderSearch } from './index'
// import HeaderNotifications from './HeaderNotifications.vue'
// import HeaderLanguage from './HeaderLanguage.vue'
import { HeaderUserDropdown } from './index'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore();

</script>

<template>
  <header class="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4 justify-between">
    <SidebarTrigger class="-ml-1" />

    <!-- Search -->
    <div class="flex-1" v-if="!authStore.isClient">
      <HeaderSearch />
    </div>

    <!-- Right side actions -->
    <div class="flex items-center gap-4">
      <!-- <HeaderLanguage />
      <HeaderNotifications /> -->
      <HeaderUserDropdown />
    </div>
  </header>
</template>

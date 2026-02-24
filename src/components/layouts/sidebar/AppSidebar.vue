<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import { useAuthStore } from '@/stores/auth'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { navigation } from './sidebar'
import { AppSidebarSkeleton } from './index'
import SidebarLogo from './SidebarLogo.vue'

const route = useRoute()
const authStore = useAuthStore()
const { sidebarVariant, sidebarCollapsible } = useTheme()

const isActive = (to: string) => {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}

// Filtra a navegação baseado na role do usuário
const filteredNavigation = computed(() => {
  return navigation
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        if (item.requiresAdmin && !authStore.isAdmin) {
          return false
        }
        if (item.requiresClient && !authStore.isClient) {
          return false
        }
        return true
      }),
    }))
    .filter((section) => section.items.length > 0)
})
</script>

<template>
  <!-- Skeleton enquanto carrega user do backend -->
  <AppSidebarSkeleton v-if="authStore.isLoadingUser" />

  <!-- Sidebar real quando user está validado -->
  <Sidebar v-else :variant="sidebarVariant" :collapsible="sidebarCollapsible">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child>
            <router-link to="/">
              <SidebarLogo />
            </router-link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup v-for="(section, index) in filteredNavigation" :key="index">
        <SidebarGroupLabel class="text-muted-foreground" v-if="section.label">
          {{ section.label }}
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in section.items" :key="item.to">
              <SidebarMenuButton
                as-child
                :is-active="isActive(item.to)"
                :tooltip="item.title"
              >
                <router-link :to="item.to">
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </router-link>
              </SidebarMenuButton>
              <SidebarMenuBadge v-if="item.badge">
                {{ item.badge }}
              </SidebarMenuBadge>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter>
    </SidebarFooter>

    <SidebarRail />
  </Sidebar>
</template>

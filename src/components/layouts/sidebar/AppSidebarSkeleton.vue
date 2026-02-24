<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'

const { sidebarVariant, sidebarCollapsible } = useTheme()
</script>

<template>
  <Sidebar :variant="sidebarVariant" :collapsible="sidebarCollapsible">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <div class="flex items-center gap-2 px-2 py-2">
            <Skeleton class="size-8 rounded-lg" />
            <div class="flex-1 space-y-1">
              <Skeleton class="h-4 w-24" />
              <Skeleton class="h-3 w-32" />
            </div>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup v-for="section in 2" :key="section">
        <Skeleton class="mx-2 mb-2 h-4 w-20" />
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="i in 3" :key="i">
              <div class="flex items-center gap-2 px-2 py-2">
                <Skeleton class="size-4" />
                <Skeleton class="h-4 w-20" />
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter>
      <Skeleton class="mx-2 h-10 rounded-md" />
    </SidebarFooter>

    <SidebarRail />
  </Sidebar>
</template>

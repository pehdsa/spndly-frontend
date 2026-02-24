<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { UserPlus } from 'lucide-vue-next'
import { InviteUserDialog } from '../components/invite-user-dialog'
import { AppPageHeader } from '@/components/shared/app-page-header'
import { ref } from 'vue'

const route = useRoute()
const inviteDialogOpen = ref(false)

const activeTab = computed(() => {
  if (route.name === 'users.invitations') return 'invitations'
  return 'users'
})
</script>

<template>
  <div class="flex flex-col gap-4 sm:gap-6">
    <AppPageHeader
      title="Usuários"
      subtitle="Gerencie usuários e convites do sistema"
    >
      <template #actions>
        <Button @click="inviteDialogOpen = true" class="w-full md:w-auto">
          <UserPlus class="mr-2 h-4 w-4" />
          Convidar
        </Button>
      </template>
    </AppPageHeader>

    <Tabs :model-value="activeTab" class="w-full">
      <TabsList>
        <TabsTrigger value="users" as-child>
          <RouterLink :to="{ name: 'users.list' }">Usuários</RouterLink>
        </TabsTrigger>
        <TabsTrigger value="invitations" as-child>
          <RouterLink :to="{ name: 'users.invitations' }">Convites</RouterLink>
        </TabsTrigger>
      </TabsList>
    </Tabs>

    <router-view />

    <InviteUserDialog v-model:open="inviteDialogOpen" />
  </div>
</template>

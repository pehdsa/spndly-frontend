<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { AppTruncate } from '@/components/shared/app-truncate'

interface Props {
  /** Título da página */
  title?: string
  /** Subtítulo da página */
  subtitle?: string
  /** Nome da rota para o botão voltar (se não passar, não exibe o botão) */
  goBackTo?: string
}

defineProps<Props>()
</script>

<template>
  <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div class="flex items-center gap-4 min-w-0">
      <!-- Botão Voltar (opcional) -->
      <Button v-if="goBackTo" variant="ghost" size="icon" as-child class="shrink-0">
        <RouterLink :to="{ name: goBackTo }">
          <ArrowLeft class="size-5" />
        </RouterLink>
      </Button>

      <!-- Título e Subtítulo -->
      <div class="min-w-0">
        <div class="flex items-center gap-3 min-w-0">
          <AppTruncate as="h1" class="text-2xl font-semibold">
            {{ title }}
          </AppTruncate>
          <!-- Badge (slot opcional) -->
          <div v-if="$slots.badge" class="shrink-0">
            <slot name="badge" />
          </div>
        </div>
        <AppTruncate v-if="subtitle" as="p" class="text-sm sm:text-base text-muted-foreground" :html="subtitle" />
      </div>
    </div>

    <!-- Ações (slot opcional) -->
    <div v-if="$slots.actions" class="w-full sm:w-auto sm:shrink-0">
      <slot name="actions" />
    </div>
  </div>
</template>

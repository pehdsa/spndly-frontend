<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-vue-next'
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-muted-foreground/20">
        404
      </h1>
      <h2 class="mt-4 text-2xl font-semibold">
        Página não encontrada
      </h2>
      <p class="mt-2 text-muted-foreground">
        A página que você está procurando não existe ou foi removida.
      </p>
    </div>

    <Button as-child>
      <router-link to="/">
        <Home class="mr-2 h-4 w-4" />
        Voltar para o início
      </router-link>
    </Button>
  </div>
</template>

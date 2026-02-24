<script setup lang="ts">
import { ref, computed } from 'vue'
import { Check } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import brFlag from '@/assets/svg/flags/br.svg'
import usFlag from '@/assets/svg/flags/us.svg'

interface Language {
  code: string
  title: string
  flag: string
}

const languages: Language[] = [
  { code: 'pt-BR', title: 'Português', flag: brFlag },
  { code: 'en-US', title: 'English', flag: usFlag },
]

const currentLanguage = ref<string>('pt-BR')

const currentLang = computed(() => {
  return languages.find((l) => l.code === currentLanguage.value)
})

const setLanguage = (code: string) => {
  currentLanguage.value = code
  localStorage.setItem('language', code)
  // TODO: Integrate with i18n
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="h-9 gap-2 px-2">
        <img :src="currentLang?.flag" :alt="currentLang?.title" class="h-4 w-5 rounded-sm object-cover" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-40">
      <DropdownMenuItem
        v-for="language in languages"
        :key="language.code"
        class="flex items-center justify-between"
        @click="setLanguage(language.code)"
      >
        <div class="flex items-center gap-2">
          <img :src="language.flag" :alt="language.title" class="h-4 w-5 rounded-sm object-cover" />
          <span>{{ language.title }}</span>
        </div>
        <Check
          v-if="currentLanguage === language.code"
          class="h-4 w-4 text-primary"
        />
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

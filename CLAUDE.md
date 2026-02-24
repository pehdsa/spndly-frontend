# CLAUDE.md — Guia de Desenvolvimento Vue 3

> Documento de referência para desenvolvimento assistido por IA em projetos Vue 3 com arquitetura Feature-First.

**Stack:** Vue 3 + TypeScript + Pinia + TanStack Query + TanStack Form + TanStack Table + Reka UI

---

## Stack e Versões

```json
{
  "vue": "^3.5.x",
  "vue-router": "^4.6.x",
  "pinia": "^3.0.x",
  "@tanstack/vue-query": "^5.x",
  "@tanstack/vue-form": "^0.x",
  "@tanstack/vue-table": "^8.x",
  "zod": "^4.x",
  "@vueuse/core": "^14.x",
  "axios": "^1.x",
  "reka-ui": "^2.x",
  "tailwindcss": "^4.x",
  "maska": "^3.x",
  "@vuepic/vue-datepicker": "^12.x"
}
```

---

## Estrutura de Pastas

```
src/
├─ assets/                       # Arquivos estáticos
├─ components/
│  ├─ layouts/                   # Layouts da aplicação (GuestLayout, AuthLayout)
│  ├─ ui/                        # Primitivos UI (shadcn/ui)
│  └─ shared/                    # Componentes compartilhados (prefixo App)
├─ composables/                  # Funções de composição reutilizáveis
├─ lib/                          # Utilitários (cn, etc)
├─ modules/                      # DOMÍNIOS (Feature-First)
├─ pages/                        # Páginas de nível raiz (HomePage, NotFoundPage)
├─ router/                       # Configuração do Vue Router
│  ├─ guards.ts                  # Navigation guards
│  ├─ routes.ts                  # Merge de rotas
│  └─ index.ts                   # Criação do router
├─ services/                     # Serviços de API por domínio
│  └─ types.ts                   # Tipos genéricos da API (ApiResponse, etc)
└─ stores/                       # Estado global (Pinia)
```

---

## Camada de Services

A camada de services é organizada por domínio e separa claramente:
- **Services**: Funções puras que fazem chamadas HTTP
- **Queries**: Hooks `useQuery` para busca de dados
- **Mutations**: Hooks `useMutation` para modificações

### Estrutura de um Service

```
services/
├─ http.ts                       # Instância Axios global com interceptors
├─ index.ts                      # Re-exports públicos
└─ <domínio>/
   ├─ api.ts                     # Instância Axios do domínio
   ├─ types.ts                   # Tipos do domínio (DTOs, entidades)
   ├─ keys.ts                    # Query keys organizadas
   ├─ services/                  # Funções puras (HTTP calls)
   │  ├─ list-items.ts
   │  ├─ get-item.ts
   │  ├─ create-item.ts
   │  └─ index.ts
   ├─ queries/                   # useQuery hooks
   │  ├─ use-items.ts
   │  └─ index.ts
   ├─ mutations/                 # useMutation hooks
   │  ├─ use-create-item.ts
   │  └─ index.ts
   └─ index.ts                   # Re-exports do domínio
```

### Tipagem de Respostas da API

Os tipos genéricos para respostas da API ficam em `services/types.ts` e seguem o padrão Laravel Resource:

```typescript
// services/types.ts
import type { PaginationMeta } from '@/components/shared/app-datatable'

// Resposta padrão com data wrapper
export interface ApiResponse<T> {
  data: T
}

// Resposta paginada (com meta separado igual Laravel)
export interface ApiPaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}
```

**Uso nos services:**

```typescript
import { http } from '@/services/http'
import type { ApiResponse, ApiPaginatedResponse } from '@/services'
import type { User } from '../types'

// Recurso único
export async function getUser(id: number): Promise<User> {
  const { data } = await http.get<ApiResponse<User>>(`/users/${id}`)
  return data.data
}

// Lista de recursos
export async function listUsers(): Promise<User[]> {
  const { data } = await http.get<ApiResponse<User[]>>('/users')
  return data.data
}

// Lista paginada
export async function listUsersPaginated(page: number): Promise<ApiPaginatedResponse<User>> {
  const { data } = await http.get<ApiPaginatedResponse<User>>('/users', { params: { page } })
  return data
}

// Resposta com mensagem
export async function deleteUser(id: number): Promise<string> {
  const { data } = await http.delete<ApiResponse<{ message: string }>>(`/users/${id}`)
  return data.data.message
}
```

**PaginationMeta** (definido em `components/shared/app-datatable/types.ts`):

```typescript
interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
}
```

### Exemplo Completo

```typescript
// services/products/types.ts
export interface Product {
  id: string
  name: string
  price: number
}

export interface CreateProductData {
  name: string
  price: number
}
```

```typescript
// services/products/api.ts
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const productsApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})
```

```typescript
// services/products/keys.ts
export const productKeys = {
  all: ['products'] as const,
  list: (filters?: object) => [...productKeys.all, 'list', filters] as const,
  detail: (id: string) => [...productKeys.all, 'detail', id] as const,
}
```

```typescript
// services/products/services/list-products.ts
import { productsApi } from '../api'
import type { Product } from '../types'

export async function listProducts(): Promise<Product[]> {
  const { data } = await productsApi.get<Product[]>('/products')
  return data
}
```

```typescript
// services/products/services/create-product.ts
import { productsApi } from '../api'
import type { Product, CreateProductData } from '../types'

export async function createProduct(data: CreateProductData): Promise<Product> {
  const response = await productsApi.post<Product>('/products', data)
  return response.data
}
```

```typescript
// services/products/queries/use-products.ts
import { useQuery, type UseQueryOptions } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useStaleTime } from '@/composables'
import type { ApiPaginatedResponse, PaginationParams } from '@/services'
import { productKeys } from '../keys'
import { listProducts } from '../services'
import type { Product } from '../types'

type Response = ApiPaginatedResponse<Product>

interface UseProductsProps {
  params?: MaybeRefOrGetter<PaginationParams | undefined>
  options?: Omit<UseQueryOptions<Response, Error>, 'queryKey' | 'queryFn'>
}

export function useProducts({ params, options }: UseProductsProps = {}) {
  const computedParams = computed(() => toValue(params))

  return useQuery<Response>({
    queryKey: computed(() => productKeys.list(computedParams.value)),
    queryFn: () => listProducts(computedParams.value),
    staleTime: useStaleTime({ minutes: 5 }),
    ...options,
  })
}
```

```typescript
// services/products/mutations/use-create-product.ts
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { productKeys } from '../keys'
import { createProduct } from '../services'
import type { CreateProductData } from '../types'

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateProductData) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
    },
  })
}
```

```typescript
// services/products/index.ts
export type * from './types'
export { productsApi } from './api'
export { productKeys } from './keys'
export * from './services'
export * from './queries'
export * from './mutations'
```

---

## Anatomia de um Módulo

Módulos contêm apenas UI e lógica específica do domínio. Services ficam em `services/`.

### Estrutura Básica (módulo simples, 1-2 páginas)

```
modules/<nome>/
├─ pages/
│  └─ <NomePage>.vue             # Página simples
├─ components/                   # Componentes compartilhados do módulo
├─ router.ts                     # Rotas do módulo
└─ index.ts                      # Contrato público do módulo
```

### Estrutura Recomendada (módulo com múltiplas páginas)

Cada página é uma pasta nomeada de forma descritiva. Use `index.ts` apenas quando fizer sentido exportar múltiplos itens relacionados (ex: tabela com columns e types).

```
modules/<nome>/
├─ pages/
│  ├─ <nome>-list-page/                    # Página de listagem
│  │  ├─ <Nome>ListPage.vue
│  │  └─ components/
│  │     ├─ <nome>-table/                  # Componente complexo
│  │     │  ├─ <Nome>Table.vue
│  │     │  ├─ columns.ts
│  │     │  ├─ types.ts
│  │     │  └─ index.ts                    # Exporta componente, columns e types
│  │     └─ <Nome>Filters.vue              # Componente simples (arquivo)
│  │
│  ├─ create-<nome>-page/                  # Página de criação
│  │  ├─ Create<Nome>Page.vue
│  │  └─ components/
│  │     └─ <nome>-form/
│  │        ├─ <Nome>Form.vue
│  │        ├─ schema.ts
│  │        └─ index.ts
│  │
│  └─ <nome>-detail-page/                  # Página de detalhe
│     ├─ <Nome>DetailPage.vue
│     └─ components/
│        └─ <Nome>Header.vue
│
├─ components/                             # Compartilhados entre páginas DO MÓDULO
│  └─ StatusBadge.vue
├─ schemas/                                # Validações Zod (para forms)
├─ router.ts
└─ index.ts                                # Exporta rotas do módulo
```

### Convenção de Nomenclatura de Páginas

| Tipo | Pasta | Componente |
|------|-------|------------|
| Listagem | `<nome>-list-page/` | `<Nome>ListPage.vue` |
| Criação | `create-<nome>-page/` | `Create<Nome>Page.vue` |
| Edição | `edit-<nome>-page/` | `Edit<Nome>Page.vue` |
| Detalhe | `<nome>-detail-page/` | `<Nome>DetailPage.vue` |

### Regra de index.ts

- **Módulo**: Sempre tem `index.ts` para exportar rotas
- **Componente complexo** (tabela, form): Tem `index.ts` quando exporta múltiplos itens
- **Componente simples**: Não precisa de `index.ts`
- **Pastas de página**: Não precisam de `index.ts`

### Quando usar pasta vs arquivo para componentes

| Situação | Estrutura | Exemplo |
|----------|-----------|---------|
| Componente simples | Arquivo único | `StatusBadge.vue` |
| Componente com auxiliares | Pasta | `logs-table/` |
| Tabela (sempre) | Pasta | columns, types, cells |
| Form complexo | Pasta | schema, fields, composable |

### Exemplo: Componente de Tabela (pasta)

```
<nome>-table/
├─ <Nome>Table.vue               # Componente principal
├─ columns.ts                    # Definição das colunas
├─ types.ts                      # Types específicos
├─ index.ts                      # Exporta tudo junto
└─ cells/                        # Cells customizadas (opcional)
   ├─ StatusCell.vue
   └─ ActionsCell.vue
```

```typescript
// <nome>-table/index.ts
export { default as LogsTable } from './LogsTable.vue'
export { columns as logsTableColumns } from './columns'
export type { WebhookLog } from './types'
```

```typescript
// Na página, importe do index:
import { LogsTable, type WebhookLog } from './components/logs-table'
```

---

## Router e Layouts

### Estrutura do Router

```
router/
├─ guards.ts                     # Navigation guards
├─ routes.ts                     # Merge de todas as rotas
└─ index.ts                      # Criação do router
```

### Guards

```typescript
// router/guards.ts
import type { NavigationGuard } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export const requiresAuth: NavigationGuard = (to, _from, next) => {
  const authStore = useAuthStore()
  if (!authStore.isAuthenticated) {
    next({ name: 'auth.login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
}

export const requiresGuest: NavigationGuard = (_to, _from, next) => {
  const authStore = useAuthStore()
  if (authStore.isAuthenticated) {
    next({ name: 'home' })
  } else {
    next()
  }
}
```

### Rotas do Módulo

Cada módulo define suas próprias rotas em `router.ts`:

```typescript
// modules/auth/router.ts
import type { RouteRecordRaw } from 'vue-router'

export const authRoutes: RouteRecordRaw = {
  path: '/auth',
  meta: {
    layout: 'guest',
    requiresGuest: true,
  },
  children: [
    {
      path: 'login',
      name: 'auth.login',
      component: () => import('./pages/LoginPage.vue'),
    },
    {
      path: 'register',
      name: 'auth.register',
      component: () => import('./pages/RegisterPage.vue'),
    },
  ],
}
```

**Convenção de nomes:** `<módulo>.<contexto>.<ação>` (ex: `auth.login`, `products.list`)

### Merge de Rotas

```typescript
// router/routes.ts
import type { RouteRecordRaw } from 'vue-router'
import { authRoutes } from '@/modules/auth/router'

const protectedRoutes: RouteRecordRaw = {
  path: '/',
  meta: { layout: 'auth', requiresAuth: true },
  children: [
    { path: '', name: 'home', component: () => import('@/pages/HomePage.vue') },
  ],
}

export const routes: RouteRecordRaw[] = [
  authRoutes,
  protectedRoutes,
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/pages/NotFoundPage.vue') },
]
```

### Layouts Dinâmicos

O `App.vue` usa layouts dinâmicos baseados na meta `layout` da rota:

```vue
<!-- App.vue -->
<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'

const GuestLayout = defineAsyncComponent(() => import('@/components/layouts/GuestLayout.vue'))
const AuthLayout = defineAsyncComponent(() => import('@/components/layouts/AuthLayout.vue'))

const layouts: Record<string, ReturnType<typeof defineAsyncComponent>> = {
  guest: GuestLayout,
  auth: AuthLayout,
}

const route = useRoute()

const currentLayout = computed(() => {
  const layoutMeta = route.matched.find((record) => record.meta.layout)?.meta.layout as string | undefined
  if (!layoutMeta || layoutMeta === 'none') return null
  return layouts[layoutMeta] ?? null
})
</script>

<template>
  <component :is="currentLayout" v-if="currentLayout">
    <router-view />
  </component>
  <router-view v-else />
</template>
```

**Nota:** Layouts usam `<slot />` para renderizar o conteúdo, não `<router-view />`.

### Meta de Rota

| Meta | Tipo | Descrição |
|------|------|-----------|
| `layout` | `'guest' \| 'auth' \| 'none'` | Layout a ser usado |
| `requiresAuth` | `boolean` | Requer autenticação |
| `requiresGuest` | `boolean` | Requer visitante (não autenticado) |
| `requiresAdmin` | `boolean` | Requer role de administrador |

---

## Roles e Permissões

O sistema possui controle de acesso baseado em roles. Os dados do usuário são buscados via `/auth/me` a cada navegação em rotas protegidas para garantir que as permissões estejam atualizadas.

### Roles Disponíveis

| Role | Valor | Descrição |
|------|-------|-----------|
| Administrador | `ADMIN` | Acesso total ao sistema |
| Visitante | `GUEST` | Acesso restrito (não pode gerenciar usuários) |

### Constantes de Role

As constantes de role ficam centralizadas em `modules/users/constants/`:

```typescript
// modules/users/constants/roles.ts
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  GUEST: 'GUEST',
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [USER_ROLES.ADMIN]: 'Administrador',
  [USER_ROLES.GUEST]: 'Visitante',
}
```

### Auth Store

A store de autenticação (`stores/auth.ts`) possui getters para verificar a role:

```typescript
const authStore = useAuthStore()

// Getters disponíveis
authStore.userRole    // 'ADMIN' | 'GUEST' | undefined
authStore.isAdmin     // true se role === 'ADMIN'
```

### Protegendo Rotas

Para restringir uma rota apenas para administradores, adicione `requiresAdmin: true` na meta:

```typescript
// modules/users/router.ts
export const usersRoutes: RouteRecordRaw = {
  path: 'users',
  meta: {
    requiresAdmin: true, // Apenas ADMIN pode acessar
  },
  component: () => import('./pages/UsersLayout.vue'),
  children: [
    // ...
  ],
}
```

O guard `requiresAdmin` redireciona para home se o usuário não for admin.

### Sidebar Dinâmica

A sidebar filtra itens automaticamente baseado na role. Para ocultar um item para usuários GUEST, adicione `requiresAdmin: true`:

```typescript
// components/layouts/sidebar/sidebar.ts
export interface NavItem {
  title: string
  icon: LucideIcon
  to: string
  badge?: string
  requiresAdmin?: boolean // Oculta para GUEST
}

export const navigation: NavSection[] = [
  {
    label: 'Gerenciamento',
    items: [
      {
        title: 'Usuários',
        icon: Users,
        to: '/users',
        requiresAdmin: true, // Só aparece para ADMIN
      },
    ],
  },
]
```

### Verificando Role em Componentes

```vue
<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <!-- Renderização condicional -->
  <Button v-if="authStore.isAdmin">Ação de Admin</Button>

  <!-- Ou usando a role diretamente -->
  <Badge v-if="authStore.userRole === 'ADMIN'">Admin</Badge>
</template>
```

### Exibindo Labels de Role

Use `USER_ROLE_LABELS` para exibir o nome amigável da role:

```typescript
import { USER_ROLE_LABELS } from '@/modules/users/constants'

// Em colunas de tabela
cell: ({ row }) => {
  const role = row.getValue('role') as UserRole
  return h(Badge, {}, () => USER_ROLE_LABELS[role])
}
```

### Adicionando Novas Roles

Para adicionar uma nova role:

1. Adicione em `modules/users/constants/roles.ts`:
```typescript
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  GUEST: 'GUEST',
  MANAGER: 'MANAGER', // Nova role
} as const

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [USER_ROLES.ADMIN]: 'Administrador',
  [USER_ROLES.GUEST]: 'Visitante',
  [USER_ROLES.MANAGER]: 'Gerente', // Label da nova role
}
```

2. Atualize o tipo em `services/users/types.ts`:
```typescript
export type UserRole = 'ADMIN' | 'GUEST' | 'MANAGER'
```

3. Se necessário, crie novos guards em `router/guards.ts`.

---

## TanStack Form + Zod

```vue
<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'
import { AppFormInput } from '@/components/shared'
import { mySchema, type MyInput } from './schemas'

const form = useForm({
  defaultValues: { email: '', password: '' } as MyInput,
  validators: {
    onSubmit: mySchema,
  },
  onSubmit: async ({ value }) => {
    await api.submit(value)
  },
})
</script>

<template>
  <form @submit.prevent.stop="form.handleSubmit">
    <form.Field name="email">
      <template #default="{ field }">
        <AppFormInput
          id="email"
          label="Email"
          :model-value="field.state.value"
          :error="field.state.meta.errors[0]?.message"
          @update:model-value="(val) => field.handleChange(val as string)"
          @blur="field.handleBlur"
        />
      </template>
    </form.Field>
    <Button type="submit">Enviar</Button>
  </form>
</template>
```

**Nota:** Com Zod v4 (Standard Schema), erros são objetos com `.message`. Use `field.state.meta.errors[0]?.message`.

---

## Schemas (Zod)

```typescript
// modules/products/schemas/product.schema.ts
import { z } from 'zod'

export const createProductSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  price: z.number().positive('Preço deve ser positivo'),
})

export type CreateProductInput = z.infer<typeof createProductSchema>
```

---

## Masks de Input

```vue
<script setup lang="ts">
import { AppFormInput } from '@/components/shared'
</script>

<template>
  <AppFormInput id="cpf" v-model="cpf" label="CPF" mask="cpf" />
  <AppFormInput id="phone" v-model="phone" label="Telefone" mask="phone" />
  <AppFormInput id="price" v-model="price" label="Preço" mask="money:2" />
</template>
```

**Masks disponíveis:** `cpf`, `cnpj`, `cpf_cnpj`, `phone`, `cep`, `money:2`, `money:4`

---

## AppDatePicker

Componente de seleção de data baseado no VueDatePicker com integração automática de dark mode e locale pt-BR.

### Props

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `id` | `string` | - | ID do input (obrigatório) |
| `label` | `string` | `null` | Label do campo |
| `placeholder` | `string` | `'Selecione uma data'` | Placeholder |
| `error` | `string` | `null` | Mensagem de erro |
| `disabled` | `boolean` | `false` | Desabilita o input |
| `clearable` | `boolean` | `true` | Permite limpar o valor |
| `autoApply` | `boolean` | `true` | Seleciona ao clicar |
| `range` | `boolean` | `false` | Seleção de intervalo |
| `multiDates` | `boolean` | `false` | Múltiplas datas |
| `monthPicker` | `boolean` | `false` | Apenas mês/ano |
| `yearPicker` | `boolean` | `false` | Apenas ano |
| `timePicker` | `boolean` | `false` | Apenas hora |
| `enableTimePicker` | `boolean` | `false` | Data + hora |
| `textInput` | `boolean` | `false` | Permite digitar |
| `inline` | `boolean` | `false` | Calendário inline |
| `format` | `string` | `'dd/MM/yyyy'` | Formato de exibição |
| `modelType` | `'timestamp' \| 'format' \| 'iso' \| string` | `undefined` | Tipo do v-model |
| `minDate` | `Date \| string` | `undefined` | Data mínima |
| `maxDate` | `Date \| string` | `undefined` | Data máxima |
| `weekStart` | `0-6` | `0` | Primeiro dia da semana |

### Eventos

| Evento | Descrição |
|--------|-----------|
| `@blur` | Ao perder foco |
| `@focus` | Ao ganhar foco |
| `@open` | Ao abrir o calendário |
| `@closed` | Ao fechar o calendário |
| `@cleared` | Ao limpar o valor |

### Uso Básico

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AppDatePicker } from '@/components/shared/app-date-picker'

const date = ref<Date>()
</script>

<template>
  <AppDatePicker id="birthdate" v-model="date" label="Data de nascimento" />
</template>
```

### Com Validação de Erro

```vue
<template>
  <AppDatePicker
    id="date"
    v-model="date"
    label="Data"
    :error="errors.date"
  />
</template>
```

### Seleção de Intervalo

```vue
<script setup lang="ts">
const dateRange = ref<Date[]>()
</script>

<template>
  <AppDatePicker
    id="period"
    v-model="dateRange"
    label="Período"
    range
    placeholder="Selecione o período"
  />
</template>
```

### Data e Hora

```vue
<template>
  <AppDatePicker
    id="datetime"
    v-model="date"
    label="Data e hora"
    enable-time-picker
  />
</template>
```

### Apenas Mês/Ano

```vue
<template>
  <AppDatePicker
    id="month"
    v-model="date"
    label="Mês de referência"
    month-picker
  />
</template>
```

### Com Limites de Data

```vue
<script setup lang="ts">
const today = new Date()
const maxDate = new Date()
maxDate.setFullYear(maxDate.getFullYear() + 1)
</script>

<template>
  <AppDatePicker
    id="future-date"
    v-model="date"
    label="Data futura"
    :min-date="today"
    :max-date="maxDate"
  />
</template>
```

### Com TanStack Form

```vue
<template>
  <form.Field name="birthdate">
    <template #default="{ field }">
      <AppDatePicker
        id="birthdate"
        label="Data de nascimento"
        :model-value="field.state.value"
        :error="field.state.meta.errors[0]?.message"
        @update:model-value="field.handleChange"
        @blur="field.handleBlur"
      />
    </template>
  </form.Field>
</template>
```

---

## Tratamento de Erros (useErrorHandler)

Composable para tratamento padronizado de erros HTTP com toast notifications (Sonner).

### Uso Básico

```typescript
import { useErrorHandler } from '@/composables'

const { handleError, watchError, showSuccessToast } = useErrorHandler()

// Watch automático em ref de erro (ex: de mutation)
const { mutate, error } = useDeleteUser()
watchError(error)

// Tratamento manual
try {
  await someAction()
} catch (err) {
  handleError(err as AxiosError)
}

// Toast de sucesso
showSuccessToast('Sucesso!', 'Usuário criado com sucesso')
```

### Com Validação de Formulário (422)

```typescript
const { handleError } = useErrorHandler()

const { mutate, error } = useCreateUser()

watchError(error, {
  showValidationToast: false, // Não mostra toast genérico para 422
  onValidationError: (errors) => {
    // errors = { email: ['Email já existe'], name: ['Nome obrigatório'] }
    // Preencher erros no formulário manualmente se necessário
  },
})
```

### Opções do handleError

```typescript
interface ErrorHandlerOptions {
  redirect?: boolean          // Redireciona em 404/500
  redirectTo?: string         // Rota customizada
  showToast?: boolean         // Exibe toast (default: true)
  showReload?: boolean        // Botão de reload no toast
  showValidationToast?: boolean // Toast para 422 (default: true)
  onError?: (error) => void   // Callback customizado
  onValidationError?: (errors) => void // Callback para 422
}
```

### Funções Disponíveis

| Função | Descrição |
|--------|-----------|
| `handleError(error, options?)` | Trata erro HTTP manualmente |
| `watchError(errorRef, options?)` | Watch automático em ref de erro |
| `showErrorToast(title, description, showReload?)` | Toast de erro |
| `showWarningToast(title, description, showReload?)` | Toast de aviso |
| `showSuccessToast(title, description?)` | Toast de sucesso |
| `extractErrorMessage(error)` | Extrai mensagem do erro |
| `extractValidationErrors(error)` | Extrai erros de validação (422) |

### Mensagens Padrão por Status

| Status | Título | Descrição |
|--------|--------|-----------|
| 400 | Erro 400 | Requisição inválida |
| 401 | Sessão expirada | Faça login novamente |
| 403 | Sem permissão | Não tem permissão |
| 404 | Não encontrado | Recurso não encontrado |
| 409 | Conflito | Recurso já existe |
| 422 | Dados inválidos | Verifique os campos |
| 429 | Muitas requisições | Aguarde alguns instantes |
| 500+ | Erro no servidor | Tente novamente mais tarde |

---

## useStaleTime

Composable para converter tempo legível em milissegundos, usado principalmente com `staleTime` do TanStack Query.

```typescript
import { useStaleTime } from '@/composables'

// Uso básico
useStaleTime({ minutes: 5 })        // 300000ms
useStaleTime({ hours: 1 })          // 3600000ms
useStaleTime({ seconds: 30 })       // 30000ms

// Combinações
useStaleTime({ hours: 2, minutes: 30 })              // 9000000ms
useStaleTime({ hours: 1, minutes: 30, seconds: 45 }) // 5445000ms

// Em queries
export function useProducts({ params, options }: UseProductsProps = {}) {
  return useQuery<Response>({
    queryKey: computed(() => productKeys.list(computedParams.value)),
    queryFn: () => listProducts(computedParams.value),
    staleTime: useStaleTime({ minutes: 5 }), // Cache por 5 minutos
    ...options,
  })
}
```

---

## useQueryParams

Composable para sincronizar estado de parâmetros com a URL.

```typescript
import { useQueryParams } from '@/composables'

const { params, syncToUrl } = useQueryParams({
  page: 1,
  per_page: 10,
  sort: undefined as string | undefined,
})

// params é reativo e inicializado com valores da URL se existirem
params.page = 2
params.sort = 'name:asc'
syncToUrl()

// Opção para atualizar URL sem recarregar componente
syncToUrl({ updateComponent: false })
```

Para uso com tabelas paginadas, veja a seção [AppDataTable > Uso com Server-Side Pagination](#uso-com-server-side-pagination-e-sorting).

---

## Fluxo de Dados

```
Page/Component
    ↓ (usa hooks)
Mutations/Queries (services/<domínio>/mutations ou queries)
    ↓ (chama)
Service Functions (services/<domínio>/services)
    ↓ (via)
Axios Instance (services/<domínio>/api.ts)
    ↓
HTTP API
```

---

## AppDataTable

Componente de tabela baseado no TanStack Table com suporte a paginação cliente/servidor, ordenação e row pinning.

### Props

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `columns` | `ColumnDef<TData>[]` | - | Definição das colunas |
| `data` | `TData[]` | - | Dados da tabela |
| `isLoadingData` | `boolean` | `false` | Estado de loading inicial |
| `isFetchingData` | `boolean` | `false` | Estado de refetch em background |
| `withoutPagination` | `boolean` | `false` | Remove a paginação |
| `manualPagination` | `boolean` | `false` | Ativa paginação servidor |
| `pagination` | `PaginationState` | `{ pageIndex: 0, pageSize: 10 }` | Estado inicial de paginação |
| `meta` | `PaginationMeta` | - | Metadados de paginação (server-side) |
| `manualSorting` | `boolean` | `false` | Ativa ordenação servidor |
| `enableRowClick` | `boolean` | `false` | Habilita clique na linha |
| `enableRowPinning` | `boolean` | `false` | Habilita fixar linhas |
| `pinHeader` | `boolean` | `false` | Header sticky |
| `variant` | `'default' \| 'striped' \| 'bordered' \| 'minimal'` | `'default'` | Variante visual |
| `rowClassName` | `(row: TData) => string` | - | Classe condicional por linha |

### Eventos

| Evento | Payload | Descrição |
|--------|---------|-----------|
| `@sorting-change` | `Updater<SortingState>` | Mudança na ordenação |
| `@pagination-change` | `PaginationState` | Mudança na paginação |
| `@visibility-change` | `VisibilityState` | Mudança na visibilidade de colunas |
| `@table-change` | `{ sorting, visibility, pagination }` | Mudança geral de estado |
| `@row-click` | `TData` | Clique em uma linha |

### Uso Básico (Client-Side)

```vue
<script setup lang="ts">
import { AppDataTable } from '@/components/shared/app-datatable'
import { columns } from './components/users-table/columns'

const users = ref([
  { id: 1, name: 'João', email: 'joao@email.com' },
  { id: 2, name: 'Maria', email: 'maria@email.com' },
])
</script>

<template>
  <AppDataTable :columns="columns" :data="users" />
</template>
```

### Definindo Colunas (SEMPRE usar AppDataTableColumnHeader)

**Importante:** Sempre utilize `AppDataTableColumnHeader` para os headers das colunas. Ele fornece ordenação automática com indicadores visuais.

```typescript
// columns.ts
import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import { AppDataTableColumnHeader } from '@/components/shared/app-datatable'

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => h(AppDataTableColumnHeader, { column, title: 'Nome' }),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => h(AppDataTableColumnHeader, { column, title: 'Email' }),
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => h(AppDataTableColumnHeader, { column, title: 'Criado em' }),
    cell: ({ row }) => new Date(row.getValue('created_at')).toLocaleDateString('pt-BR'),
  },
]
```

Para desabilitar sort em uma coluna específica, adicione `enableSorting: false`:

```typescript
{
  accessorKey: 'actions',
  header: 'Ações',
  enableSorting: false,
  cell: ({ row }) => h(ActionsCell, { row }),
}
```

### Uso com Server-Side Pagination e Sorting

Use `useQueryParams` para sincronizar com URL e `buildTableQueryParams` para converter o estado da tabela:

**Página (UsersListPage.vue):**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { buildTableQueryParams, type TableChangeData } from '@/components/shared/app-datatable'
import { useQueryParams } from '@/composables'
import { useUsers } from '@/services/users'
import { UsersTable } from './components/users-table'

const { params, syncToUrl } = useQueryParams({
  page: 1,
  per_page: 10,
  sort: undefined as string | undefined,
})

const apiParams = computed(() => ({
  page: params.page,
  per_page: params.per_page,
  sort: params.sort || undefined,
}))

const { data, isLoading, isFetching } = useUsers({ params: apiParams })

function handleTableChange(e: TableChangeData) {
  Object.assign(params, buildTableQueryParams(e))
  syncToUrl()
}
</script>

<template>
  <UsersTable
    :data="data?.data ?? []"
    :meta="data?.meta"
    :is-loading="isLoading"
    :is-fetching="isFetching"
    @table-change="handleTableChange"
  />
</template>
```

**Componente de Tabela (UsersTable.vue):**

```vue
<script setup lang="ts">
import { AppDataTable, type PaginationMeta, type TableChangeData } from '@/components/shared/app-datatable'
import type { User } from '@/services/users'
import { columns } from './columns'

interface Props {
  data: User[]
  meta?: PaginationMeta
  isLoading?: boolean
  isFetching?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'table-change', value: TableChangeData): void
}>()
</script>

<template>
  <AppDataTable
    :columns="columns"
    :data="data"
    :meta="meta"
    :is-loading-data="isLoading"
    :is-fetching-data="isFetching"
    manual-pagination
    manual-sorting
    @table-change="emit('table-change', $event)"
  />
</template>
```

### Slot de Toolbar

```vue
<template>
  <AppDataTable :columns="columns" :data="data">
    <template #toolbar="{ table, isFetching }">
      <div class="flex items-center gap-2">
        <Input placeholder="Buscar..." @input="handleSearch" />
        <Button :disabled="isFetching">Exportar</Button>
      </div>
    </template>
  </AppDataTable>
</template>
```

### Estrutura de Arquivos Recomendada

```
pages/list/
├─ components/
│  └─ users-table/
│     ├─ UsersTable.vue      # Wrapper com AppDataTable
│     ├─ columns.ts          # Definição das colunas
│     ├─ types.ts            # Types específicos
│     └─ index.ts
└─ UsersListPage.vue
```

---

## Convenções

### Extensões de Arquivo

**IMPORTANTE:** Nunca use arquivos `.tsx` ou `.jsx` neste projeto. Sempre use `.ts` para arquivos TypeScript e `.vue` para componentes Vue.

Para colunas de tabelas e outros arquivos que usam `h()` do Vue, use `.ts`:

```typescript
// columns.ts (CORRETO)
import { h } from 'vue'
export const columns = [
  {
    header: ({ column }) => h(AppDataTableColumnHeader, { column, title: 'Nome' }),
    cell: ({ row }) => h('span', {}, row.getValue('name')),
  },
]
```

### Nomenclatura de Arquivos

```
PascalCase  → Componentes: ProductTable.vue
kebab-case  → Outros: list-products.ts, use-products.ts
```

### Prefixos

```typescript
// Queries/Mutations hooks
export function useProducts() {}
export function useCreateProduct() {}

// Service functions
export async function listProducts() {}
export async function createProduct() {}

// Constants
export const PRODUCT_STATUS = {}

// Booleans
const isLoading = ref(false)
const hasError = ref(false)
```

---

## Guia Rápido

| Pergunta | Resposta |
|----------|----------|
| Onde colocar chamada HTTP? | `services/<domínio>/services/` |
| Onde colocar useQuery? | `services/<domínio>/queries/` |
| Onde colocar useMutation? | `services/<domínio>/mutations/` |
| Onde colocar tipos do domínio? | `services/<domínio>/types.ts` |
| Onde colocar tipos genéricos da API? | `services/types.ts` |
| Onde colocar validação de form? | `modules/<nome>/schemas/` |
| Onde colocar componente reutilizável global? | `components/shared/` |
| Onde colocar layouts? | `components/layouts/` |
| Onde colocar componente específico de página? | `modules/<nome>/pages/<pagina>/components/` |
| Onde colocar componente compartilhado do módulo? | `modules/<nome>/components/` |
| Onde colocar colunas de tabela? | `modules/<nome>/pages/<pagina>/components/<nome>-table/columns.ts` |
| Onde colocar rotas do módulo? | `modules/<nome>/router.ts` |
| Onde colocar guards de navegação? | `router/guards.ts` |
| Onde colocar estado global? | `stores/` |
| Dados de API? | TanStack Query |
| Formulários? | TanStack Form + Zod |

---

## Anti-patterns

❌ **Não faça:**
- Lógica de API direto no componente
- Store para dados que vêm de API (use TanStack Query)
- Queries/mutations dentro de `modules/` (use `services/`)
- Imports profundos (`@/services/auth/mutations/use-login`)

✅ **Faça:**
- Services separados de queries/mutations
- Importe do `index.ts` (`@/services/auth`)
- Query keys centralizadas por domínio
- Componentes UI são genéricos (props, sem lógica de API)

---

## Git Commits

Commits devem ser simples e diretos, sem referências a IA ou assinaturas automáticas.

### Formato

```
<tipo>: <descrição curta>
```

### Tipos

| Tipo | Descrição |
|------|-----------|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `refactor` | Refatoração sem mudança de comportamento |
| `chore` | Tarefas de manutenção (deps, config) |
| `docs` | Documentação |
| `style` | Formatação (sem mudança de código) |
| `test` | Testes |

### Exemplos

```bash
feat: add login page
fix: resolve auth redirect loop
refactor: extract form validation to composable
chore: update dependencies
docs: add router documentation
```

### Regras

- Mensagem em inglês, minúscula, sem ponto final
- Máximo 50 caracteres na primeira linha
- Sem emojis ou assinaturas
- Um commit por funcionalidade/correção

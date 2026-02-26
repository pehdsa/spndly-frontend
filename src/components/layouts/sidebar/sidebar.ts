import {
  CreditCard,
  LayoutDashboard,
  Receipt,
  Tag,
  Users,
  type LucideIcon,
} from 'lucide-vue-next'

export interface NavItem {
  title: string
  icon: LucideIcon
  to: string
  badge?: string
  items?: NavSubItem[]
  requiresAdmin?: boolean
  requiresClient?: boolean
}

export interface NavSubItem {
  title: string
  to: string
}

export interface NavSection {
  label?: string
  items: NavItem[]
}

export const navigation: NavSection[] = [
  {
    label: 'Geral',
    items: [
      {
        title: 'Dashboard',
        icon: LayoutDashboard,
        to: '/dashboard',
      },
      {
        title: 'Despesas',
        icon: Receipt,
        to: '/expenses',
      },
    ],
  },
  {
    label: 'Gerenciamento',
    items: [
      {
        title: 'Categorias',
        icon: Tag,
        to: '/categories',
      },
      {
        title: 'Métodos de Pagamento',
        icon: CreditCard,
        to: '/payment-methods',
      },
      {
        title: 'Usuários',
        icon: Users,
        to: '/users',
        requiresAdmin: true,
      },
    ],
  },
]

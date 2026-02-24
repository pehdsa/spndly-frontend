import {
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
    label: 'Gerenciamento',
    items: [
      {
        title: 'Usuários',
        icon: Users,
        to: '/users',
        requiresAdmin: true,
      },
    ],
  },
]

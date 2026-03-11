// Entidades
export interface Category {
  id: number
  name: string
  description: string | null
  created_at: string
}

// DTOs
export interface CreateCategoryData {
  name: string
  description?: string | null
}

export interface UpdateCategoryData {
  name?: string
  description?: string | null
}

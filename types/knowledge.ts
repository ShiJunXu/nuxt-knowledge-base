export interface KnowledgeCategory {
  slug: string
  name: string
  icon: string
  summary: string
  goal: string
}

export interface KnowledgeArticle {
  id: number
  category: string
  title: string
  summary: string
  tags: string[]
  updatedAt: string
  readingMinutes: number
}

export interface AppUser {
  name: string
  email: string
}

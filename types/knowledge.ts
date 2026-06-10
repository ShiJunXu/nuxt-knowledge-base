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
  categoryName?: string
  title: string
  summary: string
  content: string
  tags: string[]
  updatedAt: string
  readingMinutes: number
}

export interface AppUser {
  id: number
  name: string
  email: string
}

export interface ArticlePayload {
  category: string
  title: string
  summary: string
  content: string
  tags: string[]
  readingMinutes: number
}

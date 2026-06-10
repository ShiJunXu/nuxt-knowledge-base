import type { KnowledgeArticle, KnowledgeCategory } from '~/types/knowledge'

interface ArticleRow {
  id: number
  category_slug: string
  category_name: string
  title: string
  summary: string
  content: string
  tags: string
  reading_minutes: number
  updated_at: string
}

interface CategoryRow {
  slug: string
  name: string
  icon: string
  summary: string
  goal: string
}

export const mapArticle = (row: ArticleRow): KnowledgeArticle => ({
  id: row.id,
  category: row.category_slug,
  categoryName: row.category_name,
  title: row.title,
  summary: row.summary,
  content: row.content,
  tags: JSON.parse(row.tags || '[]'),
  updatedAt: row.updated_at.slice(0, 10),
  readingMinutes: row.reading_minutes
})

export const mapCategory = (row: CategoryRow): KnowledgeCategory => ({
  slug: row.slug,
  name: row.name,
  icon: row.icon,
  summary: row.summary,
  goal: row.goal
})

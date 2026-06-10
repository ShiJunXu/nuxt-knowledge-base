import type { ArticlePayload } from '~/types/knowledge'

const cleanPayload = (body: Partial<ArticlePayload>) => ({
  category: String(body.category || '').trim(),
  title: String(body.title || '').trim(),
  summary: String(body.summary || '').trim(),
  content: String(body.content || '').trim(),
  tags: Array.isArray(body.tags) ? body.tags.map(String).filter(Boolean) : [],
  readingMinutes: Number(body.readingMinutes || 5)
})

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const body = cleanPayload(await readBody<Partial<ArticlePayload>>(event))

  if (!body.category || !body.title || !body.summary || !body.content) {
    throw createError({
      statusCode: 400,
      statusMessage: '请填写分类、标题、摘要和正文'
    })
  }

  const db = useDb(event)
  await db
    .prepare(
      `INSERT INTO articles
        (user_id, category_slug, title, summary, content, tags, reading_minutes, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
    )
    .bind(
      user.id,
      body.category,
      body.title,
      body.summary,
      body.content,
      JSON.stringify(body.tags),
      body.readingMinutes
    )
    .run()

  return { ok: true }
})

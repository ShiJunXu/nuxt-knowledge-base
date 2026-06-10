import type { ArticlePayload } from '~/types/knowledge'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody<Partial<ArticlePayload>>(event)

  if (!id || !body.category || !body.title || !body.summary || !body.content) {
    throw createError({
      statusCode: 400,
      statusMessage: '请填写完整的笔记内容'
    })
  }

  const tags = Array.isArray(body.tags) ? body.tags.map(String).filter(Boolean) : []
  const db = useDb(event)

  await db
    .prepare(
      `UPDATE articles
       SET category_slug = ?,
           title = ?,
           summary = ?,
           content = ?,
           tags = ?,
           reading_minutes = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND user_id = ?`
    )
    .bind(
      body.category,
      body.title.trim(),
      body.summary.trim(),
      body.content.trim(),
      JSON.stringify(tags),
      Number(body.readingMinutes || 5),
      id,
      user.id
    )
    .run()

  return { ok: true }
})

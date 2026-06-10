export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const query = getQuery(event)
  const category = typeof query.category === 'string' ? query.category : ''
  const db = useDb(event)
  const sql = `
    SELECT
      articles.id,
      articles.category_slug,
      categories.name AS category_name,
      articles.title,
      articles.summary,
      articles.content,
      articles.tags,
      articles.reading_minutes,
      articles.updated_at
    FROM articles
    JOIN categories ON categories.slug = articles.category_slug
    WHERE articles.user_id = ?
    ${category ? 'AND articles.category_slug = ?' : ''}
    ORDER BY articles.updated_at DESC
  `
  const statement = db.prepare(sql)
  const { results = [] } = category
    ? await statement.bind(user.id, category).all<Parameters<typeof mapArticle>[0]>()
    : await statement.bind(user.id).all<Parameters<typeof mapArticle>[0]>()

  return {
    articles: results.map(mapArticle)
  }
})

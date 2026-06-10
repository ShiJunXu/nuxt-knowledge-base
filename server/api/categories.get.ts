export default defineEventHandler(async (event) => {
  await requireUser(event)

  const db = useDb(event)
  const { results = [] } = await db
    .prepare('SELECT slug, name, icon, summary, goal FROM categories ORDER BY sort_order ASC')
    .all<{
      slug: string
      name: string
      icon: string
      summary: string
      goal: string
    }>()

  return {
    categories: results.map(mapCategory)
  }
})

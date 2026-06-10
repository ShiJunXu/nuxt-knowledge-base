export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const id = Number(getRouterParam(event, 'id'))

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: '笔记不存在'
    })
  }

  const db = useDb(event)
  await db.prepare('DELETE FROM articles WHERE id = ? AND user_id = ?').bind(id, user.id).run()

  return { ok: true }
})

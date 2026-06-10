interface RegisterBody {
  name?: string
  email?: string
  password?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<RegisterBody>(event)
  const name = body.name?.trim()
  const email = body.email?.trim().toLowerCase()
  const password = body.password || ''

  if (!name || !email || password.length < 6) {
    throw createError({
      statusCode: 400,
      statusMessage: '请填写昵称、邮箱和至少 6 位密码'
    })
  }

  const db = useDb(event)
  const existingUser = await db
    .prepare('SELECT id FROM users WHERE email = ?')
    .bind(email)
    .first<{ id: number }>()

  if (existingUser) {
    throw createError({
      statusCode: 409,
      statusMessage: '这个邮箱已经注册过了'
    })
  }

  const passwordHash = await hashPassword(password)
  await db
    .prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)')
    .bind(name, email, passwordHash)
    .run()

  const user = await db
    .prepare('SELECT id, name, email FROM users WHERE email = ?')
    .bind(email)
    .first<{ id: number; name: string; email: string }>()

  if (!user) {
    throw createError({
      statusCode: 500,
      statusMessage: '注册失败，请稍后再试'
    })
  }

  await createSession(event, user.id)

  return { user }
})

interface LoginBody {
  email?: string
  password?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<LoginBody>(event)
  const email = body.email?.trim().toLowerCase()
  const password = body.password || ''

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: '请填写邮箱和密码'
    })
  }

  const db = useDb(event)
  const user = await db
    .prepare('SELECT id, name, email, password_hash FROM users WHERE email = ?')
    .bind(email)
    .first<{ id: number; name: string; email: string; password_hash: string }>()

  if (!user || !(await verifyPassword(password, user.password_hash))) {
    throw createError({
      statusCode: 401,
      statusMessage: '邮箱或密码不正确'
    })
  }

  await createSession(event, user.id)

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  }
})

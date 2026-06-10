import type { AppUser } from '~/types/knowledge'

interface StoredUser extends AppUser {
  password: string
}

const storageKey = 'knowledge-hub-users'
const sessionKey = 'knowledge-hub-session'

const readUsers = (): StoredUser[] => {
  if (!import.meta.client) return []
  const raw = localStorage.getItem(storageKey)
  return raw ? JSON.parse(raw) : []
}

const writeUsers = (users: StoredUser[]) => {
  if (import.meta.client) {
    localStorage.setItem(storageKey, JSON.stringify(users))
  }
}

const persistSession = (user: AppUser | null) => {
  if (!import.meta.client) return

  if (user) {
    localStorage.setItem(sessionKey, JSON.stringify(user))
  } else {
    localStorage.removeItem(sessionKey)
  }
}

export const useAuth = () => {
  const currentUser = useState<AppUser | null>('current-user', () => null)

  const init = () => {
    if (!import.meta.client || currentUser.value) return

    const raw = localStorage.getItem(sessionKey)
    currentUser.value = raw ? JSON.parse(raw) : null
  }

  const register = (payload: StoredUser) => {
    const users = readUsers()
    const email = payload.email.trim().toLowerCase()

    if (users.some((user) => user.email === email)) {
      throw new Error('这个邮箱已经注册过了')
    }

    const nextUser = {
      name: payload.name.trim(),
      email,
      password: payload.password
    }

    writeUsers([...users, nextUser])
    currentUser.value = { name: nextUser.name, email: nextUser.email }
    persistSession(currentUser.value)
  }

  const login = (email: string, password: string) => {
    const user = readUsers().find(
      (item) => item.email === email.trim().toLowerCase() && item.password === password
    )

    if (!user) {
      throw new Error('邮箱或密码不正确')
    }

    currentUser.value = { name: user.name, email: user.email }
    persistSession(currentUser.value)
  }

  const logout = async () => {
    currentUser.value = null
    persistSession(null)
    await navigateTo('/login')
  }

  return {
    currentUser,
    init,
    login,
    logout,
    register
  }
}

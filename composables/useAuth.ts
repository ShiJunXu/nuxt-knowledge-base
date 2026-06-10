import type { AppUser } from '~/types/knowledge'

export const useAuth = () => {
  const currentUser = useState<AppUser | null>('current-user', () => null)
  const initialized = useState('auth-initialized', () => false)

  const init = async () => {
    if (initialized.value) return

    try {
      const response = await $fetch<{ user: AppUser | null }>('/api/me')
      currentUser.value = response.user
    } catch {
      currentUser.value = null
    } finally {
      initialized.value = true
    }
  }

  const register = async (payload: { name: string; email: string; password: string }) => {
    const response = await $fetch<{ user: AppUser }>('/api/auth/register', {
      method: 'POST',
      body: payload
    })
    currentUser.value = response.user
    initialized.value = true
  }

  const login = async (email: string, password: string) => {
    const response = await $fetch<{ user: AppUser }>('/api/auth/login', {
      method: 'POST',
      body: { email, password }
    })
    currentUser.value = response.user
    initialized.value = true
  }

  const logout = async () => {
    await $fetch('/api/auth/logout', { method: 'POST' })
    currentUser.value = null
    initialized.value = true
    await navigateTo('/login')
  }

  return {
    currentUser,
    init,
    initialized,
    login,
    logout,
    register
  }
}

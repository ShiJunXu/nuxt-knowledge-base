export default defineNuxtRouteMiddleware((to) => {
  const { currentUser, init } = useAuth()
  init()

  const publicRoutes = ['/login', '/register']
  const isPublicRoute = publicRoutes.includes(to.path)

  if (!currentUser.value && !isPublicRoute) {
    return navigateTo('/login')
  }

  if (currentUser.value && isPublicRoute) {
    return navigateTo('/')
  }
})

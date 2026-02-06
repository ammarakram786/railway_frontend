export default defineNuxtRouteMiddleware((to) => {
  const authenticated = useCookie<boolean | null>('is_authenticated')

  const publicRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password'
  ]

  // If logged in and trying to access root or public auth routes, redirect to /users
  if (authenticated.value && (to.path === '/' || publicRoutes.includes(to.path))) {
    return navigateTo('/users')
  }

  // Allow public routes for non-authenticated users
  if (publicRoutes.includes(to.path)) {
    return
  }

  // Not authenticated → login
  if (!authenticated.value) {
    return navigateTo('/auth/login')
  }
})

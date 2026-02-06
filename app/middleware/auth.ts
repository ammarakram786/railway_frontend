export default defineNuxtRouteMiddleware(() => {
  const authenticated = useCookie<boolean | null>('is_authenticated')

  // Not logged in → go to login
  if (!authenticated.value) {
    return navigateTo('/auth/login')
  }
})

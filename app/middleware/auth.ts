// file: app/middleware/auth.ts
import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  // Fetch user if not already loaded
  if (!authStore.user) {
    try {
      await authStore.fetchProfile()
    } catch {
      // If fetching profile fails, redirect to login
      return navigateTo(`/auth/login?redirect=${to.fullPath}`)
    }
  }

  // If still no user after fetching, redirect to login
  if (!authStore.user) {
    return navigateTo(`/auth/login?redirect=${to.fullPath}`)
  }

  // Otherwise, user is authenticated; allow access
})

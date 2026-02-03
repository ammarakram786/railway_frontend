import { useAuthStore } from '~/stores/auth'
import { storeToRefs } from 'pinia'

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  const { user } = storeToRefs(authStore)
  console.log(from)
  if (to.path === '/') {
    if (user.value) {
      return navigateTo('/users')
    } else {
      return navigateTo('/auth/login')
    }
  }
})

// stores/auth.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CustomTokenObtainPairRequest, UserDetail, ApiResponse } from '~/types/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<UserDetail | null>(null)
  const loading = ref(false)

  // Access $api correctly
  const { $api } = useNuxtApp()

  const login = async (credentials: CustomTokenObtainPairRequest) => {
    try {
      console.log('cre ----------  ', credentials)

      loading.value = true
      // Send credentials in POST body
      await $api('/api/accounts/login/', {
        method: 'POST',
        body: credentials
      })

      // Fetch profile after login
      await fetchProfile()
      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await $api('/api/accounts/logout/', { method: 'POST' })
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      user.value = null
      const router = useRouter()
      router.push('/auth/login')
    }
  }

  const fetchProfile = async () => {
    try {
      const response = await $api<ApiResponse<UserDetail>>('/api/accounts/profile/')
      if (response?.status && response.data) {
        user.value = response.data
      }
    } catch (error) {
      console.error('Fetch profile failed:', error)
      user.value = null
    }
  }

  return { user, loading, login, logout, fetchProfile }
})

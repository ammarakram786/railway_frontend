import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CustomTokenObtainPairRequest, UserDetail, ApiResponse } from '~/types/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<UserDetail | null>(null)
  const loading = ref(false)
  const authenticated = useCookie<boolean | null>('is_authenticated')

  const api = useApi()

  const login = async (credentials: CustomTokenObtainPairRequest) => {
    try {
      loading.value = true

      const response = await api<ApiResponse<{ access: string }>>('/api/accounts/login/', {
        method: 'POST',
        body: credentials
      })

      if (response?.status && response.data) {
        authenticated.value = true
        await fetchProfile()
      }
      return response;
    } catch (error) {
      console.error('Login failed:', error)
      return null
    } finally {
      loading.value = false
    }
  }

  const fetchProfile = async () => {
    try {
      const response = await api<ApiResponse<UserDetail>>('/api/accounts/profile/')
      if (response?.status && response.data) {
        user.value = response.data
      }
    } catch (error) {
      user.value = null
      authenticated.value = null
    }
  }

  const logout = async () => {
    authenticated.value = null
    user.value = null
    await navigateTo('/auth/login')
  }

  return { user, loading, login, logout, fetchProfile }
})

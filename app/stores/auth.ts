import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CustomTokenObtainPairRequest, UserDetail, ApiResponse } from '~/types/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<UserDetail | null>(null)
  const permissions = computed(() => user.value?.permissions || [])
  const authenticated = useCookie<boolean | null>('is_authenticated')

  const {
    login: authLogin,
    fetchProfile: authFetchProfile,
    logout: authLogout,
    loading
  } = useAuth()


  const login = async (credentials: CustomTokenObtainPairRequest) => {
    const response = await authLogin(credentials)

    if (response?.status) {
      authenticated.value = true
      permissions.value = response.data.permissions
      await Promise.all([
        fetchProfile()
      ])
    }
    return response
  }

  const fetchProfile = async () => {
    const response = await authFetchProfile()
    if (response?.status && response.data) {
      user.value = response.data
    } else {
      user.value = null
      authenticated.value = null
    }
  }

  const logout = async () => {
    await authLogout()
    authenticated.value = null
    user.value = null
    await navigateTo('/auth/login')
  }

  const hasPermission = (permission: string) => {
    return permissions.value.includes(permission)
  }

  return {
    user,
    permissions,
    loading,
    login,
    logout,
    fetchProfile,
    hasPermission
  }
})

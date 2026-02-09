import type { CustomTokenObtainPairRequest, UserDetail, ApiResponse } from '~/types/api'

export const useAuth = () => {
  const api = useApi()
  const loading = ref(false)

  const login = async (credentials: CustomTokenObtainPairRequest) => {
    try {
      loading.value = true

      const response = await api<ApiResponse<{ access: string }>>('/api/accounts/login/', {
        method: 'POST',
        body: credentials
      })
      console.log('login ---RES----', response)
      return response

    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchProfile = async () => {
    try {
      loading.value = true
      return await api<ApiResponse<UserDetail>>('/api/accounts/profile/')
    } catch (error) {
      console.error('Fetch profile failed:', error)
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      loading.value = true
      return await api<ApiResponse<any>>('/api/accounts/logout/', {
        method: 'POST'
      })
    } catch (error) {
      console.error('Failed to logout:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    login,
    loading,
    fetchProfile,
    logout,
  }
}

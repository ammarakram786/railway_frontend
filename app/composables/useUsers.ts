import type { ApiResponse, PaginatedUserList, User, UserDetail, UserRequest, PatchedUserRequest } from '~/types/api'

export const useUsers = () => {
  const api = useApi()
  const loading = ref(false)
  const users = ref<User[]>([])
  const totalUsers = ref(0)

  const fetchUsers = async (params?: { page?: number; page_size?: number; email?: string; username?: string; is_active?: boolean; ordering?: string }) => {
    try {
      loading.value = true
      const response = await api<ApiResponse<PaginatedUserList>>('/api/accounts/users/', {
        query: params
      })
      if (response?.status && response.data) {
          users.value = response.data.results
          console.log('data --- ',response.data.results);

        totalUsers.value = response.data.count
      }
      return response
    } catch (error) {
      console.error('Failed to fetch users:', error)
      users.value = []
      totalUsers.value = 0
    } finally {
      loading.value = false
    }
  }

  const createUser = async (data: UserRequest) => {
    try {
      loading.value = true
      return await api<ApiResponse<User>>('/api/accounts/users/', {
        method: 'POST',
        body: data
      })
    } catch (error) {
      console.error('Failed to create user:', error)
    } finally {
      loading.value = false
    }
  }

  const getUser = async (id: number) => {
    try {
      loading.value = true
      return await api<ApiResponse<UserDetail>>(`/api/accounts/users/${id}/`)
    } catch (error) {
      console.error('Failed to fetch user:', error)
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (id: number, data: UserRequest | PatchedUserRequest) => {
    try {
      loading.value = true
      return await api<ApiResponse<User>>(`/api/accounts/users/${id}/`, {
        method: 'PATCH',
        body: data
      })
    } catch (error) {
      console.error('Failed to update user:', error)
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async (id: number) => {
    try {
      loading.value = true
      return await api<ApiResponse>(`/api/accounts/users/${id}/`, {
        method: 'DELETE'
      })
    } catch (error) {
      console.error('Failed to delete user:', error)
    } finally {
      loading.value = false
    }
  }

  const activateUser = async (id: number) => {
    try {
      loading.value = true
      return await api<ApiResponse<User>>(`/api/accounts/users/${id}/activate/`, {
        method: 'POST'
      })
    } catch (error) {
      console.error('Failed to activate user:', error)
    } finally {
      loading.value = false
    }
  }

  const deactivateUser = async (id: number) => {
    try {
      loading.value = true
      return await api<ApiResponse<User>>(`/api/accounts/users/${id}/deactivate/`, {
        method: 'POST'
      })
    } catch (error) {
      console.error('Failed to deactivate user:', error)
    } finally {
      loading.value = false
    }
  }

  const resetPassword = async (id: number,) => {
    try {
      loading.value = true
      return await api<ApiResponse<User>>(`/api/accounts/users/${id}/reset_password/`, {
        method: 'POST',
        body: {}
      })
    } catch (error) {
      console.error('Failed to set password:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    users,
    totalUsers,
    loading,
    fetchUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
    activateUser,
    deactivateUser,
    resetPassword
  }
}

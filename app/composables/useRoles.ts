import type { ApiResponse, PaginatedRoleList, Role, RoleList, RoleRequest, PatchedRoleRequest, Permission, PaginatedPermissionList } from '~/types/api'

export const useRoles = () => {
  const api = useApi()
  const loading = ref(false)
  const roles = ref<RoleList[]>([])
  const totalRoles = ref(0)

  const fetchRoles = async (params?: { page?: number; page_size?: number; name?: string; ordering?: string }) => {
    try {
      loading.value = true
      const response = await api<ApiResponse<PaginatedRoleList>>('/api/accounts/roles/', {
        query: params
      })
      if (response?.status && response.data) {
        roles.value = response.data.results
        totalRoles.value = response.data.count
      }
      return response
    } catch (error) {
      console.error('Failed to fetch roles:', error)
      roles.value = []
      totalRoles.value = 0
    } finally {
      loading.value = false
    }
  }

  const createRole = async (data: RoleRequest) => {
    try {
      loading.value = true
      return await api<ApiResponse<Role>>('/api/accounts/roles/', {
        method: 'POST',
        body: data
      })
    } catch (error) {
      console.error('Failed to create role:', error)
    } finally {
      loading.value = false
    }
  }

  const getRole = async (id: number) => {
    try {
      loading.value = true
      return await api<ApiResponse<Role>>(`/api/accounts/roles/${id}/`)
    } catch (error) {
      console.error('Failed to fetch role:', error)
    } finally {
      loading.value = false
    }
  }

  const updateRole = async (id: number, data: RoleRequest | PatchedRoleRequest) => {
    try {
      loading.value = true
      return await api<ApiResponse<Role>>(`/api/accounts/roles/${id}/`, {
        method: 'PATCH',
        body: data
      })
    } catch (error) {
      console.error('Failed to update role:', error)
    } finally {
      loading.value = false
    }
  }

  const deleteRole = async (id: number) => {
    try {
      loading.value = true
      return await api<void>(`/api/accounts/roles/${id}/`, {
        method: 'DELETE'
      })
    } catch (error) {
      console.error('Failed to delete role:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    roles,
    totalRoles,
    loading,
    fetchRoles,
    createRole,
    getRole,
    updateRole,
    deleteRole
  }
}

export const usePermissions = () => {
  const api = useApi()
  const loading = ref(false)
  const permissions = ref<Permission[]>([])
  const totalPermissions = ref(0)

  const fetchPermissions = async (params?: { page?: number; page_size?: number; ordering?: string }) => {
    try {
      loading.value = true
      const response = await api<ApiResponse<PaginatedPermissionList>>('/api/accounts/permissions/', {
        query: params
      })
      if (response?.status && response.data) {
        permissions.value = response.data.results
        totalPermissions.value = response.data.count
      }
      return response
    } catch (error) {
      console.error('Failed to fetch permissions:', error)
      permissions.value = []
      totalPermissions.value = 0
    } finally {
      loading.value = false
    }
  }

  return {
    permissions,
    totalPermissions,
    loading,
    fetchPermissions
  }
}

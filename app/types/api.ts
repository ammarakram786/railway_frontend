export type ID = number | string

export interface ApiResponse<T = unknown> {
  status: boolean
  code: number
  message?: string
  data?: T
  detail?: string | null
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface Permission {
  id: number
  codename: string
  name: string
}

export interface Role {
  id: number
  name: string
  permissions: Permission[]
}

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  is_active: boolean
  role: Role
  permissions: string[]
}

export interface UserDetail extends User {
  date_joined: string
  last_login: string | null
}

export interface UserRequest {
  username: string
  email: string
  first_name: string
  last_name: string
  is_active?: boolean
  role_ids?: number[]
}

export interface RoleList {
  id: number
  name: string
  permissions_count: string
}

export interface RoleRequest {
  name: string
  code_name: string
  permission_ids: number[]
}

export interface PatchedUserRequest extends Partial<UserRequest> {}
export interface PatchedRoleRequest extends Partial<RoleRequest> {}

export interface PaginatedUserList extends PaginatedResponse<User> {}
export interface PaginatedRoleList extends PaginatedResponse<RoleList> {}
export interface PaginatedPermissionList extends PaginatedResponse<Permission> {}

export interface CustomTokenObtainPairRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  first_name: string
  last_name: string
}

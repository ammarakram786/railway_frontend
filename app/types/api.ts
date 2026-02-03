export type ID = number | string

/**
 * Generic API response wrapper used across the app.
 * Keep this permissive so it matches different backend shapes.
 */
export interface ApiResponse<T = unknown> {
  status: boolean
  data?: T
  message?: string
  errors?: unknown
  [key: string]: unknown
}

export interface User {
  id?: ID
  email?: string
  username?: string
  [key: string]: unknown
}

export interface UserDetail extends User {
  first_name?: string
  last_name?: string
}

/**
 * Login payload (supports username/email-based auth).
 */
export interface CustomTokenObtainPairRequest {
  username?: string
  email?: string
  password: string
  [key: string]: unknown
}

export interface RegisterRequest {
  email?: string
  username?: string
  password?: string
  password1?: string
  password2?: string
  [key: string]: unknown
}

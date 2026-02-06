// composables/useApi.ts
import type { FetchError } from 'ofetch'
type ApiError = {
  status: boolean
  code: number
  message: string
  data: any
  detail?: string
}

export function useApi() {
  const config = useRuntimeConfig()

  const request = async <T>(
    url: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
      body?: any
      query?: any
      headers?: HeadersInit
    } = {},
    retry = true
  ): Promise<T | ApiError> => {
    try {
      return await $fetch<T>(url, {
        baseURL: config.public.apiBase,
        credentials: 'include',
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
      })
    } catch (error) {
      const isLoginRequest = url.includes('/login')
      console.log('error', isLoginRequest);
      const err = error as FetchError<ApiError>
      if (isLoginRequest) {
        retry = false
        return err.data as ApiError
      }

      if (err?.data?.code === 401) {
        if (retry) {
          try {
            // 🔁 Refresh session via cookie
            await $fetch('/api/accounts/refresh/', {
              baseURL: config.public.apiBase,
              method: 'POST',
              credentials: 'include',
            })

            // 🔂 Retry original request once
            return await request<T>(url, options, false)
          } catch {
            // Refresh failed → logout
          }
        }

        // 🧹 Clear auth state
        const isAuthenticated = useCookie<boolean | null>('is_authenticated')
        isAuthenticated.value = null

        // 🚪 Redirect (SSR safe)
        return await navigateTo('/auth/login') as any
      }



      return err.data as ApiError
    }
  }

  return request
}

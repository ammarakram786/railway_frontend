// composables/useApi.ts
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
  ): Promise<T> => {
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
    } catch (error: any) {
      if (error?.status === 401) {
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

      throw error
    }
  }

  return request
}

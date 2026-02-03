import type { FetchContext, FetchError } from 'ofetch'
import type { NitroFetchOptions } from 'nitropack/types'

type ApiOptions = NitroFetchOptions<string>

interface QueuedRequest<T = unknown> {
  resolve: (value: T) => void
  reject: (error: FetchError) => void
  url: string
  options: ApiOptions
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const router = useRouter()

  let refreshPromise: Promise<void> | null = null
  const queue: QueuedRequest[] = []

  const csrfHeaderName = 'X-CSRFToken'
  const getCSRFToken = (): string =>
    import.meta.client ? useCookie<string | null>('csrftoken').value ?? '' : ''

  /* ---------------- Refresh ---------------- */
  const refreshSession = async (): Promise<void> => {
    if (!refreshPromise) {
      refreshPromise = $fetch<void>('/api/accounts/refresh/', {
        baseURL: config.public.apiBase as string,
        method: 'POST',
        credentials: 'include',
        headers: { [csrfHeaderName]: getCSRFToken() }
      })
        .catch(async (err) => {
          await router.push('/auth/login')
          throw err
        })
        .finally(() => {
          refreshPromise = null
        })
    }
    return refreshPromise
  }

  /* ---------------- Queue ---------------- */
  const flushQueue = async (error?: FetchError): Promise<void> => {
    for (const req of queue) {
      if (error) req.reject(error)
      else
        api(req.url, req.options)
          .then(req.resolve)
          .catch(req.reject)
    }
    queue.length = 0
  }

  /* ---------------- API Client ---------------- */
  const api = $fetch.create({
    baseURL: config.public.apiBase as string,
    credentials: 'include',

    onRequest({ options }) {
      const headers = new Headers(options.headers)
      headers.set(csrfHeaderName, getCSRFToken())
      options.headers = headers
    },

    // ✅ Fixed type here: returns Promise<void>
    async onResponseError(context: FetchContext<unknown>): Promise<void> {
      const requestUrl
        = typeof context.request === 'string'
          ? context.request
          : context.request.toString()

      if (context.response?.status !== 401) return
      if (requestUrl.includes('/api/accounts/refresh/')) {
        await router.push('/auth/login')
        return
      }

      if (refreshPromise) {
        queue.push({
          resolve: () => {}, // no return
          reject: (err: FetchError) => {
            err = context.response as unknown as FetchError
            throw new Error(err.message)
          },
          url: requestUrl,
          options: context.options as ApiOptions
        })
        return
      }

      try {
        await refreshSession()
        await flushQueue()
        // do not return api(...) here
      } catch (error: unknown) {
        await flushQueue(error as FetchError)
        throw error
      }
    }
  })

  /* ---------------- Typed API wrapper ---------------- */
  const typedApi = <T>(url: string, options: ApiOptions = {}): Promise<T> =>
    api(url, options) as Promise<T>

  return { provide: { api: typedApi } }
})

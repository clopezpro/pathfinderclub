import { useFetch } from '#app'
import { useAuthUserStore } from '~/stores/auth'

let tryFetch = 0
export function fetchMAHIRFULL<T>(path: string, opts = {}) {
  const config = useRuntimeConfig()
  return useFetch<T>(path, {
    baseURL: config.public.apiBaseUrl || undefined,
    credentials: 'include',
    onRequest({ request, options }) {
      options.headers = {
        Authorization: `Bearer ${useAuthUserStore().tokens.access.token}`,
      }
    },
    onRequestError({ request, options, error }) {
      // Handle the request errors
    },
    onResponse({ request, response, options }) {
      // Process the response data
      return response._data
    },
    async onResponseError({ request, response, options }) {
      if (response.status === 401) {
        if (tryFetch >= 3) {
          tryFetch = 0
          return
        }
        try {
          tryFetch++
          await useAuthUserStore().refreshToken()
          fetchMAHIRFULL(
            path,
            opts,
          )
        }
        catch (error) {

        }
      }
      // Handle the response errors
    },
    ...opts,
  })
}

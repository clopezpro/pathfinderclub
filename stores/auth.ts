import { defineStore } from 'pinia'
import type { AuthData, IUser } from '~/types'

const alertError = useAlertErrorModal()
export const useAuthUserStore = defineStore('useAuthUserStore', {
  state: () => (
    {
      pathfinder: {
        _id: '',
        email: '',
        name: '',
        role: '',
      },
      tokens: {
        access: {
          token: null,
          expires: null,
        },
      },
      loading: false,
    } as IUser
  ),
  getters: {
    getUser(): AuthData {
      return this.pathfinder
    },
    isAuth(): boolean {
      return this.tokens.access.token !== null
    },
    getLoading(): boolean {
      return this.loading || false
    },
  },
  persist: {
    key: 'authPathfinder',
    paths: ['pathfinder', 'tokens'],
    /* afterRestore: (ctx) => {
      console.log(`just restored '${ctx.store.$state}'`, ctx.store.$state)
    },
    beforeRestore: (ctx) => {
      console.log(`about to restore '${ctx.store.$state}'`)
    }, */
    /* serializer: {
      deserialize: parse,
      serialize: stringify,
    }, */

  },
  actions: {
    async setUser(data: IUser) {
      this.tokens.access.token = data.tokens.access.token
      this.tokens.access.expires = data.tokens.access.expires
      this.pathfinder = data.pathfinder
      const route = useRoute()
      if (route.params.nextUrl)
        return await navigateTo(route.params.nextUrl as string)
      else
        if (route.params.nextUrl)
          return await navigateTo(route.params.nextUrl)
        else
          return await navigateTo('/')
    },
    cleanData() {
      this.tokens.access.token = null
      this.tokens.access.expires = null
      this.pathfinder = {
        _id: '',
        email: '',
        name: '',
        role: '',
      }
      const token = useCookie('authPathfinder')
      token.value = null
    },
    async logout(redirect = true) {
      try {
        this.loading = true
        const { data, error } = await fetchMAHIRFULL('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
        })
        this.loading = false
        if (error.value)
          return alertError(error.value)

        this.cleanData()
        return await navigateTo('/login', {
          replace: true,
        })

        /* if (result.status === 204 || result.status === 404) {
          this.loading = false
          this.cleanData()
          if (redirect)
            return await navigateTo('/login')
        }
        throw new Error(result._data.message) */
      }
      catch (e) {
        this.loading = false
        alertError(e)
      }
    },
    async refreshToken() {
      this.loading = true
      const { data, error } = await fetchMAHIRFULL<IUser>('/api/auth/refresh-tokens')

      this.loading = false
      if (error.value) {
        if (error.value.statusCode === 402)
          return await navigateTo('/login')
      }
      if (data.value && Object.keys(data.value).includes('tokens')) {
        this.tokens.access.token = data.value.tokens.access.token
        this.tokens.access.expires = data.value.tokens.access.expires
      }
      else {
        this.cleanData()
        return await navigateTo('/login')
      }
    },
    async checkSession() {
      this.loading = true
      const { data, error } = await useFetch('/api/auth/getSession', {
        credentials: 'include',
      })

      this.loading = false
      if (error.value) {
        console.log(error.value.statusMessage, error.value.statusCode)
        if (error.value.statusCode === 401)
          return false
      }

      return true
    },
    /*  async refreshToken() {
      const { showModalError } = useAlertModalStore()
      try {
        this.loading = true
        const result = await fetchMAHIRFULL({
          baseURL: '/auth/refresh-tokens',
          method: 'POST',
          ignoreResponseError: true,
          body: {
            refreshToken: this.tokens.refresh.token?.toString(),
          },
        }, true)
        this.loading = false

        if (result.status === 200) {
          this.tokens.access.token = result._data.tokens.access.token
          this.tokens.access.expires = result._data.tokens.access.expires
          this.tokens.refresh.token = result._data.tokens.refresh.token
          this.tokens.refresh.expires = result._data.tokens.refresh.expires
          this.user = result._data.user
        }
        else {
          this.cleanData()
          return await navigateTo('/login')
        }
      }
      catch (e) {
        this.loading = false
        console.log(e)
      }
    }, */
  },
})

import { useAuthUserStore } from '@/stores/auth.js'

export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuth } = useAuthUserStore()
  /* console.log('isAuth', isAuth, await checkSession())
  if (!await checkSession())
    return await navigateTo('/login') */

  if (!isAuth && to.path !== '/login') {
    return await navigateTo('/login', {

    })
  }
})

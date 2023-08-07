import { useAuthUserStore } from '@/stores/auth.js'

export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuth } = useAuthUserStore()
  if (!isAuth && to.path !== '/login')
    return await navigateTo('/login')
  else if (isAuth && to.path === '/login')
    return await navigateTo('/')
})

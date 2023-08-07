import { authController } from '../../model/auth/index'

export default defineEventHandler(async (event) => {
  const data = await authController.refreshTokens(event)

  setCookie(event, 'tokenRefresh', data.tokens.refresh.token, {
    httpOnly: true,
  })
  delete data.tokens.refresh
  return data
})

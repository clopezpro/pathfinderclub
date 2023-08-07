import type { H3Event } from 'h3'
import { tokenService } from '../token'
import { authService } from '../auth'

export async function login(req: any) {
  const { email, password } = req
  const pathfinder = await authService.loginUserWithEmailAndPassword(email, password)
  const tokens = await tokenService.generateAuthTokens(pathfinder)
  return { pathfinder, tokens }
}

export async function logout(req: any) {
  await authService.logout(req.body.refreshToken)
  return createError({
    statusCode: 201,
    statusMessage: 'Logout successfully',
  })
}

export async function refreshTokens(event: H3Event) {
  const authCookie = getCookie(event, 'tokenRefresh')

  const token = authCookie || ''
  const userWithTokens = await authService.refreshAuth(token)
  return { ...userWithTokens }
}

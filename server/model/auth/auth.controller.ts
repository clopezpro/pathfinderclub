import { tokenService } from '../token'
import { authService } from '../auth'

export async function login(req: any) {
  const { email, password } = req.body
  const user = await authService.loginUserWithEmailAndPassword(email, password)
  const tokens = await tokenService.generateAuthTokens(user)
  return { user, tokens }
}

export async function logout(req: any) {
  await authService.logout(req.body.refreshToken)
  return createError({
    statusCode: 201,
    statusMessage: 'Logout successfully',
  })
}

export async function refreshTokens(req: any) {
  const token = req.body.refreshToken
  const userWithTokens = await authService.refreshAuth(token)
  return { ...userWithTokens }
}

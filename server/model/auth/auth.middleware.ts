import type { EventHandler, H3Event } from 'h3'
import passport from 'passport'
import type { IPathfinderDoc } from '../pathfinder/pathfinder.interfaces'
import jwtStrategy from './passport'

function verifyCallback(e: H3Event, resolve: any, reject: any) {
  return async (err: Error, user: IPathfinderDoc, info: string) => {
    if (err || info || !user)
      reject(`Please authenticate  ${info ? ` - ${info}` : ''}`)

    resolve(user)
  }
}
function authMiddleware(h: EventHandler) {
  return async (e: H3Event) => {
    const authCookie = getCookie(e, 'tokenRefresh')

    if (!authCookie) {
      throw createError({
        statusCode: 403,
        statusMessage: 'No esta autorizado',
      })
    }
    passport.use(jwtStrategy)
    return new Promise<IPathfinderDoc>((resolve, reject) => {
      passport.authenticate('jwt', { session: false }, verifyCallback(e, resolve, reject))(e.node.req, e.node.res)
    }).then((user: IPathfinderDoc) => {
      e.context.user = user
      return h(e)
    })
      .catch(async (err) => {
        /*  if (err.toString() === 'Please authenticate   - Error: No auth token' && authCookie) {
          const data = await authController.refreshTokens(e)

          setCookie(e, 'tokenRefresh', data.tokens.refresh.token, {
            httpOnly: true,
          })
          e.context.user = data.pathfinder
          return h(e)
        } */

        throw createError({
          statusCode: 401,
          statusMessage: err.toString(),
        })
      })
  }
}
export default authMiddleware

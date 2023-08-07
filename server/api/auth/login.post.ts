import { validate } from '../../controller/validate'

import { authController, authValidation } from '../../model/auth/index'

export default defineEventHandler(async (event) => {
  const req = await readBody(event)

  validate(authValidation.login, req)

  const data = await authController.login(req)

  setCookie(event, 'tokenRefresh', data.tokens.refresh.token, {
    httpOnly: true,
  })
  delete data.tokens.refresh
  return data
})

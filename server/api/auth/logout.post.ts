import { authController } from '../../model/auth/index'

export default defineEventHandler(async (event) => {
  return await authController.logout(event)
})

import { auth } from '../../model/auth'
import { activityController, activityValidation } from '../../model/activity'
import { validate } from '../../controller/validate'

export default eventHandler(auth(defineEventHandler(async (event) => {
  const req = await readBody(event)
  validate(activityValidation.takeActivity, req)
  return await activityController.takeActivity(event)
})))

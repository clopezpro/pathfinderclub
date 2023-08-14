import { auth } from '../../model/auth'
import { activityController } from '../../model/activity/index'

/* import { validate } from '../../controller/validate' */

export default eventHandler(auth(defineEventHandler(async (event) => {
  return await activityController.getActivityBodies(event)
})))

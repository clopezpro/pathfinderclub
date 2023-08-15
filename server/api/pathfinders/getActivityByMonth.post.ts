import { auth } from '../../model/auth'
import { activityController } from '../../model/activity/index'

/* import { validate } from '../../controller/validate' */

export default eventHandler(auth(defineEventHandler(async (event) => {
  const req = await readBody(event)
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const month = req.month ? Number.parseInt(req.month) : currentMonth
  const year = req.year ? Number.parseInt(req.year) : currentYear

  return await activityController.getActivityByMonth(month, year)
})))

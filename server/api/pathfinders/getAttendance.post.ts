import { auth } from '../../model/auth'
import { attendanceController } from '../../model/attendance/index'

/* import { validate } from '../../controller/validate' */

export default eventHandler(auth(defineEventHandler(async (event) => {
  return await attendanceController.getAttendance(event)
})))

import { auth } from '../../model/auth'
import { attendanceController, attendanceValidation } from '../../model/attendance/index'
import { validate } from '../../controller/validate'

export default eventHandler(auth(defineEventHandler(async (event) => {
  const req = await readBody(event)
  validate(attendanceValidation.takeList, req)
  return await attendanceController.takeList(event)
})))

import type mongoose from 'mongoose'
import type { H3Event } from 'h3'
import { Attendance } from './'
import type { attendanceInterfaces as IA } from './'

export const getAttendanceBodyById = async (id: mongoose.Types.ObjectId): Promise<IA.IAttendanceBodyDoc | null> => Attendance.AttendanceBody.findById(id)

export async function takeList(e: H3Event) {
  const req = await readBody(e)
  const { list, date, comment } = req
  const dateSeach = new Date(date)
  let attendanceId = ''
  const AttendanceExist = await Attendance.AttendanceHeader.findOne({ date: dateSeach })
  if (AttendanceExist)
    return { exist: true }

  const attendanceHeaderIns = await Attendance.AttendanceHeader.create({
    date: dateSeach,
    comment,
  })

  attendanceId = attendanceHeaderIns._id

  for (let y = 0; y < list.length; y++) {
    const item = list[y]
    const dataToInsert = {
      pathfinderId: item._id,
      attendance: false,
      attendanceHeaderId: attendanceId,
      comment: item.comment,
    }
    const bodyDB = await Attendance.AttendanceBody.findOne({ pathfinderId: item._id, attendanceHeaderId: attendanceId })
    if (!bodyDB) {
      /* to create */
      await Attendance.AttendanceBody.create(dataToInsert)
    }
    else {
      const data = await getAttendanceBodyById(bodyDB._id)
      if (data) {
        data.attendance = false
        data.comment = item.comment
        await data.save()
      }
    }
  }
  throw createError({
    statusCode: 201,
    statusMessage: 'DATOS ACTUALIZADOS CON ÉXITO',
  })
}

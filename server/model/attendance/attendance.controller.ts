import type mongoose from 'mongoose'
import type { H3Event } from 'h3'
import type { IOptions } from '../../controller/paginate/paginate'
import { Attendance } from './'
import type { attendanceInterfaces as IA } from './'

export const getAttendanceBodyById = async (id: mongoose.Types.ObjectId): Promise<IA.IAttendanceBodyDoc | null> => Attendance.AttendanceBody.findById(id)
export const getAttendanceBodyByHeader = async (id: mongoose.Types.ObjectId): Promise<IA.IAttendanceBodyDoc[] | []> => Attendance.AttendanceBody.find({ attendanceHeaderId: id })

export async function takeList(e: H3Event) {
  const req = await readBody(e)
  const { list, date, comment } = req
  const dateSeach = new Date(date)
  let attendanceId = ''
  const AttendanceExist = await Attendance.AttendanceHeader.findOne({ date: dateSeach })
  if (!AttendanceExist) {
    const attendanceHeaderIns = await Attendance.AttendanceHeader.create({
      date: dateSeach,
      comment,
    })

    attendanceId = attendanceHeaderIns._id
  }
  else {
    AttendanceExist.comment = comment
    await AttendanceExist.save()
    attendanceId = AttendanceExist._id
  }

  for (let y = 0; y < list.length; y++) {
    const item = list[y]
    const dataToInsert = {
      pathfinderId: item._id,
      attendance: item.attendance,
      attendanceHeaderId: attendanceId.toString(),
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
        data.attendance = item.attendance
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

export async function getAttendance(e: H3Event) {
  const req = await readBody(e)
  const options: IOptions = pick(req, ['sortBy', 'limit', 'page', 'projectBy'])
  const filter = pick(req, ['date'])

  const now = new Date()

  options.sortBy = 'updatedAt:asc'
  /*   if (filter.monthCurrent)
    filter.birthdate = { $expr: { $eq: [{ $month: '$birthdate' }, date.getMonth()] } } */

  if (filter.date) {
    const specificDate = new Date(filter.date)
    filter.date = specificDate
  }
  const AttendanceHeader = await Attendance.AttendanceHeader.paginate(filter, options)

  AttendanceHeader.results = AttendanceHeader.results.map((data: any) => {
    if (data.date) {
      /* const [year, month, day] = data._doc.birthdate?.split('-') */
      const now_utc = new Date(data.date.toUTCString().slice(0, -4))
      data._doc.dateStr = `${now_utc.toLocaleDateString('ec-EC', { month: 'short', day: 'numeric' })}`
    }
    else {
      data._doc.dateStr = 'No tiene fecha'
    }
    return data
  })
  return AttendanceHeader
}
export async function getAttendanceBodies(e: H3Event) {
  const { header } = await readBody(e)
  return await getAttendanceBodyByHeader(header)
}

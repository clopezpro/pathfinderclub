import type mongoose from 'mongoose'
import type { H3Event } from 'h3'
import type { IOptions } from '../../controller/paginate/paginate'
import { Activity } from '.'
import type { activityInterfaces as IA } from '.'

export const getActivityBodyById = async (id: mongoose.Types.ObjectId): Promise<IA.IActivityBodyDoc | null> => Activity.ActivityBody.findById(id)
export const getActivityBodyByHeader = async (id: mongoose.Types.ObjectId): Promise<IA.IActivityBodyDoc[] | []> => Activity.ActivityBody.find({ activityHeaderId: id })
export async function getActivityBodyByHeaders(id: [mongoose.Types.ObjectId]): Promise<IA.IActivityBodyDoc[] | []> {
  const data = await Activity.ActivityBody.find({ activityHeaderId: { $in: id } })
  return data
}

export async function takeActivity(e: H3Event) {
  const req = await readBody(e)
  const { list, date, comment, name, typeActivity } = req
  const dateSeach = new Date(date)
  let activityId = ''
  const ActivityExist = await Activity.ActivityHeader.findOne({ date: dateSeach, name })
  if (!ActivityExist) {
    const activityHeaderIns = await Activity.ActivityHeader.create({
      date: dateSeach,
      name,
      typeActivity,
      comment,
    })

    activityId = activityHeaderIns._id
  }
  else {
    ActivityExist.comment = comment
    await ActivityExist.save()
    activityId = ActivityExist._id
  }

  for (let y = 0; y < list.length; y++) {
    const item = list[y]
    const dataToInsert = {
      pathfinderId: item._id,
      grade: Number.parseInt(item.grade),
      activityHeaderId: activityId.toString(),
      comment: item.comment,
    }
    const bodyDB = await Activity.ActivityBody.findOne({ pathfinderId: item._id, activityHeaderId: activityId })

    if (!bodyDB) {
      /* to create */
      await Activity.ActivityBody.create(dataToInsert)
    }
    else {
      const data = await getActivityBodyById(bodyDB._id)
      if (data) {
        data.grade = Number.parseInt(item.grade)
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

export async function getActivity(e: H3Event) {
  const req = await readBody(e)
  const options: IOptions = pick(req, ['sortBy', 'limit', 'page', 'projectBy'])
  const filter = pick(req, ['month', 'year'])

  const now = new Date()

  options.sortBy = 'updatedAt:asc'
  /*   if (filter.monthCurrent)
    filter.birthdate = { $expr: { $eq: [{ $month: '$birthdate' }, date.getMonth()] } } */

  if (filter.month && filter.year > 0) {
    filter.$expr = [{
      $eq: [{ $month: '$date' }, filter.month],
    },
    {
      $eq: [{ $year: '$date' }, filter.year],
    },
    ]
    delete filter.month
  }
  else {
    filter.$expr = {
      $eq: [{ $year: '$date' }, filter.year],
    }
  }
  delete filter.year
  const ActivityHeader = await Activity.ActivityHeader.paginate(filter, options)

  ActivityHeader.results = ActivityHeader.results.map((data: any) => {
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
  return ActivityHeader
}
export async function getActivityBodies(e: H3Event) {
  const { headers } = await readBody(e)

  return await getActivityBodyByHeaders(headers)
}

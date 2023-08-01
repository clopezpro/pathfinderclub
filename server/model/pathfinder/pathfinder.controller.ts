import type { ObjectId } from 'mongoose'
import type { IOptions } from '../../controller/paginate/paginate'
import pick from '../../utils/pick'
import type { IPathfinderDoc, NewCreatedPathfinder, UpdatePathfinderBody } from './pathfinder.interfaces'
import Pathfinder from './pathfinder.model'

export async function createUser(pathfinderBody: NewCreatedPathfinder) {
  if (await Pathfinder.isIdentityTaken(pathfinderBody.indentity)) {
    throw createError({
      statusCode: 400,
      statusMessage: `La cédula ${pathfinderBody.indentity} ya esta registrada `,
    })
  }
  return Pathfinder.create(pathfinderBody)
}
export async function getPathfinder(pathfinderSearch: any) {
  const options: IOptions = pick(pathfinderSearch, ['sortBy', 'limit', 'page', 'projectBy'])
  const filter = pick(pathfinderSearch, ['birthdate', 'identity', 'fullname', 'isUpdate', 'month'])

  const now = new Date()

  options.sortBy = 'updatedAt:asc'
  if (filter.fullname)
    filter.fullname = { $regex: filter.fullname, $options: 'i' }

  /*   if (filter.monthCurrent)
    filter.birthdate = { $expr: { $eq: [{ $month: '$birthdate' }, date.getMonth()] } } */

  if (filter.month && filter.month != 'Todos') {
    filter.month = parseInt(filter.month)
    filter.$expr = {
      $eq: [{ $month: '$birthdate' }, filter.month + 1],
    }
  }
  delete filter.month
  const Pathfinders = await Pathfinder.paginate(filter, options)

  Pathfinders.results = Pathfinders.results.map((data: any) => {
    if (data.birthdate) {
      /* const [year, month, day] = data._doc.birthdate?.split('-') */
      const now_utc = new Date(data.birthdate.toUTCString().slice(0, -4))
      data.fullname = data.fullname.toUpperCase()
      data._doc.birth = `${now_utc.toLocaleDateString('ec-EC', { month: 'short', day: 'numeric' })}`
    }
    else {
      data._doc.birth = 'No tiene fecha de nacimiento'
    }
    return data
  })
  return Pathfinders
}
const getPathfinderById = async (id: ObjectId): Promise<IPathfinderDoc | null> => Pathfinder.findById(id)

export async function updatePathfinder(pathfinderBody: UpdatePathfinderBody, id: ObjectId) {
  const data = await getPathfinderById(id)
  if (!data) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Conquistador no encontrado',
    })
  }

  if (pathfinderBody.email && (await Pathfinder.isIdentityTaken(pathfinderBody.indentity || '', id))) {
    throw createError({
      statusCode: 404,
      statusMessage: 'LA CEDULA YA EXISTE ',
    })
  }
  pathfinderBody.isUpdate = true
  Object.assign(data, pathfinderBody)
  await data.save()
  return data
}
export async function validate(identity: string) {
  const PathfinderData = await Pathfinder.findOne({ identity })
  if (!PathfinderData) {
    throw createError({
      statusCode: 404,
      statusMessage: `Estimado su identificación ${identity} no forma parte del CLUB Abisai, envié sus datos a 0961255848 para registrarlo como uno de nuestros privilegiados conquistadores`,
    })
  }
  return PathfinderData
}

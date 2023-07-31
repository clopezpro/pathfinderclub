import type { ObjectId } from 'mongoose'
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
      statusMessage: `No Estimado  su identificación ${identity} no forma parte del CLUB Abisai, envié sus datos a 0961255848 para registrarlo como uno de nuestros privilegiados conquistadores`,
    })
  }
  return PathfinderData
}

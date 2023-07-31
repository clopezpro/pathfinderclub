import { pathfinderController } from '../../model/pathfinder/index'

export default defineEventHandler(async (event) => {
  const req = await readBody(event)
  return await pathfinderController.getPathfinder(req)
})

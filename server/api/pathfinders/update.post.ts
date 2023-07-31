import { validate } from '../../controller/validate'

import { pathfinderController, pathfinderValidation } from '../../model/pathfinder/index'

export default defineEventHandler(async (event) => {
  const req = await readBody(event)
  validate(pathfinderValidation.createPathfinder, req)

  return await pathfinderController.createUser(req)
})

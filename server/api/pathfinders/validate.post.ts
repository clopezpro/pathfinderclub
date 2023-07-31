import { validate } from '../../controller/validate'

import { pathfinderController, pathfinderValidation } from '../../model/pathfinder/index'

export default defineEventHandler(async (event) => {
  const req = await readBody(event)

  validate(pathfinderValidation.validatePathfinder, req)

  return await pathfinderController.validate(req.identity)
})

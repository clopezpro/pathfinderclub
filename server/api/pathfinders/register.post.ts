import { validate } from '../../controller/validate'

import { pathfinderController, pathfinderValidation } from '../../model/pathfinder/index'

export default defineEventHandler(async (event) => {
  const req = await readBody(event)
  if (!req._id) {
    validate(pathfinderValidation.createPathfinder, req)
    return await pathfinderController.createUser(req)
  }
  else {
    validate(pathfinderValidation.updatePathfinder, req)
    const id = req._id
    delete req._id
    return await pathfinderController.updatePathfinder(req, id)
  }
})

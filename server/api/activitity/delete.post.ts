import { auth } from '../../model/auth'
import { activityController } from '../../model/activity/index'

export default eventHandler(auth(defineEventHandler(async (event) => {
  setResponseStatus(event, 200, 'Actividad Eliminada con Éxito')
  return await activityController.deleteActivity(event)
})))

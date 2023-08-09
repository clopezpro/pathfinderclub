import { auth } from '../../model/auth'

export default eventHandler(auth(defineEventHandler(async (event) => {
  return {
    user: event.context.user,
  }
})))
/* export default defineEventHandler({async (event) => {
  return {
    user: event.context.user,
  }
},before: []})
 */

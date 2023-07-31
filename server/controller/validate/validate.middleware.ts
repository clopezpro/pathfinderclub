import Joi from 'joi'

function validate(schema: Record<string, any>, req: any): void {
  const { error } = Joi.object(schema).prefs({ errors: { label: 'key' } }).validate(req)

  if (error) {
    const errorMessage = error.details.map(details => details.message).join(', ')
    throw createError({
      statusCode: 400,
      statusMessage: errorMessage,
    })
  }
}
export default validate

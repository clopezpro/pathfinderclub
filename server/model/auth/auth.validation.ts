import Joi from 'joi'

export const login = {
  email: Joi.string().required(),
  password: Joi.string().required(),
}

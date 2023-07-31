import Joi from 'joi'
import type { NewCreatedPathfinder } from './pathfinder.interfaces'

export const createUserBody: Record<keyof NewCreatedPathfinder, any> = {
  email: Joi.string().required().email(),
  firstname: Joi.string(),
  indentity: Joi.string().required(),
  lastname: Joi.string(),
  fullname: Joi.string(),
  birthdate: Joi.string(),
  address: Joi.string(),
  comment: Joi.string().optional().allow(''),
  phone: Joi.string().optional().allow(''),
  isUpdate: Joi.boolean().default(false),
}
export const validatePathfinder = {
  identity: Joi.string().required(),
}
export const createPathfinder = createUserBody

export const updatePathfinder = { ...createUserBody, _id: Joi.string().required() }

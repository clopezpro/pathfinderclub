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
export const pathfinderSearch = {
  identity: Joi.string(),
  name: Joi.string(),
  birthdate: Joi.string(),
  sortBy: Joi.string().optional(),
  projectBy: Joi.string().optional(),
  limit: Joi.number().integer().optional(),
  page: Joi.number().integer().optional(),
}

export const updatePathfinder = { ...createUserBody, _id: Joi.string().required() }

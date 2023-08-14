import Joi from 'joi'

export const takeList = {
  list: Joi.array().example([{ _id: '111111111111111' }]).default([]),
  comment: Joi.string().optional().allow(null, ''),
  date: Joi.string().required(),
}

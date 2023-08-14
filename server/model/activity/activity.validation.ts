import Joi from 'joi'

export const takeActivity = {
  list: Joi.array().example([{ _id: '111111111111111', grade: 1 }]).default([]),
  comment: Joi.string().optional().allow(null, ''),
  topgrade: Joi.number(),
  typeActivity: Joi.string(),
  name: Joi.string(),
  date: Joi.string().required(),
}

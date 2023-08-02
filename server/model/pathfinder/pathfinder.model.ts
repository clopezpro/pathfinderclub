import mongoose from 'mongoose'
import validator from 'validator'
import paginate from '../../controller/paginate/paginate'
import { roles } from '../../config/roles'
import type { IPathfinderDoc, IPathfinderModel } from './pathfinder.interfaces'

const pathfinderSchema = new mongoose.Schema<IPathfinderDoc, IPathfinderModel>(
  {
    firstname: {
      type: String,
      trim: true,
    },
    lastname: {
      type: String,
      trim: true,
    },
    fullname: {
      type: String,
      trim: true,
    },
    indentity: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    comment: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    birthdate: {
      type: Date,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value))
          throw new Error('Correo invalido')
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value: string) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/))
          throw new Error('La contraseña debe contener al menos una letra y un número')
      },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    isUpdate: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)
pathfinderSchema.plugin(paginate)
pathfinderSchema.static('isIdentityTaken', async function (indentity: string, excludePathfinderId?: mongoose.ObjectId): Promise<boolean> {
  // eslint-disable-next-line @typescript-eslint/no-invalid-this
  const pathfinder = await this.findOne({ indentity, _id: { $ne: excludePathfinderId } })
  return !!pathfinder
})

const Pathfinder = mongoose.model<IPathfinderDoc, IPathfinderModel>('Pathfinders', pathfinderSchema)

export default Pathfinder

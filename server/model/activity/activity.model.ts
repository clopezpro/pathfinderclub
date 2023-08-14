import mongoose, { Schema } from 'mongoose'
import paginate from '../../controller/paginate/paginate'
import { typeActivity } from '../../config/typeActivity'
import type { IActivityBodyDoc, IActivityBodyModel, IActivityHeaderDoc, IActivityHeaderModel } from './activity.interfaces'

/* addd period in later */
const activityHeaderSchema = new mongoose.Schema<IActivityHeaderDoc, IActivityHeaderModel>(
  {
    comment: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    topgrade: {
      type: Number,
      trim: true,
    },
    date: {
      type: Date,
    },
    type: {
      type: String,
      enum: typeActivity,
      default: 'Otra',
    },
  },
  {
    timestamps: true,
  },
)
activityHeaderSchema.plugin(paginate)
const activityBodySchema = new mongoose.Schema<IActivityBodyDoc, IActivityBodyModel>(
  {
    pathfinderId: {
      type: Schema.Types.ObjectId,
      ref: 'pathfinders',
    },
    activityHeaderId: {
      type: Schema.Types.ObjectId,
      ref: 'activityheaders',
    },
    grade: {
      type: Number,
      default: 0,
    },
    comment: {
      type: String,
      required: false,
    },
  },
)

const ActivityHeader = mongoose.model<IActivityHeaderDoc, IActivityHeaderModel>('activityheaders', activityHeaderSchema)
const ActivityBody = mongoose.model<IActivityBodyDoc, IActivityBodyModel>('activitybodies', activityBodySchema)

export { ActivityHeader, ActivityBody }

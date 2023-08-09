import mongoose, { Schema } from 'mongoose'
import paginate from '../../controller/paginate/paginate'
import { typeAttendance } from '../../config/typeAttendance'
import type { IAttendanceBodyDoc, IAttendanceBodyModel, IAttendanceHeaderDoc, IAttendanceHeaderModel } from './attendance.interfaces'

/* addd period in later */
const attendanceHeaderSchema = new mongoose.Schema<IAttendanceHeaderDoc, IAttendanceHeaderModel>(
  {
    comment: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
    },
    type: {
      type: String,
      enum: typeAttendance,
      default: 'attendance',
    },
  },
  {
    timestamps: true,
  },
)
const attendanceBodySchema = new mongoose.Schema<IAttendanceBodyDoc, IAttendanceBodyModel>(
  {
    pathfinderId: {
      type: Schema.Types.ObjectId,
      ref: 'Pathfinders',
    },
    attendanceHeadId: {
      type: Schema.Types.ObjectId,
      ref: 'AttendanceHeaders',
    },
    attendance: {
      type: Boolean,
      default: false,
    },
    comment: {
      type: String,
      required: false,
    },
  },
)
attendanceHeaderSchema.plugin(paginate)

const AttendanceHeader = mongoose.model<IAttendanceHeaderDoc, IAttendanceHeaderModel>('AttendanceHeaders', attendanceHeaderSchema)
const AttendanceBody = mongoose.model<IAttendanceBodyDoc, IAttendanceBodyModel>('AttendanceBodies', attendanceBodySchema)

export { AttendanceHeader, AttendanceBody }

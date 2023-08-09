import type mongoose from 'mongoose'
import type { Document, Model } from 'mongoose'
import type { QueryResult } from '../../controller/paginate/paginate'

export type typeAttendance = 'attendance' | 'event'

export interface IAttendanceHeader {
  comment: string
  date: Date
  type: typeAttendance
}
export interface IAttendanceBody {
  pathfinderId: mongoose.Types.ObjectId
  attendanceHeadId: mongoose.Types.ObjectId
  attendance: boolean
  comment?: string
}

export interface IAttendanceHeaderDoc extends IAttendanceHeader, Document {}
export interface IAttendanceHeaderModel extends Model<IAttendanceHeaderDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>
}

export interface IAttendanceBodyDoc extends IAttendanceBody, Document {}
export interface IAttendanceBodyModel extends Model<IAttendanceBodyDoc> {}

export type NewCreatedAttendance = IAttendanceHeader
export type UpdateAttendance = Partial<IAttendanceHeader>

export type NewCreatedAttendanceBody = IAttendanceBody
export type UpdateAttendanceBody = Partial<IAttendanceBody>

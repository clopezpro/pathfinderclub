import type mongoose from 'mongoose'
import type { Document, Model } from 'mongoose'
import type { QueryResult } from '../../controller/paginate/paginate'

export type typeActivity = 'Otra' | 'Juego' | 'Lectura' | 'Reto'

export interface IActivityHeader {
  comment: string
  name: string
  topgrade: number
  date: Date
  type: typeActivity
}
export interface IActivityBody {
  pathfinderId: mongoose.Types.ObjectId
  activityHeaderId: mongoose.Types.ObjectId
  grade: number
  comment?: string
}

export interface IActivityHeaderDoc extends IActivityHeader, Document {}
export interface IActivityHeaderModel extends Model<IActivityHeaderDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>
}
export interface IActivityBodyDoc extends IActivityBody, Document {}
export interface IActivityBodyModel extends Model<IActivityBodyDoc> {}

export type NewCreatedActivity = IActivityHeader
export type UpdateActivity = Partial<IActivityHeader>

export type NewCreatedActivityBody = IActivityBody
export type UpdateActivityBody = Partial<IActivityBody>

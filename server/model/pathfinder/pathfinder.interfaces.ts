import type { Document, Model } from 'mongoose'
import type mongoose from 'mongoose'
import type { AccessAndRefreshTokens } from '../token/token.interfaces'
import type { QueryResult } from '../../controller/paginate/paginate'

export interface IPathfinder {
  firstname: string
  indentity: string
  lastname: string
  fullname: string
  birthdate: Date
  address: string
  comment: string
  phone: string
  email: string
  isUpdate: boolean
  password: string
  role: string
}

export interface IPathfinderDoc extends IPathfinder, Document {
  isPasswordMatch(password: string): Promise<boolean>
}
export interface IPathfinderModel extends Model<IPathfinderDoc> {
  isIdentityTaken(indentity: string, excludePathfinderId?: mongoose.Types.ObjectId): Promise<boolean>
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>
}
export type NewCreatedPathfinder = IPathfinder
export type UpdatePathfinderBody = Partial<IPathfinder>

export interface IPathfinderWithTokens {
  pathfinder: IPathfinderDoc
  tokens: AccessAndRefreshTokens
}

import type { Model, ObjectId } from 'mongoose'

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
}
export interface IPathfinderModel extends Model<IPathfinder> {
  isIdentityTaken(indentity: string, excludePathfinderId?: ObjectId): Promise<boolean>
}
export interface IPathfinderDoc extends IPathfinder, Document {
  isPasswordMatch(password: string): Promise<boolean>
}

export type NewCreatedPathfinder = Omit<IPathfinder, 'isIdentityTaken'>
export type UpdatePathfinderBody = Partial<IPathfinder>

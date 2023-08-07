export interface AuthData {
  _id: string
  email: string
  name: string
  role: string
}

export interface TokensT {
  token: string | null
  expires: Date | null
}

export interface IUser {
  pathfinder: AuthData
  tokens: {
    access: TokensT
  }
  loading: boolean

}
export interface IModule {
  name: string
  icon: string
  path?: string
  selected?: boolean
  subMenus?: ISubMenu[] | []
}
export interface ISubMenu {
  name: string
  icon: string
  path: string
}

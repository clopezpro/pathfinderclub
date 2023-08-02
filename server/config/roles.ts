const allRoles = {
  user: [],
  admin: ['getUsers', 'manageUsers'],
}

export const roles: string[] = Object.keys(allRoles)

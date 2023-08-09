import type { IModule } from '~/types'

// @unocss-include

export const MODULE_LIST: IModule[] = [
  {
    name: 'home',
    icon: 'i-carbon-home',
    path: '/',
  },
  {
    name: 'config',
    icon: 'i-carbon-settings-adjust',
    path: '/config',
    subMenus: [
      {
        name: 'Users',
        icon: 'i-carbon-user-profile-alt',
        path: '/config/users',
      },
    ],
  },
  {
    name: 'PathFinders',
    icon: 'i-carbon-reminder-medical',
    path: '/list',
    subMenus: [
      {
        name: 'TakeList',
        icon: 'i-carbon-license-draft',
        path: '/pathfinder/takeList',

      },
      {
        name: 'List',
        icon: 'i-carbon-notification',
        path: '/pathfinder/list',

      },
    ],
  },
]

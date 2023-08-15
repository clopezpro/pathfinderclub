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
        name: 'TakeActivity',
        icon: 'i-carbon-license-draft',
        path: '/pathfinder/takeActivity',

      },
      {
        name: 'List Updated',
        icon: 'i-carbon-notification',
        path: '/pathfinder/list',

      },
      {
        name: 'Activity Resume',
        icon: 'i-carbon-report',
        path: '/pathfinder/showActivity',

      },
    ],
  },
]
export const MONTHS = [{
  name: 'Todos',
  value: null,
}, {
  name: 'Enero',
  value: 0,
},
{
  name: 'Febrero',
  value: 1,
},
{
  name: 'Marzo',
  value: 2,
},
{
  name: 'Abril',
  value: 3,
},
{
  name: 'Mayo',
  value: 4,
},
{
  name: 'Junio',
  value: 5,
},
{
  name: 'Julio',
  value: 6,
},
{
  name: 'Agosto',
  value: 7,
},
{
  name: 'Septiembre',
  value: 8,
},
{
  name: 'Octubre',
  value: 9,
},
{
  name: 'Noviembre',
  value: 10,
},
{
  name: 'Diciembre',
  value: 11,
},
]
export function OnlyMonths() {
  MONTHS.shift()
  return MONTHS
}

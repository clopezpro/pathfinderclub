import { defineStore } from 'pinia'
import type { IModule } from '@/types'
import { MODULE_LIST } from '~/constants/lists'

export const useMenuStore = defineStore('useMenuStore', () => {
  const menu = ref<IModule[] | []>(MODULE_LIST.map((menu) => {
    menu.selected = false
    return menu
  }))
  const showMenu = ref<boolean>(false)
  const minimized = ref<boolean>(false)
  const loading = ref<boolean>(false)
  const $route = useRouter()
  const selectMenu = (name: string) => {
    for (const [key, value] of menu.value.entries()) {
      menu.value[key].selected = false
      if (value.name === name) {
        if (value.subMenus?.length === 0) {
          showMenu.value = false /* is a module only not display submenus */
          continue
        }
        else {
          showMenu.value = true
        }
        menu.value[key].selected = true
      }
    }
  }
  const minimizeBar = () => {
    minimized.value = !minimized.value
    if (minimized.value)
      showMenu.value = false
  }
  const setDefaultMenu = () => {
    for (const [key, value] of menu.value.entries()) {
      menu.value[key].selected = false
      if (value.subMenus) {
        const subMenu = value.subMenus?.find(subMenu => subMenu.path === $route.currentRoute.value.path)
        if (subMenu)
          menu.value[key].selected = true
      }
      else {
        if (menu.value[key].path === $route.currentRoute.value.path)
          menu.value[key].selected = true
      }
      // set default selected menu by path in route currentPath
    }
  }
  setDefaultMenu()
  const openAndCloseMenu = () => {
    showMenu.value = !showMenu.value
    if (showMenu.value && minimized.value)
      minimized.value = false
  }
  const getMenuActive = () => {
    return menu.value.find(menu => menu.selected)
  }
  return {
    loading,
    minimized,
    showMenu,
    getMenuActive,
    getMenus: menu,
    minimizeBar,
    selectMenu,
    openAndCloseMenu,
  }
})

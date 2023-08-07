<script setup lang="ts">
import subMenus from './navBar/navBar.subMenus.vue'
import { useMenuStore } from '~/stores/menu'
import type { IModule } from '@/types'

const sidebarElement = ref<HTMLElement | null>(null)

const useAuth = useAuthUserStore()
const useMenu = useMenuStore()
const $route = useRoute()

/* onClickOutside(sidebarElement, () => {
  menuOpen.value = null
}) */

const getMenus = computed(() => {
  return useMenu.getMenus
})
function selectMenu(menu: IModule) {
  useMenu.selectMenu(menu.name)
  if (menu.subMenus?.length === 0 && menu.path)
    navigateTo(menu.path)
}
/* onMounted(() => {
  useMenu.fetchMenus()
}) */
</script>

<template>
  <div v-if="!useMenu.minimized" flex>
    <div

      id="sidebar"
      ref="sidebarElement"
      scrollbar
      scrollbar-rounded
      scrollbar-w-6px
      scrollbar-radius-2
      scrollbar-track-black
      scrollbar-thumb-radius-4
      scrollbar-thumb-red-900
      class=" scrollbar-track-gray-800 dark:bg-gray-800/[.42]"
      dark:border-gray-800
      border-gray-200
      bg-white
      border-r
      backdrop-blur

      shadow
      min-h-full
      transition-all
      duration-300
      linear
      overflow-y-auto
      flex
      z-50
    >
      <div>
        <div flex justify-center mt-1 overflow-hidden>
          <UTooltip text="Ocultar">
            <button
              class="justify-center flex-1 h-full border dark:border-green-800 rounded-md"
              @click="useMenu.minimizeBar()"
              @touchmove="useMenu.minimizeBar()"
            >
              <div class="relative">
                <div i-carbon-arrow-left h-7 w-7 text-muted-600 dark:text-muted-200 />
              </div>
            </button>
          </UTooltip>
        </div>
        <div
          overflow-hidden
          mt-2
        >
          <div class="w-full text-center">
            <hr class="dark:border-gray-500">
            <div class="text-center text-4xl text-primary ">
              מ
            </div>
            <hr class="dark:border-gray-500">
            <div class=" p-1">
              <div class=" flex justify-center">
                <UButton
                  title="CERRAR LA SESSION ACTUAL "
                  :padded="false"
                  variant="outline"
                  :loading="useAuth.loading"
                  class="justify-center  mr-1"
                  @click="useAuth.logout()"
                >
                  <div v-if="!useAuth.loading" class="relative text-red-600">
                    <div i-carbon-power h7 w-7 />
                  </div>
                </UButton>
                <UButton
                  title="Recargar Módulos "
                  variant="outline"
                  class=" mr-1 p-1"
                  icon="i-carbon-update-now"
                  :loading="useMenu.loading"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          flex="~ row col" justify-top gap-4
          pt-2
          px-1
          items-center
        >
          <ul>
            <li v-for="(menu, index) in getMenus" :key="index">
              <div>
                <div
                  class="mt-1"
                  :class="{
                    ' rounded-2xl transition-colors duration-300 bg-primary-100 text-primary-500 dark:bg-primary-500/10 p-2  ': menu.selected,
                    'dark:bg-primary-500/10 border border-gray-800 border-2xl  border-dashed': menu.selected && useMenu.showMenu,

                  }
                  "
                >
                  <div

                    flex
                    flex-col
                    items-center
                    border
                    cursor-pointer
                    rounded-md
                    border-muted-200
                    dark:border-muted-700
                    p-1 px-2
                    text-xs
                    @click="selectMenu(menu)"
                  >
                    <div

                      w-5
                      h-5
                      :class="menu.icon"
                    />
                    <div>{{ menu.name }}</div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <Transition name="slide-fade">
      <subMenus v-if="useMenu.showMenu" :items="useMenu.getMenuActive()" />
    </Transition>
  </div>
  <div

    v-if="useMenu.minimized"
    dark:bg-muted-900
    border-dashed
    class="group  "
    lg:w-5
    lg:px2
    w-2
    noprint
    flex="~ row col" justify-evenly
    items-center
    border=" r base"
    border-primary
    shadow="md"
    shadow-primary
    @click="useMenu.minimizeBar()"
    @touchmove="useMenu.minimizeBar()"
  >
    <div
      class="transition-transform  group  group-hover:scale-200"
      transform hover:scale-110 group:bg-primary hover="   rounded  "
    >
      <div i-heroicons-chevron-double-right-solid h-8 w-8 text-primary shadow-primary shadow="md" />
    </div>
  </div>
</template>

<style>
  #sidebar{
    --scrollbar-track: gray-800;
    --scrollbar-thumb: gray;
}
.activeModule{

  color: green-500;
  background-color: gray-900;
  box-shadow: 0 0 0 2px green-500;
  padding: 0.5rem;
}
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from{
  transform: translateX(-20px);
  opacity: 0;
}
.slide-fade-leave-to{
  transform: translateX(-200px);
  border: 0px;
  opacity: 100;
}
</style>

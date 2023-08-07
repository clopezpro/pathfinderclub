<script setup lang="ts">
import { toRefs } from 'vue'
import type { IModule } from '../../types'

const props = defineProps(
  {
    items: {
      required: false,
      type: Object as () => IModule,
      default: () => ({} as IModule),
    },
  },
)
const { items } = toRefs(props)
</script>

<template>
  <div
    class="w-[200px]"
    border
    border-muted-200
    dark:border-muted-700
    dark:bg-gray-900
    pointer-events-auto
    relative
    z-10
    h-full

    bg-white
  >
    <div
      class="flex h-screen flex-col"
    >
      <ul>
        <div class="flex h-16 w-full items-center px-6">
          <div class="font-heading text-muted-700 text-lg font-light capitalize dark:text-white">
            {{ items.name }}
          </div>
        </div>
        <div slimscroll relative h-full w-full overflow-y-auto px-2>
          <div border border-muted-200 dark:border-green-700 rounded-md py-2 dark:bg-muted-900>
            <NuxtLink
              v-for="submenu in items.subMenus || []" :key="submenu.path"
              v-slot="{ isActive }" :to="submenu.path" title="Home"
            >
              <li
                class=""
                hover="dark:bg-muted-700 "
                :class="{
                  ' dark:bg-muted-700 text-primary text-primary-500 shadow-md border-gray-300 ml-2': isActive,
                }"
                dark:bg-gray-800
                bg-muted-100
                text-muted-400
                hover:text-primary-500
                focus:text-primary-500
                rounded-md
                text-primary
                flex items-center
                m-1
                divide-x
                divide-x-green-700
              >
                <div
                  pl-2
                  min-h-8
                  class=" flex gap-x-2 w-full items-center "
                >
                  <div

                    w-5
                    h-5
                    :class="submenu.icon"
                  />
                  <span
                    class="font-sans text-sm"
                  >
                    {{ submenu.name.toUpperCase() }}
                  </span>
                </div>
              </li>
            </NuxtLink>
          </div>
        </div>
      </ul>
    </div>
  </div>
</template>

<style>
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

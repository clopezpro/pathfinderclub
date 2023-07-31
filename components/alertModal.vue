<script setup lang="ts">
import { onClickOutside, onKeyDown } from '@vueuse/core'

import { provideAlertErrorModal } from '~/composables/alert'

provideAlertErrorModal(showModalError)
const dataModal = reactive({
  typeShow: 'info' as string,
  show: false as boolean,
  title: '' as string,
  message: '' as string,
  stack: null as string | null | undefined,
})
const showStack = ref<boolean>(false)
function showModal(params: {
  typeShow?: 'info' | 'error' | 'warning' | 'success' | 'question' | undefined
  title: string
  message: string
  stack?: string | null | undefined
}): void {
  dataModal.show = true
  dataModal.title = params.title
  dataModal.message = params.message
  dataModal.stack = params.stack
  dataModal.typeShow = params.typeShow || 'info'
}
function showModalError(e: Error | string | unknown, origin?: string | undefined): void {
  if (e instanceof Error) {
    showModal({
      typeShow: 'error',
      title: `${e.name} ${e.cause || ''} ${origin || ''}`,
      message: e.message,
      stack: e.stack,
    })
  }
  if (typeof e === 'string') {
    showModal({
      typeShow: 'error',
      title: `${origin || ''}`,
      message: e,
    })
  }
  if (!e) {
    showModal({
      typeShow: 'error',
      title: `${origin || ''}`,
      message: 'ERROR DESCONOCIDO',
    })
  }
}
function hideModal() {
  dataModal.show = false
  dataModal.title = ''
  dataModal.message = ''
  dataModal.stack = null
  showStack.value = false
}
const el = ref<HTMLElement | null>(null)

const getClassIcon = computed(() => {
  switch (dataModal.typeShow) {
    case 'error':
      return 'bg-red-800 text-red-200 bg-opacity-90'
    default:
      return 'bg-blue-800 text-blue-200'
  }
})
const getIcon = computed(() => {
  switch (dataModal.typeShow) {
    case 'error':
      return 'i-material-symbols-skull-outline h-6 w-6'
    default:
      return 'i-carbon-user-identification h-6 w-6'
  }
})
onKeyDown('Escape', () => {
  if (dataModal.show)
    dataModal.show = false
})

onClickOutside(el, () => {
  dataModal.show = false
})
</script>

<template>
  <div class="z-100">
    <UModal v-model="dataModal.show">
      <div class="bg-muted-100 dark:bg-muted-900 w-full p-4 rounded shadow-xl">
        <div>
          {{ dataModal.title }}
        </div>
        <div mb-4 flex items-center gap-2>
          <div
            :class="getClassIcon"
            class="animate-pulse  rounded-full m-1   opacity-90   p-2 relative inline-flex shrink-0 items-center justify-center"
          >
            <div :class="getIcon" />
          </div>
          {{ dataModal.message }}
        </div>
        <div v-if="dataModal.typeShow" class="flex justify-center w-full gap-2">
          Mostrar Stack for Dev
          <UToggle
            v-model="showStack" :ui="{
              container: {
                base: 'pointer-events-none relative inline-block h-4 w-4 rounded-full bg-white dark:bg-gray-900 shadow  ring-0 transition ease-in-out duration-200',
              },
            }" on-icon="i-heroicons-check-20-solid" off-icon="i-heroicons-x-mark-20-solid" color="primary"
          />
        </div>
        <div
          v-if="showStack" class="group transition-all duration-300" border="muted-200 2 dashed"
          dark="border-muted-700 bg-muted-800" bg-white duration-300 rounded-xl relative mx-auto mt-1 max-w-3xl p-3
          hover:border-solid
        >
          <div
            class="
              mt-1
              overflow-auto
              whitespace-pre
              p-2
              font-mono
              text-sm
              opacity-60
              transition-all
              duration-300
              group-hover:opacity-100
              group-focus:opacity-100"
          >
            <button
              absolute top-1 right-1 z-100 p1 n-link bg-black:60 rounded-full title="Close"
              @click="showStack = false"
            >
              <div i-carbon-close />
            </button>
            {{ dataModal.stack }}
          </div>
        </div>
      </div>
    </UModal>
  </div>
</template>

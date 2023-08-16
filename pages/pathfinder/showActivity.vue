<script setup>
import { OnlyMonths } from '~/constants/lists'

definePageMeta({
  title: 'Mostrar Actividades',
  middleware: ['authenticated'],
})
const columns = [{
  key: 'id',
  label: 'ID',
}, {
  key: 'name',
  label: 'Conquistador',
}]
const dataDB = ref([])

const alertError = useAlertErrorModal()
const toast = useToast()

const loading = reactive({
  list: false,
})
const filter = reactive({
  name: '',
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
})

const Activities = ref([])
const ActivityBodies = ref([])
/* watch(filter, () => {
  if (filter.monthCurrent)
    filter.month = monthCurrent

  else
    filter.month = undefined
}) */

const showColumns = computed(() => {
  if (Activities.value.length > 0) {
    return [
      ...columns,
      ...Activities.value.map((rs) => {
        return {
          key: rs._id,
          label: `${rs.name} ${rs.dateStr}`,
        }
      }),
      {
        key: 'average',
        label: 'Promedio',
      },

    ]
  }

  return [...columns]
})

async function getActivityV2() {
  loading.process = true

  const { data, error } = await fetchMAHIRFULL('/api/pathfinders/getActivityResume', {
    method: 'POST',
    server: false,
    body: { month: filter.month, year: filter.year },
  })
  loading.process = false
  if (error.value)
    return alertError(error.value)

  dataDB.value = data.value.data
  Activities.value = data.value.activities
}
onMounted(() => {
  nextTick(async () => {
    await getActivityV2()
    //
  })
})
</script>

<template>
  <div class="flex  items-center  justify-end">
    <div class="w-full text-center">
      <h1 text-primary-600 md:text-2xl font-bold>
        ACTIVIDADES REALIZADAS POR MES
      </h1>
    </div>
    <div />
    <div class="border border-gray-800 p-2 rounded-md">
      <div class="text-primary-500 text-center">
        Buscar Conquistador
      </div>
      <div />
      <div class="">
        <UFormGroup name="month" :label="`Solo ACTIVIDADES este  mes ${parseInt(filter.month) ? parseInt(filter.month) + 1 : 'Todos'} ?`">
          <USelect v-model="filter.month" icon="i-carbon-calendar-heat-map" :options="OnlyMonths()" option-attribute="name" />
        </UFormGroup>
      </div>
      <div>
        <UFormGroup size="xs" name="lastname" label="Buscar por Nombres y Apellidos">
          <UInput v-model="filter.fullname" placeholder="Moran Loor" icon="i-carbon-identification" />
        </UFormGroup>
      </div>
      <div class="flex justify-end">
        <UButton @click="getActivityV2">
          Buscar
        </UButton>
      </div>
    </div>
  </div>
  <div class="overflow-x-auto">
    <UTable :columns="showColumns" :rows="dataDB">
      <template v-for="activity in Activities" :key="activity._id" #[`${activity._id}-header`]>
        <UPopover>
          <UButton color="white" :label="activity.name" trailing-icon="i-heroicons-chevron-down-20-solid" />

          <template #panel>
            <div p-2>
              <div class="text-primary-500 text-center">
                Nombre: {{ activity.name }}
              </div>
              <div class="text-primary-500 ">
                Fecha: {{ activity.dateStr }}
              </div>
              <div v-if=" activity.comment.length > 0" class="text-primary-500 ">
                Comment:{{ activity.comment }}
              </div>
              <div class="text-primary-500 ">
                Tipo: {{ activity.type }}
              </div>
            </div>
          </template>
        </UPopover>
      </template>
      <template #id-data="{ index }">
        <div>
          {{ index + 1 }}
        </div>
      </template>
    </UTable>
  </div>
</template>

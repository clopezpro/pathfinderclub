<script setup>
import { MONTHS } from '~/constants/lists'

definePageMeta({
  title: 'Lista Actividades',
  middleware: ['authenticated'],
})

const columns = [{
  key: 'id',
  label: 'ID',
}, {
  key: 'fullname',
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
  month: null,
})

const Activity = ref([])
const ActivityBodies = ref([])
/* watch(filter, () => {
  if (filter.monthCurrent)
    filter.month = monthCurrent

  else
    filter.month = undefined
}) */

const showColumns = computed(() => {
  if (Activity.value.length > 0) {
    return [
      ...columns,
      ...Activity.value.map((rs) => {
        return {
          key: rs._id,
          label: rs.name,
          component: 'UCheckbox',
          props: {
            'value': `row.grades.${rs._id}`,
            'true-value': true,
            'false-value': false,
          },
        }
      }),
    ]
  }

  return [...columns]
})
const showData = computed(() => {
  if (ActivityBodies.value.length > 0) {
    const activityKeys = Activity.value.map(rs => rs._id)

    return dataDB.value.map((rs) => {
      activityKeys.forEach((idActivity) => {
        rs[idActivity] = ActivityBodies.value.find(rsYes => idActivity === rsYes.activityHeaderId && rs._id === rsYes.pathfinderId)?.grade || 0
      })
      return rs
    })
  }
  return [...dataDB.value]
})
async function getActivity() {
  loading.process = true
  const { data, error } = await fetchMAHIRFULL('/api/pathfinders/getActivity', {
    method: 'POST',
    body: { month: filter.month, year: filter.year },
  })
  loading.process = false
  if (error.value)
    return alertError(error.value)

  if (data.value.results.length > 0) {
    Activity.value = data.value.results
    getActivityBodies()
  }
  else {
    dataDB.value = dataDB.value.map((rs) => {
      rs.grades = []
      return rs
    })
  }
}
async function getActivityBodies() {
  loading.process = true
  const { data, error } = await fetchMAHIRFULL('/api/pathfinders/getActivityBodies', {
    method: 'POST',
    body: { headers: Activity.value.map(rs => rs._id) },
  })
  loading.process = false
  if (error.value)
    return alertError(error.value)

  if (data.value.length > 0) {
    const yesActivity = data.value
    ActivityBodies.value = data.value
  }
  else {
    ActivityBodies.value = []
  }
}

async function getTopPathfinder() {
  const params = Object.keys(filter).reduce((obj, key) => {
    if (filter && Object.prototype.hasOwnProperty.call(filter, key) && filter[key])
      obj[key] = filter[key]
    return obj
  }, {})
  loading.list = true
  const { data, error } = await fetchMAHIRFULL('/api/pathfinders/top', {
    method: 'POST',
    body: { ...params, isUpdate: true },
  })
  loading.list = false
  if (error.value)
    return alertError(error.value)

  dataDB.value = data.value.results
}
// getActivity()
getTopPathfinder()
</script>

<template>
  <div class="flex   justify-end">
    <div />
    <div class="border border-gray-800 p-2 rounded-md">
      <div class="text-primary-500 text-center">
        Buscar Conquistador
      </div>
      <div />
      <div class="">
        <UFormGroup name="month" :label="`Solo ACTIVIDADES este  mes ${parseInt(filter.month) ? parseInt(filter.month) + 1 : 'Todos'} ?`">
          <USelect v-model="filter.month" icon="i-carbon-calendar-heat-map" :options="MONTHS" option-attribute="name" />
        </UFormGroup>
      </div>
      <div>
        <UFormGroup size="xs" name="lastname" label="Buscar por Nombres y Apellidos">
          <UInput v-model="filter.fullname" placeholder="Moran Loor" icon="i-carbon-identification" />
        </UFormGroup>
      </div>
      <div class="flex justify-end">
        <UButton @click="getActivity">
          Buscar
        </UButton>
      </div>
    </div>
  </div>
  <div class="overflow-x-auto">
    <UTable :columns="showColumns" :rows="showData">
      <template #id-data="{ index }">
        <div>
          {{ index + 1 }}
        </div>
      </template>
    </UTable>
  </div>
</template>

<script setup>
definePageMeta({
  title: 'Lista Pathfinders',
  middleware: ['authenticated'],
})

const columns = [{
  key: 'id',
  label: 'ID',
}, {
  key: 'fullname',
  label: 'Conquistador',
},
{
  key: 'birth',
  label: 'Cumpleaños',
},
{
  key: 'actions',
  label: '-',
}]
const dataDB = ref([])

const months = [{
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
const loading = reactive({
  list: false,
})
const filter = reactive({
  identity: '',
  name: '',
  birthdate: '',
  isUpdate: true,
  monthCurrent: false,
  month: null,
})

/* watch(filter, () => {
  if (filter.monthCurrent)
    filter.month = monthCurrent

  else
    filter.month = undefined
}) */
const alertError = useAlertErrorModal()
async function getTopPathfinder() {
  const params = Object.keys(filter).reduce((obj, key) => {
    if (filter && Object.prototype.hasOwnProperty.call(filter, key) && filter[key])
      obj[key] = filter[key]
    return obj
  }, {})
  loading.list = true
  const { data, error } = await fetchMAHIRFULL('/api/pathfinders/top', {
    method: 'POST',
    body: { ...params },
  })
  loading.list = false
  if (error.value)
    return alertError(error.value)

  dataDB.value = data.value.results
}
getTopPathfinder()
</script>

<template>
  <div class="flex   justify-end">
    <div />
    <div class="border border-gray-800 p-2 rounded-md">
      <div class="text-primary-500 text-center">
        Buscar Conquistador
      </div>
      <div class="flex justify-center">
        <div class="">
          Solo quien Actualizo?
        </div>
        <UToggle
          v-model="filter.isUpdate" :ui="{
            container: {
              base: 'pointer-events-none relative inline-block h-4 w-4 rounded-full bg-white dark:bg-gray-900 shadow  ring-0 transition ease-in-out duration-200',
            },
          }"
        />
      </div>
      <div class="">
        <UFormGroup name="email" :label="`Solo quien cumple este  mes ${parseInt(filter.month) ? parseInt(filter.month) + 1 : 'Todos'} ?`">
          <USelect v-model="filter.month" icon="i-carbon-calendar-heat-map" :options="months" option-attribute="name" />
        </UFormGroup>
      </div>
      <div />
      <div>
        <UFormGroup size="xs" name="lastname" label="Buscar por Nombres y Apellidos">
          <UInput v-model="filter.fullname" placeholder="Moran Loor" icon="i-carbon-identification" />
        </UFormGroup>
      </div>
      <div class="flex justify-end">
        <UButton @click="getTopPathfinder">
          Buscar
        </UButton>
      </div>
    </div>
  </div>
  <div class="overflow-x-auto">
    <UTable :columns="columns" :rows="dataDB">
      <template #id-data="{ index }">
        <div>
          {{ index + 1 }}
        </div>
      </template>
      <template #actions-data="{ row }">
        <div v-if="row.isUpdate" class="text-green-400 ">
          OK
        </div>
        <div v-else class="text-red-800 ">
          NO
        </div>
      </template>
    </UTable>
  </div>
</template>

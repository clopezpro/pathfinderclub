<script setup>
const alertError = useAlertErrorModal()
const toast = useToast()

const items = [{
  label: 'Datos Actividad',
  key: 'activity',
  icon: 'i-carbon-data-check',
  content: 'This is the content shown for Tab1',
}, {
  label: 'Calificar',
  key: 'rateActivity',
  icon: 'i-carbon-license-draft',

}]
const Activities = ref([])
const loading = reactive({
  list: false,
  process: false,
})
const form = reactive({
  _id: undefined,
  typeActivity: 'Otra',
  date: '',
  name: '',
  comment: '',
  topgrade: 1,
})
const tabActive = ref(0)
function nextRate() {
  tabActive.value = 1
}
const typeActivity = ['Otra', 'Juego', 'Lectura', 'Reto']

const columns = [{
  key: 'id',
  label: 'ID',
}, {
  key: 'fullname',
  label: 'Conquistador',
},
{
  key: 'acc',
  label: 'acc',
}]
const dataDB = ref([])
async function getTopPathfinder() {
  loading.list = true
  const { data, error } = await fetchMAHIRFULL('/api/pathfinders/top', {
    method: 'POST',
    body: { isUpdate: true },
  })
  loading.list = false
  if (error.value)
    return alertError(error.value)

  dataDB.value = data.value.results.map((rs) => {
    rs.grade = 0
    return rs
  })
}
function setDateCurrent() {
  const now = new Date()
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  form.date = `${year}-${month}-${day}`
}
async function processActivity() {
  loading.process = true
  const { data, error } = await fetchMAHIRFULL('/api/pathfinders/takeActivity', {
    method: 'POST',
    body: { list: dataDB.value, ...form },
  })
  loading.process = false
  if (error.value)
    return alertError(error.value)

  tabActive.value = 0
  form._id = undefined
  form.name = ''
  form.comment = ''
  form.topgrade = 1
  dataDB.value = dataDB.value.map((rs) => {
    rs.grade = 0
    return rs
  })
  toast.add({
    title: 'Notas Ingresadas con éxito!',
  })
}

async function getActivityByMonth() {
  loading.list = true
  let month = 0
  let year = 2023
  if (form.date) {
    month = new Date(form.date).getMonth()
    year = new Date(form.date).getFullYear()
  }
  else {
    month = new Date().getMonth()
    year = new Date().getFullYear()
  }
  const { data, error } = await fetchMAHIRFULL('/api/pathfinders/getActivityByMonth', {
    method: 'POST',
    server: false,
    body: { month, year },
  })
  loading.list = false
  if (error.value)
    return alertError(error.value)

  Activities.value = data.value
}
/* watch(form.date, async () => {
  await getActivityByMonth()
}) */
setDateCurrent()
getTopPathfinder()
getActivityByMonth()
</script>

<template>
  <div>
    <UTabs v-model="tabActive" :items="items">
      <template #default="{ item, index, selected }">
        <div class="flex items-center gap-2 relative truncate">
          <UIcon :name="item.icon" class="w-4 h-4 flex-shrink-0" />

          <span class="truncate">{{ index + 1 }}. {{ item.label }}</span>

          <span v-if="selected" class="absolute -right-4 w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400" />
        </div>
      </template>
      <template #item="{ item }">
        <UCard>
          <div v-if="item.key === 'activity'" class=" md:mx-auto  flex">
            <div border border-gray-800 p-2 rounded-md>
              <UTable
                :columns="[{
                             key: 'name',
                           },
                           { key: 'type' },
                           { key: 'date' },

                ]" :rows="Activities"
              >
                >
              </UTable>

              <!--  <div v-for="activity in Activities" :key="activity._id">
                {{ activity.name }}
              </div> -->
            </div>
            <div class="border border-gray-800 p-2 rounded-md ">
              <div class="text-primary-500 text-center">
                Tomar Actividad
              </div>
              <div>
                <UFormGroup size="xs" name="date" label="Fecha Actividad">
                  <UInput v-model="form.date" my-2 border type="date" icon="i-carbon-calendar-heat-map" @change="getActivityByMonth" />
                  <p text-xs />
                </UFormGroup>
              </div>
              <div flex md:flex-row flex-col gap-2>
                <div w-full>
                  <UInput v-model="form.name" label="Nombre" class=" border" placeholder="NOMBRE DE LA ACTIVIDAD" icon="i-carbon-rule-test" size="sm" color="white" />
                </div>
                <div>
                  <USelect v-model="form.typeActivity" label="Tipo " border :options="typeActivity" />
                </div>
                <div>
                  <UInput v-model="form.topgrade" label="Nota Max" text-right size="sm" border type="number" />
                </div>
              </div>
              <UTextarea v-model="form.comment" my-2 placeholder="Algún Comentario de este dia " autoresize color="primary" border size="sm" />
              <div flex items-center gap-x-2 justify-end>
                <div text-primary-600 />
                <UButton label="CONTINUAR" color="gray" variant="solid" @click="nextRate" />
              </div>
            </div>
          </div>
          <div v-else-if="item.key === 'rateActivity'" class="space-y-3">
            <div class="text-primary-500 text-center">
              Calificar Actividad
            </div>
            <div class="flex items-center justify-end md:flex-row flex-col gap-2">
              <UIcon name="i-carbon-calendar-heat-map" class="w-4 h-4 flex-shrink-0" />
              <span class="truncate">{{ form.date }}</span>
              <div>
                {{ form.name }}
              </div>
              <div>
                Sobre: {{ form.topgrade }}
              </div>
            </div>
            <div flex justify-end>
              <UButton :loading="loading.process" type="button" label="GUARDAR NOTAS" color="primary" variant="solid" @click="processActivity" />
            </div>
            <div class="overflow-x-auto">
              <UTable :columns="columns" :rows="dataDB">
                <template #id-data="{ index }">
                  <div>
                    {{ index + 1 }}
                  </div>
                </template>
                <template #acc-data="{ index }">
                  <div w-10>
                    <UInput v-model="dataDB[index].grade" text-right :padded="false" size="sm" border :min="0" :max="form.topgrade" type="number" />
                  </div>
                </template>
              </UTable>
            </div>
          </div>
        </UCard>
      </template>
    </UTabs>
  </div>
</template>

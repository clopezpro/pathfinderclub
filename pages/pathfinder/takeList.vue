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
  key: 'acc',
  label: 'acc',
}]
const dataDB = ref([])

const loading = reactive({
  list: false,
  process: false,
})
const form = reactive({
  _id: undefined,
  comment: '',
  birthdate: '',

})

/* watch(filter, () => {
  if (filter.monthCurrent)
    filter.month = monthCurrent

  else
    filter.month = undefined
}) */
function setAttendance(item, attendance) {
  const index = dataDB.value.findIndex(rs => rs._id === item._id)
  if (index !== -1)
    dataDB.value[index].attendance = attendance
}
const alertError = useAlertErrorModal()
async function getTopPathfinder() {
  loading.list = true
  const { data, error } = await fetchMAHIRFULL('/api/pathfinders/top', {
    method: 'POST',
    body: { isUpdate: true },
  })
  loading.list = false
  if (error.value)
    return alertError(error.value)

  dataDB.value = data.value.results
}

const showDate = computed(() => {
  if (form.birthdate) {
    const [year, month, day] = form.birthdate?.split('-')
    const now = new Date(+year, +month - 1, +day)
    return `${now.toLocaleDateString('ec-EC', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}`
  }
  return ''
})
const showResume = computed(() => {
  return dataDB.value.filter(a => a.attendance).length
})
async function processList() {
  loading.process = true
  const { data, error } = await fetchMAHIRFULL('/api/pathfinders/takeList', {
    method: 'POST',
    body: { list: dataDB.value, comment: form.comment, date: form.birthdate },
  })
  loading.process = false
  if (error.value)
    return alertError(error.value)
}

async function getAttendance() {
  loading.process = true
  const { data, error } = await fetchMAHIRFULL('/api/pathfinders/getAttendance', {
    method: 'POST',
    body: { date: form.birthdate },
  })
  loading.process = false
  if (error.value)
    return alertError(error.value)

  if (data.value.results.length > 0) {
    form._id = data.value.results[0]._id
    form.comment = data.value.results[0].comment
    getAttendanceBodies()
  }
  else {
    form._id = undefined
    dataDB.value = dataDB.value.map((rs) => {
      rs.attendance = false
      return rs
    })
  }
}
async function getAttendanceBodies() {
  loading.process = true
  const { data, error } = await fetchMAHIRFULL('/api/pathfinders/getAttendanceBodies', {
    method: 'POST',
    body: { header: form._id },
  })
  loading.process = false
  if (error.value)
    return alertError(error.value)

  if (data.value.length > 0) {
    const yesAttendance = data.value.filter(rs => rs.attendance)

    dataDB.value = dataDB.value.map((rs) => {
      rs.attendance = yesAttendance.findIndex(rsYes => rsYes.pathfinderId === rs._id) !== -1
      return rs
    })
  }
}
function setDateCurrent() {
  const now = new Date()
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  form.birthdate = `${year}-${month}-${day}`
  getAttendance()
}
/* watch(form.birthdate, async () => {
  console.log('change')
  await getAttendance()
}) */
setDateCurrent()
getTopPathfinder()
</script>

<template>
  <div class="flex   justify-center">
    <div class="border border-gray-800 p-2 rounded-md">
      <div class="text-primary-500 text-center">
        Tomar Lista
      </div>
      <div>
        <UFormGroup size="xs" name="birthdate" label="Fecha Actual">
          <UInput v-model="form.birthdate" my-2 border type="date" icon="i-carbon-calendar-heat-map" @change="getAttendance" />
          <p text-xs>
            {{ showDate }}
          </p>
        </UFormGroup>
      </div>
      <UTextarea v-model="form.comment" my-2 placeholder="Algún Comentario de este dia " autoresize color="primary" border size="sm" />
      <div flex items-center gap-x-2 justify-end>
        <div text-primary-600>
          {{ showResume }}
        </div>
        <UButton v-if="!form._id" :disabled="loading.process" :loading="loading.process" label="PROCESAR" color="gray" variant="solid" @click="processList" />
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
      <template #acc-data="{ row }">
        <div v-if="row.attendance">
          <UButton :disabled="form._id ? true : false" label="SI" icon="i-carbon-checkbox-checked" color="primary" variant="solid" @click="setAttendance(row, false)" />
        </div>
        <div v-else>
          <UButton :disabled="form._id ? true : false" label="NO" icon="i-carbon-checkbox" square color="red" variant="solid" @click="setAttendance(row, true)" />
        </div>
      </template>
    </UTable>
  </div>
</template>

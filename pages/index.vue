<script setup lang="ts">
useHead({
  title: 'Club Abisai Actualiza tus Datos',
  meta: [
    { name: 'description', content: 'Una aplicación del club de conquistadores Abisai de la Iglesia Realiad de Dios de Monte Sinai en Guayaquil' },
    { property: 'og:image', itemprop: 'image', content: '/cub_abisai.webp' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@dev_clopez' },
    { name: 'twitter:creator', content: '@dev_clopez' },
  ],
  link: [
    {
      rel: 'icon', type: 'image/webp', href: '/cub_abisai.webp',
    },
    {
      itemprop: 'thumbnailUrl', type: 'image/webp', href: '/cub_abisai.webp',
    },
  ],
})

const alertError = useAlertErrorModal()
const loading = reactive({
  identity: false,
  form: false,
})
const form = reactive({
  _id: undefined,
  firstname: '',
  indentity: '',
  lastname: '',
  fullname: '',
  birthdate: null,
  address: '',
  comment: '',
  phone: '',
  email: '',
  isUpdate: false,
})
async function registerPathfinder() {
  const { data, error } = await useFetch('/api/pathfinders/register', {
    method: 'POST',
    body: form,
  })
  if (error.value)
    return alertError(error.value)

  alert(`Estimado Conquistador ${form.fullname}, has cumplido el Reto de Actualizar tu datos envia una captura de esto al club`)
  form.isUpdate = true
  form._id = undefined
}
function updateFullname() {
  form.fullname = `${form.lastname} ${form.firstname}`
}
async function searchPathfinder() {
  loading.identity = true
  const { data, error } = await useFetch('/api/pathfinders/validate', {
    method: 'POST',
    body: { identity: form.indentity },
  })
  loading.identity = false
  if (error.value)
    return alertError(error.value)

  if (data.value) {
    const datForm = data.value
    if (datForm?.isUpdate)
      return alert('YA HAS ACTUALIZADO TUS DATOS MUCHAS GRACIAS ;)')

    let birthdate = datForm.birthdate || null
    if (birthdate) {
      const [year, month, day] = birthdate.split('-')
      birthdate = `${year}-${month}-${day}`
    }
    form._id = datForm._id
    form.fullname = datForm.fullname
    form.firstname = datForm.firstname
    form.lastname = datForm.lastname
    form.birthdate = datForm.birthdate
    form.address = datForm.address
    form.phone = datForm.phone
    form.email = datForm.email
  }
}
const showDate = computed(() => {
  if (form.birthdate) {
    const [year, month, day] = form.birthdate?.split('-')
    const now = new Date(+year, +month - 1, +day)

    const f = new Date().getFullYear()
    const yearsOld = f - parseInt(year)

    return `${now.toLocaleDateString('ec-EC', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })} Tienes ${yearsOld} ${yearsOld <= 1 ? 'año' : 'años'}`
  }
  return ''
})

// registerPathfinder()
</script>

<template>
  <div flex mx-auto justify-center items-center>
    <UCard>
      <template #header>
        Club de Conquistadores <span text-primary-500>ABISAI</span>
      </template>
      <div>
        <UFormGroup size="xs" hint="Obligatorio" help="Escriba el numero de cédula debe tener 10 dígitos" name="identity" label="Cédula de Indentidad">
          <div flex gap-2>
            <div w-full>
              <UInput v-model="form.indentity" type="tel" :loading="loading.identity" placeholder="1234567890" icon="i-carbon-identification" />
            </div>
            <div>
              <UButton icon="i-carbon-search" :loading="loading.identity" label="Buscar" :disabled="loading.identity" @click="searchPathfinder" />
            </div>
          </div>
        </UFormGroup>
      </div>
      <div v-if="form._id && !form.isUpdate">
        <div v-if="form.fullname.length > 0">
          <p text-xs>
            Sus Nombres completos son :
          </p>
          <div text-center text-primary-500 text-italic>
            <p>{{ form.fullname }}</p>
          </div>
        </div>
        <div text-xs py-2>
          <strong text-red-500>NOTA:</strong>
          Si sale tu nombre completo igual debes colocar tu apellido y nombre, para confirmar ;) <br>
          solo se puede actualizar una vez, si colocas datos erroneos no PASARAS el reto
        </div>
        <div flex:lg gap-x-2>
          <UFormGroup size="xs" name="firstname" label="Coloca  tus Nombres">
            <UInput v-model="form.firstname" placeholder="Andy Jariel" icon="i-carbon-identification" @change="updateFullname" />
          </UFormGroup>
          <UFormGroup size="xs" name="lastname" label="Coloca tus  Apellidos">
            <UInput v-model="form.lastname" placeholder="Moran Loor" icon="i-carbon-identification" @change="updateFullname" />
          </UFormGroup>
        </div>
        <div>
          <UFormGroup size="xs" name="birthdate" label="Fecha de Nacimiento">
            <UInput v-model="form.birthdate" type="date" icon="i-carbon-calendar-heat-map" />
            <p text-xs>
              {{ showDate }}
            </p>
          </UFormGroup>
        </div>
        <div>
          <UFormGroup size="xs" name="address" label="Tu direccion">
            <UInput v-model="form.address" placeholder="Monte sinahi realidad de dios MZ-111 SOLAR: 444" type="text" icon="i-carbon-map" />
          </UFormGroup>
        </div>
        <div>
          <UFormGroup size="xs" name="telefono" label="Numero de teléfono de contacto">
            <UInput v-model="form.phone" placeholder="096125500" type="tel" icon="i-carbon-phone-ip" />
          </UFormGroup>
        </div>
        <div>
          <UFormGroup size="xs" name="email" label="tu correo si es que tienes">
            <UInput v-model="form.email" placeholder="Andyfiufiu@gmai.com" type="email" icon="i-carbon-phone-ip" />
          </UFormGroup>
        </div>
        <div flex justify-end>
          <UButton label="GUARDAR" :loading="loading.form" :disabled="loading.form" @click="registerPathfinder" />
        </div>
      </div>

      <template #footer />
    </UCard>
  </div>
</template>

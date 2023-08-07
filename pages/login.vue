<script setup lang="ts">
import { useAuthUserStore } from '@/stores/auth.js'

/* import { computed} from "vue";
import { useAuthemailStore } from "@/stores/auth.js"; */
/* import { onMounted } from 'vue'; */

const useAuth = useAuthUserStore()
const alertError = useAlertErrorModal()
const { NAMESYSTEM } = useRuntimeConfig().public
definePageMeta({
  title: 'Login',
  description: 'Inicializar sesion en el sistema',
  layout: 'login',
  middleware: ['unauthenticated'],
})
const form = reactive({
  email: '',
  password: '',
})
const loading = ref<boolean>(false)
async function login() {
  loading.value = true
  const { data, error } = await fetchMAHIRFULL('/api/auth/login', {
    method: 'POST',
    body: { ...form },
  })
  loading.value = false

  if (error.value)
    return alertError(error.value, 'AL INICIAR SESSION')

  useAuth.setUser(data.value)
}
</script>

<template>
  <div h-screen flex justify-center items-center>
    <div class="flex-initial w-full min-w-min max-w-md">
      <div class=" px-10">
        <div w-full rounded shadow-xl border-opacity-5 bg-white p-5 dark:bg-muted-800>
          <!-- header -->
          <header>
            <p class="text-center text-xl text-orange-500">
              {{ NAMESYSTEM }}
            </p>
          </header>
          <!-- form -->
          <div>
            <div>
              <div class="text-center">
                <h2 class="intro-x focus:bg-black font-bold text-2xl xl:text-3xl dark:text-gray-200">
                  Iniciar Sesion
                </h2>
              </div>
              <UInput
                v-model="form.email" color="white" variant="outline" placeholder="Correo Electronico"
                icon="i-heroicons-envelope" size="lg"
              />
            </div>
            <div>
              <div>
                <label class="block" for="password">Contraseña de {{ form.email }}</label>
                <UInput
                  v-model="form.password" color="white" type="password" variant="outline" placeholder="Contraseña"
                  icon="i-heroicons-finger-print-20-solid" size="lg" autocomplete="current-password"
                />
              </div>
              <div class="flex justify-around pt-4">
                <span class="rounded-md shadow-sm">
                  <UButton :loading="loading" :disabled="loading" type="button" variant="ghost" @click="login()">
                    INICIAR SESSION
                  </UButton>
                </span>
              </div>
              <div flex text-xs italic justify-end>
                <div flex px-4 shadow-sm gap-2>
                  <div i-carbon-favorite-filled text-red-800 animated pulse infinited />
                  <div>
                    Mariuxi Moran
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
* {
  box-sizing: border-box;
}

.contenedor_login {
  display: flex;
  justify-content: center;
  align-items: center;
  @apply h-screen;
}
</style>

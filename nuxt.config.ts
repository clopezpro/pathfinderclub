const isDev = process.env.NODE_ENV === 'development'

// const apiBaseUrl = 'http://localhost:3001'
const apiBaseUrl = 'https://movies-proxy.vercel.app'

export default defineNuxtConfig({
  modules: [
    '@nuxthq/ui',
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@vee-validate/nuxt',
  ],
  experimental: {
    inlineSSRStyles: false,
    viewTransition: true,
    renderJsonPayloads: true,
  },
  runtimeConfig: {
    public: {
      apiBaseUrl,
      NAMESYSTEM: process.env.NAMESYSTEM,
    },
    URL_MONGO: process.env.MONGO_URL,
    KEY_GPT: process.env.KEY_GPT,
    SEED: process.env.SEED,
    PASS_TOKEN: process.env.PASS_TOKEN,
    NODE_ENV: process.env.NODE_ENV,
  },
  devtools: {
    enabled: true,
  },
  nitro: {
    routeRules: {
      '/**': { isr: false },
    },
  },
})

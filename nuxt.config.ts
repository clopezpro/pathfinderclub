const isDev = process.env.NODE_ENV === 'development'

// const apiBaseUrl = 'http://localhost:3001'
const apiBaseUrl = '/'

export default defineNuxtConfig({
  modules: [
    '@nuxthq/ui',
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
  ],
  colorMode: {
    preference: 'system',
  },
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
    jwtConfig: {
      secret: process.env.JWT_SECRET,
      accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES,
      refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION_DAYS,
      resetPasswordExpirationMinutes: process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
      verifyEmailExpirationMinutes: process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
      cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        signed: true,
      },
    },
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

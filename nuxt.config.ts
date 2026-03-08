// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-12-21',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', 'vuetify-nuxt-module', '@pinia/nuxt'],
  runtimeConfig: {
    // apiSecret: '123',
    public: {
      apiBase: 'https://vercel-test-store-api.vercel.app',
    },
  },
  css: ['~/assets/css/global.scss'],
  eslint: {
    config: {
      import: {
        package: 'eslint-plugin-import-lite',
      },
    },
  },

  vuetify: {
    moduleOptions: {},
    vuetifyOptions: './vuetify.config.ts',
  },
})

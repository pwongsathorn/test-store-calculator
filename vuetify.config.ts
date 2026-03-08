import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration'

export default defineVuetifyConfiguration({
  /* vuetify options */
  theme: {
    defaultTheme: 'light',
  },
  defaults: {
    VRow: {
      density: 'comfortable',
    },
    VBtn: {
      density: 'comfortable',
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
    },
  },
})

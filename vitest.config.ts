// import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

export default defineConfig({
  test: {
    projects: [
      {
        plugins: [vue()],
        resolve: {
          alias: {
            '~': resolve(__dirname, 'app'), // ✅ Nuxt srcDir is ./app
            '@': resolve(__dirname, 'app'), // ✅ same
            '#app': resolve(__dirname, 'node_modules/nuxt/dist/app'),
            '#imports': resolve(__dirname, 'tests/mocks/imports.ts'),
          },
        },
        test: {
          name: 'unit',
          include: ['tests/unit/*.{test,spec}.ts'],
          environment: 'happy-dom',
          globals: true,
          setupFiles: ['./tests/setup.ts'],
          server: {
            deps: {
              inline: ['vuetify'],
            },
          },
        },
      },
      {
        test: {
          name: 'e2e',
          include: ['tests/e2e/*.{test,spec}.ts'],
          environment: 'node',
        },
      },
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['tests/nuxt/*.{test,spec}.ts'],
          environment: 'nuxt',
        },
      }),
    ],
  },
})

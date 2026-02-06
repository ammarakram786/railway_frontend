// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@pinia/nuxt'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      apiBase: ''
    }
  },

  compatibilityDate: '2025-01-15',

  icon: {
    serverBundle: 'remote',
    clientBundle: {
      scan: true,
      includeCustomCollections: true
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },
  nitro: {
  devProxy: {
    '/api': {
      target: 'http://10.0.121.52:8000/api',
      changeOrigin: true,
      prependPath: true
      }
    }
  },

})

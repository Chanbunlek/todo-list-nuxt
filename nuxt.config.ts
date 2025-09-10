// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
    devServer: {
    host: '0.0.0.0'
  },
  app: {
    baseURL: '/todo-list-nuxt'
  },
  vite: {
    server: {
      allowedHosts: [
        '.ngrok-free.app'
      ]
    }
  },
  ssr: false,
  nitro: {
    preset: 'static'
  },
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    'nuxt-headlessui',
    '@pinia/nuxt',
    '@vee-validate/nuxt'
  ],
  veeValidate: {
    // disable or enable auto imports
    autoImports: true,
    // Use different names for components
    componentNames: {
      Form: 'VeeForm',
      Field: 'VeeField',
      FieldArray: 'VeeFieldArray',
      ErrorMessage: 'VeeErrorMessage',
    },
  },
  components: [
    {
      path: '~/components/',
      pathPrefix: false
    }
  ]
})
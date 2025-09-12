import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: true },

  // Global CSS (Tailwind entry)
  css: ['~/assets/css/main.css'],

  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/icon',
    '@nuxtjs/tailwindcss'
  ],

  app: {
    head: {
      title: 'nox-nuxt-v4',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#111827' }
      ]
    }
  },

  // Example runtime config (override via env)
  runtimeConfig: {
    apiSecret: process.env.NUXT_API_SECRET || '',
    public: {
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'Nuxt Template',
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api'
    }
  },

  // Route rules demonstrate per-path behavior (edit as needed)
  routeRules: {
    '/': { prerender: true }
  }
})

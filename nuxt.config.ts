import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: true },

  // Global CSS (Tailwind entry)
  css: ['~/assets/css/main.css'],

  modules: [
    '@pinia/nuxt',
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

  // Disable client app-manifest fetch to avoid /_nuxt/builds/meta 404s on Netlify
  experimental: {
    appManifest: false
  },

  // Example runtime config (override via env)
  runtimeConfig: {
    apiSecret: process.env.NUXT_API_SECRET || '',
    auth: {
      cookieName: process.env.NUXT_AUTH_COOKIE_NAME || 'sid',
      sessionDays: Number(process.env.NUXT_AUTH_SESSION_DAYS || 365),
      secureCookies: process.env.NODE_ENV === 'production'
    },
    public: {
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'Nuxt Template',
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
      timeZone: process.env.NUXT_PUBLIC_TIME_ZONE || 'America/Sao_Paulo'
    }
  },

  // Disable client app-manifest fetch to avoid /_nuxt/builds/meta 404s on Netlify
  experimental: {
    appManifest: false
  },

  // Route rules demonstrate per-path behavior (edit as needed)
  routeRules: {
    '/': { prerender: true }
  }
})

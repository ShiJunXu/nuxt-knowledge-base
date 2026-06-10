export default defineNuxtConfig({
  compatibilityDate: '2026-06-10',
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/color-mode'],
  devtools: { enabled: true },
  colorMode: {
    classSuffix: '',
    preference: 'light'
  },
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      title: 'Knowledge Hub',
      meta: [
        {
          name: 'description',
          content: 'A Nuxt knowledge base for learning notes, content planning, and certificates.'
        }
      ]
    }
  },
  nitro: {
    prerender: {
      routes: [
        '/',
        '/login',
        '/register',
        '/category/english',
        '/category/frontend',
        '/category/wechat',
        '/category/redbook',
        '/category/certificates'
      ]
    }
  }
})

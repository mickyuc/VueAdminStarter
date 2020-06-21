import { config as envConfig } from 'dotenv'
import colors from 'vuetify/es5/util/colors'

envConfig()
const PAGE_TITLE = 'Admin'

export default {
  mode: 'universal',
  head: {
    titleTemplate: `%s - ${PAGE_TITLE}`,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  loading: { color: '#fff' },
  css: [
    '@mdi/font/css/materialdesignicons.css'
  ],
  env: {
    title: PAGE_TITLE,
    version: process.env.npm_package_version,
    upTime: new Date()
  },
  plugins: [
    '~/plugins/filters',
    '~/plugins/axios'
  ],
  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify'
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    // '@nuxtjs/pwa',
    '@nuxtjs/dotenv'
  ],
  axios: {
    proxy: true,
    prefix: '/api'
  },
  proxy: {
    '/api': {
      target: process.env.PROXY_TARGET || 'http://localhost:3000'
    }
  },
  auth: {
    redirect: {
      logout: '/login'
    },
    strategies: {
      local: {
        endpoints: {
          login: { url: '/auth/login', method: 'post', propertyName: false },
          logout: { url: '/auth/logout', method: 'post' },
          user: { url: '/auth/user', method: 'get', propertyName: false }
        },
        tokenRequired: false,
        tokenType: false
      }
    }
  },
  vuetify: {
    defaultAssets: false,
    customVariables: ['~/assets/variables.scss'],
    icons: {
      iconfont: 'mdi'
    },
    treeShake: true,
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  router: {
    middleware: [
      'auth',
      'meta',
      'roles/staff'
    ]
  },
  build: {
    transpile: [
      'vuetify'
    ],
    extend (config, ctx) {
    }
  }
}

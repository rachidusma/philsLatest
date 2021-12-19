export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - Phil\'s Burger',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/PhilsBurger_Logo_Rund_Sv.png' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/css/main.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/axios'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    'nuxt-animejs'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/buefy
    'nuxt-buefy',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/dayjs',
    '@nuxtjs/auth-next',
    '@nuxtjs/i18n',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    ['nuxt-vuex-localstorage', {
      localStorage: ['localStorage']
    }]
  ],

  i18n: {
    locales: [
      { code: 'en', file: 'en.js' },
      { code: 'sw', file: 'sw-lng.js' }
    ],
    lazy: true,
    langDir: 'lang/',
    defaultLocale: 'en'
  },

  dayjs: {
    locales: ['en', 'sw'],
    defaultLocale: 'en'
  },

  pageTransition: {
    name: 'page',
    mode: 'out-in',
    css: false,

    beforeEnter (el) {
      this.$anime.set(el, {
        opacity: 0
      })
    },

    enter (el, done) {
      this.$anime({
        targets: el,
        opacity: [0, 1],
        duration: 500,
        easing: 'easeInOutSine',
        complete: done
      })
    },

    leave (el, done) {
      this.$anime({
        targets: el,
        opacity: [1, 0],
        duration: 500,
        easing: 'easeInOutSine',
        complete: done
      })
    }
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseUrl: '/api'
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },
  auth: {
    // Options
    // cookie: {
    //   options: {
    //     domain: 'egypt-economy.com'
    //     // secure: 'true'
    //   }
    // },
    redirect: false,
    strategies: {
      local: {
        endpoints: {
          login: { url: '/users/auth', method: 'post', propertyName: 'token' },
          logout: false,
          user: { url: '/users/me', method: 'get', propertyName: 'data' }
        },
        token: {
          required: true,
          name: 'x-auth-token',
          type: ''
        }
      }
    },
    plugins: ['~/plugins/auth.js']
  },
  env: {
    baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://qopla.herokuapp.com',
    stripePublicKey: 'pk_test_51JvMKcAgMQD7Pt0PWPxeOWArxjl7bOv7bOPY7P3Rfc6DaqsXrd0SaegQNdVkuMlduutuEccII32Ke5r60PORLdDJ006PmrmZeg'
  },
  router: {
    middleware: ['ssr-cookie']
  },
  serverMiddleware: {
    '/api': '~/api'
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend (config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map'
      }
    },
    transpile: [
      'nuxt-vuex-localstorage'
    ]
  }
}

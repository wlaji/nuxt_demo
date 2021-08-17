import colors from 'vuetify/es5/util/colors'
import path from 'path'
import fs from 'fs'

const prodPlugins = []
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console')
}

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    __dangerouslyDisableSanitizers: ['script', 'noscript'],//不转义script标签的内容,用于结构化数据
    titleTemplate: '%s - nuxt_demo',
    title: 'nuxt_demo',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: ''},
      {name: 'format-detection', content: 'telephone=no'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
      {
        rel: "preload",
        href:
          "https://sticker-static.oss-us-west-1.aliyuncs.com/static/font/calibri-regular.woff",
        as: "font",
        type: "font/woff",
        crossorigin: "anonymous"
      }
    ],
    script: [
      {
        src: "/js/lib-flexible.js" // 淘宝手机端适配解决方案
      },
      {
        src: "//at.alicdn.com/t/font_1065565_1tg1d7eb9a1.js", //阿里图标, 请根据自己的去替换
        async: true,
        defer: true
      }
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/css/main.scss',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    {src: '~/plugins/axios.js'},
    {src: '~/plugins/filter.js'},
    {src: '~/plugins/globalBus.js'}
  ],

  server: {
    port: 3002, // default: 3000
    host: '0.0.0.0', // default: localhost,
    timing: false,
    // https: {
    //   key: fs.readFileSync(path.resolve(__dirname, 'server.key')),
    //   cert: fs.readFileSync(path.resolve(__dirname, 'server.crt'))
    // }
  },

  render: {
    resourceHints: false //禁用预加载
  },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/style-resources',
  ],

  styleResources: {
    //全局scss变量
    sass: ['./assets/css/variables.scss']
  },

  router: {
    middleware: ["device"]
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/css/variables.scss'],
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

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    analyze: false,
    postcss: {
      plugins: [
        // 解决scss文件编译后会将 calc(100% / (var(--aspect-ratio))) 变为 calc(100% / var(--aspect-ratio))的问题
        require('postcss-remove-nested-calc')
      ]
    },
    babel: {
      plugins: [
        ...prodPlugins //打包移除console
      ],
    }
  }
}

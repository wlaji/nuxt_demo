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
      {'http-equiv': "X-UA-Compatible", content: "IE=edge"},
      {name: "renderer", content: "webkit"},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: ''},
      {hid: "keywords", name: "keywords", content: ""},
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
      // {
      //   src: "/js/lib-flexible.js", // 淘宝手机端适配解决方案
      //   body: true
      // },
      // {
      //   src: "/js/chat.js", // 聊天插件
      //   body: true,
      //   async: true,
      //   defer: true
      // }
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
    {src: '~/plugins/globalBus.js'},
    { src: '~/plugins/i18n.js' }
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
    resourceHints: false, //禁用预加载
    asyncScripts: true
  },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/style-resources',
    '@nuxtjs/i18n',
  ],
  i18n: {
    locales: [
      {name: 'English', code: 'en', iso: 'en-US', file: 'en.js'},
      {name: '简体中文', code: 'zh', iso: 'zh-cn', file: 'zh.js'},
    ],
    lazy: true,
    langDir: '~/lang/',
    defaultLocale: 'en',
    baseUrl: 'http://192.168.1.7:3002'
  },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    ['@nuxtjs/vuetify', {
      customVariables: ['~/assets/css/variables.scss'],
      defaultAssets: {
        font: false,
        icons: 'mdi'
      },
      treeShake: true,
    }]
  ],

  vuetify : {
    optionsPath : '~/plugins/vuetify.options.js'
  },

  styleResources: {
    //全局scss变量
    sass: ['./assets/css/variables.scss']
  },

  router: {
    middleware: []
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    analyze: true,
    postcss: {
      plugins: {
        cssnano: {
          preset: [
            "default",
            {
              calc: false
            }
          ]
        }
      }
    },
    babel: {
      plugins: [
        ...prodPlugins //打包移除console
      ],
    },
    //分割vendor.app.js文件(打包优化)
    optimization: {
      minimize:true,
      splitChunks: {
        minSize: 1000000,
        maxSize: 2500000,
        cacheGroups: {
          // //缓存组，将所有加载模块放在缓存里面一起分割打包
          vendors: {
            chunks: "initial",
            // 提升权重，先抽离第三方模块，再抽离公共模块，要不然执行抽离公共模块就截止不会往下执行
            priority: 100,
            // 文件最小字节
            minSize: 10240,
            test: /[\\/]node_modules[\\/]/
          },
          common: {
            chunks: "all",
            priority: 10,
            // 文件最小字节
            minSize: 10240,
            // 引用次数
            minChunks: 2,
            //模块嵌套引入时，判断是否复用已经被打包的模块
            reuseExistingChunk: true
          }
        }
      }
    }
  }
}

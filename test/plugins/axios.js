import utils from '@/utils/utils'
import { Message } from 'element-ui'
import { initializeAxios } from '@/utils/request'

function queryString(data) {
  let ret = ''
  for (let it in data) {
    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
  }
  return ret
}

export default ({ req, res, store, app, redirect }, inject) => {
  // 创建axios实例
  const http = app.$axios.create({
    timeout: 300000
  })
  let baseUrl =
    process.env.NODE_ENV === 'development'
      ? 'https://sticker-api.gs-souvenir.com/'
      :'https://4031w093e1.goho.co/sticker-api/'
  let timeOut = 300000
  // 基本配置
  http.defaults.timeout = timeOut
  http.defaults.headers.post['Content-Type'] =
    'application/x-www-form-urlencoded'
  http.defaults.baseURL = baseUrl
  initializeAxios(http)
  // request拦截器
  http.onRequest(
    config => {
      if (config.method === 'post') {
        if (config.headers['Content-Type'] !== 'multipart/form-data') {
          config.data = queryString(config.data)
        }
      }
      if (process.client) {
        let token = utils.getcookiesInClient('token')
        if (token) {
          config.headers['token'] = token
        }
      } else {
        let serverCookie = utils.getcookiesInServer(req)
        if (serverCookie.token) {
          config.headers['token'] = serverCookie.token
        }
      }
      return config
    },
    error => {
      console.log(error)
      Promise.reject(error)
    }
  )

  // 响应拦截器
  http.onResponse(
    response => {
      const code = response.data.ret
      if (code === 401) {
        if(process.client){
          utils.removeCookie('token')
          store.commit('SET_USER', '')
          // store.commit('SET_CART', [])
          store.commit('set_checkoutCart', [])
          redirect(302, '/login')
        }else{

        }
      } else if (code === 0) {
        //接口错误
        Message.error({ message: response.data.msg })
        return Promise.reject('error')
      } else if (code === 101 || code === 402) {
        //参数错误
        Message.error({ message: response.data.msg })
        return Promise.reject('error')
      } else {
        return response.data
      }
    },
    error => {
      console.log('err' + error)
      Message({
        message: error.message,
        type: 'error',
        duration: 2 * 1000
      })
      return Promise.reject(error)
    }
  )
  inject('http', http)
}

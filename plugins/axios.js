import {initializeAxios} from '~/utils/request'
import qs from 'qs'

// 声明一个 Map 用于存储每个请求的标识 和 取消函数
const pending = new Map();

/**
 * 清空 pending 中的请求（在路由跳转时调用）
 */
export const clearPending = () => {
  for (const [url, cancel] of pending) {
    cancel(url)
  }
  pending.clear()
};

export default ({req, res, store, app, redirect}) => {
  // 创建axios实例
  const service = app.$axios.create({
    baseURL: process.env.NODE_ENV === 'development' ?
      'http://120.24.82.148:8088'
      : '/api',
    timeout: 5000,
    transformRequest: [(data) => {
      data = JSON.stringify(data);
      return data
    }],
    headers: {
      get: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      post: {
        'Content-Type': 'application/json;charset=utf-8'
      }
    },
  });

  // request拦截器
  service.onRequest(config => {
      return config
    },
    error => {
      return Promise.reject(error)
    }
  )

  // 响应拦截器
  service.onResponse(response => {
      return response.data
    },
    error => {
      if (app.$axios.isCancel(error)) {
        console.log('repeated request')
      } else {
        error.data = {};
        error.data.message = '请求超时或服务器异常，请检查网络或联系管理员！';
        console.log(error.data.message )
      }
      return Promise.reject(error)
    }
  )
  initializeAxios(service)
}

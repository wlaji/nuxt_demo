import { request } from '@/utils/request'

//获取业务员自定义产品信息
export function getCustomProductInfo(data) {
  return request({
    url: '/api/product/getCustomProductInfo',
    method: 'post',
    data
  })
}





import { request } from '@/utils/request'

//获取页面信息
export function getPageInfo(data) {
  return request({
    url: '/api/Page/getPageInfo',
    method: 'post',
    data
  })
}


















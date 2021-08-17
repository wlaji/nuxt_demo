import { request } from '@/utils/request'

export function getActivityPageInfo(data) {
  return request({
    url: '/api/Activity/getActivityPageInfo',
    method: 'post',
    data
  })
}
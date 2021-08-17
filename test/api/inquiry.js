import { request } from '@/utils/request'

//添加询盘
export function addInquiry(data) {
  return request({
    url: '/api/Inquiry/addInquiry',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}





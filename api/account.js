import { request } from '@/utils/request'

//测试
export function getArticleList(params) {
  return request({
    url: '/manage/config/getArticleList   ',
    method: 'post',
    data: params
  })
}


















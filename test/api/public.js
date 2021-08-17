import { request } from '@/utils/request'
//尺寸表
export function getProductConfig(data) {
  return request({
    url: '/api/product/getProductConfig',
    method: 'post',
    data
  })
}

//获取首尾信息
export function getHeadInfo() {
  return request({
    url: '/api/Page/getHead',
    method: 'post'
  })
}

//获取产品
export function getSubProduct(data) {
  return request({
    url: '/api/product/getSubProduct',
    method: 'post',
    data
  })
}

//获取页面信息
export function getPageInfo(data) {
  return request({
    url: '/api/Page/getPageInfo',
    method: 'post',
    data
  })
}

//获取国家信息
export function getCountry() {
  return request({
    url: '/api/config/getCountry',
    method: 'post'
  })
}

//获取省份信息
export function getState(data) {
  return request({
    url: '/api/config/getState',
    method: 'post',
    data
  })
}

//获取货币信息
export function getCurrency() {
  return request({
    url: '/api/config/getCurrency',
    method: 'post'
  })
}

//获取基础价格列表
export function getQuotation(data) {
  return request({
    url: '/api/product/getQuotation',
    method: 'post',
    data
  })
}

//获取产品配置信息
export function getConfigInfo(data) {
  return request({
    url: '/api/product/getProductParam',
    method: 'post',
    data
  })
}

//获取详细价格
export function getProductPrice(data) {
  return request({
    url: '/api/product/getProductPrice',
    method: 'post',
    data
  })
}

//获取活动详细价格
export function getCouponProductPrice(data) {
  return request({
    url: '/api/product/getCouponProductPrice',
    method: 'post',
    data
  })
}

//邮件订阅
export function subscriptions(data) {
  return request({
    url: '/api/user/emailSubscriptions',
    method: 'post',
    data
  })
}

//邮件退订
export function emailUnsubscribe(data) {
  return request({
    url: '/api/user/emailUnsubscribe',
    method: 'post',
    data
  })
}

//oss上传图片
export function ossUpload(data,onUploadProgressFn) {
  return request({
    url: 'https://sticker-api.gs-souvenir.com/oss/uploadImage',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress:onUploadProgressFn
  })
}

//oss上传文件
export function ossUploadFile(data,onUploadProgressFn) {
  return request({
    url: 'https://sticker-api.gs-souvenir.com/oss/uploadFile',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress:onUploadProgressFn
  })
}

//获取颜色列表
export function getColorData() {
  return request({
    url: '/api/config/getColorList',
    method: 'post'
  })
}

//验证用户是否注册
export function isRegister(data) {
  return request({
    url: '/api/User/isRegister',
    method: 'post',
    data
  })
}

//获取同级小分类
export function getSameLevelProduct(data) {
  return request({
    url: '/api/product/getSameLevelProduct',
    method: 'post',
    data
  })
}

//获取FAQ问答
export function getFaqByName(data) {
  return request({
    url: '/api/faq/getFaqByName',
    method: 'post',
    data
  })
}

//获取促销码
export function getActivityCouponCodeByName(data) {
  return request({
    url: '/api/ActivityCoupon/getActivityCouponCodeByName',
    method: 'post',
    data
  })
}

//根据优惠码规格title获取规格信息
export function getActivityCouponTypeMessage(data) {
  return request({
    url: 'api/ActivityCoupon/getActivityCouponTypeMessage',
    method: 'post',
    data
  })
}

//访问量统计
export function addWebVisit(data) {
  return request({
    url: '/api/WebVisit/addWebVisit',
    method: 'post',
    data
  })
}

//获取网站评论
export function getSiteReviews(data) {
  return request({
    url: '/api/review/getSiteReviews',
    method: 'post',
    data
  })
}

//获取网站评论
export function getSiteReviewInfo(data) {
  return request({
    url: '/api/review/getSiteReviewInfo',
    method: 'post',
    data
  })
}


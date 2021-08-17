import { request } from '@/utils/request'

//下单
export function addOrder(data) {
  return request({
    url: '/api/Order/addOrder',
    method: 'post',
    data
  })
}

export function addActivityOrder(data) {
  return request({
    url: '/api/ActivityOrder/addActivityOrder',
    method: 'post',
    data
  })
}

//支付
export function pay(data) {
  return request({
    url: '/payment/pay',
    method: 'post',
    data
  })
}

//支付 免费订单
export function addFreeOrder(data) {
  return request({
    url: '/api/freeorder/addFreeOrder',
    method: 'post',
    data
  })
}

//根据优惠券代码检查并获取优惠券
export function getAndCheckCouponByCouponCode(data) {
  return request({
    url: 'api/coupon/getAndCheckCouponByCouponCode',
    method: 'post',
    data
  })
}

//获取默认优惠力度最大的优惠券
export function getBestCoupons(data) {
  return request({
    url: 'api/Coupon/getBestCoupons',
    method: 'post',
    data
  })
}

//获取可以使用的优惠券列表
export function getUserCoupon(data) {
  return request({
    url: 'api/Coupon/getUserCoupon',
    method: 'post',
    data
  })
}

//改变选择的优惠券
export function changeUserCoupon(data) {
  return request({
    url: 'api/Coupon/changeUserCoupon',
    method: 'post',
    data
  })
}

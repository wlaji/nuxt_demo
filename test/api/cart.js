import { request } from '@/utils/request'

//添加购物车
export function addCart(data) {
  return request({
    url: '/api/Cart/addCart',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data,
  })
}

//购物车合并
export function cartMerge(data) {
  return request({
    url: '/api/cart/cartMerge',
    method: 'post',
    data,
  })
}

//获取用户购物车列表
export function getUserCart() {
  return request({
    url: '/api/Cart/getUserCart',
    method: 'post',
  })
}

//更改购物车数量
export function updateCartCount(data) {
  return request({
    url: 'api/Cart/editCartNumber',
    method: 'post',
    data
  })
}


//删除购物车数据
export function delCart(data) {
  return request({
    url: '/api/Cart/deleteCart',
    method: 'post',
    data
  })
}

//购物车添加附件
export function addCartAccessory(data) {
  return request({
    url: '/api/cart/addCartAccessory',
    method: 'post',
    data
  })
}



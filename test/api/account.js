import { request } from '@/utils/request'

//账号密码登录
export function login(data) {
  return request({
    url: '/api/User/userLogin',
    method: 'post',
    data,
  })
}

//邮箱登录
export function emailToLogin(data) {
  return request({
    url: '/api/User/codeLogin',
    method: 'post',
    data,
  })
}

//第三方登录
export function thirdPartLogin(data) {
  return request({
    url: '/api/user/thirdPartyLogin',
    method: 'post',
    data,
  })
}

//第三方绑定网站用户
export function thirdPartyLoginBindingUser(data) {
  return request({
    url: '/api/user/thirdPartyLoginBindingUser',
    method: 'post',
    data,
  })
}

//第三方绑定网站用户
export function thirdPartyLoginRegisterUser(data) {
  return request({
    url: '/api/user/thirdPartyLoginRegisterUser',
    method: 'post',
    data,
  })
}

//发送登录验证码
export function sendLoginEmail(data) {
  return request({
    url: '/api/User/sendLoginCode',
    method: 'post',
    data,
  })
}

//退出登录
export function loginOut(data) {
  return request({
    url: '/api/User/userLogOut',
    method: 'post',
    data,
  })
}

//查询是否登录
export function isLogin(data) {
  return request({
    url: '/home/account/isLogin',
    method: 'post',
    data,
  })
}

//获取用户信息
export function fetchUserInfo(data) {
  return request({
    url: '/api/User/getUserInfo',
    method: 'post',
    data,
  })
}

//注册
export function register(data) {
  return request({
    url: '/api/User/userRegister',
    method: 'post',
    data,
  })
}

//修改用户信息
export function updateUserInfo(data) {
  return request({
    url: '/api/User/editUser',
    method: 'post',
    data,
  })
}

//修改密码
export function updateUserPwd(data) {
  return request({
    url: '/api/User/changePassword',
    method: 'post',
    data,
  })
}

//忘记密码发送邮件
export function sendCode(data) {
  return request({
    url: '/api/User/sendChangePasswordCode',
    method: 'post',
    data,
  })
}

//忘记密码重置密码
export function resetPassword(data) {
  return request({
    url: '/api/User/changePasswordByCode',
    method: 'post',
    data,
  })
}

//修改,添加收货地址
export function editAddress(data) {
  return request({
    url: '/api/User/editAddress',
    method: 'post',
    data,
  })
}

//删除收货地址
export function delAddress(data) {
  return request({
    url: '/api/User/deleteAddress',
    method: 'post',
    data,
  })
}
//获取地址列表
export function getUserAddressList(){
  return request({
    url: '/api/User/getUserAddressList',
    method: 'post',
  })
}
//获取地址信息
export function getAddressInfo(data) {
  return request({
    url: '/api/User/getAddressById',
    method: 'post',
    data,
  })
}

//获取订单列表
export function getOrderList(data) {
  return request({
    url: '/api/Order/getOrderList',
    method: 'post',
    data,
  })
}

//用户取消订单
export function userCancelOrder(data) {
  return request({
    url: '/api/Order/cancelOutstandingOrders',
    method: 'post',
    data,
  })
}

//获取订单详情
export function getOrderDetailInfo(data) {
  return request({
    url: '/api/Order/getOrderInfo',
    method: 'post',
    data,
  })
}

//修改订单配置
export function setOrderPayment(data) {
  return request({
    url: '/api/Order/setOrderPayment',
    method: 'post',
    data,
  })
}

//用户查询个人模板
export function getUserSample(data) {
  return request({
    url: '/api/DesignSystem/getUserSample',
    method: 'post',
    data,
  })
}

//获取用户模板信息
export function getUserSampleInfo(data) {
  return request({
    url: '/api/DesignSystem/getUserSampleInfo',
    method: 'post',
    data,
  })
}

//添加/编辑用户模板
export function editUserSample(data) {
  return request({
    url: '/api/DesignSystem/editUserSample',
    method: 'post',
    data,
  })
}

//分享用户模板
export function shareUserSample(data) {
  return request({
    url: '/api/share/establishShare',
    method: 'post',
    data,
  })
}

//获取分享的模板
export function getShareSample(data) {
  return request({
    url: '/api/share/getShareInfo',
    method: 'post',
    data,
  })
}

//删除用户模板
export function deleteUserSample(data) {
  return request({
    url: '/api/DesignSystem/deleteUserSample',
    method: 'post',
    data,
  })
}

//获取用户模板分类
export function getUserSampleCategory(data) {
  return request({
    url: '/api/DesignSystem/getUserSampleCategory',
    method: 'post',
    data,
  })
}

//用户编辑模板分类
export function userEditSampleCategory(data) {
  return request({
    url: '/api/DesignSystem/userEditSampleCategory',
    method: 'post',
    data,
  })
}

//用户删除模板分类
export function userDeleteSampleCategory(data) {
  return request({
    url: '/api/DesignSystem/userDeleteSampleCategory',
    method: 'post',
    data,
  })
}

//获取用户元素分类
export function getUserElementCategory(data) {
  return request({
    url: '/api/DesignSystem/getUserElementCategory',
    method: 'post',
    data,
  })
}

//编辑用户元素分类
export function editElementCategory(data) {
  return request({
    url: '/api/DesignSystem/editElementCategory',
    method: 'post',
    data,
  })
}

//获取用户元素
export function getUserElement(data) {
  return request({
    url: '/api/DesignSystem/getUserElement',
    method: 'post',
    data,
  })
}

//编辑用户元素
export function editUserElement(data) {
  return request({
    url: '/api/DesignSystem/editUserElement',
    method: 'post',
    data,
  })
}

//删除用户元素
export function deleteUserElement(data) {
  return request({
    url: '/api/DesignSystem/deleteUserElement',
    method: 'post',
    data,
  })
}
//获取启用货币
export function getCurrency(data) {
  return request({
    url: '/api/config/getCurrency',
    method: 'post',
    data,
  })
}
//修改支付方式与货币
export function setOrderPaymentt(data) {
  return request({
    url: '/api/order/setOrderPayment',
    method: 'post',
    data,
  })
}

//获取优惠券
export function getUserCoupon(data){
  return request({
    url:'/api/Coupon/getUserCoupon',
    method: 'post',
    data,
  })
}

//删除优惠券
export function deleteUserCoupon(data){
  return request({
    url:'/api/Coupon/deleteUserCoupon',
    method: 'post',
    data,
  })
}















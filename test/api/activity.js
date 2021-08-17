import { request } from '@/utils/request'
//获取活动信息以及第一页图稿
export function getActivityPageInfo(data) {
    return request({
        url: '/api/Activity/getActivityPageInfo',
        method: 'post',
        data
    })
}
//活动页获取翻页图稿
export function getActivityWorks(data) {
    return request({
        url: '/api/Activity/getActivityWorks',
        method: 'post',
        data
    })
}
//编辑活动页面
export function editActivityWork(data) {
    return request({
        url: '/api/Activity/editActivityWork',
        method: 'post',
        data
    })
}
//获取图稿评论
export function getWorkCommentList(data) {
    return request({
        url: '/api/Activity/getWorkCommentList',
        method: 'post',
        data
    })
}

//添加评论
export function addWorkComment(data) {
    return request({
        url: '/api/Activity/addWorkComment',
        method: 'post',
        data
    })
}
//作者回复评论
export function replyWorkComment(data) {
    return request({
        url: '/api/Activity/replyWorkComment',
        method: 'post',
        data
    })
}
//活动页点赞
export function addSupport(data) {
    return request({
        url: '/api/Activity/addSupport',
        method: 'post',
        data
    })
}
//获取优惠券代码绑定的产品分类
export function getActivityCouponProductCategory(data) {
    return request({
        url: 'api/ActivityCoupon/getActivityCouponProductCategory',
        method: 'post',
        data
    })
}

//根据产品分类名获取优惠券限制
export function getActivityCouponCondition(data) {
    return request({
        url: 'api/ActivityCoupon/getActivityCouponCondition',
        method: 'post',
        data
    })
}

//根据产品分类名获取优惠券限制
export function getActivityCouponCodeByName(data) {
  return request({
    url: 'api/ActivityCoupon/getActivityCouponCodeByName',
    method: 'post',
    data
  })
}

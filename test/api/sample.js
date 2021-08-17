import { request } from '@/utils/request'

//查询模板列表
export function getElement(data) {
    return request({
        url: 'api/DesignSystem/getElement',
        method: 'post',
        data: data,
    })
}
//查询元素列表
export function getSample(data) {
    return request({
        url: 'api/DesignSystem/getSample',
        method: 'post',
        data: data,
    })
}
//查询标签列表
export function getTag(data) {
    return request({
        url: 'api/DesignSystem/getTag',
        method: 'post',
        data: data,
    })
}
//获取模板分类
export function getSampleCategory(data) {
    return request({
        url: 'api/DesignSystem/getSampleCategory',
        method: 'post',
        data:data
    })
}
//获取元素分类
export function getElementCategory(data) {
    return request({
        url: 'api/DesignSystem/getElementCategory',
        method: 'post',
        data:data
    })
}
//获取模板详情
export function getSampleInfo(data) {
    return request({
        url: 'api/DesignSystem/getSampleInfo',
        method: 'post',
        data:data
    })
}

//获取模板效果
export function getStyleType(data) {
  return request({
    url: 'api/DesignSystem/getStyleType',
    method: 'post',
    data
  })
}


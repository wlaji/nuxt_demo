/**
 * @api:     阿里云OSS服务API
 * @author:  xec
 */
import axios from 'axios';
// 创建axios实例
const request = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 'https://sticker.gs-souvenir.com' : 'https://sticker.gs-souvenir.com',
  timeout: 10000
})

/** 阿里OSS文件上传API */
export var ossApi = {
  /**
   * 获取图片上传签名
   * @return {AxiosPromise}   axios请求
   */
  getSignature(url, data) {
    return request({
      url: url,
      method: 'post',
      data,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  /**
   * 上传文件至OSS服务器
   * @param ossURL            OSS上传地址
   * @param ossData           上传至OSS的文件数据
   * @return {AxiosPromise}   axios请求
   */
  uploadToOss(ossURL, ossData) {
    return request({
      url: ossURL,
      method: 'post',
      data: ossData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}


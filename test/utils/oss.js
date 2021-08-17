/**
 * @api:     阿里云OSS上传辅助工具
 * @author:  mandy
 */
import { ossApi } from "@/api/upload";

export const ossUtils = {
  /**
   * 生成指定长度的随机名称
   * @param len         名称的长度
   * @return {string}   生成的随机名称
   */
  getRandomString(len) {
    const date = new Date();
    let month = date.getMonth() + 1;
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    let strDate = date.getDate();
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    const currentDate = date.getFullYear() + month + strDate;

    len = len || 32;
    const chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
    const maxPos = chars.length;
    let pwd = "";
    for (let i = 0; i < len; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return currentDate + pwd;
  },
  /**
   * 获取文件后缀名
   * @return {string}   文件后缀名
   * @param filePath
   */
  getFileSuffix(filePath) {
    const pos = filePath.lastIndexOf(".");
    let suffix = "";
    if (pos !== -1) {
      suffix = filePath.substring(pos);
    }
    return suffix;
  },
  /**
   * 根据文件类型生成随机文件名
   * @param file
   */
  generateRandomFileName(file) {
    let randomName = ossUtils.getRandomString(8);
    randomName += ossUtils.getFileSuffix(file.name);
    return randomName;
  },

  /**
   * 获取OSS文件上传的校验签名
   * 1. 签名具备时效性，优先从浏览器缓存中获取
   * 2. 无缓存签名或签名过期，则重新向服务器请求
   * @return {Promise<unknown>} 在该promise的then方法中取得签名
   */
  getSignaturePromise(url,data) {
    return new Promise((resolve, reject) => {
      // Todo： 方便测试，清除浏览器缓存
      //localStorage.clear()
      // 判断浏览器长期存储的签名是否存在且未过期
      const ossSignature = JSON.parse(localStorage.getItem(url));
      const nowTimeStamp = Date.parse(new Date());
      // 3秒缓冲期，过期时间前3秒即视为过期，重新申请
      if (ossSignature && ossSignature.expire - 3 * 1000 > nowTimeStamp) {
        // 浏览器存储的签名有效，直接使用
        resolve(ossSignature);
      } else {
        // 浏览器存储的Policy无效，重新请求接口获取OSS上传校验签名
        ossApi
          .getSignature(url,data)
          .then((response) => {
            const newSignature = response.data.list;
            // 存储生成的签名
            localStorage.setItem(url, JSON.stringify(newSignature));
            resolve(newSignature);
          })
          .catch((error) => {
            error.msg = "请求OSS校验签名失败";
            reject(error);
          });
      }
    });
  },
  /**
   * 生成OSS文件上传的表单参数
   * @param ossSignature    OSS校验签名
   * @param file            要上传的文件
   * @param ossFileName     文件保存在OSS的文件名
   * @return {FormData}     生成的表单数据
   */
  getFormData(ossSignature, ossFileName, file) {
    const ossData = new FormData();
    // policy、OSSAccessKeyId、signature 是OSS上传的校验参数
    ossData.append("policy", ossSignature.policy);
    ossData.append("OSSAccessKeyId", ossSignature.accessid);
    ossData.append("signature", ossSignature.signature);
    // 上传成功后返回200状态码，不设置则默认返回204
    ossData.append("success_action_status", "201");
    // callback 是OSS上传成功的回调参数
    // ossData.append('callback', ossSignature.callback)
    // key 是文件在OSS上存储的路径
    let filePath = ossSignature.dir;
    if (!filePath.endsWith("/")) {
      filePath += "/";
    }
    ossData.append("key", filePath + ossFileName);
    ossData.append("name", ossFileName);
    // file 是文件在OSS上存储的数据，注意放在最后避免校验参数不被识别导致403错误
    ossData.append("file", file);
    return ossData;
  },
  /**
   * 异步上传文件至OSS
   * @param generatePolicyURL 生成OSS上传签名的URL地址
   * @param ossFileName       存储在OSS上的文件名
   * @param file              要上传的文件
   * @return {Promise<void>}  axios创建的OSS上传请求对应的promise
   */
  async uploadFile(generatePolicyURL,dirConfig, ossFileName, file) {
    return new Promise((resolve, reject) => {
      this.getSignaturePromise(generatePolicyURL,dirConfig).then(
        (ossSignature) => {
          const ossData = ossUtils.getFormData(ossSignature, ossFileName, file);
          const ossURL = ossSignature.host;
          ossApi
            .uploadToOss(ossURL, ossData)
            .then((response) => {
              let url = ossURL + "/" + ossData.get("key");
              const responseData = url;
              resolve(responseData);
            })
            .catch((error) => {
              error.msg = "OSS文件上传失败";

              console.log(error);
              reject(error);
            });
        },
        (error) => {
          reject(error);
        }
      );
    });
  },
};

import Cookies from 'js-cookie'
import CryptoJS from 'crypto-js'

export default {
  //获取服务端cookie
  getcookiesInServer(req) {
    let service_cookie = {}
    req &&
      req.headers.cookie &&
      req.headers.cookie.split(';').forEach(function(val) {
        let parts = val.split('=')
        service_cookie[parts[0].trim()] = (parts[1] || '').trim()
      })
    return service_cookie
  },

  //获取客户端cookie
  getcookiesInClient(key) {
    return Cookies.get(key) ? Cookies.get(key) : ''
  },

  setCookie(key, data, time) {
    return Cookies.set(key, data, { expires: time })
  },

  removeCookie(key) {
    return Cookies.remove(key)
  },

  encryptedFun(obj) {
    return CryptoJS.AES.encrypt(JSON.stringify(obj), 'xiaoyuren').toString()
  },

  decodeFun(str) {
    let bytes = CryptoJS.AES.decrypt(str, 'xiaoyuren')
    let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    return decryptedData
  },

  saveAs(blob, filename) {
    let reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onload = function(e) {
      let a = document.createElement('a')
      a.download = filename
      a.href = e.target.result
      a.click()
    }
  },

  decodeName(str) {
    try {
      let arr = str.split('-'),
        newArr = []
      arr.forEach(item => {
        let newItem = item.charAt(0).toUpperCase() + item.slice(1)
        newArr.push(newItem)
      })
      return newArr.join(' ')
    } catch {}
  },

  formatFirstCategoryName(str) {
    let newStr = str.toLowerCase()
    newStr = newStr.replace(/(^\s*)|(\s*$)/g, '')
    newStr = newStr.replace(/\s+/g, '-')
    return newStr.charAt(0).toUpperCase() + newStr.slice(1)
  },

  formatSecondCategoryName(str) {
    let newStr = str.toLowerCase()
    newStr = newStr.replace(/(^\s*)|(\s*$)/g, '')
    newStr = newStr.replace(/\s+/g, '-')
    return newStr
  },

  getBase64(img) {
    return new Promise(resolve => {
      function getBase64Image(img, width, height) {
        //width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
        let canvas = document.createElement('canvas')
        canvas.width = width ? width : img.width
        canvas.height = height ? height : img.height

        let ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        let dataURL = canvas.toDataURL()
        return dataURL
      }

      let image = new Image()
      image.crossOrigin = ''
      image.src = img
      image.onload = function() {
        resolve(getBase64Image(image)) //将base64传给done上传处理
      }
    })
  },

  dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename + '.png', { type: 'image/png' })
  },

  deepCopy(target) {
    let copyed_objs = [] //此数组解决了循环引用和相同引用的问题，它存放已经递归到的目标对象
    function _deepCopy(target) {
      if (typeof target !== 'object' || !target) {
        return target
      }
      for (let i = 0; i < copyed_objs.length; i++) {
        if (copyed_objs[i].target === target) {
          return copyed_objs[i].copyTarget
        }
      }
      let obj = {}
      if (Array.isArray(target)) {
        obj = [] //处理target是数组的情况
      }
      copyed_objs.push({
        target: target,
        copyTarget: obj
      })
      Object.keys(target).forEach(key => {
        if (obj[key]) {
          return
        }
        obj[key] = _deepCopy(target[key])
      })
      return obj
    }

    return _deepCopy(target)
  },
  // 合成版
  /**
   * @desc 函数防抖
   * @param func 目标函数
   * @param wait 延迟执行毫秒数
   * @param immediate true - 立即执行， false - 延迟执行
   */
  debounce(func, wait, immediate) {
    let timer
    return function() {
      let context = this,
        args = arguments
      if (timer) clearTimeout(timer)
      if (immediate) {
        let callNow = !timer
        timer = setTimeout(() => {
          timer = null
        }, wait)
        if (callNow) {
          func.apply(context, args)
        }
      } else {
        timer = setTimeout(() => {
          func.apply(context, args)
        }, wait)
      }
    }
  },

  /**
   * @desc 函数节流
   * @param func 函数
   * @param wait 延迟执行毫秒数
   * @param type 1 表时间戳版，2 表定时器版
   */
  throttle(func, wait, type) {
    let previous, timeout
    if (type === 1) {
      previous = 0
    } else if (type === 2) {
      let timeout
    }
    return function() {
      let context = this
      let args = arguments
      if (type === 1) {
        let now = Date.now()

        if (now - previous > wait) {
          func.apply(context, args)
          previous = now
        }
      } else if (type === 2) {
        if (!timeout) {
          timeout = setTimeout(() => {
            timeout = null
            func.apply(context, args)
          }, wait)
        }
      }
    }
  },

  getDivPosition(div) {
    let x = div.getBoundingClientRect().left
    let y = div.getBoundingClientRect().top
    return {
      x: x,
      y: y
    }
  },

  pdfToImg(src) {
    return new Promise(function(resolve) {
      let pdfjsLib = window['pdfjs-dist/build/pdf']
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.3.200/build/pdf.worker.min.js'
      let loadingPdf = pdfjsLib.getDocument(src)
      loadingPdf.promise.then(pdf => {
        let pageNumber = 1
        pdf
          .getPage(pageNumber)
          .then(page => {
            let scale = 2 //缩放倍数，1表示原始大小
            let viewport = page.getViewport(scale)
            let canvas = document.createElement('canvas')
            let context = canvas.getContext('2d') //创建绘制canvas的对象
            canvas.height = viewport.height //定义canvas高和宽
            canvas.width = viewport.width
            let renderContext = {
              canvasContext: context,
              viewport: viewport
            }
            let renderTask = page.render(renderContext)
            renderTask.promise.then(function() {
              resolve(canvas.toDataURL())
            })
          })
          .catch(err => {})
      })
    })
  },

  generateUUID() {
    let d = new Date().getTime()
    if (window.performance && typeof window.performance.now === 'function') {
      d += performance.now() //use high-precision timer if available
    }
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(
      c
    ) {
      let r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
    })
    return uuid
  },

  scrollToElement(ele) {
    ele.scrollIntoView()
    let fixedHeight = document.getElementById('headWrap').offsetHeight
    //现在占固定头的帐户
    let scrolledY = window.scrollY
    if (scrolledY) {
      window.scroll(0, scrolledY - fixedHeight)
    }
  },

  isBase64(url) {
    return url.indexOf('data:image') > -1 ? true : false
  },

  urlAddVersion(url) {
    return this.isBase64(url) ? url : url + '?versions' + this.generateUUID()
  },

  colorRgb(sColor) {
    sColor = sColor.toLowerCase()
    //十六进制颜色值的正则表达式
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
    // 如果是16进制颜色
    if (sColor && reg.test(sColor)) {
      if (sColor.length === 4) {
        let sColorNew = '#'
        for (let i = 1; i < 4; i += 1) {
          sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
        }
        sColor = sColorNew
      }
      //处理六位的颜色值
      let sColorChange = []
      for (let i = 1; i < 7; i += 2) {
        sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
      }
      return 'rgb(' + sColorChange.join(',') + ')'
    }
    return sColor
  },

  colorHex(color) {
    let that = color
    //十六进制颜色值的正则表达式
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
    // 如果是rgb颜色表示
    if (/^(rgb|RGB)/.test(that)) {
      let aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, '').split(',')
      let strHex = '#'
      for (let i = 0; i < aColor.length; i++) {
        let hex = Number(aColor[i]).toString(16)
        if (hex.length < 2) {
          hex = '0' + hex
        }
        strHex += hex
      }
      if (strHex.length !== 7) {
        strHex = that
      }
      return strHex
    } else if (reg.test(that)) {
      let aNum = that.replace(/#/, '').split('')
      if (aNum.length === 6) {
        return that
      } else if (aNum.length === 3) {
        let numHex = '#'
        for (let i = 0; i < aNum.length; i += 1) {
          numHex += aNum[i] + aNum[i]
        }
        return numHex
      }
    }
    return that
  },

  // 预加载图片
  loadImage(url) {
    return new Promise((resolve, reject) => {
      let img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = url
      img.crossOrigin = 'Anonymous'
    })
  },

  //改变图片颜色
  changeImgColor(url, colorObj, callback) {
    this.loadImage(url).then(myImage => {
      let oldColor = this.colorRgb(colorObj.oldColor)
      oldColor = oldColor.substring(4, oldColor.length - 1).split(',')
      let newColor = this.colorRgb(colorObj.newColor)
      newColor = newColor.substring(4, newColor.length - 1).split(',')
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext('2d')
      let originW = myImage.width
      let originH = myImage.height
      canvas.width = originW
      canvas.height = originH
      ctx.drawImage(myImage, 0, 0)
      let myImageData = ctx.getImageData(0, 0, originW, originH)
      let picLength = myImageData.data.length
      for (let i = 0; i < picLength; i += 4) {
        let juli = Math.sqrt(
          Math.pow(myImageData.data[i] - oldColor[0], 2) +
            Math.pow(myImageData.data[i + 1] - oldColor[1], 2) +
            Math.pow(myImageData.data[i + 2] - oldColor[2], 2)
        )
        if (juli === 0) {
          myImageData.data[i] = newColor[0]
          myImageData.data[i + 1] = newColor[1]
          myImageData.data[i + 2] = newColor[2]
        }
      }
      ctx.putImageData(myImageData, 0, 0)
      let dataUrl = canvas.toDataURL()
      if (typeof callback === 'function') {
        callback(dataUrl)
      }
    })
  },

  //将图片改为指定颜色单色图
  removeImgColor(url, color, callback) {
    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')
    let img = new Image()
    img.onload = () => {
      let originW = img.width
      let originH = img.height
      canvas.width = originW
      canvas.height = originH
      //左右镜像翻转
      // ctx.translate(canvas.width, 0);
      // ctx.scale(-1, 1);
      ctx.drawImage(img, 0, 0)
      let myImageData = ctx.getImageData(0, 0, originW, originH)
      let picLength = myImageData.data.length
      let colorChange = this.colorRgb(color)
        .substring(4, this.colorRgb(color).length - 1)
        .split(',')
      for (let i = 0; i < picLength; i += 4) {
        myImageData.data[i] = colorChange[0]
        myImageData.data[i + 1] = colorChange[1]
        myImageData.data[i + 2] = colorChange[2]
      }
      ctx.putImageData(myImageData, 0, 0)
      let dataUrl = canvas.toDataURL()
      if (typeof callback === 'function') {
        callback(dataUrl)
      }
    }
    img.src = url
    img.crossOrigin = 'Anonymous'
  },

  getAlpha(rgba) {
    let rgb = rgba.match(/(\d(\.\d+)?)+/g)
    return rgb[3]
  },
  // 保留两位小数
  keepTwoDecimal(num) {
    let result = parseFloat(num)
    if (isNaN(result)) {
      alert('传递参数错误，请检查！')
      return false
    }
    result = Math.round(num * 100) / 100
    return result
  },
  toggleBody(isPin) {
    if (isPin) {
      document.documentElement.style['overflow-y'] = 'hidden'
    } else {
      document.documentElement.style['overflow-y'] = 'auto'
    }
  },

  copyText (id, attr) {
    let target = null;

    if (attr) {
      target = document.createElement('div');
      target.id = 'tempTarget';
      target.style.opacity = '0';
      if (id) {
        let curNode = document.querySelector('#' + id);
        target.innerText = curNode[attr];
      } else {
        target.innerText = attr;
      }
      document.body.appendChild(target);
    } else {
      target = document.querySelector('#' + id);
    }

    try {
      let range = document.createRange();
      range.selectNode(target);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
      console.log('复制成功')
    } catch (e) {
      console.log('复制失败')
    }

    if (attr) {
      // remove temp target
      target.parentElement.removeChild(target);
    }
  }

}

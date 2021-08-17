export function validateSize(currentNum, minNum, maxNum) {
  let newCurrentNum = Number(currentNum)
  minNum = Number(minNum)
  maxNum = Number(maxNum)
  let isNumber = typeof newCurrentNum === 'number' && !isNaN(newCurrentNum) //判断是否是数字
  let isNull = currentNum === "" || currentNum === undefined || currentNum === null //判断是否是空值

  let result = {
    message: '',
    isValid: true
  }
  if (isNull) {
    result.message = `This field is required`
    result.isValid = false
    return result
  }
  if (!isNumber) {
    result.message = `Must be a number`
    result.isValid = false
    return result
  }
  if (newCurrentNum < minNum) {
    result.message = `Can't be less than ${minNum}`
    result.isValid = false
    return result
  }
  if (newCurrentNum > maxNum) {
    result.message = `Can't be more than ${maxNum}`
    result.isValid = false
    return result
  }
  if (!/^([1-9]\d*|false)(\.\d{1,2})?$/.test(newCurrentNum)) {
    result.message = `Maximum 2 decimal places`
    result.isValid = false
    return result
  }
  return result
}
export function validateQty(currentNum, minNum, maxNum) {
  let newCurrentNum = Number(currentNum)
  minNum = Number(minNum)
  maxNum = Number(maxNum)
  let isNumber = typeof newCurrentNum === 'number' && !isNaN(newCurrentNum) //判断是否是数字
  let isNull = currentNum === "" || currentNum === undefined || currentNum === null //判断是否是空值
  let isInteger = Number.isInteger(newCurrentNum) //判断是否是整型
  let result = {
    message: '',
    isValid: true,
    number:newCurrentNum
  }
  if (isNull) {
    result.message = `This field is required`
    result.isValid = false
    return result
  }
  if (!isNumber) {
    result.message = `Must be a number`
    result.isValid = false
    return result
  }
  if (!isInteger) {
    result.message = `Must be of integer type`
    result.isValid = false
    return result
  }
  if (newCurrentNum > 10) {
    if (newCurrentNum % 10 !== 0) {
      result.message = `Must be a multiple of 10`
      result.isValid = false
      return result
    }
  }
  if (newCurrentNum < minNum) {
    result.message = `Can't be less than ${minNum}`
    result.isValid = false
    return result
  }
  if (newCurrentNum > maxNum) {
    result.message = `Can't be more than ${maxNum}`
    result.isValid = false
    return result
  }
  return result
}

/**
   * 图片属性参数校验
   * @param file    待校验的图片
   * @return {{isValid: boolean, message: string}}  {是否校验成功，提示消息}
   */
export function validateImageAttribute(file) {
  const validityType = [
    "image/svg+xml",
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/gif",
  ];
  if (validityType.indexOf(file.type) === -1) {
    return {
      isValid: false,
      message: "Upload pictures can only be PNG, SVG, JPG, GIF format!",
    };
  }
  const maxSizeInMb = 10;
  if (file.size > maxSizeInMb * 1024 * 1024) {
    return {
      isValid: false,
      message: "Upload image size must not exceed '+ maxSizeInMb + 'MB!",
    };
  }
  return {
    isValid: true,
    message: "Picture check qualified",
  };
}


export function checkCardNumber(rule, value, callback) {
  console.log(rule,value)
  function validateCreditCard(s) {
    // remove non-numerics
    var v = '0123456789',
      w = '',
      i,
      j,
      k,
      m,
      c,
      a,
      x
    for (i = 0; i < s.length; i++) {
      x = s.charAt(i)
      if (v.indexOf(x, 0) !== -1) {
        w += x
      }
    }
    // validate number
    j = w.length / 2
    k = Math.floor(j)
    m = Math.ceil(j) - k
    c = 0
    for (i = 0; i < k; i++) {
      a = w.charAt(i * 2 + m) * 2
      c += a > 9 ? Math.floor(a / 10 + (a % 10)) : a
    }
    for (i = 0; i < k + m; i++) {
      c += w.charAt(i * 2 + 1 - m) * 1
    }
    return c % 10 === 0
  }

  if (value === '') {
    callback(new Error('Invalid card number'))
  } else {
    if (!validateCreditCard(value)) {
      callback(new Error('Invalid card number'))
    } else {
      callback()
    }
  }
}
export function checkCvv(rule, value, callback) {
  function validateCvv(str) {
    if (str.length !== 3 && str.length !== 4) {
      return false
    }
    let arr = str.split('')
    let findItem = arr.find(item => {
      return isNaN(parseFloat(item))
    })
    if (findItem) {
      return false
    } else {
      return true
    }
  }

  if (value === '') {
    callback(new Error('CVV is a required field'))
  } else {
    if (!validateCvv(value)) {
      callback(new Error('Invalid CVV'))
    } else {
      callback()
    }
  }
}

export function checkMM(rule, value, callback) {
  let regx = /^(0[1-9]|1[0-2])$/
  if (value === '') {
    callback(new Error('Month is required'))
  } else {
    if(!regx.test(value)){
      callback(new Error('Invalid Month'))
    }else{
      callback()
    }
  }
}


export function checkYY(rule, value, callback) {
  let regx = /^[0-9]{2}$/
  if (value === '') {
    callback(new Error('Year is required'))
  } else {
    if(!regx.test(value)){
      callback(new Error('Invalid Year'))
    }else{
      callback()
    }
  }
}




import Vue from 'vue'
// 时间格式化
export function formatPrice(str) {
  return str.toFixed(2)
}
export function decodeName(val) {
  try {
    let arr = val.split('-'),
      newArr = []
    arr.forEach(item => {
      let newItem = item.charAt(0).toUpperCase() + item.slice(1)
      newArr.push(newItem)
    })
    return newArr.join(' ')
  } catch {}
}
export function formatTime(valueTime) {
  let date = new Date(parseInt(valueTime) * 1000)
  let y = date.getFullYear()
  let m = date.getMonth() + 1
  m = m < 10 ? '0' + m : m
  let d = date.getDate()
  d = d < 10 ? '0' + d : d
  let h = date.getHours()
  h = h < 10 ? '0' + h : h
  let minute = date.getMinutes()
  let second = date.getSeconds()
  minute = minute < 10 ? '0' + minute : minute
  second = second < 10 ? '0' + second : second
  return y + '-' + m + '-' + d
}
export function formatTime2(valueTime) {
  let date = new Date(parseInt(valueTime) * 1000)
  let y = date.getFullYear()
  let m = date.getMonth() + 1
  m = m < 10 ? '0' + m : m
  let d = date.getDate()
  d = d < 10 ? '0' + d : d
  let h = date.getHours()
  h = h < 10 ? '0' + h : h
  let minute = date.getMinutes()
  let second = date.getSeconds()
  minute = minute < 10 ? '0' + minute : minute
  second = second < 10 ? '0' + second : second
  return h + ':' + minute + ':' + second
}
export function formatStatus(ind) {
  let statusArr = [
    'Awaiting Payment',
    'Recieved payment and Awaiting Shipping',
    'Shipment Shipped',
    'Received',
    'Cancelled'
  ]
  let item = statusArr.find((item, index) => {
    return index + 1 == ind
  })
  return item
}

let filters = {
  formatPrice,
  decodeName,
  formatTime,
  formatTime2,
  formatStatus
}

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
export default filters

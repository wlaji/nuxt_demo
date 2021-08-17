import Vue from 'vue'

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
  formatStatus
}

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
export default filters

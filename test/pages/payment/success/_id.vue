<template>
  <div>
    <paymentSuccess :orderInfo="orderInfo"></paymentSuccess>
  </div>
</template>

<script>
import paymentSuccess from '@/components/payment/success'
import { getOrderDetailInfo } from '@/api/account'

export default {
  middleware: 'permission',
  async asyncData({ params,error }) {
    try {
      let { data } = await getOrderDetailInfo({
        id: params.id
      })
      console.log(data)
      let sa_products = {
        107:'Custom stickers'
      }
      // data.product.forEach(item => {
      //   sa_products[item.product_category_id] = item.product_cate_name
      // })
      let html1 = `var sa_products = ${JSON.stringify(sa_products)}`
      return {
        orderInfo: data,
        html1
      }
    } catch {
      error({
        statusCode: 404
      });
    }
  },
  head() {
    return {
      meta: [
        {
          hid: 'robots',
          name: 'robots',
          content: 'noindex, nofollow' //禁止所有搜索引擎的收录和索引，也不追踪网页上的链接，
        }
      ],
      script: [
        {
          innerHTML: this.html1,
          type: 'text/javascript'
        },
        {
          innerHTML: `var sa_values = {
                      site: 33868,
                      token: '61f9V7hD',
                      orderid:'${this.orderInfo.oid}',
                      name:'${this.orderInfo.shipping_address_info.last_name} ${this.orderInfo.shipping_address_info.first_name}',
                      email:'${this.orderInfo.user.email}'
                    }

                    function saLoadScript(src) {
                      var js = window.document.createElement('script')
                      js.src = src
                      js.type = 'text/javascript'
                      document.getElementsByTagName('head')[0].appendChild(js)
                    }

                    var d = new Date()
                    if (d.getTime() - 172800000 > 1477399567000) {
                      saLoadScript('https://www.shopperapproved.com/thankyou/rate/33868.js')
                    } else {
                      saLoadScript(
                        '//direct.shopperapproved.com/thankyou/rate/33868.js?d=' + d.getTime()
                      )
                    }`
        }
      ]
    }
  },
  components: {
    paymentSuccess
  }
}
</script>

<style scoped></style>

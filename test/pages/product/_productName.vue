<template>
  <div class="productWrap bg-default">
    <div class="container py-3">
      <div class="row bg-white p-3">
        <div class="col-12 col-xl-4 mb-2">
          <div class="d-flex-center bg-secondary">
            <img
              class="img-fluid"
              :src="pageInfo.pic_path"
              alt="product"
              preview="0"
              style="cursor: zoom-in"
            />
          </div>
        </div>
        <div class="col-12 col-xl-8 mb-2">
          <h3 class="py-2">{{ pageInfo.name }}</h3>
          <p v-html="pageInfo.product_description"></p>
          <el-divider></el-divider>
          <div class="detail">
            <div
              class="mb-2"
              v-for="item in pageInfo.productList"
              :key="item.id"
            >
              <ul>
                <li>
                  <label>Category:</label>
                  <span class="ml-2">{{ item.product_cate_name }}</span>
                </li>
                <li>
                  <label>Size:</label>
                  <span class="ml-2"
                    >{{ item.width }}” x {{ item.height }}”</span
                  >
                </li>
                <li v-for="(citem, key) in item.orderParams" :key="key">
                  <label>{{ key }}:</label>
                  <span class="ml-2">{{ citem }}</span>
                </li>
                <li>
                  <label>Unit Price:</label>
                  <span class="ml-2"
                    >{{ currencyItem.symbol }}{{ item.unit_price }}</span
                  >
                </li>
                <li>
                  <label>Quantity:</label>
                  <span class="ml-2">{{ item.quantity }}</span>
                </li>
                <li>
                  <label>Price:</label>
                  <span class="ml-2"
                    >{{ currencyItem.symbol }}{{ item.price }}</span
                  >
                </li>
              </ul>
            </div>
            <div class="mb-2">
              Total Price:
              <b class="text-danger"
                >{{ currencyItem.symbol }} {{ pageInfo.price }}</b
              >
            </div>
            <div class="mb-2">
              Quantity: <span>{{ pageInfo.quantity }}</span>
            </div>
            <div class="mt-2 d-flex align-items-center">
              <el-button
                :disabled="disabledBtn"
                type="warning"
                icon="el-icon-shopping-bag-2"
                size="medium"
                @click="buyNow"
                >Buy Now
              </el-button>
              <span v-show="disabledBtn" class="ml-2">(The purchase link has expired. If necessary, please click  <a href="https://www.customsticker.com/Custom-stickers" style="text-decoration: underline">here</a> or email at <a href="mailto:Info@GS-JJ.com">eva@customsticker.com</a> to reorder.)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrency } from '@/api/public'
import { getCustomProductInfo } from '@/api/customProduct'
import loginComponent from '@/components/loginComponent'

function getOrderParams(data, orderParams) {
  let verifyArr = data
  let aaa = (param) => {
    if (param.data && param.data.length) {
      orderParams[param.param_name] = param.data[0].param_name
      if (param.data[0].data && param.data[0].data.length) {
        aaa(param.data[0].data[0])
      }
    }
  }
  verifyArr.forEach((item) => {
    aaa(item)
  })
}

export default {
  async asyncData(ctx) {
    try {
      let res = await getCustomProductInfo({
        name: ctx.params.productName,
      })
      let pageInfo = res.data
      let proList = pageInfo.productList,
        totalPrice = 0,
        totalQuantity = 0
      proList.forEach((item) => {
        item.orderParams = {}
        totalPrice += Number(item.price)
        totalQuantity += Number(item.quantity)
        getOrderParams(JSON.parse(item.param_description), item.orderParams)
      })
      pageInfo['price'] = totalPrice
      pageInfo['quantity'] = totalQuantity

      let disabledBtn = false
      //ios兼容
      pageInfo.end_time = pageInfo.end_time.replace(/-/g,'/');
      let endTime = new Date(pageInfo.end_time).getTime()
      let currentTime =  new Date().getTime();
      if(currentTime>endTime){
        disabledBtn = true
      }
      return {
        pageInfo,
        disabledBtn,
      }
    } catch {
      ctx.error({
        statusCode: 404,
      })
    }
  },
  data() {
    return {
      currencyId: '',
      currencyInfo: [],
    }
  },
  head() {
    return {
      meta: [
        {
          hid: 'robots',
          name: 'robots',
          content: 'noindex, nofollow', //禁止所有搜索引擎的收录和索引，也不追踪网页上的链接，
        },
      ],
    }
  },
  computed: {
    currencyItem() {
      let currencyItem = this.currencyInfo.find((item) => {
        return item.id === this.currencyId
      })
      if (currencyItem) {
        return currencyItem
      } else {
        return {
          symbol: '',
          rate: '',
        }
      }
    },
  },
  components: {
    loginComponent,
  },
  methods: {
    buyNow() {
      // if (this.$store.state.authInfo) {
      this.$router.push({
        path: '/checkout',
        query: {
          Buynow: 1,
          Name: this.$route.params.productName,
          p_id: this.pageInfo.id,
        },
      })
      // } else {
      // this.$store.commit('SET_LOGINDIALOG', true)
      // }
    },
  },
  created() {
    //货币列表
    getCurrency().then((res) => {
      this.currencyInfo = res.data
      let defaultCurrency = this.currencyInfo.find((item) => {
        return item.is_default === 1
      })
      this.currencyId = defaultCurrency.id
    })
  },
  mounted() {
    this.$Bus.$on('logined', (e) => {
      this.buyNow()
    })
  },
  beforeDestroy() {
    this.$Bus.$off('logined')
  },
}
</script>

<style lang="scss" scoped>
.el-button.is-disabled{
  background-color: #ccc !important;
  border-color: #ccc !important;
}
.productWrap {
  /deep/ .el-form-item__label {
    font-size: 1.6rem;
    line-height: 35px;
  }
  .detail {
    ul,
    div {
      @include px2rem(font-size, 24px);
    }
    /deep/.el-button {
      @include px2rem(font-size, 24px);
    }
  }
  /deep/.el-divider--horizontal {
    @include px2rem(margin-top, 24px);
    @include px2rem(margin-bottom, 24px);
  }
  @media screen and (min-width: $breakpoint-xl-min){
    /deep/ .el-form-item__label {
      font-size:16px;
      line-height: 35px;
    }
    .detail {
      ul,
      div {
        font-size:18px;
      }
      /deep/.el-button {
        font-size:18px;
      }
    }
    /deep/.el-divider--horizontal {
      margin:20px 0;
    }
  }
}
</style>
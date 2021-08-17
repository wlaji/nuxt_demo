<template>
  <div>
    <div class="container py-4">
      <div class="row">
        <div class="col-12 col-xl-8">
          <div class="border h-100 box1 overflow-hidden">
            <div class="header px-2 border-bottom">
              <div
                class="back pointer expand-selection d-inline-block"
                @click="backDesign"
              >
                <img
                  src="@/assets/images/@2x/back.png"
                  alt="back"
                  title="back"
                />
              </div>
              <h2 class="text-center text-xl-left mb-0">
                ORDER DETAILS
              </h2>
              <div></div>
            </div>
            <div class="row my-4">
              <div class="col-4 col-xl-6">
                <div class="imgWrap p-2">
                  <img
                    :src="cartTemp.pic_path"
                    class="img-fluid"
                    preview="0"
                    alt="design"
                  />
                </div>
                <div class="d-none d-xl-block remark">
                  <el-input
                    type="textarea"
                    v-model="remark"
                    :rows="4"
                    placeholder="Tell us about your design ideas here!"
                  ></el-input>
                  <div class="edit-icon"></div>
                </div>
              </div>
              <div class="col-8 col-xl-6">
                <ul class="paramsList" v-if="cartTemp">
                  <li class="p-1">
                    <span>Categoty:</span>
                    <span class="ml-1 text-secondary">{{
                      cartTemp.product_cate_name
                    }}</span>
                  </li>
                  <li class="p-1">
                    <span>Size:</span>
                    <span class="ml-1 text-secondary">{{
                      cartTemp.width + '” x ' + cartTemp.height + '”'
                    }}</span>
                  </li>
                  <li
                    class="p-1"
                    v-for="(item, key) in JSON.parse(cartTemp.select_params)"
                    :key="key"
                  >
                    <span>{{ key }}:</span>
                    <span class="ml-1 text-secondary">{{ item }}</span>
                  </li>
                  <li class="p-1">
                    <span>Currency:</span>
                    <span class="ml-1 text-secondary">{{
                      cartTemp.currency ? cartTemp.currency.code : ''
                    }}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div class="d-xl-none remark">
              <el-input
                type="textarea"
                v-model="remark"
                :rows="4"
                placeholder="Tell us about your design ideas here!"
              ></el-input>
              <div class="edit-icon"></div>
            </div>
          </div>
        </div>
        <div class="col-12 col-xl-4 mt-3 mt-xl-0">
          <div
            class="border h-100 box2 d-flex flex-column justify-content-between overflow-hidden"
          >
            <div class="priceInfo">
              <h2 class="text-center text-xl-left border-bottom px-2">
                ORDER TOTAL
              </h2>
              <ul class="p-2">
                <li class="p-2">
                  <span> Each </span>
                  <span>
                    <b
                      >{{ Symbol }}
                      {{ (cartTemp.unit_price * Rate) | formatPrice }}</b
                    >
                  </span>
                </li>
                <li class="p-2">
                  <span> Quantity </span>
                  <b>
                    {{ cartTemp.quantity }}
                  </b>
                </li>
                <li class="p-2">
                  <span> Subtotal </span>
                  <span class="text-danger">
                    <b>{{ Symbol }}{{ (cartTemp.price * Rate) | formatPrice }}</b>
                  </span>
                </li>
              </ul>
            </div>
            <div class="submit-btn px-2 py-4">
              <el-button
                class="d-none"
                type="primary"
                :loading="loadAddToInquiry"
                @click="inquiry"
                style="background-color: #409eff"
              >
                Submit Inquiry
                <el-tooltip
                  content="Bottom center"
                  placement="top"
                  effect="light"
                >
                  <div style="width: 250px" slot="content">
                    If there are no special process requirements, it is
                    recommended to select submit order.
                  </div>
                  <i
                    class="el-icon-question h3 p-1 m-0 align-middle"
                    @click.stop
                  ></i>
                </el-tooltip>
              </el-button>
              <el-button
                type="warning"
                :disabled="!cartTemp.allowAddToCart"
                :loading="loadAddToCart"
                @click="addToCart"
                class="mt-3"
                style="background-color: #ff7a00"
              >
                Submit Order
                <el-tooltip placement="top" effect="light">
                  <div style="width: 250px" slot="content">
                    If there are no special process requirements, it is
                    recommended to select submit order.
                  </div>
                  <i
                    class="el-icon-question h3 p-1 m-0 align-middle"
                    @click.stop
                  ></i>
                </el-tooltip>
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { addCart } from '@/api/cart'

export default {
  data() {
    return {
      remark: '',
      loadAddToCart: false,
      loadAddToInquiry: false
    }
  },
  computed: {
    cartTemp() {
      // console.log(JSON.parse(this.$store.state.cartTemp.select_params))
      return this.$store.state.cartTemp
    },
    Rate() {
      return this.cartTemp.currency ? this.cartTemp.currency.rate : 1
    },
    Symbol() {
      return this.cartTemp.currency ? this.cartTemp.currency.symbol : '$'
    }
  },
  methods: {
    //添加至购物车
    addToCart() {
      this.loadAddToCart = true
      let cartTemp = this.cartTemp
      //判断是否登录
      let category_id =  cartTemp.product_category_id || sessionStorage.getItem('product_category_id')

      if (this.$store.state.authInfo) {
        let formData = new FormData()
        formData.append('quantity', cartTemp.quantity)
        formData.append('param_id_list', cartTemp.param_id_list)
        formData.append('width', cartTemp.width)
        formData.append('height', cartTemp.height)
        formData.append('remark', this.remark)
        formData.append('pic_path', cartTemp.pic_path)
        formData.append('product_category_id', category_id)
        formData.append('select_params', cartTemp.select_params)
        addCart(formData)
          .then(res => {
            this.$store.dispatch('getUserInfo').then(() => {
              this.$router.push({
                path: '/cart'
              })
            })
          })
          .finally(() => {
            this.loadAddToCart = false
          })
      } else {
        let data = Object.assign({}, cartTemp, {
          remark: this.remark,
          id: this.$utils.generateUUID()
        })
        data.select_params = data.select_params
        this.$store.commit('ADD_CART', data)
        this.$router.push({
          path: '/cart'
        })
      }
    },

    //添加至询盘
    inquiry() {
      this.loadAddToInquiry = true
      let cartTemp = this.cartTemp
      let data = Object.assign(
        {},
        {
          remark: this.remark
        },
        cartTemp
      )
      this.$store.commit('ADD_INQUIRY', data)
      this.$router.push({
        path: '/inquiry'
      })
    },

    //返回上一个页面
    backDesign() {
      let backType = this.cartTemp.backType
      sessionStorage.setItem('beforeRouteName', this.$route.name)
      if (backType === 'params') {
        this.$router.push({
          name: 'options-categoryName',
          params: {
            categoryName: this.$utils.formatSecondCategoryName(
              this.cartTemp.product_cate_name
            )
          }
        })
      } else if (backType === 'design') {
        this.$router.push({
          name: 'create-your-own-stickers-categoryName',
          params: {
            categoryName: this.$utils.formatSecondCategoryName(
              this.cartTemp.product_cate_name
            )
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.imgWrap {
  display: flex;
  justify-content: center;
  align-items: start;
  width: 100%;
  height: 200px;
  cursor: zoom-in;
}

.box1 .header,
.box2 h2 {
  background-color: #d8ebff;
}

.header {
  position: relative;
  @include px2rem(height, 90px);
  @include px2rem(line-height, 90px);

  .back {
    position: absolute;
    left: 15px;
    @include px2rem(width, 45px);
    img{
      width: 100%;
      object-fit: contain;
    }
  }

  h2 {
    @include px2rem(font-size, 40px);
  }
}

.priceInfo{
  @include px2rem(font-size, 32px);
  h2{
    @include px2rem(height, 90px);
    @include px2rem(line-height, 90px);
    @include px2rem(font-size, 40px);
  }
}


.box2 ul li {
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:last-child {
    border-top: 5px solid #e6e6e6;
    @include px2rem(margin-top, 20px);
  }
}

.submit-btn{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .el-button {
    width: 100%;
    margin: 0 auto;
    @include px2rem(height, 100px);
    @include px2rem(font-size, 32px);
  }
}

.remark {
  position: relative;
  @include px2rem(width, 635px);
  @include px2rem(height, 205px);
  margin: 0 auto;
  @include px2rem(margin-bottom, 30px);

  .edit-icon {
    position: absolute;
    left:5px;
    top:10px;
    @include px2rem(width, 32px);
    @include px2rem(height, 32px);
    line-height: 1.5;
    background: url('../../assets/images/@2x/edit.png') center/contain no-repeat;
  }

  /deep/ .el-textarea__inner {
    @include px2rem(padding-left, 40px);
    @include px2rem(padding-right, 35px);
    border-color: $primary;
    @include px2rem(font-size, 32px);
    width: 100%;
    height: 100%;
  }
}

.paramsList {
  @include px2rem(font-size, 28px);
}

@media screen and (min-width: $breakpoint-xl-min){
  .imgWrap {
    align-items: center;
  }
  .header {
    display: flex;
    height: 54px;
    line-height: 54px;
    .back {
      position: relative;
      left: 0;
      width: 35px;
    }

    h2 {
      font-size: 28px;
      margin-left:20px
    }
  }

  .priceInfo{
    font-size: 18px;

    h2{
      height: 54px;
      line-height: 54px;
      font-size: 28px;
    }
  }


  .box2 ul li {
    &:last-child {
      margin-top:20px
    }
  }

  .submit-btn{
    .el-button {
      width: 100%;
      margin: 0 auto;
      height: 60px;
      font-size:20px;
    }
  }

  .remark {
    width: 288px;
    height:144px;
    margin-bottom:0;

    .edit-icon {
      width: 20px;
      height:20px;
    }

    /deep/ .el-textarea__inner {
      padding-left:30px;
      padding-right:30px;
      font-size:18px;
    }
  }

  .paramsList {
    font-size:18px;
  }
}
</style>

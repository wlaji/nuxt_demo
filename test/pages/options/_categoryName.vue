<template>
  <div class="optionsWrap" :class="{ 'bg-default': showBlur }">
    <div class="container py-2 pb-xl-5">
      <div class="content-wrap">
        <div class="h3 mb-4">
          Please fill-out the Automated Quotation System as follows...
        </div>
        <div class="row">
          <div class="col-12 col-xl-4 py-3 py-xl-0">
            <div class="row">
              <div class="col-5 col-xl-12">
                <div style="--aspect-ratio: 250/200">
                  <img :src="priceConfig.pic_path" :alt="cateName" />
                </div>
              </div>
              <div class="col-7 col-xl-12">
                <ul class="mt-3 basicInfo">
                  <li class="row mb-1 mb-xl-2">
                    <span class="text-uppercase col-6"><b>Categoty:</b></span>
                    <span class="text-capitalize col-6"
                    ><b>{{ cateName }}</b></span
                    >
                  </li>
                  <li class="row mb-1 mb-xl-2">
                    <span class="text-uppercase col-6">Size :</span>
                    <span class="col-6">{{ sizeW + '” x ' + sizeH + '”' }}</span>
                  </li>
                  <li class="row mb-1 mb-xl-2">
                    <span class="text-uppercase col-6">Quantity :</span>
                    <span class="col-6">{{ qty }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-12 col-xl-8" id="params-select">
            <tree
              :list="otherSelectList"
              ref="paramTree"
              @changeSelect="changeSelect"
              @visibleChange="visibleChange"
            ></tree>
            <div class="select-item" v-if="shapeList.length">
              <div class="row align-items-center">
                <div class="col-5 text-right">
                  <label>
                    <b>Shape</b>
                  </label>
                </div>
                <div class="col-7" id="shapeSelect">
                  <template v-if="shapeList.length > 1">
                    <el-select
                      v-model="activeShape"
                      class="mySelect"
                      :popper-append-to-body="false"
                      :class="{ selected: activeShape }"
                      @visible-change="visibleChange"
                    >
                      <el-option
                        v-for="item in shapeList"
                        :key="item"
                        :value="item"
                      >
                        <div class="text-break">{{ item }}</div>
                      </el-option>
                    </el-select>
                  </template>
                  <template v-else>
                    {{ shapeList[0] }} (Available to change into any other shapes
                    for free)
                  </template>
                </div>
              </div>
            </div>
            <div class="select-item">
              <div class="row align-items-center">
                <div class="col-5 text-right">
                  <label>
                    <b>Transport</b>
                  </label>
                </div>
                <div class="col-7">
                  Free 2 Days Shipping by Air ( It may be delayed because of the
                  COVID-19 )
                </div>
              </div>
            </div>

            <div class="select-item">
              <div class="row align-items-center">
                <div class="col-5 text-right">
                  <label>
                    <b>Currency</b>
                  </label>
                </div>
                <div class="col-7">
                  <span>{{ currencyCode }}</span>
                  <!--                  <el-select-->
                  <!--                    disabled-->
                  <!--                    v-model="currencyCode"-->
                  <!--                    @change="priceCalculate"-->
                  <!--                    placeholder="Select Your Currency"-->
                  <!--                  >-->
                  <!--                    <el-option-->
                  <!--                      v-for="item in currencyInfo"-->
                  <!--                      :key="item.id"-->
                  <!--                      :label="item.code"-->
                  <!--                      :value="item.code"-->
                  <!--                    >-->
                  <!--                      <span style="float: left">-->
                  <!--                        {{ item.code }}-->
                  <!--                        <img-->
                  <!--                          :src="item.flag_path"-->
                  <!--                          style="-->
                  <!--                            position: relative;-->
                  <!--                            max-width: 16px;-->
                  <!--                            max-height: 10px;-->
                  <!--                            top: -2px;-->
                  <!--                          "-->
                  <!--                        />-->
                  <!--                      </span>-->
                  <!--                      <span-->
                  <!--                        style="float: right; color: #8492a6; font-size: 13px"-->
                  <!--                        >{{ item.symbol }}</span-->
                  <!--                      >-->
                  <!--                    </el-option>-->
                  <!--                  </el-select>-->
                </div>
              </div>
            </div>

            <div class="row no-gutters align-items-center justify-content-center subtotal my-3">
              <div class="col-auto col-xl-5">
                <label class="mx-2 mx-xl-0">
                  <b>Subtotal</b>
                </label>
              </div>
              <div class="col col-xl-7 d-flex align-items-center" style="padding-left: 0;">
              <span class="qty mx-2">
                <qty-input
                  ref="qtyInput"
                  v-model="qty"
                  :min="this.priceConfig.min_quantity"
                  :max="this.priceConfig.max_quantity"
                  @validateResult="priceCalculate"
                ></qty-input>
              </span>
                <span class="unitPrice mx-2"
                >(Each {{ Symbol }} {{ priceInfo.unit_price }})</span
                >
                <span class="totalPrice mx-2">
                {{ Symbol }}{{ priceInfo.price }}
              </span>
              </div>
            </div>

            <div class="row align-items-center submit">
              <div class="col col-xl-5"></div>
              <div class="col-12 col-xl-7">
                <el-button
                  type="warning"
                  size="large"
                  style="background-color: #ff7a00;width: 100%"
                  :loading="loadContinue"
                  @click="continueUpload"
                >
                  Continue
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <cus-dialog :visible.sync="model1" :lockScroll="true" :hiddenFooter="true">
      <template v-slot:header>
        <div class="h3 text-center">
          How would you like to design your stickers ?
        </div>
      </template>
      <template v-slot:body>
        <div class="row box-wrap">
          <div class="col-12 mb-3">
            <div class="box1 h-100 text-left">
              <div class="row align-items-center" @click="$refs.upFile.click()">
                <div class="col-5">
                  <div
                    class="imgWrap d-flex-center"
                    :class="{ error: errorImg && !picPath }"
                  >
                    <img :src="picPath" alt="upload" v-if="picPath" />
                    <template v-else>
                      <img
                        class="nohover"
                        src="https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210107/ef9cddf56ef338d9ed2413d06b698a53.png"
                        alt="upload"
                      />
                      <img
                        class="hover"
                        src="https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210107/66499d6f46e4ad0e505a1ee68155d5a0.png"
                        alt="upload"
                      />
                    </template>
                    <input
                      type="file"
                      ref="upFile"
                      @change="uploadOnChange"
                      accept=".jpg,.png,.jpeg,.gif"
                    />
                  </div>
                </div>
                <div class="col-7 text-left">
                  <div>
                    <h3>Upload image</h3>
                    <div>
                      Send us a photo and tell us your ideas, you will get proof
                      right away. Try now!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12">
            <div class="box2 h-100" @click="next(2)">
              <div class="row align-items-center">
                <div class="col-5">
                  <div class="imgWrap">
                    <img
                      src="https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210107/be5633fc90a6582899056e96b2d0265c.jpg"
                      alt="Online Design System"
                    />
                  </div>
                </div>
                <div class="col-7 text-left">
                  <div>
                    <h3>Online Design System</h3>
                    <ul>
                      <li>Multiple templates and elements.</li>
                      <li>Easy and professional.</li>
                      <li>Bring your idea to life.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </cus-dialog>
  </div>
</template>

<script>
import sizeInput from '@/components/BasisComponents/sizeInput'
import qtyInput from '@/components/BasisComponents/qtyInput'
import tree from '@/components/optionsTree/tree'
import {
  validateSize,
  validateQty,
  validateImageAttribute
} from '@/utils/validate'

import {
  getCurrency,
  ossUpload,
  getConfigInfo,
  getProductPrice,
  getProductConfig
} from '@/api/public'

function addProperty(tree) {
  let verifyArr = tree
  verifyArr.forEach(item => {
    item.isChecked = true
    item.selectId = ''
    if (item.data) {
      addProperty(item.data)
    }
  })
  return verifyArr
}

export default {
  data() {
    return {
      showBlur: false,
      removeZheZhao: false,
      selectIndex: -1,
      activeShape: '',
      shapeList: [],
      paramsList: [],
      otherSelectList: [],
      priceConfig: {
        pic_path: require('../../static/images/loading.png')
      },
      sizeW: '',
      sizeH: '',
      currencyInfo: [],
      currencyCode: '',
      discountInfo: [],
      discountId: '',
      qty: '',
      optionsObj: {
        optionIdList: [],
        select_params: {}
      },
      allowAddToCart: true,
      priceInfo: {
        unit_price: 0,
        price: 0
      },
      picPath: '',
      uploadImgFile: '',
      fileData: [],
      errorImg: false,
      showDateErrorMsg: false,
      loadContinue: false,
      model1: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      }
    }
  },
  components: {
    sizeInput,
    qtyInput,
    tree
  },
  computed: {
    cateName() {
      return this.$utils.decodeName(this.$route.params.categoryName)
    },
    Rate() {
      return this.priceInfo.currency ? this.priceInfo.currency.rate : 1
    },
    Symbol() {
      return this.priceInfo.currency ? this.priceInfo.currency.symbol : '$'
    }
  },
  methods: {
    //校验树形结构参数
    checkedParamsFn(tree) {
      let checkedParams = true

      function validateItem(tree) {
        tree.forEach(item => {
          if (item.data) {
            if (!item.selectId) {
              item.isChecked = false
              checkedParams = false
            } else {
              if (item.data && item.data.length) {
                let findItem = item.data.find(citem => {
                  return citem.id === item.selectId
                })
                if (findItem && findItem.data && findItem.data.length) {
                  validateItem(findItem.data)
                }
              }
            }
          }
        })
      }

      validateItem(tree)
      return checkedParams
    },

    //校验尺寸和数量
    verifyParams() {
      let priceConfig = this.priceConfig
      let validateSizeW = validateSize(
        this.sizeW,
        priceConfig.min_width,
        priceConfig.max_width
      )
      let validateSizeH = validateSize(
        this.sizeH,
        priceConfig.min_height,
        priceConfig.max_height
      )
      let validateQtyResult = validateQty(
        this.qty,
        priceConfig.min_quantity,
        priceConfig.max_quantity
      )
      //验证尺寸和数量
      if (
        !validateSizeW.isValid ||
        !validateSizeH.isValid ||
        !validateQtyResult.isValid
      ) {
        return false
      }
      return true
    },

    //综合校验
    checkedAllParams() {
      let list = this.otherSelectList || [],
        checkedSizeAndQty = this.verifyParams(),
        checkedParams = true
      //判断是否有其他选项
      if (list.length) {
        checkedParams = this.checkedParamsFn(list)
      }
      if (!checkedSizeAndQty || !checkedParams) {
        return false
      }
      return true
    },

    continueUpload() {
      this.loadContinue = true
      if (!this.checkedAllParams()) {
        this.loadContinue = false
        return false
      }
      this.loadContinue = false
      this.model1 = true
    },

    //去参数展示页或者设计系统
    async next(type) {
      let picPath
      let getCartTempData = type => {
        this.optionsObj = this.$refs.paramTree.getSelectId(this.otherSelectList)
        let priceInfo = this.priceInfo
        let data = Object.assign(
          {},
          {
            backType: type === 1 ? 'params' : 'design',
            product_cate_name: this.$utils.decodeName(
              this.$route.params.categoryName
            ),
            quantity: this.qty,
            param_id_list: this.optionsObj.optionIdList.join(','),
            width: this.sizeW,
            height: this.sizeH,
            pic_path: picPath,
            strict: {
              min_quantity: parseInt(this.priceConfig.min_quantity),
              max_quantity: parseInt(this.priceConfig.max_quantity)
            },
            params: priceInfo.additionalOption,
            options: this.paramsList,
            select_params: JSON.stringify(this.optionsObj.select_params),
            allowAddToCart: this.allowAddToCart, //是否允许添加到购物车
            activeShape: this.activeShape
          },
          priceInfo,
          {
            unit_price: this.$utils.keepTwoDecimal(
              priceInfo.unit_price / this.Rate
            ),
            price: this.$utils.keepTwoDecimal(priceInfo.price / this.Rate),
            accessory: ''
          }
        )
        return data
      }
      if (type === 1) {
        sessionStorage.removeItem('beforeRouteName')
        try {
          picPath = await this.upImg()
        } catch {}
        this.$store.commit('ADD_CART_TEMP', getCartTempData(type))
        this.$router.push({
          path: '/options/params'
        })
      } else if (type === 2) {
        sessionStorage.setItem('beforeRouteName', this.$route.name)
        this.$store.commit('ADD_CART_TEMP', getCartTempData(type))
        this.$router.push({
          name: 'create-your-own-stickers-categoryName',
          params: {
            categoryName: this.$route.params.categoryName
          }
        })
      }
    },

    upImg() {
      const loading = this.$loading({
        lock: true,
        text: 'Please wait...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
        customClass: 'cus-loading'
      })
      return new Promise(resolve => {
        this.fileData = new FormData() // new formData对象
        this.fileData.append('photo[]', this.uploadImgFile) // append增加数据
        this.fileData.append('isRandom', true)
        this.fileData.append('isTemp', false)
        ossUpload(this.fileData)
          .then(res => {
            let path = Object.values(res.data)[0]
            if (path) {
              resolve(path)
            } else {
              this.$message.error('upload failed')
            }
          })
          .catch(err => {
            this.$message.error('upload failed')
            this.$refs.upFile.value = ''
          })
          .finally(() => {
            loading.close()
          })
      })
    },

    uploadOnChange(e) {
      let file = this.$refs.upFile.files[0]
      if (!file) {
        return false
      }
      let validateResult = validateImageAttribute(file)
      if (!validateResult.isValid) {
        this.$message.error(validateResult.message)
        this.$refs.upFile.value = ''
        return false
      }
      this.uploadImgFile = file
      let reader = new FileReader()
      reader.readAsDataURL(this.$refs.upFile.files[0])
      reader.onload = e => {
        // this.picPath = e.target.result
        this.next(1)
      }
    },

    changeSelect() {
      this.optionsObj = this.$refs.paramTree.getSelectId(this.otherSelectList)
      this.priceCalculate()
      this.$nextTick(() => {
        this.addClick()
      })
    },

    priceCalculate() {
      let verifyParams = this.verifyParams()
      if (!verifyParams) {
        //展示错误信息
        this.$refs.qtyInput.validateFun()
        return false
      }
      let postData = {
        product_category_name: this.cateName,
        width: this.sizeW,
        height: this.sizeH,
        param_id_list: this.optionsObj.optionIdList,
        currency: this.currencyCode,
        quantity: this.qty
      }
      getProductPrice(postData)
        .then(res => {
          this.priceInfo = res.data
          this.allowAddToCart = true
        })
        .catch(err => {
          this.allowAddToCart = false
        })
    },

    getUsedCurrencyt() {
      return new Promise(resolve => {
        getCurrency().then(res => {
          this.currencyInfo = res.data
          let defaultCurrency = this.currencyInfo.find(item => {
            return item.is_default === 1
          })
          this.currencyCode = defaultCurrency.code
          resolve()
        })
      })
    },

    initSize(data) {
      this.sizeW = data.sizeW
      this.sizeH = data.sizeH
      this.qty = data.qty
    },

    back() {
      this.$router.go(-1)
    },

    //选择项数据回填
    otherSelectListData(list, idList) {
      let findParent = (list, id, parent) => {
        list.forEach(item => {
          if (item.id == id) {
            if (parent) {
              parent.selectId = Number(id)
            }
          } else {
            if (item.data && item.data.length) {
              findParent(item.data, id, item)
            }
          }
        })
      }
      idList.forEach(id => {
        findParent(list, id, '')
      })
    },

    addClick() {
      let elSelectArr = Array.from(document.getElementsByClassName('mySelect'))
      elSelectArr.forEach((item, index) => {
        item.onclick = () => {
          this.selectIndex = index
        }
      })
      if (elSelectArr[this.selectIndex + 1]) {
        elSelectArr[this.selectIndex + 1].click()
      }
    },

    visibleChange(bool) {
      setTimeout(() => {
        let elSelectArr = Array.from(
          document.getElementsByClassName('mySelect')
        )
        if (bool) {
          this.showBlur = true
          elSelectArr.forEach((item, index) => {
            if (index !== this.selectIndex) {
              item.classList.add('zhezhao')
            } else {
              item.classList.remove('zhezhao')
            }
          })
        } else {
          this.showBlur = false
          elSelectArr.forEach((item, index) => {
            item.classList.remove('zhezhao')
          })
        }
      }, 10)
    }
  },
  mounted() {
    setTimeout(() => {
      if (sessionStorage.getItem('beforeRouteName') === 'options-params') {
        let cartTemp = this.$store.state.cartTemp
        console.log(cartTemp)
        this.getUsedCurrencyt().then(res => {
          Promise.all([
            getConfigInfo({
              product_category_name: this.cateName
            }),
            getProductConfig({
              product_category_name: this.cateName
            })
          ]).then(result => {
            let configInfo = result[0],
              productConfig = result[1]
            this.otherSelectList = addProperty(configInfo.data)
            this.otherSelectListData(
              this.otherSelectList,
              cartTemp.param_id_list.split(',')
            )
            this.priceConfig = productConfig.data
            this.shapeList = JSON.parse(productConfig.data.shape)
            this.activeShape = this.shapeList.length ? this.shapeList[0] : ''
            this.initSize({
              sizeW: cartTemp.width,
              sizeH: cartTemp.height,
              qty: cartTemp.quantity
            })
            this.priceCalculate()
          })
        })
      } else {
        let sessionData = sessionStorage.getItem('stickerSizeAndQtyInfo')
          ? JSON.parse(sessionStorage.getItem('stickerSizeAndQtyInfo'))
          : ''
        this.getUsedCurrencyt().then(res => {
          Promise.all([
            getConfigInfo({
              product_category_name: this.cateName
            }),
            getProductConfig({
              product_category_name: this.cateName
            })
          ]).then(result => {
            let configInfo = result[0],
              productConfig = result[1]
            this.otherSelectList = addProperty(configInfo.data)
            this.priceConfig = productConfig.data
            this.shapeList = JSON.parse(productConfig.data.shape)
            this.activeShape = this.shapeList.length ? this.shapeList[0] : ''
            if (sessionData) {
              this.initSize(sessionData)
              this.priceCalculate()
            } else {
              let data = {
                sizeW: this.priceConfig.size_restrict[0].width,
                sizeH: this.priceConfig.size_restrict[0].height,
                qty: this.priceConfig.min_quantity
              }
              this.initSize(data)
              this.priceCalculate()
            }
            this.$nextTick(() => {
              this.addClick()
            })
          })
        })
      }
    }, 100)
  },

  beforeDestroy() {
    sessionStorage.removeItem('stickerSizeAndQtyInfo')
  }
}
</script>

<style lang="scss" scoped>
.zhezhao {
  position: relative;

  /deep/ .el-input__inner {
    background-color: #f3f3f3 !important;
    border-color: #dcdfe6 !important;
  }
}

.box-wrap {
  .box1,
  .box2 {
    flex: 1;
    border: 1px solid #ccc;
    padding: 5px;
    cursor: pointer;
    @media screen and (max-width: $breakpoint-sm-max) {
      border-color: $primary;
    }

    &:hover {
      border-color: $primary;
    }

    .imgWrap {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      @include px2rem(height, 150px);
      cursor: pointer;

      img {
        object-fit: contain;
      }
    }
  }

  .box1 {
    &:hover {
      .imgWrap {
        background-color: #d8ebff;
      }

      .nohover {
        display: none;
      }

      .hover {
        display: block;
      }
    }

    .hover {
      display: none;
    }

    .imgWrap {
      position: relative;
      background-color: #eeeeee;

      input[type='file'] {
        position: absolute;
        z-index: -1;
        opacity: 0;
        left: 0;
        top: 0;
        width: 100%;
        font-size: 0;
      }

      i {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 6rem;
        color: $primary;
      }
    }

    .imgWrap.error {
      border: 1px dashed $danger;
    }
  }

  .box2 ul {
    list-style: disc;
    padding-left: 20px;
  }
}

.content-wrap {
  width: 100%;
  margin: 0 auto;

  & > .h3 {
    @include px2rem(font-size, 32px);
  }

  .basicInfo {
    li {
      span {
        @include px2rem(font-size, 24px);
      }

      span:nth-child(1) {
        text-align: right;
      }

      span:nth-child(2) {
        text-align: left;
      }
    }
  }
}

.subtotal {
  @include px2rem(font-size, 32px);

  .unitPrice {
    font-weight: 700;
    @include px2rem(font-size, 32px);
  }

  .totalPrice {
    @include px2rem(font-size, 48px);
    color: #ff0000;
    font-weight: 700;
  }

  /deep/ {
    .el-input__inner {
      @include px2rem(width, 165px);
      @include px2rem(height, 66px);
      @include px2rem(font-size, 32px);
    }
  }
}

.submit {
  button {
    @include px2rem(width, 700px);
    @include px2rem(height, 100px);
    @include px2rem(font-size, 32px);
    font-weight: 700;
  }
}

.select-item {
  .row {
    @include px2rem(font-size, 28px);
    line-height: 1.2;
    margin-bottom: 22px;
  }

  .qty {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-width: 100px;
    padding: 5px 10px;
    border: 1px solid #ccc;
    cursor: not-allowed;
  }
}

//参数列表样式
.tree /deep/,
#shapeSelect /deep/{
  @include px2rem(font-size, 28px);

  .errorMsg {
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    left: 15px;
  }

  .el-select-dropdown {
    border-color: $primary;
  }

  .popper__arrow {
    border-bottom-color: $primary;
  }

  .el-select {
    width: 100%;

    .el-input__inner {
      border-color: $primary;
      color: #999;
      @include px2rem(height, 66px);
      @include px2rem(font-size, 28px);

      &::-webkit-input-placeholder {
        color: #999;
      }
    }

    .el-select-dropdown__item {
      display: flex;
      align-items: center;
      height: auto;
      line-height: 1.4em;
      white-space: normal;
      @include px2rem(min-height, 34px);
      @include px2rem(padding, 10px);
      border-bottom: 1px solid #ccc;
      @include px2rem(font-size, 28px);

      &:last-child {
        border-bottom: none;
      }
    }
  }

  .el-input__suffix .el-input__icon {
    color: #999;
    @include px2rem(font-size, 28px);
    @include px2rem(line-height, 66px);
  }

  .el-select.selected {
    .el-input__inner {
      border-color: #dcdfe6;
    }
  }

  .el-select .is-focus {
    .el-input__inner {
      border-color: #dcdfe6;
    }
  }

  .el-date-editor {
    .el-input__inner {
      border-color: $primary;
    }
  }

  .el-date-editor.selected {
    .el-input__inner {
      border-color: #dcdfe6;
    }
  }

  .el-select-dropdown__item.hover {
    color: $primary;
  }
}

@media screen and (min-width: $breakpoint-xl-min) {
  .box-wrap {
    .box1,
    .box2 {
      .imgWrap {
        height: 150px;
      }
    }
  }

  .content-wrap {
    & > .h3 {
      font-size: 18px;
    }

    .basicInfo {
      li {
        span {
          font-size: 18px;
        }
      }
    }
  }

  .subtotal {
    text-align: right;
    font-size: 18px;
    &> [class*='col-'] {
      padding-right: 15px;
      padding-left: 15px;
    }
    .unitPrice {
      font-size: 18px;
    }

    .totalPrice {
      font-size: 32px;
    }

    /deep/ {
      .el-input__inner {
        width: 112px;
        height: 38px;
        font-size: 18px;
      }
    }
  }

  .submit {
    button {
      width: 394px;
      height: 54px;
      font-size: 24px;
    }
  }

  .select-item {
    .row {
      font-size: 18px;
    }
  }

  //参数列表样式
  .tree /deep/,
  #shapeSelect /deep/{
    font-size: 18px;

    .el-select {
      .el-input__inner {
        height: 36px;
        font-size: 18px;
      }

      .el-select-dropdown__item {
        padding:5px 10px;
        font-size: 18px;
      }
    }

    .el-input__suffix .el-input__icon {
      color: #999;
      font-size: 18px;
      line-height: 36px;
    }
  }
}
</style>

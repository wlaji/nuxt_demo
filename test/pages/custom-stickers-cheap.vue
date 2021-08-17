<template>
  <div class="optionsWrap" :class="{ 'bg-default': showBlur }">
    <div class="container py-2 pb-xl-5">
      <div class="content-wrap">
        <div class="h3 mb-4 pTips" id="pH3">
          Please fill out the Automated Quotation System as follows...
        </div>
        <p class="pTips" style="margin:-20px 0 20px">
          This page is just for promotional orders and you are enjoying the
          discount. So you will not enjoy other discounts on the website.
        </p>
        <div class="row">
          <div class="col-12 col-xl-4 py-3 py-xl-0">
            <div class="row pTips">
              <div class="col-5 col-xl-12">
                <div style="--aspect-ratio: 250/200">
                  <img
                    :src="priceConfig.pic_path"
                    :alt="cateName"
                    v-if="pPath == ''"
                  />
                  <img :src="pPath" :alt="cateName" v-if="pPath != ''" />
                </div>
              </div>
              <div class="col-7 col-xl-12">
                <ul class="mt-3 basicInfo" v-show="activityTypeInfo.tips">
                  <div class="select-item mt-3" v-show="activityTypeInfo.tips">
                    <div class="row align-items-center mb-2 mb-lg-3">
                      <div class="col-12 col-lg-12">
                        <div class="tips" v-html="activityTypeInfo.tips"></div>
                      </div>
                    </div>
                  </div>
                </ul>
              </div>
            </div>
            <div class="row pTipsmb">
              <div class="col-6" style="align-items: center; display: flex;">
                <div class="h3 mb-4">
                  Please fill-out the Automated Quotation System as follows...
                </div>
              </div>
              <div class="col-6">
                <div style="--aspect-ratio: 250/200">
                  <img
                    :src="priceConfig.pic_path"
                    :alt="cateName"
                    v-if="pPath == ''"
                  />
                  <img :src="pPath" :alt="cateName" v-if="pPath != ''" />
                </div>
              </div>
            </div>
            <p class="pTipsmb">
              This page is just for promotional order and you are enjoying the
              discount. So you will not enjoy other discounts on the website.
            </p>
          </div>
          <div class="col-12 col-xl-8 mt-3 mt-xl-0" id="params-select">
            <div class="select-item">
              <div class="row align-items-center">
                <div class="col-5 text-right">
                  Category:
                </div>
                <div class="col-7" style="display: flex;align-items: center;">
                  <el-cascader
                    v-model="pName"
                    :options="aOptions"
                    :props="optionProps"
                    style="width: 100%;"
                    @change="handleChangeOption"
                    :disabled="isCas"
                  ></el-cascader>
                  <div
                    class="row pTips"
                    v-if="shapeList.length > 1"
                    style="margin-left: auto;margin-left: auto;align-items: center;margin-bottom: 0;"
                  >
                    <div class="col-5" style="text-align: right">Shape:</div>
                    <div class="col-7">
                      <template v-if="shapeList.length > 1">
                        <el-select
                          v-model="activeShape"
                          class="mySelect"
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
                        {{ shapeList[0] }}
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="select-item" v-if="shapeList.length > 1">
              <div
                class="row align-items-center pTipsmb"
                v-show="shapeList.length > 1"
              >
                <div class="col-5 text-right">
                  Shape:
                </div>
                <div class="col-7">
                  <template v-if="shapeList.length > 1">
                    <el-select
                      v-model="activeShape"
                      class="mySelect"
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
                </div>
              </div>
            </div>
            <div class="select-item">
              <div class="row align-items-center">
                <div class="col-5 text-right">
                  Size:
                </div>
                <div class="col-7">
                  <el-select
                    :placeholder="sizePlaceholder"
                    v-model="sizeIndex"
                    @change="changeSize"
                    ref="changeSize"
                  >
                    <el-option
                      v-for="(item, index) in parry"
                      :key="index"
                      :label="item"
                      :value="index"
                    ></el-option>
                  </el-select>
                  <div class="row inputSize p-2" v-show="showSizeInput">
                    <div class="col-6 inputW">
                      <label class="d-inline-block mb-1">Width</label>
                      <size-input
                        v-model="sizeW"
                        ref="sizeWInput"
                        :min="strict.min_width"
                        :max="strict.max_width"
                        @validateResult="priceCalculate"
                        :required="true"
                      ></size-input>
                    </div>
                    <div class="col-6 inputH">
                      <label class="d-inline-block mb-1">Height</label>
                      <size-input
                        v-model="sizeH"
                        ref="sizeWInput"
                        :min="strict.min_height"
                        :max="strict.max_height"
                        @validateResult="priceCalculate"
                        :required="true"
                      ></size-input>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="select-item">
              <div class="row align-items-center">
                <div class="col-5 text-right">
                  Quantity :
                </div>
                <div class="col-7">
                  <span v-if="qtType == 1">{{ qty }}</span>
                  <div v-else>
                    <qty-input
                      ref="qtyInput"
                      style="width:150px"
                      v-model="qty"
                      :min="this.priceConfig.min_quantity"
                      :max="this.priceConfig.max_quantity"
                      @validateResult="priceCalculate"
                    ></qty-input>
                  </div>
                </div>
              </div>
            </div>
            <tree
              :list="otherSelectList"
              ref="paramTree"
              class="select-item"
              @changeSelect="changeSelect"
              @visibleChange="visibleChange"
            ></tree>
            <tree
              :list="customParams"
              ref="paramTree1"
              class="select-item"
              @changeSelect="changeSelect1"
              @visibleChange="visibleChange"
            ></tree>

            <div class="select-item" v-show="priceStrict">
              <div class="row align-items-center">
                <div class="col-5 text-right">
                  <label> <b>Transport</b> </label>
                </div>
                <div class="col-7">
                  <el-select
                    placeholder="Please select shipping time"
                    v-model="pStrict"
                    @change="changeTransport"
                    class="tranSport"
                  >
                    <el-option
                      v-for="(item, index) in priceStrict"
                      :key="index"
                      :label="item.shipping_price_description"
                      :value="item.price"
                    ></el-option>
                  </el-select>
                </div>
              </div>
            </div>
            <div class="select-item" v-show="!priceStrict">
              <div class="row align-items-center">
                <div class="col-5 text-right">
                  <label> <b>Transport</b> </label>
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
                  <label> <b>Currency</b> </label>
                </div>
                <div class="col-7">
                  <span>{{ currencyCode }}</span>
                </div>
              </div>
            </div>

            <div
              class="row align-items-center justify-content-center subtotal my-3"
            >
              <div class="col-5 text-right">
                <label class="mx-2 mx-xl-0"> <b>Subtotal</b> </label>
              </div>
              <div class="col-7 text-left">
                <b class="totalPrice" v-if="pPice == 0">
                  {{ Symbol }}{{ priceInfo.price }}
                </b>
                <b class="totalPrice" v-if="pPice != 0">
                  {{ Symbol }}{{ pPice }}
                </b>
                <span style="margin-left: 10px;">(Original Price:{{ Symbol }}{{yPrice}})</span>
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

            <div
              class="select-item mt-3  pTipsmbb"
              v-show="activityTypeInfo.tips"
            >
              <div class="row align-items-center mb-2 mb-lg-3">
                <div class="col-12 col-lg-8">
                  <div class="tips" v-html="activityTypeInfo.tips"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--    跳转弹窗-->
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
          <div class="col-12 d-none">
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

    <!--    优惠券弹窗-->
    <coupon
      :visible.sync="showCouponDialog"
      :isShow = "true"
      v-model="cid"
      :lockScroll="false"
      @submitCode="submitCid"
    ></coupon>
  </div>
</template>

<script>
import sizeInput from "@/components/BasisComponents/sizeInput";
import qtyInput from "@/components/BasisComponents/qtyInput";
import tree from "@/components/optionsTree/tree";
import coupon from "@/components/coupon";

import {
  validateSize,
  validateQty,
  validateImageAttribute
} from "@/utils/validate";

import {
  getCurrency,
  ossUpload,
  getCouponProductPrice,
  getProductConfig
} from "@/api/public";

import {
  getActivityCouponProductCategory,
  getActivityCouponCondition
} from "@/api/activity";

export default {
  data() {
    return {
      isCas:false,
      customParams:[],
      pStrict:null,
      priceStrict:[],
      pPice: "",
      activityTypeInfo: [],
      payType: "",
      pPath: "",
      showSizeInput: false, //是否展示sizeinput
      sizeIndex: "",
      strict: "",
      parry: [],
      cateName: "",
      cid: "",
      showCouponDialog: false,
      pName: '',
      aOptions: [],
      optionProps: {
        expandTrigger: "hover",
        value: "product_cate_name",
        label: "product_cate_name",
        children: "data"
      },
      showBlur: false,
      removeZheZhao: false,
      selectIndex: -1,
      activeShape: "",
      shapeList: [],
      paramsList: [],
      otherSelectList: [],
      priceConfig: {
        pic_path: require("static/images/loading.png")
      },
      sizeW: "",
      sizeH: "",
      currencyInfo: [],
      currencyCode: "",
      discountInfo: [],
      discountId: "",
      qty: "",
      optionsObj: {
        optionIdList: [],
        select_params: {}
      },
      optionsObj1: {
        optionIdList: [],
        select_params: {}
      },
      allowAddToCart: true,
      priceInfo: {
        unit_price: 0,
        price: 0
      },
      picPath: "",
      uploadImgFile: "",
      fileData: [],
      errorImg: false,
      showDateErrorMsg: false,
      loadContinue: false,
      model1: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
      sizePlaceholder: "please select size",
      qtType: 0,
      qarry: [],
      yPrice:0,
    };
  },
  components: {
    sizeInput,
    qtyInput,
    tree,
    coupon
  },
  computed: {
    Rate() {
      return this.priceInfo.currency ? this.priceInfo.currency.rate : 1;
    },
    Symbol() {
      return this.priceInfo.currency ? this.priceInfo.currency.symbol : "$";
    },
    cYPrice:{
      get(){
        return this.yPrice
      },
      set(newValue){
        let price = Number(this.pStrict) + Number(newValue)
        this.yPrice = price.toFixed(2)
      }
    }
  },
  methods: {
    email() {
      window.location.href = "https://www.customsticker.com/contact-us";
    },
    changeSize(e) {
      // sizeW sizeH
      if (this.activityTypeInfo.type == 1) {
        if (this.strict.size_restrict[e]) {
          this.qty = this.strict.size_restrict[e].quantity;
        }
      }
      if (this.qarry) {
        this.qty = this.qarry[e];
      }
      if (this.strict.custom_size == 1) {
        if (e != this.parry.length - 1) {
          this.sizeW = this.strict.size_restrict[e].width;
          this.sizeH = this.strict.size_restrict[e].height;
          this.showSizeInput = false;
        } else {
          this.showSizeInput = true;
        }
      } else {
        this.sizeW = this.strict.size_restrict[e].width;
        this.sizeH = this.strict.size_restrict[e].height;
        this.showSizeInput = false;
        this.priceCalculate();
      }
      if (this.qty == undefined) {
        this.qty = 1;
      }
    },
    addProperty(tree) {
      let verifyArr = tree;
      verifyArr.forEach(item => {
        item.isChecked = true;
        item.selectId = "";
        if (item.data) {
          this.addProperty(item.data);
        }
      });
      return verifyArr;
    },
    // 价格计算
    pcTypePrice(price) {
      let activityTypeInfo = this.activityTypeInfo;
      let pPice = 0;
      if (activityTypeInfo.type == 0) {
        pPice =
          (price * (100 - parseInt(activityTypeInfo.discount_cash))) / 100;
      }
      else if (activityTypeInfo.type == 2) {
        pPice = this.priceInfo.pPrice
        this.priceInfo.price = this.priceInfo.pPrice
        // pPice = activityTypeInfo.discount_cash;
        // this.priceInfo.price = activityTypeInfo.discount_cash;
      }
      else {
        pPice = price - parseInt(activityTypeInfo.discount_cash);
      }
      sessionStorage.setItem("discountPrice", activityTypeInfo.discount_cash);
      sessionStorage.setItem("discountType", activityTypeInfo.type);
      if (pPice <= 0) {
        pPice = 0;
      }
      let pStrict = this.pStrict || 0
      pPice+=pStrict
      this.pPice = pPice.toFixed(2);
      if (this.payType == 2) {
        this.payType = 3;
      }
    },
    handleChangeOption(e) {
      let product_category_name = e[e.length - 1];
      this.product_category_name = product_category_name;
      this.cateName = product_category_name;
      let postData = {
        product_category_name: product_category_name,
        coupon_code: this.cid
      };
      getActivityCouponCondition(postData).then(res => {
        if (res.data) {
          this.activityTypeInfo = res.data.activityTypeInfo;
          sessionStorage.setItem(
            "product_category_id",
            res.data.product_category_id
          );
          this.otherSelectList = this.addProperty(res.data.product_param_list);
          this.customParams = this.addProperty(res.data.custom_params)
          this.strict = res.data.strict;

          this.priceStrict = res.data.price_strict
          let parry = [];
          let qarry = [];
          if (res.data.type == 1) {
            this.strict.size_restrict.forEach((item, index) => {
              parry[index] = `${item.width}"x${item.height}"`;
              qarry[index] = item.quantity;
            });
          } else {
            this.strict.size_restrict.forEach((item, index) => {
              parry[index] = `${item.width}"x${item.height}"`;
            });
          }
          if (res.data.strict.custom_size == 1) {
            parry.push("Custom Size");
          }
          if (parry[0] == "Custom Size") {
            this.showSizeInput = true;
            this.sizePlaceholder = "custom size";
          }
          this.sizeIndex = parry[0];
          this.qarry = qarry;
          this.parry = parry;
          let aaa = (list, pItem) => {
            list.forEach(item => {
              if (item.isSelect) {
                pItem.selectId = item.id;
              }
              if (item.isSelect && item.data && item.data.length) {
                aaa(item.data, item);
              }
            });
          };
          this.otherSelectList.forEach(item => {
            //判断是否默认选中
            if (item.isSelect && item.data.length) {
              //传入子类列表,和父级对象
              aaa(item.data, item);
            }
          });

          let payType = 0;
          // type为0或1，正常算价格 调支付接口
          if (
            res.data.activityTypeInfo.type == 0 ||
            res.data.activityTypeInfo.type == 1
          ) {
            payType = 0;
          } else {
            //type为2 固定价格
            payType = 2;
            if (res.data.activityTypeInfo.discount_cash == 0) {
              // discount_cash为0不调用支付
              payType = 1;
            }
          }
          this.qtType = res.data.type;
          this.payType = payType;
        }
      });

      this.getUsedCurrencyt().then(res => {
        Promise.all([
          getProductConfig({
            product_category_name: product_category_name
          })
        ]).then(result => {
          let productConfig = result[0];
          this.priceConfig = productConfig.data;

          this.shapeList = JSON.parse(productConfig.data.shape);
          this.activeShape = this.shapeList.length ? this.shapeList[0] : "";
          let qty = 1;
          //如果数量不可以输入 又有预选值 用第一个
          if (this.qarry) {
            qty = this.qarry[0] || 1;
          } else {
            qty = this.priceConfig.min_quantity;
          }
          // if(this.activityTypeInfo.type==1){
          //   qty =
          // }
          if(this.strict.min_quantity){
            qty = this.strict.min_quantity
            this.priceConfig.min_quantity = this.strict.min_quantity
            this.priceConfig.max_quantity = this.strict.max_quantity
          }

          let data = {
            sizeW: this.priceConfig.size_restrict[0].width,
            sizeH: this.priceConfig.size_restrict[0].height,
            qty: qty
          };
          let sizeIndex = this.sizeIndex
          if(sizeIndex){
            data.sizeW = Number(sizeIndex.split('"x')[0])
            data.sizeH = Number(sizeIndex.split('"x')[0])
          }
          console.log(data)
          this.initSize(data);
          this.priceCalculate();
        });
      });
    },
    //校验树形结构参数
    checkedParamsFn(tree) {
      let checkedParams = true;

      function validateItem(tree) {
        tree.forEach(item => {
          if (item.data) {
            if (!item.selectId) {
              item.isChecked = false;
              checkedParams = false;
            } else {
              if (item.data && item.data.length) {
                let findItem = item.data.find(citem => {
                  return citem.id === item.selectId;
                });
                if (findItem && findItem.data && findItem.data.length) {
                  validateItem(findItem.data);
                }
              }
            }
          }
        });
      }

      validateItem(tree);
      return checkedParams;
    },

    //校验尺寸和数量
    verifyParams() {
      let priceConfig = this.priceConfig;
      let validateSizeW = validateSize(
        this.sizeW,
        priceConfig.min_width,
        priceConfig.max_width
      );
      let validateSizeH = validateSize(
        this.sizeH,
        priceConfig.min_height,
        priceConfig.max_height
      );
      // let validateQtyResult = validateQty(
      //   this.qty,
      //   priceConfig.min_quantity,
      //   priceConfig.max_quantity
      // )
      let validateQtyResult = {};
      validateQtyResult.isValid = true;
      //验证尺寸和数量
      if (
        !validateSizeW.isValid ||
        !validateSizeH.isValid ||
        !validateQtyResult.isValid
      ) {
        return false;
      }
      return true;
    },

    //综合校验
    checkedAllParams() {
      let list = this.otherSelectList || [],
        checkedSizeAndQty = this.verifyParams(),
        checkedParams = true;
      //判断是否有其他选项
      if (list.length) {
        checkedParams = this.checkedParamsFn(list);
      }
      console.log(checkedSizeAndQty);
      if (!checkedSizeAndQty || !checkedParams) {
        return false;
      }
      return true;
    },

    continueUpload() {
      this.loadContinue = true;
      if (!this.checkedAllParams()) {
        this.loadContinue = false;
        return false;
      }
      let p = true
      let pStrict =  Number(this.pStrict)
      if(pStrict===0 || pStrict>0){
        p = false
      }
      if(this.priceStrict&&p){
        this.$message.warning("Your transport is empty");
        this.loadContinue = false;
        return false;
      }

      sessionStorage.setItem('pStrict',this.pStrict)
      sessionStorage.setItem("optionIdList1", this.optionsObj1.optionIdList);
      sessionStorage.setItem("optionIdList", this.optionsObj.optionIdList);
      sessionStorage.setItem("payType", this.payType);
      if (this.pPath) {
        let newParams = this.getNewParams();
        let cartTempData = Object.assign({}, newParams, {
          pic_path: this.pPath
        });
        this.$store.commit("updateCartTemp", cartTempData);
        this.$router.push({
          name: "discount-products-checkout"
        });
      } else {
        this.loadContinue = false;
        this.model1 = true;
      }
    },

    getNewParams() {
      let getCartTempData = () => {
        let priceInfo = this.priceInfo;
        let pPice = this.pPice || this.priceInfo.price;
        let data = Object.assign(
          {},
          {
            backType: "design",
            product_cate_name: this.$utils.decodeName(
              this.$route.params.categoryName
            ),
            quantity: this.qty,
            param_id_list: this.optionsObj.optionIdList.join(","),
            width: this.sizeW,
            height: this.sizeH,
            pic_path: "",
            strict: {
              min_quantity: parseInt(this.priceConfig.min_quantity),
              max_quantity: parseInt(this.priceConfig.max_quantity)
            },
            params: priceInfo.additionalOption,
            options: this.paramsList,
            select_params: JSON.stringify(this.optionsObj.select_params),
            allowAddToCart: false, //是否允许添加到购物车
            activeShape: this.activeShape
          },
          priceInfo,
          {
            unit_price: this.$utils.keepTwoDecimal(
              priceInfo.unit_price / this.Rate
            ),
            price: this.$utils.keepTwoDecimal(pPice / this.Rate)
          }
        );
        return data;
      };
      return getCartTempData();
    },

    //去参数展示页或者设计系统
    async next(type) {
      let picPath;
      let getCartTempData = type => {
        this.optionsObj = this.$refs.paramTree.getSelectId(
          this.otherSelectList
        );
        sessionStorage.setItem("optionIdList", this.optionsObj.optionIdList);
        let priceInfo = this.priceInfo;
        let price = this.pPice;
        if (!price) {
          price = priceInfo.price;
        }
        price = this.$utils.keepTwoDecimal(price / this.Rate);
        sessionStorage.setItem("price", price);
        let data = Object.assign(
          {},
          {
            backType: type === 1 ? "params" : "design",
            product_cate_name: this.$utils.decodeName(this.cateName),
            quantity: this.qty,
            param_id_list: this.optionsObj.optionIdList.join(","),
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
            price: price,
            accessory: ""
          }
        );
        return data;
      };
      if (type === 1) {
        sessionStorage.removeItem("beforeRouteName");
        let dataList = getCartTempData(type);
        try {
          dataList.pic_path = await this.upImg();
        } catch {}
        this.$store.commit("ADD_CART_TEMP", dataList);
        // let newParams = this.getNewParams()
        // let cartTempData = Object.assign({}, newParams, {
        //   pic_path: this.pPath,
        // })
        // this.$store.commit('updateCartTemp', cartTempData)
        this.$router.push({
          name: "discount-products-checkout"
        });
        // this.$router.push({
        //   path: '/options/params'
        // })
      } else if (type === 2) {
        sessionStorage.setItem("beforeRouteName", this.$route.name);
        sessionStorage.setItem("optionsObj", JSON.stringify(this.optionsObj));
        let obj = {
          qty: this.qty,
          sizeH: this.sizeH,
          sizeW: this.sizeW,
          activeShape: this.activeShape
        };
        sessionStorage.setItem("pObj", JSON.stringify(obj));
        this.$store.commit("ADD_CART_TEMP", getCartTempData(type));
        this.$router.push({
          name: "create-your-own-stickers-categoryName",
          params: {
            categoryName: this.$utils.formatFirstCategoryName(this.cateName),
            hasC: true
          }
        });
      }
    },

    upImg() {
      const loading = this.$loading({
        lock: true,
        text: "Please wait...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
        customClass: "cus-loading"
      });
      return new Promise(resolve => {
        this.fileData = new FormData(); // new formData对象
        this.fileData.append("photo[]", this.uploadImgFile); // append增加数据
        this.fileData.append("isRandom", true);
        this.fileData.append("isTemp", false);
        ossUpload(this.fileData)
          .then(res => {
            let path = Object.values(res.data)[0];
            if (path) {
              resolve(path);
            } else {
              this.$message.error("upload failed");
            }
          })
          .catch(err => {
            this.$message.error("upload failed");
            this.$refs.upFile.value = "";
          })
          .finally(() => {
            loading.close();
          });
      });
    },

    uploadOnChange(e) {
      let file = this.$refs.upFile.files[0];
      if (!file) {
        return false;
      }
      let validateResult = validateImageAttribute(file);
      if (!validateResult.isValid) {
        this.$message.error(validateResult.message);
        this.$refs.upFile.value = "";
        return false;
      }
      this.uploadImgFile = file;
      let reader = new FileReader();
      reader.readAsDataURL(this.$refs.upFile.files[0]);
      reader.onload = e => {
        // this.picPath = e.target.result
        this.next(1);
      };
    },

    changeSelect() {
      this.optionsObj = this.$refs.paramTree.getSelectId(this.otherSelectList);
      this.priceCalculate();
      // this.$nextTick(() => {
      //   this.addClick()
      // })
    },
    changeSelect1() {
      this.optionsObj1 = this.$refs.paramTree1.getSelectId(this.customParams);
      this.priceCalculate();
      // this.$nextTick(() => {
      //   this.addClick()
      // })
    },
    changeTransport(e,i){
      let obj = {}
      obj = this.priceStrict.find(item => {
        return item.price === e
      });
      sessionStorage.setItem('discountName',obj.shipping_price_description)
      this.priceCalculate()
    },

    // 获取价格
    priceCalculate() {
      let verifyParams = this.verifyParams();
      // this.qtType不等于1的时候才会展示input input隐藏时候调用validateFun()会报错
      if (!verifyParams && this.qtType != 1) {
        //展示错误信息
        this.$refs.qtyInput.validateFun();
        return false;
      }
      let postData = {
        product_category_name: this.cateName,
        width: this.sizeW,
        height: this.sizeH,
        param_id_list: this.optionsObj.optionIdList,
        currency: this.currencyCode,
        quantity: this.qty
      };
      getCouponProductPrice(postData)
        .then(res => {
          this.cYPrice = res.data.price
          this.allowAddToCart = true;
          if (this.payType != 3) {
            let pPrice = 0;
            if (this.activityTypeInfo.type == 2) {
              let pStrict = Number(this.pStrict) || 0
              let num = Number(this.activityTypeInfo.discount_cash)+pStrict
              pPrice = num.toFixed(2);
              res.data.price = num.toFixed(2);
              res.data.pPrice = num.toFixed(2);
            } else {
              pPrice = res.data.price;
            }
            this.priceInfo = res.data;
            this.pcTypePrice(pPrice);
          }
        })
        .catch(err => {
          this.allowAddToCart = false;
        });
    },

    getUsedCurrencyt() {
      return new Promise(resolve => {
        getCurrency().then(res => {
          this.currencyInfo = res.data;
          let defaultCurrency = this.currencyInfo.find(item => {
            return item.is_default === 1;
          });
          this.currencyCode = defaultCurrency.code;
          resolve();
        });
      });
    },

    initSize(data) {
      this.sizeW = data.sizeW;
      this.sizeH = data.sizeH;
      this.qty = data.qty;
    },

    back() {
      this.$router.go(-1);
    },

    //选择项数据回填
    otherSelectListData(list, idList) {
      let findParent = (list, id, parent) => {
        list.forEach(item => {
          if (item.id == id) {
            if (parent) {
              parent.selectId = Number(id);
            }
          } else {
            if (item.data && item.data.length) {
              findParent(item.data, id, item);
            }
          }
        });
      };
      idList.forEach(id => {
        findParent(list, id, "");
      });
    },

    addClick() {
      let elSelectArr = Array.from(document.getElementsByClassName("mySelect"));
      elSelectArr.forEach((item, index) => {
        item.onclick = () => {
          this.selectIndex = index;
        };
      });
      if (elSelectArr[this.selectIndex + 1]) {
        elSelectArr[this.selectIndex + 1].click();
      }
    },

    visibleChange(bool) {
      console.log(bool);
      setTimeout(() => {
        let elSelectArr = Array.from(
          document.getElementsByClassName("mySelect")
        );
        if (bool) {
          this.showBlur = true;
          elSelectArr.forEach((item, index) => {
            if (index !== this.selectIndex) {
              item.classList.add("zhezhao");
            } else {
              item.classList.remove("zhezhao");
            }
          });
        } else {
          this.showBlur = false;
          elSelectArr.forEach((item, index) => {
            item.classList.remove("zhezhao");
          });
        }
      }, 10);
    },

    checkPname(tree, ary, index) {
      let verifyArr = tree;
      ary[index] = tree.length - 1;
      index += 1;
      verifyArr.forEach(item => {
        if (item.data) {
          this.checkPname(item.data, ary, index);
        }
      });
      return ary;
    },
    lasetName(tree) {
      let tArry = tree;
      let lastName = "";

      tArry.forEach(item => {
        if (item.data) {
          this.lasetName(item.data);
        } else {
          this.lastName = item.product_cate_name;
        }
      });
    },
    submitCid() {
      let cid = this.cid;
      if(cid){
        let postData = {
          coupon_code: cid
        };
        getActivityCouponProductCategory(postData).then(res => {
          if (res.ret == 1) {
            sessionStorage.setItem("cid", this.cid);
            this.$router.go(0)
          }
        })
      }
    },
  },
  mounted() {

    this.cid = sessionStorage.getItem("cid") || "";
    if (this.cid) {
      this.showCouponDialog = false;
      let postData = {
        coupon_code: this.cid
      };
      getActivityCouponProductCategory(postData).then(res => {
        this.aOptions = res.data.data;
          // aOptions.length>0||aOptions[0].data.length>0?'false':'true'
        if(res.data.data.length>1||res.data.data[0].data.length>1){
          this.isCas = false
        }else{
          this.isCas = true
        }
        this.pPath = res.data.pic_path;
        let ary = [];
        let index = 0;
        let aryB = this.checkPname(res.data.data, ary, index);
        let product_category_name = "";
        // let checkResult = aryB.every(item => item > 0)
        let checkResult = false;
        aryB.forEach(item => {
          if (item > 0) {
            checkResult = true;
          }
        });
        //展示选项列表
        if (checkResult) {
          product_category_name = res.data.data[0].data[0].product_cate_name
        } else {
          this.lasetName(res.data.data);
          product_category_name = this.lastName;
        }
        this.pName = product_category_name
        let aryC = [product_category_name];
        this.handleChangeOption(aryC);
      },(res =>{
        sessionStorage.removeItem('cid')
        this.showCouponDialog = true;
      })
      );
    } else {
      //缓存没有id 弹窗提示输入优惠券码
      this.showCouponDialog = true;

    }
  },

  beforeDestroy() {
    sessionStorage.removeItem("stickerSizeAndQtyInfo");
  }
};
</script>

<style lang="scss" scoped>
@media screen and (min-width: 1200px) {
  .pTips {
    display: flex;
  }
  .pTipsmb,
  .pTipsmbb {
    display: none;
  }
  #pH3{
    font-size: 24px!important;
  }
  /deep/.tranSport{
    height: 36px;
    font-size: 18px;
    border-color: #3797D9;
    width: 100%;
    .el-input__inner {
      border-color: #3797D9;
      font-size: 18px;
      color: #999!important;
    }
  }
}

@media screen and (max-width: 1199px) {
  /deep/.tranSport{
      .el-input__inner {
        height: 0.88rem;
        border-color: #3797D9;
        font-size: .37333rem!important;
      }
    }
  .pTips {
    display: none;
  }
  .pTipsmb {
    display: flex;
  }
  .pTipsmbb {
    display: block;
  }
}

.tips {
  border: 2px dashed #eee;
  padding: 10px;
}

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

      input[type="file"] {
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
#shapeSelect /deep/ {
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
      border-color: #dcdfe6!important;
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

    & > [class*="col-"] {
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
  #shapeSelect /deep/ {
    font-size: 18px;

    .el-select {
      .el-input__inner {
        height: 36px;
        font-size: 18px;
      }

      .el-select-dropdown__item {
        padding: 5px 10px;
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

<template>
  <div
    class="priceListWrap"
    v-if="priceList.length && priceList[0].unit_price != 0"
  >
    <div>
      <p class="font-weight-bold mb-3 mb-xl-2">SIZE</p>
      <el-select
        class="full-width size-select"
        v-model="sizeId"
        :popper-append-to-body="false"
        placeholder="please select size"
        @change="changeSize"
      >
        <el-option
          v-for="item in selectList"
          :key="item.id"
          :label="item.Name"
          :value="item.id"
        ></el-option>
        <el-option
          label="Custom Size"
          value="custom"
          v-if="priceConfig.custom_size == 1"
        ></el-option>
      </el-select>
    </div>
    <div v-show="customSize">
      <div
        class="d-flex align-items-center justify-content-center inputSize my-3 position-relative"
      >
        <div class="inputW d-flex align-items-center">
          <label class="d-inline-block mr-2">Width”</label>
          <size-input
            v-model="sizeW"
            ref="sizeWInput"
            :disabled="!customSize"
            :min="priceConfig.min_width"
            :max="priceConfig.max_width"
            :required="true"
            @validateResult="debounceQuotationCalculator"
          ></size-input>
        </div>
        <div class="mx-3">X</div>
        <div class="inputH d-flex align-items-center">
          <label class="d-inline-block mr-2">Height”</label>
          <size-input
            v-model="sizeH"
            ref="sizeHInput"
            :disabled="!customSize"
            :min="priceConfig.min_height"
            :max="priceConfig.max_height"
            :required="true"
            @validateResult="debounceQuotationCalculator"
          ></size-input>
        </div>
      </div>
    </div>

    <div class="container-fluid" style="border-bottom: 2px solid #DCDFE6">
      <div class="row py-2 text-danger font-weight-bold">
        <span class="col-5">Quantity</span>
        <span class="col-4 offset-3">Unit Price</span>
      </div>
    </div>

    <div class="customQty container-fluid">
      <p class="font-weight-bold mt-3 mt-xl-2">Custom quantity</p>
      <div class="row align-items-center py-3 py-xl-2">
        <div class="col-5">
          <el-radio
            class="qty d-flex align-items-center"
            size="mini"
            v-model="selectQty"
            label="customQty"
            @change="changeSelectQty"
          >
            <qty-input
              :disabled="!showCustomQtyInput"
              class="flex-1"
              v-model="qty"
              ref="qtyInput"
              :min="priceConfig.min_quantity"
              :max="priceConfig.max_quantity"
              :required="true"
              @validateResult="debounceQuotationCalculator"
            ></qty-input>
          </el-radio>
        </div>
        <div class="col-3">
          <span class="price" ref="tipsPrice">
            <el-tooltip
              :manual="true"
              effect="dark"
              v-model="showTips"
              popper-class="sizeValidateToolTip"
              placement="top-start"
            >
              <div slot="content" v-html="message"></div>
              <span>${{ customQtyPrice }}</span>
            </el-tooltip>
          </span>
        </div>
        <div class="col-4">
          <span class="unitPrice text-nowrap"
            >${{ customQtyUnitPrice }} each</span
          >
        </div>
      </div>
    </div>

    <ul class="priceTable container-fluid mb-1">
      <li
        v-for="(item, index) in priceList"
        :key="index"
        class="row"
        :class="{ custom: item.type == 'custom' }"
      >
        <div class="col-5">
          <el-radio
            size="mini"
            v-model="selectQty"
            :label="item.quantity"
            @change="changeSelectQty"
            >{{ item.quantity }}
          </el-radio>
        </div>
        <div class="col-3">
          <span class="price">${{ item.price }}</span>
        </div>
        <div class="col-4">
          <span class="unitPrice">${{ item.unit_price }} each</span>
        </div>
      </li>
    </ul>

    <div class="trait mt-3 mt-xl-2">
      <div
        class="row no-gutters align-items-center bg-white px-1 py-2 py-xl-2"
        v-show="isSticker"
      >
        <div class="col-6 py-2 py-xl-2">
          <div class="row no-gutters">
            <div class="col-3 d-flex-center">
              <div class="imgWrap">
                <img
                  src="@/assets/images/free/free-air-shipping.png"
                  alt="Free Air Shipping"
                  title="Free Air Shipping"
                />
              </div>
            </div>
            <div class="col-9 d-flex align-items-center">
              <b>Free&nbsp;</b> Air Shipping
            </div>
          </div>
        </div>
        <div class="col-6 py-2 py-xl-2">
          <div class="row no-gutters">
            <div class="col-3 d-flex-center">
              <div class="imgWrap">
                <img
                  src="@/assets/images/free/free-packing.png"
                  alt="Free 50/Set Packing"
                  title="Free 50/Set Packing"
                />
              </div>
            </div>
            <div class="col-9 d-flex align-items-center">
              <b>Free&nbsp;</b> 50/Set Packing
            </div>
          </div>
        </div>
        <div class="col-6 py-2 py-xl-2">
          <div class="row no-gutters">
            <div class="col-3 d-flex-center">
              <div class="imgWrap">
                <img
                  src="@/assets/images/free/free-round-corners.png"
                  alt="Free Round Corners"
                  title="Free Round Corners"
                />
              </div>
            </div>
            <div class="col-9 d-flex align-items-center">
              <b>Free&nbsp;</b> Round Corners
            </div>
          </div>
        </div>
        <div class="col-6 py-2 py-xl-2">
          <div class="row no-gutters">
            <div class="col-3 d-flex-center">
              <div class="imgWrap">
                <img
                  src="@/assets/images/free/free-shapes-options.png"
                  alt="Free Shapes Options"
                  title="Free Shapes Options"
                />
              </div>
            </div>
            <div class="col-9 d-flex align-items-center">
              <b>Free&nbsp;</b> Shapes Options
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="nextBtn mt-2" @click="next">
      <a
        href="javascript:;"
        class="text-decoration-none"
        :title="'Order '+ $utils.decodeName(cateName)"
        >Continue</a
      >
    </div>
    <!--    <div class="freeBtn mt-2 d-none" @click="freeOrdersBtn">-->
    <!--      <a href="javascript:;" class="text-decoration-none">Get Free Stickers</a>-->

    <!--      <el-tooltip-->
    <!--        popper-class="priceListTooltip"-->
    <!--        content="Bottom center"-->
    <!--        placement="bottom"-->
    <!--        effect="light"-->
    <!--      >-->
    <!--        <div slot="content">-->
    <!--          These free stickers are special gifts for those customers who ordered-->
    <!--          at GS-JJ.-->
    <!--        </div>-->
    <!--        <i class="el-icon-question mb-0 text-white align-middle font18" @click.stop></i>-->
    <!--      </el-tooltip>-->
    <!--    </div>-->
    <p
      class="freeOrderLink"
      v-if="$route.params.productName === 'Die-cut-stickers'"
    >
      <a
        href="javascript:;"
        @click="freeOrdersBtn"
        title="Get Free Stickers?"
        class="freeLink"
        >Get Free Stickers?</a
      >
      These free stickers are thank you gifts for customers who ordered at
      <a href="https://www.gs-jj.com/" target="_blank" title="GS-JJ.com">GS-JJ.com</a>.
    </p>

    <coupon
      :visible.sync="showCouponDialog"
      v-model="couponCode"
      :lockScroll="true"
      @submitCode="submitCode"
    ></coupon>
  </div>
</template>

<script>
import sizeInput from "@/components/BasisComponents/sizeInput";
import qtyInput from "@/components/BasisComponents/qtyInput";
import { validateSize, validateQty } from "@/utils/validate";
import { getQuotation } from "@/api/public";
import { getProductConfig } from "@/api/public";
import coupon from "@/components/coupon";
import { getActivityCouponProductCategory } from "@/api/activity";

export default {
  data() {
    return {
      showCouponDialog: false,
      priceConfig: "",
      customQtyPrice: 0,
      customQtyUnitPrice: 0,
      showCustomQtyInput: true,
      selectQty: "",
      qty: "",
      sizeW: 2,
      sizeH: 2,
      sizeId: 0,
      priceList: [],
      fileList: false,
      uploadImgFile: "",
      loginImgA: "",
      showTips: false,
      message: "",
      showPriceList: true,
      couponCode: "",
      debounceQuotationCalculator: ''
    };
  },
  components: {
    sizeInput,
    qtyInput,
    coupon
  },
  computed: {
    isSticker() {
      let cateName = this.$route.params.productName;
      console.log(cateName);
      let arr = [
        "Die-cut-stickers",
        "Kiss-cut-stickers",
        "Circle-stickers",
        "Square-stickers",
        "Clear-stickers",
        "Rectangle-stickers",
        "Oval-stickers",
        "Bumper-stickers",
        "Sticker-sheets",
        "Rounded-corner-stickers",
        "Transfer-stickers",
        "Front-adhesive-stickers",
        "Vinyl-lettering",
        "Static-clings-decals",
        "Soap-labels",
        "Mailing-labels",
        "Custom-wine-labels",
        "Band-stickers",
        "Custom-laptop-stickers",
        "Logo-stickers"
      ];
      return arr.includes(cateName);
    },
    cateName() {
      let params = this.$route.params;
      return params.productName;
    },
    selectList() {
      try {
        let list = this.priceConfig.size_restrict;
        list.forEach((item, index) => {
          item.Name = `${item.width}"x${item.height}"`;
          item.id = index;
        });
        return list;
      } catch (error) {}
    },
    sizeLabel() {
      try {
        if (this.sizeId !== "custom") {
          let item = this.selectList.find(item => {
            return item.id === this.sizeId;
          });
          return item.Name;
        } else {
          return "Custom";
        }
      } catch (e) {}
    },
    customSize() {
      let value = this.sizeId;
      if (value === "custom") {
        return true;
      }
      return false;
    }
  },
  filters: {
    formatPrice2(str) {
      return str.toFixed(0);
    }
  },
  methods: {
    submitCode() {
      if (!this.couponCode) {
        this.$message.error("Please enter the promo code.");
        return;
      }
      getActivityCouponProductCategory({
        coupon_code: this.couponCode
      }).then(res => {
        sessionStorage.setItem("cid", this.couponCode);
        this.$router.push({
          name: "custom-stickers-cheap"
        });
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let stickerSizeAndQtyInfo = JSON.stringify({
            sizeW: this.freeOrders.width,
            sizeH: this.freeOrders.height,
            qty: this.freeOrders.quantity
          });
          sessionStorage.setItem(
            "stickerSizeAndQtyInfo",
            stickerSizeAndQtyInfo
          );
          this.$router.push({
            name: "optionsFreeOrder-categoryName",
            params: {
              categoryName: this.$utils.formatSecondCategoryName(this.cateName)
            }
          });
        } else {
          return false;
        }
      });
    },
    next() {
      let verifyParams = this.verifyParams();
      if (!verifyParams) {
        //展示错误信息
        this.$refs.sizeWInput.validateFun();
        this.$refs.sizeHInput.validateFun();
        if (this.selectQty === "customQty") {
          this.$refs.qtyInput.validateFun();
        }
        return false;
      }
      this.goDesign();
    },

    freeOrdersBtn() {
      this.showCouponDialog = true;
    },

    changeSize(value) {
      if (value === "custom") {
        return false;
      }
      let selectItem = this.selectList.find(item => {
        return item.id === this.sizeId;
      });
      this.sizeW = selectItem.width;
      this.sizeH = selectItem.height;
      this.debounceQuotationCalculator();
    },

    changeSelectQty(val) {
      if (val === "customQty") {
        this.showCustomQtyInput = true;
      } else {
        console.log(this.$refs.qtyInput);
        this.qty = "";
        this.$nextTick(() => {
          this.$refs.qtyInput.someting = false;
        });
        this.showCustomQtyInput = false;
      }
    },

    goDesign() {
      let qty = this.selectQty === "customQty" ? this.qty : this.selectQty;
      let stickerSizeAndQtyInfo = JSON.stringify({
        sizeW: this.sizeW,
        sizeH: this.sizeH,
        sizeId: this.sizeId,
        qty: qty
      });
      sessionStorage.setItem("stickerSizeAndQtyInfo", stickerSizeAndQtyInfo);
      sessionStorage.removeItem("beforeRouteName");
      this.$router.push({
        name: "options-categoryName",
        params: {
          categoryName: this.$utils.formatSecondCategoryName(this.cateName)
        }
      });
    },

    verifyParams() {
      let priceConfig = this.priceConfig;
      let selectQty = this.selectQty;
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
      let validateQtyResult = {
        isValid: true
      };
      //判断是否是用户自定义数量，是的话就需要验证用户输入的数量,默认不需要验证
      if (selectQty === "customQty") {
        validateQtyResult = validateQty(
          this.qty,
          priceConfig.min_quantity,
          priceConfig.max_quantity
        );
      }
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

    showMsg(msg) {
      if (msg) {
        this.showTips = true;
        this.message = msg;
      } else {
        this.showTips = false;
        this.message = "";
      }
    },

    quotationCalculator() {
      return new Promise(resolve => {
        let verifyParams = this.verifyParams();
        if (!verifyParams) {
          //展示错误信息
          this.$refs.sizeWInput.validateFun();
          this.$refs.sizeHInput.validateFun();
          if (this.selectQty === "customQty") {
            this.$refs.qtyInput.validateFun();
          }
          return false;
        }
        let postData;
        this.qty
          ? (postData = {
              size: this.sizeW * this.sizeH,
              product_category_name: this.$utils.decodeName(this.cateName),
              quantity: this.qty
            })
          : (postData = {
              size: this.sizeW * this.sizeH,
              product_category_name: this.$utils.decodeName(this.cateName)
            });
        getQuotation(postData).then(res => {
          let list = res.data;
          let tips = false;
          if (list.length >= 9) {
            this.customQtyPrice = list[list.length - 1].price;
            this.customQtyUnitPrice = list[list.length - 1].unit_price;
            this.priceList = list.slice(0, list.length - 1);
            tips = list[list.length - 1].tips;
          } else {
            this.priceList = list.slice(0, list.length);
          }
          if (this.selectQty === "customQty") {
            if (tips) {
              this.showMsg("The minimum starting price is 30 dollars");
            } else {
              this.showMsg();
            }
          }
          resolve(list);
        });
      });
    },

    initSize() {
      this.sizeW = this.selectList[0].width;
      this.sizeH = this.selectList[0].height;
      this.sizeId = this.selectList[0].id;
    }
  },
  async fetch() {
    let res = await getProductConfig({
      product_category_name: this.$utils.decodeName(this.cateName)
    });
    this.priceConfig = res.data;
    this.$emit("getProductConfig", res.data);
    if (!this.priceConfig.size_restrict.length) {
      this.showPriceList = false;
      return;
    }
    this.initSize();
    let res2 = await this.quotationCalculator();
    //默认选中第一个数量
    if (res2.length) {
      this.selectQty = "customQty";
    }
  },
  mounted() {
    this.debounceQuotationCalculator = this.$utils.debounce(this.quotationCalculator, 300)
  }
};
</script>

<style lang="scss" scoped>
.priceListWrap {
  width: 100%;
  background-color: #f3f3f3;
  @include px2rem(font-size, 28px);
  @include px2rem(padding, 20px);

  .freeOrderLink {
    @include px2rem(padding-top, 20px);
    text-align: center;
    color: #333;

    .freeLink {
      font-weight: 700;
      color: $primary;
    }

    a {
      text-decoration: underline;
      color: #333;
    }
  }

  /deep/ .el-radio__label {
    @include px2rem(font-size, 28px);
    vertical-align: middle;
  }

  /deep/ .el-radio__inner {
    @include px2rem(width, 28px);
    @include px2rem(height, 28px);

    &::after {
      @include px2rem(width, 10px);
      @include px2rem(height, 10px);
    }
  }

  .size-select /deep/ {
    .el-input__inner {
      @include px2rem(height, 80px);
      @include px2rem(font-size, 28px);
    }

    .el-input__suffix .el-input__icon {
      color: #999;
      @include px2rem(font-size, 28px);
      @include px2rem(line-height, 80px);
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

  .inputSize {
    @include px2rem(font-size, 28px);

    /deep/ {
      .el-input__inner {
        @include px2rem(width, 200px);
        @include px2rem(height, 60px);
        @include px2rem(font-size, 28px);
      }
    }
  }

  .customQty {
    @include px2rem(font-size, 28px);

    /deep/ {
      .el-input__inner {
        @include px2rem(width, 200px);
        @include px2rem(height, 60px);
        @include px2rem(font-size, 28px);
      }
    }
  }

  .priceTable {
    li.custom {
      background-color: $primary !important;
      color: #fff !important;
    }

    li {
      display: flex;
      justify-content: space-around;
      align-items: center;
      @include px2rem(height, 80px);
      @include px2rem(line-height, 80px);

      &:last-child {
        border-bottom: none;
      }

      &:nth-child(odd) {
        background-color: #f8f8f8;
      }

      &:nth-child(even) {
        background-color: #eee;
      }

      .qty {
        position: relative;
        flex: 1;

        .el-radio__inner {
          border: 1px solid #ccc;
        }
      }

      .price,
      .unitPrice {
        flex: 1;
      }
    }
  }

  .trait {
    border-radius: 4px;
    @include px2rem(font-size, 24px);

    .imgWrap{
      display: flex;
      justify-content: center;
      align-items: center;
      @include px2rem(width, 70px);
      @include px2rem(height,48px);
    }
  }

  .nextBtn,
  .freeBtn {
    background-color: #ff7a00;
    @include px2rem(font-size, 32px);
    @include px2rem(height, 100px);
    @include px2rem(line-height, 100px);
    border-radius: 6px;
    text-align: center;
    cursor: pointer;

    &:hover {
      background-image: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.18) 0%,
        transparent 100%
      );
    }

    a {
      color: #fff;
      font-weight: 700;
    }
  }

  .freeBtn {
    background-color: $primary;
  }
}

@media screen and (min-width: $breakpoint-xl-min) {
  .priceListWrap {
    display: flex;
    flex-direction: column;
    position: absolute;
    right: calc((100% - 1180px) / 2);
    top: 20px;
    width: 385px;
    max-height: 650px;
    font-size: 16px;
    padding: 10px;
    background-color: #fff;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
    border-radius: 4px;

    .freeOrderLink {
      position: absolute;
      bottom: -60px;
      text-align: center;
      color: #fff;

      .freeLink {
        font-weight: 700;
        color: #fff000;
      }

      a {
        text-decoration: underline;
        color: #fff;
      }
    }

    /deep/ .el-radio__label {
      font-size: 16px;
    }

    /deep/ .el-radio__inner {
      width: 14px;
      height: 14px;
      vertical-align: middle;

      &::after {
        width: 4px;
        height: 4px;
      }
    }

    .size-select /deep/ {
      .el-input__inner {
        height: 40px;
        font-size: 16px;
      }

      .el-input__suffix .el-input__icon {
        font-size: 16px;
        line-height: 30px;
      }

      .el-select-dropdown__item {
        height: 34px;
        padding: 0 10px;
        font-size: 14px;
      }
    }

    .inputSize {
      font-size: 16px;

      /deep/ {
        .el-input__inner {
          width: 92px;
          height: 30px;
          font-size: 16px;
        }
      }
    }

    .customQty {
      font-size: 16px;

      /deep/ {
        .el-input__inner {
          width: 100%;
          height: 30px;
          font-size: 14px;
        }
      }
    }

    .priceTable {
      overflow: auto;
      flex-shrink: 1;

      &::-webkit-scrollbar {
        width: 6px;
      }

      /* 滚动条滑块 */
      &::-webkit-scrollbar-thumb {
        background: #9ec7eb;
        border-radius: 3px;
      }

      li {
        height: 36px;
        line-height: 36px;
      }
    }

    .trait {
      border-radius: 4px;
      font-size: 16px;

      .imgWrap {
        width: 40px;
        height: 40px;
      }
    }

    .nextBtn,
    .freeBtn {
      font-size: 16px;
      height: 45px;
      line-height: 45px;
    }
  }
}
</style>

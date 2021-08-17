<template>
  <div class="h-100 p-2 position-relative d-flex flex-column bg-white">
    <div class="title">
      <h3 class="text-center p-2">Customize Options</h3>
    </div>
    <div class="content container-fluid">
      <div class="select-item">
        <div class="row align-items-center">
          <div class="col-4">
            <label>
              <b>
                <span class="status-point align-middle mr-2"></span>Categoty
              </b>
            </label>
          </div>
          <div class="col-8 text-right">
            <el-select
              v-model="productCateName"
              :popper-append-to-body="false"
              class="mySelect"
              @change="handleChangeCategory"
            >
              <el-option
                v-for="item in categoryList"
                :key="item.id"
                :value="item.product_cate_name"
              >
                <div class="text-break text-left">
                  {{ item.product_cate_name }}
                </div>
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="select-item">
        <div class="row align-items-center">
          <div class="col-4">
            <label>
              <b><span class="status-point align-middle mr-2"></span>Size</b>
            </label>
          </div>
          <div
            class="col-8 text-right d-flex justify-content-end align-items-center"
          >
            <div class="d-flex align-items-center justify-content-end">
              <size-input
                @click.stop
                style="width:50px"
                v-model="sizeW"
                ref="sizeWInput"
                :min="priceConfig.min_width"
                :max="priceConfig.max_width"
                :required="true"
                @validateResult="updateSize"
              ></size-input>
              <div class="mx-2">
                <b>X</b>
              </div>
              <size-input
                style="width:50px"
                v-model="sizeH"
                ref="sizeHInput"
                :min="priceConfig.min_height"
                :max="priceConfig.max_height"
                :required="true"
                @validateResult="updateSize"
              ></size-input>
            </div>
            <el-dropdown
              trigger="click"
              @command="handleChangeSize"
              class="myDropDown"
            >
              <span class="el-dropdown-link">
                <i
                  class="el-icon-arrow-down el-icon--right text-primary font-weight-bold"
                  style="margin-right: 11px;"
                ></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item, index) in priceConfig.size_restrict"
                  :key="index"
                  divided
                  :command="item"
                >
                  {{ item.width }}" X {{ item.height }}"
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>

      <div class="select-item" v-if="shapeList.length">
        <div class="row align-items-center">
          <div class="col-4">
            <label>
              <b><span class="status-point align-middle mr-2"></span>Shape</b>
            </label>
          </div>
          <div class="col-8 text-right">
            <template v-if="shapeList.length > 1">
              <el-select
                class="mySelect selected"
                :popper-append-to-body="false"
                v-model="activeShape"
                @change="changeShape"
              >
                <el-option
                  v-for="item in shapeList"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                  <div class="text-break text-left">{{ item }}</div>
                </el-option>
              </el-select>
            </template>
            <template v-else>
              {{ shapeList[0] }} (Available to change into any other shapes for
              free)
            </template>
          </div>
        </div>
      </div>
      <tree
        :list="otherSelectList"
        ref="paramTree"
        @changeSelect="changeSelect"
      ></tree>
      <div class="select-item">
        <div class="row align-items-center">
          <div class="col-4">
            <label>
              <b
                ><span class="status-point align-middle mr-2"></span
                >Transport</b
              >
            </label>
          </div>
          <div class="col-8 text-right">
            Free 2 Days Shipping by Air ( It may be delayed because of the
            COVID-19 )
          </div>
        </div>
      </div>
      <div class="select-item">
        <div class="row align-items-center">
          <div class="col-4">
            <label>
              <b
                ><span class="status-point align-middle mr-2"></span>Currency</b
              >
            </label>
          </div>
          <div class="col-8 text-right">
            <span>{{ currencyCode }}</span>
          </div>
        </div>
      </div>

      <div class="select-item border-bottom-0">
        <div class="row align-items-center">
          <div class="col-4">
            <label>
              <b
                ><span class="status-point align-middle mr-2"></span>Quantity</b
              >
            </label>
          </div>
          <div class="col-8 text-right">
            <qty-input
              style="width:80px"
              v-model="qty"
              :min="priceConfig.min_quantity"
              :max="priceConfig.max_quantity"
              @validateResult="updateQty"
            ></qty-input>
          </div>
        </div>
      </div>
    </div>

    <div class="subtotal container-fluid">
      <div class="row align-items-center h-100">
        <div class="col-5 text-center">
          <div class="d-flex flex-column align-items-center">
            <b class="h2"> {{ Symbol }}{{ priceInfo.price }} </b>
            <span class="text-secondary text-nowrap h3 font-weight-normal"
              >(Each {{ Symbol }} {{ priceInfo.unit_price }})</span
            >
          </div>
        </div>
        <div class="col-7 text-right">
          <div class="d-flex flex-fill">
            <el-button class="nextBtn" type="warning" @click="next"
              >Next
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import sizeInput from "@/components/BasisComponents/sizeInput";
import qtyInput from "@/components/BasisComponents/qtyInput";
import tree from "@/components/optionsTree/designTree";
import { validateSize, validateQty } from "@/utils/validate";

import {
  getCurrency,
  getConfigInfo,
  getProductPrice,
  getProductConfig
} from "@/api/public";

function addProperty(tree) {
  let verifyArr = tree;
  verifyArr.forEach(item => {
    item.isChecked = true;
    item.selectId = "";
    if (item.data) {
      addProperty(item.data);
    }
  });
  return verifyArr;
}

export default {
  props: ["categoryList"],
  data() {
    return {
      productCateName: "",
      initNoCompelete: true,
      activeShape: null,
      shapeList: [],
      paramsList: [],
      otherSelectList: [],
      priceConfig: {
        pic_path: require("../../static/images/loading.png")
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
      }
    };
  },
  components: {
    sizeInput,
    qtyInput,
    tree
  },
  computed: {
    cateName() {
      return this.$utils.decodeName(this.$route.params.categoryName);
    },
    Rate() {
      return this.priceInfo.currency ? this.priceInfo.currency.rate : 1;
    },
    Symbol() {
      return this.priceInfo.currency ? this.priceInfo.currency.symbol : "$";
    }
  },
  methods: {
    close() {
      this.$emit("close");
    },

    setShapeAndSize(specification) {
      let findItem = this.categoryList.find(item => {
        return item.id === specification.id;
      });
      // console.log(findItem)
      if (findItem.product_cate_name !== this.cateName) {
        this.$store.commit("ADD_CART_TEMP", "");
        sessionStorage.removeItem("beforeRouteName");
        sessionStorage.setItem(
          "tempIdInfo",
          JSON.stringify({
            id: specification.tempId,
            type: specification.type
          })
        );
        this.$router.push({
          name: "create-your-own-stickers-categoryName",
          params: {
            categoryName: this.$utils.formatSecondCategoryName(
              findItem.product_cate_name
            )
          }
        });
      } else {
        this.sizeW = specification.width;
        this.sizeH = specification.height;
        this.activeShape = specification.shape;
        this.priceCalculate();
      }
    },

    next() {
      let verifyParams = this.checkedAllParams();
      if (!verifyParams) {
        return false;
      }
      this.$emit("finishedDesign");
    },

    handleChangeCategory(product_cate_name) {
      console.log(product_cate_name);
      //修改分类,清除vuex中的参数信息,删除相关session,刷新页面重新请求数据
      if (product_cate_name !== this.cateName) {
        this.$confirm(
          "If you want to change the category, your current design and customization options will be cleared. Is that OK? ",
          "Hint",
          {
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            type: "warning"
          }
        )
          .then(() => {
            this.$store.commit("ADD_CART_TEMP", "");
            sessionStorage.removeItem("beforeRouteName");
            sessionStorage.setItem("changeCategory", 1);
            this.$router.push({
              name: "create-your-own-stickers-categoryName",
              params: {
                categoryName: this.$utils.formatSecondCategoryName(
                  product_cate_name
                )
              }
            });
          })
          .catch(() => {});
      }
    },

    handleChangeSize(command) {
      console.log(command);
      this.sizeW = command.width;
      this.sizeH = command.height;
      this.updateSize();
    },

    changeShape(val) {
      this.$emit("changeShape", val);
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
      let validateQtyResult = validateQty(
        this.qty,
        priceConfig.min_quantity,
        priceConfig.max_quantity
      );
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

    checkedAllParams() {
      let list = this.otherSelectList || [],
        checkedSizeAndQty = this.verifyParams(),
        checkedParams = true;
      //判断是否有其他选项
      if (list.length) {
        checkedParams = this.checkedParamsFn(list);
      }
      if (!checkedSizeAndQty || !checkedParams) {
        return false;
      }
      return true;
    },

    changeSelect() {
      this.optionsObj = this.$refs.paramTree.getSelectId(this.otherSelectList);
      this.priceCalculate();
    },

    priceCalculate() {
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
      let postData = {
        product_category_name: this.cateName,
        width: this.sizeW,
        height: this.sizeH,
        param_id_list: this.optionsObj.optionIdList,
        currency: this.currencyCode,
        quantity: this.qty
      };
      getProductPrice(postData)
        .then(res => {
          this.priceInfo = res.data;
          this.allowAddToCart = true;
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
      this.$emit("changeSize", data);
    },

    updateSize() {
      this.priceCalculate();
      let data = {
        sizeW: this.sizeW,
        sizeH: this.sizeH,
        qty: this.qty
      };
      this.$emit("changeSize", data);
    },

    updateQty() {
      this.priceCalculate();
      let data = {
        sizeW: this.sizeW,
        sizeH: this.sizeH,
        qty: this.qty
      };
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

    getSpecification() {
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
      let validateShape = this.shapeList.length ? this.activeShape : true;
      //验证尺寸和数量
      if (!validateSizeW.isValid || !validateSizeH.isValid || !validateShape) {
        return false;
      }
      return {
        width: this.sizeW,
        height: this.sizeH,
        shape: this.activeShape
      };
    },

    getNewParams() {
      let getCartTempData = () => {
        this.optionsObj = this.$refs.paramTree.getSelectId(
          this.otherSelectList
        );
        let priceInfo = this.priceInfo;
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
            allowAddToCart: this.allowAddToCart, //是否允许添加到购物车
            activeShape: this.activeShape
          },
          priceInfo,
          {
            unit_price: this.$utils.keepTwoDecimal(
              priceInfo.unit_price / this.Rate
            ),
            price: this.$utils.keepTwoDecimal(priceInfo.price / this.Rate)
          }
        );
        return data;
      };
      return getCartTempData();
    }
  },
  created() {},
  mounted() {
    this.productCateName = this.cateName;
    setTimeout(() => {
      if (
        (sessionStorage.getItem("beforeRouteName") === "options-categoryName" ||
          sessionStorage.getItem("beforeRouteName") === "options-params" ||
          this.$route.query.shareName) &&
        this.$store.state.cartTemp
      ) {
        let cartTemp = this.$store.state.cartTemp;
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
              productConfig = result[1];
            this.otherSelectList = addProperty(configInfo.data);
            this.otherSelectListData(
              this.otherSelectList,
              cartTemp.param_id_list.split(",")
            );
            this.priceConfig = productConfig.data;
            this.shapeList = JSON.parse(productConfig.data.shape);
            this.activeShape = cartTemp.activeShape;
            this.initSize({
              sizeW: cartTemp.width,
              sizeH: cartTemp.height,
              qty: cartTemp.quantity
            });
            this.priceCalculate();
            this.$emit("changeShape", this.activeShape);
            if (
              (sessionStorage.getItem("beforeRouteName") === "options-params" ||
                this.$route.query.shareName) &&
              this.$store.state.cartTemp
            ) {
              this.$emit(
                "loadTemplate",
                JSON.parse(this.$store.state.cartTemp.templateJson)
              );
            }
          });
        });
      } else {
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
              productConfig = result[1];
            this.otherSelectList = addProperty(configInfo.data);
            this.priceConfig = productConfig.data;
            this.shapeList = JSON.parse(productConfig.data.shape);
            this.activeShape = this.shapeList.length ? this.shapeList[0] : "";
            let qty =
              Number(this.priceConfig.min_quantity) <= 100
                ? 100
                : Number(this.priceConfig.min_quantity);
            let data = {
              sizeW: Number(this.priceConfig.size_restrict[0].width),
              sizeH: Number(this.priceConfig.size_restrict[0].height),
              qty: qty
            };
            this.initSize(data);
            this.priceCalculate();
            this.$emit("changeShape", this.activeShape);
            if (sessionStorage.getItem("tempIdInfo")) {
              this.$emit(
                "selectTemplate",
                JSON.parse(sessionStorage.getItem("tempIdInfo"))
              );
              sessionStorage.removeItem("tempIdInfo");
            }
          });
        });
      }
    }, 100);
  }
};
</script>

<style lang="scss" scoped>
.mb-paramsSelect {
  h3,
  .h3 {
    font-size: 24px;
  }
  .h2 {
    font-size: 36px;
  }
  .content {
    font-size: 16px;
    /deep/ .mySelect {
      .el-input {
        font-size: 16px;
      }
    }
  }
  text-align: left;
  /deep/ .status-point {
    display: none;
  }
}

.content {
  overflow: hidden auto;
  position: absolute;
  bottom: 100px;
  left: 0;
  top: 50px;
  width: 100%;
  font-size: 16px;
}

.nextBtn {
  width: 210px;
  height: 44px;
  font-size: 24px;
  background-color: #fb8b31;
  padding: 0 !important;
}

.subtotal {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  padding: 0 20px;
  box-shadow: 0 5px 10px -5px rgba(0, 0, 0, 0.25) inset;
}

.select-item {
  padding: 10px 0;
  border-bottom: 1px solid #ccc;

  errorMsg {
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    left: 15px;
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

.el-dropdown-link {
  width: 100%;
  display: block;
}

.content /deep/ .mySelect {
  .el-input {
    font-size: 16px;
  }
  .el-select-dropdown__item {
    display: flex;
    align-items: center;
    height: auto;
    line-height: 1.2em;
    white-space: normal;
    min-height: 34px;
    padding: 5px 10px;
    border-bottom: 1px solid #ccc;
    &:last-child {
      border-bottom: none;
    }
  }
  .el-input__inner {
    text-align: right;
    border: none;
    height: 30px;
    line-height: 30px;
    color: #333;
  }
  .el-input__icon {
    line-height: 30px;
    color: $primary;
    font-weight: 700;
  }
  .el-select-dropdown {
    border-color: $primary;
  }
  .popper__arrow {
    border-bottom-color: $primary;
    left: auto !important;
    right: 35px !important;
  }
}
.content /deep/ {
  .customInput .el-input__inner {
    border: 1px solid $primary;
  }
}
</style>

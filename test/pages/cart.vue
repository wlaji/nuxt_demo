<template>
  <div class="cartWrap bg-default">
    <div class="container py-3">
      <div class="steps row align-items-center border-bottom pb-3">
        <h3 class="col-12 col-xl-3 text-secondary mb-0">
          <i class="el-icon-shopping-cart-1 h2 mb-0 align-middle"></i> Shopping
          Cart
        </h3>
        <div class="col-xl-9 d-none d-xl-block">
          <el-steps :active="activeInd" simple class="bg-white">
            <el-step title="1.Shopping Cart"></el-step>
            <el-step title="2.Checkout"></el-step>
            <el-step title="3.Complete"></el-step>
          </el-steps>
        </div>
      </div>
      <div
        class="d-flex-center mt-3"
        v-if="$fetchState.pending"
        style="width: 100%; height: 300px"
      >
        <span class="spinner-border"></span>
      </div>
      <div class="mt-3" v-else-if="$fetchState.error">An error occurred :(</div>
      <div
        v-else
        class="cartContent mt-3"
        v-loading="updatePrice"
        element-loading-background="rgba(255, 255, 255, 0.2)"
      >
        <div class="cart-list" v-if="cartList.length !== 0">
          <div>
            <el-table
              :data="cartList"
              ref="multipleTable"
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="35">
              </el-table-column>
              <el-table-column>
                <template slot="header" slot-scope="scope">
                  <div class="container">
                    <div class="row">
                      <div class="col-12">
                        <div class="d-flex justify-content-end" style="padding:0 15px"><el-button type="danger" size="mini" style="width:96px;" @click="clearCart">Delete All</el-button></div>
                      </div>
                    </div>
                  </div>
                </template>
                <template slot-scope="scope">
                  <div
                    class="cart-item container-fluid bg-white border my-2 py-2"
                  >
                    <div class="h5">
                      {{ scope.row.product_cate_name }}
                    </div>
                    <div class="row">
                      <div class="col-12 col-xl-4 d-flex-center">
                        <div class="designImg">
                          <div class="imgWrap">
                            <img
                              v-lazy="scope.row.pic_path"
                              class="img-fluid"
                              preview="0"
                              alt="product"
                              title="product"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="col-12 col-xl-8 mt-2 mt-xl-0">
                        <div class="container-fluid">
                          <div class="row">
                            <div class="params-item col-12 col-xl">
                              <div class="row">
                                <p class="col-6 col-xl-12"><b>Size</b></p>
                                <p
                                  class="col-6 col-xl-12 text-right text-xl-left"
                                >
                                  {{
                                    scope.row.width +
                                      "” x " +
                                      scope.row.height +
                                      "”"
                                  }}
                                </p>
                              </div>
                            </div>
                            <div class="params-item col-12 col-xl">
                              <div class="row">
                                <p class="col-6 col-xl-12"><b>Unit Price</b></p>
                                <p
                                  class="col-6 col-xl-12 text-right text-xl-left"
                                >
                                  ${{ scope.row.unit_price }}
                                </p>
                              </div>
                            </div>
                            <div class="params-item col-12 col-xl">
                              <div class="row align-items-center">
                                <p class="col-6 col-xl-12 h-100">
                                  <b>Quantity</b>
                                </p>
                                <p
                                  class="col-6 col-xl-12 text-right text-xl-left"
                                >
                                  <qtyInput
                                    :ref="'myQty' + scope.row.id"
                                    v-model="scope.row.quantity"
                                    :min="scope.row.strict.min_quantity"
                                    :max="scope.row.strict.max_quantity"
                                    :disabled="updatePrice"
                                    @validateResult="
                                      changeQty($event, scope.row)
                                    "
                                  ></qtyInput>
                                </p>
                              </div>
                            </div>
                            <div class="params-item col-12 col-xl">
                              <div class="row">
                                <p class="col-6 col-xl-12"><b>Total</b></p>
                                <p
                                  class="col-6 col-xl-12 text-right text-xl-left"
                                >
                                  <span class="text-danger"
                                    >${{ scope.row.price }}</span
                                  >
                                </p>
                              </div>
                            </div>
                          </div>
                          <div class="d-none d-xl-block">
                            <div class="row mt-2">
                              <div class="col-12 col-xl-8">
                                <div class="row">
                                  <label class="col-12 col-xl-3"
                                    ><b>Options:</b></label
                                  >
                                  <div
                                    class="col-12 col-xl-9 text-right text-xl-left"
                                  >
                                    <template v-if="scope.row.select_params">
                                      <div
                                        style="word-break: break-word"
                                        v-for="(value,
                                        key,
                                        index) in JSON.parse(
                                          scope.row.select_params
                                        )"
                                        :key="index"
                                      >
                                        {{ key }} : {{ value }}
                                      </div>
                                    </template>
                                    <template v-else>------</template>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="row mt-2">
                              <div class="col-xl-8 col-12">
                                <div class="row">
                                  <label class="col-12 col-xl-3"
                                    ><b>Artwork:</b></label
                                  >
                                  <div
                                    class="col-12 col-xl-9 text-right text-xl-left"
                                  >
                                    <fileUpload
                                      class="mb-2"
                                      :limit="5"
                                      :multiple="true"
                                      accept=".jpg,.jpeg,.gif,.png,.pdf,.ai,.bmp,.tif,.eps,"
                                      :originFileList="
                                        scope.row.accessory
                                          ? JSON.parse(scope.row.accessory)
                                          : []
                                      "
                                      @getFileList="
                                        getFileList($event, scope.row)
                                      "
                                    >
                                      <template v-slot:btn>
                                        <el-button size="small" type="primary"
                                          >Upload File
                                        </el-button>
                                      </template>
                                      <template v-slot:tip>
                                        <div
                                          class="el-upload__tip"
                                          style="word-break: break-word"
                                        >
                                          ( Vector diagram is preferred to
                                          upload ) Allow the following file
                                          formats:
                                          <span class="text-danger"
                                            >JPG, JPEG, GIF, PNG ,PDF, AI, BMP,
                                            TIF, EPS.</span
                                          >
                                        </div>
                                      </template>
                                    </fileUpload>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="row mt-2">
                              <div class="col-12 col-xl-8">
                                <div class="row">
                                  <label class="col-12 col-xl-3"
                                    ><b>Comments:</b></label
                                  >
                                  <div class="col">
                                    <el-input
                                      type="textarea"
                                      disabled
                                      :autosize="{ minRows: 2, maxRows: 4 }"
                                      v-model="scope.row.remark"
                                    ></el-input>
                                  </div>
                                </div>
                              </div>
                              <div
                                class="col-12 col-xl-4 d-flex justify-content-end align-items-center mt-2 mt-xl-0"
                              >
                                <el-popconfirm
                                  title="Are you sure to delete this design?"
                                  confirm-button-text="Confirm"
                                  cancel-button-text="Cancel"
                                  @confirm="delCart([scope.row.id])"
                                >
                                  <el-button
                                    type="danger"
                                    slot="reference"
                                    size="mini"
                                  >
                                    Remove Item
                                  </el-button>
                                </el-popconfirm>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="d-block d-xl-none">
                      <div class="container-fluid">
                        <div class="row">
                          <div class="col-12 col-xl-8">
                            <div class="row">
                              <label class="col-12"><b>Options:</b></label>
                              <div class="col-12 text-left">
                                <template v-if="scope.row.select_params">
                                  <div
                                    class="my-1"
                                    style="word-break: break-word"
                                    v-for="(value, key, index) in JSON.parse(
                                      scope.row.select_params
                                    )"
                                    :key="index"
                                  >
                                    {{ key }} : {{ value }}
                                  </div>
                                </template>
                                <template v-else>------</template>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-12 col-xl-8">
                            <div class="row">
                              <label class="col-12 col-xl-3"
                                ><b>Comments:</b></label
                              >
                              <div class="col">
                                <el-input
                                  type="textarea"
                                  disabled
                                  :autosize="{ minRows: 2, maxRows: 4 }"
                                  v-model="scope.row.remark"
                                ></el-input>
                              </div>
                            </div>
                          </div>
                          <div
                            class="col-12 col-xl-4 d-flex justify-content-end align-items-center mt-2 mt-xl-0"
                          >
                            <el-popconfirm
                              title="Are you sure to delete this design?"
                              confirm-button-text="Confirm"
                              cancel-button-text="Cancel"
                              @confirm="delCart([scope.row.id])"
                            >
                              <el-button
                                type="danger"
                                slot="reference"
                                size="mini"
                              >
                                Remove Item
                              </el-button>
                            </el-popconfirm>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="noCart" v-else>
          <h3>Your shopping cart is empty!</h3>
          <p>
            Once you add something to your cart, you will be able to check out
          </p>
          <el-button @click="goHome" class="font14 mt-3"
            >Continue Shopping
          </el-button>
        </div>

        <div class="submit-wrap text-right mt-3 p-4">
          <div class="row">
            <div class="col-12">
              <div class="row justify-content-end">
                <div class="submit-cart col-12 col-xl-4">
                  <div class="row no-gutters mb-2 py-2 border-bottom">
                    <div class="col-6 text-left text-xl-right">
                      <div>Subtotal({{ selectedCartList.length }} items)</div>
                    </div>
                    <div class="col-2">
                      <div class="text-danger font-weight-bold">$</div>
                    </div>
                    <div class="col-4">
                      <div class="text-danger font-weight-bold">
                        {{ priceTotal }}
                      </div>
                    </div>
                  </div>
                  <div class="row no-gutters mb-2 py-2 border-bottom">
                    <div class="col-6 text-left text-xl-right">
                      <div>(+)Shipping charges</div>
                    </div>
                    <div class="col-2">
                      <div class="text-danger font-weight-bold">$</div>
                    </div>
                    <div class="col-4">
                      <div class="text-danger font-weight-bold">0.00</div>
                    </div>
                  </div>
                  <div class="row no-gutters mb-2 py-2 border-bottom">
                    <div class="col-6 text-left text-xl-right">
                      <div class="font-weight-bold">GRAND TOTAL</div>
                    </div>
                    <div class="col-2">
                      <div class="text-danger font-weight-bold">$</div>
                    </div>
                    <div class="col-4">
                      <div class="text-danger font-weight-bold">
                        {{ priceTotal }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 mt-2">
              <div class="row justify-content-end">
                <div class="col-12 col-xl-3">
                  <el-button type="warning" class="w-100" @click="goHome">
                    Continue Shopping
                    <i class="el-icon-shopping-cart-full align-middle"></i>
                  </el-button>
                </div>
                <div class="col-12 col-xl-3">
                  <el-button
                    class="ml-0 mt-2 mt-xl-0 w-100"
                    type="success"
                    @click="goCheckout"
                    :disabled="cartList.length === 0"
                  >
                    Proceed to CheckOut
                    <i class="el-icon-right align-middle"></i>
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import qtyInput from "@/components/BasisComponents/qtyInput";
import {
  getUserCart,
  updateCartCount,
  delCart,
  addCartAccessory
} from "@/api/cart";
import { getProductPrice } from "@/api/public";
import fileUpload from "@/components/fileUpload";
import { validateQty } from "@/utils/validate";

export default {
  data() {
    return {
      activeInd: 0,
      onlineCartList: [],
      localCartList: [],
      updatePrice: false,
      selectedCartList: [],
      activeTab: 1,
      disabledCheckout: false,
      debounceUpdateQty: null
    };
  },
  computed: {
    priceTotal() {
      let total = 0;
      this.selectedCartList.forEach(item => {
        total += parseFloat(item.price);
      });
      return total.toFixed(2);
    },
    cartList: {
      get() {
        if (this.$store.state.authInfo) {
          return this.onlineCartList;
        } else {
          return this.localCartList;
        }
      },
      set(val) {}
    }
  },
  components: {
    qtyInput,
    fileUpload
  },
  filters: {
    filterOptions(val) {
      if (val) {
        let temp = [];
        let getChild = function(val) {
          if (val.data && val.data.length) {
            getChild(val.data[0]);
          } else {
            temp.push(val.param_name);
          }
        };
        if (val && val.length > 0) {
          val.forEach(item => {
            getChild(item.data[0]);
          });
        } else {
          temp = "------";
        }
        return temp.join(",");
      }
    }
  },
  methods: {
    clearCart(){
      if(!this.selectedCartList.length){
        return false
      }
      this.$confirm('Are you sure to delete designs that you choose?', 'Hint', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.delCart(this.selectedCartList.map((item)=>item.id))
      }).catch(() => {
      });
    },
    getFileList(fileList, row) {
      let resultList = [];
      fileList.forEach(file => {
        const returnFile = {
          name: file.name,
          url: file.url
        };
        resultList.push(returnFile);
      });
      if (!this.$store.state.authInfo) {
        let cartList = this.localCartList;
        let findItem = cartList.find(item => {
          return item.id === row.id;
        });
        findItem.accessory = JSON.stringify(resultList);
        this.$store.commit("UPDATE_CART", {
          id: row.id,
          data: {
            accessory: JSON.stringify(resultList)
          }
        });
      } else {
        addCartAccessory({
          accessory: JSON.stringify(resultList),
          cart_id: row.id
        }).then(res => {
          let cartList = this.onlineCartList;
          let findItem = cartList.find(item => {
            return item.id === row.id;
          });
          findItem.accessory = JSON.stringify(resultList);
        });
      }
    },

    logined() {
      this.$router.go(0);
    },

    handleSelectionChange(val) {
      this.selectedCartList = val;
    },

    changeQty(result, row) {
      this.debounceUpdateQty(result, row);
    },

    updateQty(result, row) {
      if (!this.$store.state.authInfo) {
        let postData = {
          product_category_name: row.product_cate_name,
          width: row.width,
          height: row.height,
          param_id_list: row.param_id_list,
          quantity: result.number
        };
        getProductPrice(postData)
          .then(res => {
            let cartList = this.localCartList;
            let findItem = cartList.find(item => {
              return item.id === row.id;
            });
            findItem.unit_price = res.data.unit_price;
            findItem.price = res.data.price;
            this.$store.commit("UPDATE_CART", {
              id: row.id,
              data: res.data
            });
          })
          .finally(() => {
            this.updatePrice = false;
          });
      } else {
        let postData = {
          id: row.id,
          quantity: result.number
        };
        updateCartCount(postData)
          .then(res => {
            let cartList = this.onlineCartList;
            let findItem = cartList.find(item => {
              return item.id === row.id;
            });
            findItem.unit_price = res.data.unit_price;
            findItem.price = res.data.price;
          })
          .finally(() => {
            this.updatePrice = false;
          });
      }
    },

    delCart(delIdList) {
      console.log(delIdList)
      let fn = (cartList,delId)=>{
        for( let i=cartList.length-1; i>=0; i--){
          if(delId.includes(cartList[i].id)){
            cartList.splice(i, 1);
          }
        }
      }
      if (!this.$store.state.authInfo) {
        let cartList = this.localCartList;
        fn(cartList,delIdList)
        this.$store.commit("REMOVE_CARTLIST", delIdList);
      } else {
        delCart({
          idList: delIdList
        }).then(res => {
          let cartList = this.onlineCartList;
          fn(cartList,delIdList)
          this.$store.dispatch("getUserInfo");
        });
      }
    },

    goHome() {
      this.$router.push({
        path: "/"
      });
    },

    goCheckout() {
      console.log();
      let cartList = this.selectedCartList;
      let checkQty = cartList.every(item => {
        let result = validateQty(
          item.quantity,
          item.strict.min_quantity,
          item.strict.max_quantity
        );
        return result.isValid;
      });
      if (!checkQty) {
        this.$message.error("Quantity check failed");
        return false;
      }
      if (this.selectedCartList.length > 0) {
        this.$store.commit("set_checkoutCart", this.selectedCartList);
        this.$router.push({
          path: "/checkout"
        });
      } else {
        this.$message.error("Please select the product to be billed");
      }
    },

    isJSON(jsonContent) {
      if (typeof jsonContent == "string") {
        try {
          let obj = JSON.parse(jsonContent);
          if (jsonContent.indexOf("{") > -1) {
            return {
              msg: 0,
              error_code: "JSON格式正确"
            };
          } else {
            return {
              msg: 1,
              error_code: "JSON格式错误"
            };
          }
        } catch (e) {
          console.log(e);
          return {
            msg: 1,
            error_code: "JSON格式错误"
          };
        }
      }
      return {
        msg: 1,
        error_code: "JSON格式错误"
      };
    }
  },
  async fetch() {
    if (this.$store.state.authInfo) {
      await this.$store.dispatch("getUserInfo");
      this.onlineCartList = await getUserCart().then(async res => {
        let errCart = [],
          successCart = [];
        //校验购物车数据合法性
        res.data.forEach((item, index) => {
          let result = this.isJSON(item.select_params);
          if (result.msg === 1) {
            errCart.push(item.id);
          } else {
            successCart.push(item);
          }
        });
        if (errCart.length) {
          try {
            await delCart({ idList: errCart });
            await this.$store.dispatch("getUserInfo");
            return successCart;
          } catch {
            return successCart;
          }
        } else {
          return successCart;
        }
      });
    }
  },
  mounted() {
    this.debounceUpdateQty = this.$utils.debounce(this.updateQty, 500);
    this.$Bus.$on("logined", e => {
      this.logined();
    });
    setTimeout(() => {
      let localCartList = this.$utils.deepCopy(this.$store.state.cart);
      let errCart = [],
        successCart = [];
      //校验购物车数据合法性
      localCartList.forEach((item, index) => {
        let result = this.isJSON(item.select_params);
        if (result.msg === 1) {
          errCart.push(item.id);
        } else {
          successCart.push(item);
        }
      });
      if (errCart.length) {
        this.$store.commit("SET_CART", []);
        this.localCartList = [];
      } else {
        this.localCartList = localCartList;
      }
    });
    let time = setInterval(() => {
      if (this.cartList.length) {
        clearInterval(time);
        this.$refs.multipleTable.toggleAllSelection();
      }
    }, 300);
  },
  beforeDestroy() {
    this.$Bus.$off("logined");
  }
};
</script>

<style lang="scss" scoped>
.cartWrap {
  font-size: 16px;
  .cart-list {
    p {
      font-size: 14px;
      margin-bottom: 10px;
    }

    div {
      font-size: 14px;
    }

    .designImg {
      display: flex;
      justify-content: center;
      align-items: center;
      @include px2rem(height, 363px);
      max-height: 363px;
      @include px2rem(width, 548px);
      border-radius: 4px;
      @media screen and (min-width: $breakpoint-xl-min) {
        width: 100%;
        height: 250px;
      }
    }

    .imgWrap {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      cursor: zoom-in;
    }

    /deep/ .el-checkbox__inner {
      border-color: #888;
    }

    @media screen and (min-width: $breakpoint-xl-min) {
      p {
        font-size: 14px;
        margin-bottom: 10px;
      }
      div {
        font-size: 14px;
      }
    }
  }

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand /deep/ label {
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }

  .submit-wrap {
    background-color: #fff;

  }

  .noCart {
    margin: 10px 0;
    padding: 20px;
    background-color: #1296db;
    color: #fff;
  }
}
</style>

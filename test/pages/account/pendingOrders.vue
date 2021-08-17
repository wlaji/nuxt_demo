<template>
  <div class="pendingOrders">
    <div class="container">
      <div class="row">
        <div
          class="col-xl-auto col-12 left border-right"
          v-if="$store.state.device.type === 'pc'"
        >
          <ul class="py-1 pointer">
            <li
              class="rounded my-2 border position-relative"
              v-for="item in peddingOrderList"
              :key="item.id"
              :style="item.selected ? 'border-color:#409eff !important' : ''"
            >
              <label class="w-100 h-100 container-fluid py-1 pointer">
                <div class="row">
                  <div class="col-6">
                    <radio v-model="selected" :label="item"></radio>
                  </div>
                  <div
                    class="
                      col-6
                      text-right
                      d-flex
                      align-items-center
                      justify-content-end
                    "
                  ></div>
                </div>
                <div
                  class="row py-2 c-border-bottom"
                  v-for="(item2, index) in item.order_product"
                  :key="item2.id"
                >
                  <div class="col-5" style="--pc: 16px">
                    <div class="my-2">
                      <span class="font-weight-bold"
                        >item {{ index + 1 }} :</span
                      >
                      {{ item2.product_cate_name }}
                    </div>
                    <div class="my-2">
                      <span class="font-weight-bold">Size :</span>
                      {{ item2.width }}" X {{ item2.height }}"
                    </div>
                    <div class="my-2">
                      <span class="font-weight-bold">Quantity :</span>
                      {{ item2.quantity }}
                    </div>
                  </div>
                  <div class="col-5" style="--pc: 16px">
                    <div class="my-2 font-weight-bold">
                      <span>Status :</span>
                      <span
                        :style="
                          item.status == '1'
                            ? 'color:#3AC124'
                            : 'color:#FF0000;'
                        "
                        >{{ item.status | filterStatus }}</span
                      >
                    </div>
                    <div
                      class="my-2"
                      v-for="(item3, key, index) in getOrderParams(
                        JSON.parse(item2.param_description)
                      )"
                      :key="index"
                    >
                      <span class="font-weight-bold">{{ key }} :</span>
                      {{ item3 }}
                    </div>
                  </div>
                  <div class="col text-right">
                    <div class="mt-2">
                      <img class="img-fluid" :src="item2.pic_path" alt="" />
                    </div>
                  </div>
                  <div class="col-12 text-right">
                    (Total)
                    <span
                      style="--pc: 24px"
                      class="text-danger font-weight-bold"
                      >$ {{ item2.price }}</span
                    >
                  </div>
                </div>
              </label>
              <span
                style="position: absolute; top: 10px; right: 20px; z-index: 10"
                ><i @click.stop="delDialogFun(item)" class="el-icon-delete"></i
              ></span>
            </li>
          </ul>
          <div
            class="my-4 d-flex flex-column align-items-center px-xl-5 px-3"
            v-if="!peddingOrderList.length > 0"
          >
            <div class="no-address-info text-center">
              <p style="--pc: 16px; --mb: 32rem">
                You have no current orders. Need some products to start your
                next project?
              </p>
            </div>
            <div class="mt-3 w-100 text-center">
              <el-button
                type="primary"
                class="new-address w-100"
                @click="goHome"
                style="--pc: 20px; --mb: 32rem"
                >Choose Products</el-button
              >
            </div>
          </div>
        </div>
        <div class="col-12 left border-right" v-else>
          <ul class="py-1 pointer" style="--mb: 28rem">
            <li
              class="rounded my-2 border"
              v-for="item in peddingOrderList"
              :key="item.id"
              :style="item.selected ? 'border-color:#409eff !important' : ''"
            >
              <label class="w-100 h-100 py-1">
                <div class="d-flex justify-content-between pl-1 pr-2">
                  <div class="d-flex justify-content-between">
                    <radio
                      v-model="selected"
                      :label="item"
                      style="--mb: 32rem"
                      class="font-weight-bold"
                    ></radio>
                  </div>
                  <div class="text-right d-flex align-self-center">
                    <span
                      ><i
                        @click.stop="delDialogFun(item)"
                        class="el-icon-delete"
                      ></i
                    ></span>
                  </div>
                </div>
                <div>
                  <div v-for="item2 in item.order_product" :key="item2.id">
                    <div class="px-2">
                      <div class="row py-2">
                        <div class="col-auto">
                          <div
                            class="d-flex-center"
                            style="--pwmb: 133rem; --phmb: 133rem"
                          >
                            <img
                              class="img-fluid"
                              :src="item2.pic_path"
                              alt=""
                            />
                          </div>
                        </div>
                        <div
                          class="col d-flex flex-column justify-content-between"
                          style="--pc: 16px"
                        >
                          <div class="row">
                            <div class="col-6">
                              <span>Size</span>
                            </div>
                            <div class="col-6 text-right">
                              <span
                                >{{ item2.width }}" X {{ item2.height }}"</span
                              >
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-6">
                              <span>Quantity</span>
                            </div>
                            <div class="col-6 text-right">
                              <span> {{ item2.quantity }}</span>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-6">
                              <span>Total</span>
                            </div>
                            <div class="col-6 text-right">
                              <span class="text-danger font-weight-bold"
                                >$ {{ item2.price }}</span
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                      <el-divider content-position="left"></el-divider>
                      <div class="c-border-bottom">
                        <div class="row my-2">
                          <div class="col-6">
                            <span>Status :</span>
                          </div>
                          <div class="col-6 text-right">
                            <span
                              :style="
                                item.status == '1'
                                  ? 'color:#3AC124'
                                  : 'color:#FF0000;'
                              "
                              >{{ item.status | filterStatus }}</span
                            >
                          </div>
                        </div>
                        <div
                          class="row my-2"
                          v-for="(item3, key, index) in getOrderParams(
                            JSON.parse(item2.param_description)
                          )"
                          :key="index"
                        >
                          <div class="col-6">
                            <span>{{ key }} :</span>
                          </div>
                          <div class="col-6 text-right">
                            <span>{{ item3 }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <el-divider content-position="left"></el-divider>
                  </div>
                </div>
              </label>
            </li>
          </ul>
          <div class="my-4 d-flex flex-column align-items-center px-xl-5 px-3">
            <div class="no-address-info text-center">
              <p class="font-weight-bold" style="--pc: 16px; --mb: 32rem">
                You have no current orders. Need some products to start your
                next project?
              </p>
            </div>
            <div class="mt-3 w-100 text-center">
              <el-button
                type="primary"
                class="new-address w-100"
                @click="goHome"
                style="--pc: 20px; --mb: 32rem"
                >Choose Products</el-button
              >
            </div>
          </div>
        </div>
        <div class="d-xl-none mb-header w-100">
          <div
            class="
              top
              border-top border-bottom border-right border-left
              py-2
              h-100
              d-flex
              justify-content-center
              align-items-center
            "
          >
            <p style="--pc: 16px; --mb: 32rem" class="font-weight-bold">
              Order information
            </p>
          </div>
        </div>
        <div class="col-12 col-xl right border-bottom">
          <div class="py-2">
            <el-form
              class="orderInfo"
              :model="orderInfo"
              ref="orderInfo"
              label-width="200px"
              label-position="left"
              :rules="orderInfoRules"
            >
              <el-form-item
                label="Order Number:"
                class="text-right"
                v-if="selected"
              >
                <span class="font-weight-bold">{{ selected.oid }}</span>
              </el-form-item>
              <el-form-item
                class="text-right"
                label="Order Date:"
                v-if="selected"
              >
                <span class="font-weight-bold">{{ selected.create_time }}</span>
              </el-form-item>
              <el-form-item label="Shipped To:" class="text-right">
                <span class="font-weight-bold">{{
                  selected.shipping_address
                }}</span>
              </el-form-item>
              <el-form-item label="Currency:" class="text-right">
                <span class="font-weight-bold">{{ selected.currency }}</span>
              </el-form-item>
              <el-form-item label="Billed To:" class="text-right">
                <span class="font-weight-bold">{{
                  selected.bill_address
                }}</span>
              </el-form-item>
              <el-form-item
                label="Payment Method:"
                prop="payStyle"
                class="text-right"
              >
                <el-select
                  v-model="orderInfo.payStyle"
                  placeholder=""
                  @change="changePayFun()"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <div v-if="orderInfo.payStyle == 'Authorize'">
                <el-form-item
                  label="Card Number:"
                  prop="cardNumber"
                  label-width="1"
                >
                  <el-input v-model="orderInfo.cardNumber"></el-input>
                </el-form-item>
                <el-form-item label="CVV:" prop="cardCode" label-width="1">
                  <el-input v-model="orderInfo.cardCode"></el-input>
                </el-form-item>
                <div class="row">
                  <div class="col-6">
                    <el-form-item
                      label="Expiration date:"
                      prop="MM"
                      label-width="1"
                    >
                      <el-input
                        v-model="orderInfo.MM"
                        placeholder="MM"
                      ></el-input>
                    </el-form-item>
                  </div>
                  <div class="col-6">
                    <el-form-item prop="YY" label=" " label-width="1">
                      <el-input
                        v-model="orderInfo.YY"
                        placeholder="YY"
                      ></el-input>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <el-form-item
                v-if="selected"
                :label="`Subtotal( ${
                  selected.order_product
                    ? selected.order_product.length + ' Items'
                    : '0 Item'
                }) :`"
                class="text-right"
              >
                <span class="font-weight-bold">$ {{ noDiscount }}</span>
              </el-form-item>
              <el-form-item
                v-if="selected"
                label="(+)Shipping Charges :"
                class="text-right"
              >
                <span class="font-weight-bold"
                  >$ {{ selected.shipping_price }}</span
                >
              </el-form-item>
              <el-form-item
                v-if="selected"
                label="(+) Tax :"
                class="text-right"
              >
                <span class="font-weight-bold"
                  >$ {{ selected.duty_price }}</span
                >
              </el-form-item>
              <el-form-item
                v-if="selected"
                label="Discount($30 OFF $200) :"
                class="text-right"
              >
                <span class="font-weight-bold"></span>
              </el-form-item>
              <el-form-item
                v-if="selected"
                label="Discount(50% OFF) :"
                class="text-right"
              >
                <span class="font-weight-bold"></span>
              </el-form-item>
              <el-form-item
                v-if="selected"
                label="Grand Total :"
                class="text-right"
              >
                <span class="font-weight-bold text-danger" style="--pc: 20px"
                  >$ {{ selected.order_price }}</span
                >
              </el-form-item>
            </el-form>
            <div class="col-12 my-2">
              <el-button
                v-if="$store.state.device.type === 'pc'"
                :type="selected ? 'primary' : 'info'"
                :disabled="!selected || paymentDisabled"
                style="--pc: 20px"
                class="w-100"
                @click="payFun"
                >Complete Your Payment</el-button
              >
              <el-button
                v-else
                type="info"
                style="--pc: 20px; --mb: 32rem; --phmb: 83rem"
                class="w-100"
                @click="payFun"
                :disabled="paymentDisabled"
                >Complete Your Payment</el-button
              >
            </div>
            <div
              class="col-12 font-weight-bold px-3 px-xl-5"
              style="--pc: 16px; --mb: 32rem"
            >
              <span class="text-danger">Tips:</span>
              <span>Please check the product you need to buy on the left.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <cus-dialog :visible.sync="dialogFormVisible">
      <template v-slot:header>
        <div class="font36-24 font-weight-bold text-center">
          Cancellation Of Order
        </div>
      </template>
      <template v-slot:body>
        <el-form :model="form1" :rules="form1Rules" ref="form1">
          <el-form-item prop="cancelReason">
            <el-input
              type="textarea"
              :rows="6"
              v-model="form1.cancelReason"
              placeholder="Please enter the reason for cancellation"
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template v-slot:footer>
        <div class="d-flex justify-content-center">
          <el-button @click="dialogFormVisible = false">Cancel</el-button>
          <el-button
            type="primary"
            :loading="cancelLoading"
            @click="deleteOrder('form1')"
            >Confirm
          </el-button>
        </div>
      </template>
    </cus-dialog>
  </div>
</template>

<script>
import { checkCardNumber, checkCvv, checkYY, checkMM } from "@/utils/validate";
import { pay } from "@/api/checkout";
import checkbox from "@/components/checkbox.vue";
import radio from "@/components/radio.vue";
import { getOrderList, userCancelOrder, setOrderPaymentt } from "@/api/account";

export default {
  middleware: "permission",
  data() {
    return {
      options: [
        {
          value: "PayPal",
          label: "PayPal",
        },
        {
          value: "Authorize",
          label: "Credit Card/Debit Card",
        },
      ],
      pageInfo: {
        page: 1,
        size: 16,
        total: 0,
      },
      peddingOrderList: [],
      selected: "",
      orderInfoRules: {
        payStyle: [
          {
            required: true,
            validator: checkCardNumber,
            trigger: "blur",
          },
        ],
        cardNumber: [
          {
            required: true,
            validator: checkCardNumber,
            trigger: "blur",
          },
        ],
        cardCode: [
          {
            required: true,
            validator: checkCvv,
            trigger: "blur",
          },
        ],
        MM: [
          {
            required: true,
            validator: checkMM,
            trigger: "blur",
          },
        ],
        YY: [
          {
            required: true,
            validator: checkYY,
            trigger: "blur",
          },
        ],
      },
      form1Rules: {
        cancelReason: [
          {
            required: true,
            trigger: "blur",
            message: "resaon is required",
          },
        ],
      },
      orderInfo: {
        payStyle: "",
        cardNumber: "",
        cardCode: "",
        MM: "",
        YY: "",
      },
      dialogFormVisible: false,
      form1: {
        cancelReason: "",
        id: "",
      },
      cancelLoading: false,
      paymentDisabled: false,
    };
  },
  watch: {
    selected: {
      handler() {
        this.orderInfo.payStyle = this.selected.payment;
      },
      deep: true,
    },
  },
  components: {
    checkbox,
    radio,
  },
  mounted() {},

  computed: {
    noDiscount: function () {
      let temp = 0;
      if (
        this.selected.order_product &&
        this.selected.order_product.length > 0
      ) {
        this.selected.order_product.forEach((item) => {
          temp = temp + Number(item.price);
        });
        return temp;
      } else {
        return 0;
      }
    },
  },
  filters: {
    filterStatus: function (value) {
      if (!value) return "";
      switch (value) {
        case 1:
          return "Awaiting Payment";
        case 2:
          return "Recieved payment and Awaiting Shipping";
        case 3:
          return "Shipment Shipped";
        case 4:
          return "Received";
        case 5:
          return "Cancelled";
      }
    },
  },
  methods: {
    deleteOrder() {
      this.$refs["form1"].validate((valid) => {
        if (valid) {
          this.cancelLoading = true;
          userCancelOrder(this.form1)
            .then((res) => {
              this.dialogFormVisible = false;
              this.selected = "";
              this.$message.success(res.msg);
              this.getOrderListFun();
            })
            .finally(() => {
              this.cancelLoading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    delDialogFun(item) {
      this.form1.id = item.id;
      this.dialogFormVisible = true;
    },
    changePayFun() {
      this.paymentDisabled = true;
      this.orderInfo.cardNumber = "";
      this.orderInfo.cardCode = "";
      this.orderInfo.MM = "";
      this.orderInfo.YY = "";
      setOrderPaymentt({
        currency: this.selected.currency,
        payment: this.orderInfo.payStyle,
        id: this.selected.id,
      }).then((res) => {
        this.paymentDisabled = false;
        this.$message({
          type: "success",
          message: res.msg,
        });
      });
    },
    payFun() {
      let postData;
      if (this.orderInfo.payStyle === "PayPal") {
        postData = {
          order_id: this.selected.oid,
        };
      } else if (this.orderInfo.payStyle === "Authorize") {
        let orderInfo = this.orderInfo;
        postData = {
          order_id: this.selected.oid,
          JsonStr: JSON.stringify({
            CardNumber: orderInfo.cardNumber,
            ExpirationDate: "20" + orderInfo.YY + "-" + orderInfo.MM,
            CardCode: orderInfo.cardCode,
          }),
        };
      }
      this.$refs["orderInfo"].validate((valid) => {
        if (valid) {
          this.payment(postData, this.orderInfo.payStyle);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    payment(postData, type) {
      const loading = this.$loading({
        lock: true,
        text: "In payment...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
        customClass: "cus-loading",
      });
      pay(postData)
        .then((res) => {
          if (type === "PayPal") {
            let div = document.createElement("div");
            let page = document.body;
            div.innerHTML = res.data;
            page.appendChild(div);

            document.getElementById("paypal_form").submit();
          }
          if (type === "Authorize") {
            //信用卡支付失败，跳转到订单详情页面继续支付
            if (res.ret === 2) {
              this.$router.push({
                name: "payment-failed-id",
                params: {
                  id: res.data,
                },
              });
            } else {
              this.$router.push({
                name: "payment-success-id",
                params: {
                  id: res.data,
                },
              });
            }
          }
          this.submitLoading = false;
        })
        .finally(() => {
          setTimeout(() => {
            loading.close();
          }, 3000);
        });
    },
    goHome() {
      this.$router.push("/");
    },
    getOrderListFun() {
      let postData = {
        pageCount: this.pageInfo.size,
        page: this.pageInfo.page,
        status: "1",
      };
      getOrderList(postData).then((res) => {
        this.peddingOrderList = res.data.data;
      });
    },
    getOrderParams(data) {
      let orderParams = {};
      let verifyArr = data;
      let aaa = (param) => {
        if (param.data && param.data.length) {
          orderParams[param.param_name] = param.data[0].param_name;
          if (param.data[0].data && param.data[0].data.length) {
            let result = aaa(param.data[0].data[0]);
          }
        }
      };
      verifyArr.forEach((item) => {
        aaa(item);
      });
      return orderParams;
    },
  },
  created() {
    this.getOrderListFun();
  },
};
</script>

<style lang="scss" scoped>
.pendingOrders {
  .left {
    width: 600px;
  }
  .mb-header {
    background-color: #edf3f9;
  }
  .right {
    background-color: #edf3f9;
  }
  .c-border-bottom:not(:last-child) {
    border-bottom: 1px solid #d6e1e9;
  }
  .cardForm {
    /deep/.el-input__inner {
      @include px2rem(height, 40px);
      @include px2rem(line-height, 40px);
      @media screen and (min-width: $breakpoint-xl-min) {
        height: 28px;
        line-height: 28px;
      }
    }
  }
  .orderInfo {
    /deep/.el-form-item__label,
    /deep/.el-form-item__content {
      @include px2rem(font-size, 28px);
      @media screen and (min-width: $breakpoint-xl-min) {
        font-size: 16px;
      }
    }
  }
}
</style>
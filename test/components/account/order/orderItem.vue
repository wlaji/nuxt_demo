<template>
  <li class="order-item border rounded overflow-hidden">
    <div class="order-head px-2 pointer">
      <div>
        Order Date : <span>{{ orderItemData.create_time | filterTime }}</span>
      </div>
      <div
        class="d-none d-xl-block"
        :class="{ dowm: showMore }"
        @click="showMore = !showMore"
      >
        <i
          class="el-icon-arrow-down font-weight-bold text-primary"
          style="--pc:20px"
        ></i>
      </div>
    </div>
    <div class="order-content p-2">
      <template v-for="(pItem, index) in orderItemData.order_product">
        <div
          class="product-item py-2"
          :class="{ showMore: showMore }"
          :key="index"
          v-if="showMore || index === 0"
        >
          <h3 class="d-xl-none">Item 1 : {{ pItem.product_cate_name }}</h3>
          <div class="row no-gutters mt-3">
            <div
              class="col-3 product-img order-xl-3 d-xl-flex justify-content-xl-end"
            >
              <img :src="pItem.pic_path" class="img-thumbnail" alt="" />
            </div>
            <template v-if="!showMore">
              <div
                class="col-5 text-center d-flex flex-column justify-content-center order-xl-1 flex-xl-row align-items-xl-center justify-content-xl-start"
              >
                <label>Order Number:</label>
                <p class="text-secondary mt-2 mt-xl-0 ml-xl-2">
                  {{ orderItemData.oid }}
                </p>
              </div>
              <div
                class="col-4 text-center d-flex flex-column justify-content-center order-xl-2 flex-xl-row align-items-xl-center justify-content-xl-start"
              >
                <label>Total:</label>
                <p class="font-weight-bold mt-2 mt-xl-0 ml-xl-2 price">
                  ${{ orderItemData.order_price }}
                </p>
              </div>
            </template>
            <template v-else>
              <!--                手机端内容-->
              <div class="col-9 d-xl-none product-info pl-2 pl-xl-0">
                <ul>
                  <li
                    v-for="(paramItem, key, index) in getOrderParams(
                      JSON.parse(pItem.param_description)
                    )"
                    :key="index"
                  >
                    <label>{{ key }}:</label>
                    <span class="text-secondary">{{ paramItem }}</span>
                  </li>
                </ul>
              </div>
              <!--                pc端内容-->
              <div class="col-xl-4 product-info d-none d-xl-block">
                <ul>
                  <li><label>Item 1:</label> <span>{{ pItem.product_cate_name }}r</span></li>
                  <li>
                    <label>Size:</label>
                    <span class="text-secondary">{{
                      pItem.width + "x" + pItem.height
                    }}</span>
                  </li>
                  <li>
                    <label>Quantity:</label>
                    <span class="text-secondary">{{ pItem.quantity }}</span>
                  </li>
                  <li>
                    <label>Total:</label>
                    <span class="font-weight-bold">${{ pItem.price }}</span>
                  </li>
                </ul>
              </div>
              <div class="col-xl-5 product-info d-none d-xl-block">
                <ul>
                  <li
                    v-for="(paramItem, key, index) in getOrderParams(
                      JSON.parse(pItem.param_description)
                    )"
                    :key="index"
                  >
                    <label>{{ key }}:</label>
                    <span class="text-secondary">{{ paramItem }}</span>
                  </li>
                </ul>
              </div>
            </template>
          </div>
        </div>
      </template>
      <div class="order-more-info pt-2" v-show="showMore">
        <div class="d-flex justify-content-between mb-2">
          <label>Status:</label>
          <span class="text-secondary"
            >{{ orderItemData.status | filterStatus }}
            <i style="font-style: normal" v-if="orderItemData.tracking_number"
              >(TN: {{ orderItemData.tracking_number }})</i
            ></span
          >
        </div>
        <div class="d-flex justify-content-between mb-2">
          <label>Order Number:</label>
          <span class="text-secondary">{{ orderItemData.oid }}</span>
        </div>
        <div class="d-flex justify-content-between mb-2">
          <label>Subtotal:</label>
          <span class="font-weight-bold">${{ orderItemData.order_price }}</span>
        </div>
      </div>
      <div
        class="text-center more-icon pointer d-xl-none"
        :class="{ up: showMore }"
        @click="showMore = !showMore"
      >
        <i
          class="el-icon-d-arrow-right font-weight-bold"
          style="--mb:30rem;--pc:40px"
        ></i>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  name: "orderItem",
  props: ["orderItemData"],
  data() {
    return {
      showMore: false
    };
  },
  filters: {
    filterTime(val) {
      function dateFormat(fmt, date) {
        let ret;
        const opt = {
          "Y+": date.getFullYear().toString(), // 年
          "m+": (date.getMonth() + 1).toString(), // 月
          "d+": date.getDate().toString(), // 日
          "H+": date.getHours().toString(), // 时
          "M+": date.getMinutes().toString(), // 分
          "S+": date.getSeconds().toString() // 秒
          // 有其他格式化字符需求可以继续添加，必须转化成字符串
        };
        for (let k in opt) {
          ret = new RegExp("(" + k + ")").exec(fmt);
          if (ret) {
            fmt = fmt.replace(
              ret[1],
              ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
            );
          }
        }
        return fmt;
      }
      return dateFormat("YYYY, mm/dd HH:MM", new Date(val));
    },
    filterStatus(val) {
      let arr = [
        {
          text: "Awaiting Payment",
          value: 1
        },
        {
          text: "In production",
          value: 2
        },
        {
          text: "Shipped",
          value: 3
        },
        {
          text: "Received",
          value: 4
        },
        {
          text: "Cancelled",
          value: 5
        }
      ];
      return arr.find(item => item.value == val).text || "";
    }
  },
  methods: {
    getOrderParams(data) {
      let orderParams = {};
      let verifyArr = data;
      let aaa = param => {
        if (param.data && param.data.length) {
          orderParams[param.param_name] = param.data[0].param_name;
          if (param.data[0].data && param.data[0].data.length) {
            let result = aaa(param.data[0].data[0]);
          }
        }
      };
      verifyArr.forEach(item => {
        aaa(item);
      });
      return orderParams;
    }
  },
  mounted() {
    console.log(this.orderItemData)
  }
};
</script>

<style scoped lang="scss">
.dowm {
  i {
    transform: rotate(-180deg);
  }
}

.order-item {
  @include px2rem(font-size, 28px);

  .order-head {
    @include px2rem(height, 72px);
    @include px2rem(line-height, 72px);
    background-color: #edf3f9;
    text-align: center;
  }

  .product-item.showMore {
    border-bottom: 1px solid #ccc;
  }

  .more-icon {
    i {
      transform: rotate(90deg);
    }
  }

  .more-icon.up {
    i {
      transform: rotate(-90deg);
    }
  }

  .product-img img {
    @include px2rem(width, 133px);
    @include px2rem(height, 133px);
  }

  .product-info {
    li {
      display: flex;
      justify-content: space-between;
      @include px2rem(margin-bottom, 20px);
      span {
        @include px2rem(margin-left, 10px);
        text-align: right;
      }
    }
  }
}

@media screen and (min-width: $breakpoint-xl-min) {
  .order-item {
    font-size: 16px;

    p {
      font-size: 16px;
    }

    .order-head {
      display: flex;
      justify-content: space-between;
      height: 33px;
      line-height: 33px;
      text-align: left;

      & > div:last-child {
        flex: 1;
        text-align: right;
      }
    }

    .product-img img {
      width: 67px;
      height: 67px;
    }

    label {
      font-weight: 700;
    }

    .price {
      font-weight: normal !important;
    }

    .product-info {
      li {
        display: flex;
        justify-content: start;
        height: auto;
        margin-bottom: 10px;

        span {
          margin-left: 10px;
          text-align: left;
          color: #333 !important;
        }
      }
    }
  }
}
</style>
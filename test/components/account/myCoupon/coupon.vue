<template>
  <div class="container-fluid" :class="currentTabComponent">
    <ul class="couponWrap row">
      <baseCoupon
        v-for="(item, index) in couponList"
        :key="index"
        class="col-12 col-xl-6"
      >
        <template v-slot:left>
          <div class="left">
            <div class="imgWrap">
              <img class="couponImg" :src="item.pic_path" alt="coupon" />
              <!--              expire_soon 为 1 代表优惠券即过期-->
              <div
                class="expire"
                v-if="
                  item.expire_soon === 1 &&
                    currentTabComponent === 'validCoupon'
                "
              >
                <span class="expire-text text-center"> Expire<br />Soon </span>
              </div>
            </div>
          </div>
        </template>
        <template v-slot:right>
          <div class="right pl-2 py-2">
            <h3>
              Types:
              <template v-if="item.coupon_activity_condition.length">
                {{ item.coupon_activity_condition | filterType }}
              </template>
              <template v-else>
                {{ item.default_product_category_name }}
              </template>
            </h3>
            <div class="info">
              <p>
                Deadline: {{ item.validity_end_time | filterTime }}
              </p>
              <p>Description: {{ item.condition_description }}</p>
            </div>
            <div class="bottom d-flex mt-2">
              <div
                class="use pointer"
                v-if="currentTabComponent === 'validCoupon'"
                @click="useCoupon(item.default_product_category_name)"
              >
                <span class="mr-1 font-weight-bold">Use Now</span>
                <span class="more-icon"
                  ><i class="el-icon-arrow-right"></i
                ></span>
              </div>

              <div class="delete pointer" v-else @click="deleteCoupon(item.id)">
                <span class="delete-icon mr-1"
                  ><i class="el-icon-delete"></i
                ></span>
                <span class="font-weight-bold">Delete</span>
              </div>
            </div>
          </div>
        </template>
      </baseCoupon>
    </ul>
  </div>
</template>

<script>
import baseCoupon from "@/components/account/myCoupon/baseCoupon";
import { deleteUserCoupon } from "@/api/account";

export default {
  props: ["couponList", "currentTabComponent"],
  data() {
    return {};
  },
  components: {
    baseCoupon
  },
  filters: {
    filterType(val) {
      let str = [];
      val.forEach(item => {
        str.push(item.product_cate_name);
      });
      return str.join(",");
    },
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

      return dateFormat("YYYY.mm.dd", new Date(val));
    }
  },
  methods: {
    useCoupon(cateName) {
      this.$router.push({
        name: "productName",
        params: {
          productName: this.$utils.formatFirstCategoryName(cateName)
        }
      });
    },
    deleteCoupon(id) {
      this.$confirm("Are you sure to delete the coupon？", "Hint", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning"
      })
        .then(() => {
          deleteUserCoupon({
            coupon_id_list: id
          }).then(res => {
            this.$message.success(res.msg);
            this.$emit("getUserCoupon");
          });
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped lang="scss">
.couponWrap {
  @include px2rem(font-size, 32px);
  min-height: 300px;

  li {
    @include px2rem(margin-bottom, 20px);
  }

  .left .imgWrap {
    overflow: hidden;
    position: relative;
    @include px2rem(width, 193px);
    @include px2rem(height, 218px);

    .des {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      color: #fff;
      text-align: center;
      white-space: nowrap;
    }

    img {
      width: 100%;
      height: 100%;
    }

    .expire {
      position: absolute;
      left: 0;
      top: 0;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      @include px2rem(width, 120px);
      @include px2rem(height, 120px);
      background-color: #ffea01;
      transform: translate(-50%, -50%) rotate(-45deg);

      .expire-text {
        @include px2rem(font-size, 20px);
        color: #e94a1f;
        font-weight: 700;
        line-height: 0.9;
        transform: scale(0.7);
      }
    }
  }

  .right {
    h3 {
      @include px2rem(font-size, 32px);
    }

    .info p {
      @include px2rem(font-size, 24px);
      color: #666666;
    }

    .bottom {
      .use {
        display: flex;
        align-items: center;
        color: $primary;
      }

      .more-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        @include px2rem(width, 36px);
        @include px2rem(height, 36px);
        border-radius: 50%;
        background-color: $primary;

        i {
          color: #fff;
          @include px2rem(font-size, 15px);
        }
      }

      .delete {
        display: flex;
        align-items: center;
        color: #666666;
      }
    }
  }
}

@media screen and (min-width: $breakpoint-xl-min) {
  .couponWrap {
    font-size: 16px;

    li {
      margin-bottom: 20px;
    }

    .left .imgWrap {
      width: 134px;
      height: 148px;

      .expire {
        width: 80px;
        height: 80px;

        .expire-text {
          font-size: 14px;
          transform: scale(0.8);
        }
      }
    }

    .right {
      h3 {
        font-size: 18px;
      }

      .info p {
        font-size: 16px;
      }

      .bottom {
        .more-icon {
          width: 20px;
          height: 20px;

          i {
            color: #fff;
            font-size: 12px;
          }
        }
      }
    }
  }
}

.validCoupon .couponImg {
  background-color: #409eff;
}

.invalidCoupon .couponImg {
  background-color: #ccc;
}

.usedCoupon .couponImg {
  background-color: #f6657f;
}
</style>

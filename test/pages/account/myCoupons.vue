<template>
  <div class="myCoupons p-2">
    <div class="border rounded overflow-hidden">
      <div class="tab-header">
        <ul class="row no-gutters">
          <li
            class="col-4 col-xl-2 pointer"
            :class="{ active: conIndex === 1 }"
            @click="selectIndex(1)"
          >
            Valid Coupons
          </li>
          <li
            class="col-4 col-xl-2 pointer"
            :class="{ active: conIndex === 2 }"
            @click="selectIndex(2)"
          >
            Invalid Coupons
          </li>
          <li
            class="col-4 col-xl-2 pointer"
            :class="{ active: conIndex === 3 }"
            @click="selectIndex(3)"
          >
            Used Coupons
          </li>
        </ul>
      </div>
      <div class="tab-content py-2">
        <div
          class="d-flex-center"
          v-if="$fetchState.pending"
          style="height: 300px"
        >
          <span class="spinner-border"></span>
        </div>
        <div class="d-flex-center" style="height: 200px" v-else-if="$fetchState.error">An error occurred :(</div>
        <coupon
          v-else
          :couponList="couponList"
          :currentTabComponent="currentTabComponent"
          @getUserCoupon="$fetch()"
        ></coupon>
      </div>
    </div>
    <div class="paging">
      <pagination
        v-show="pageInfo.total > 1"
        :size="pageInfo.size"
        :page="pageInfo.page"
        :total="pageInfo.total"
        @getPaginationData="getPaginationData"
      ></pagination>
    </div>
  </div>
</template>
<script>
import coupon from "@/components/account/myCoupon/coupon";
import pagination from "@/components/pagination/index";
import { getUserCoupon } from "@/api/account";

export default {
  middleware: 'permission',
  data() {
    return {
      couponOriginList: [],
      conIndex: 1,
      currentTabComponent: "validCoupon",
      pageInfo: {
        page: 1,
        size: 100,
        total: 0
      }
    };
  },
  components: {
    coupon,
    pagination
  },
  computed: {
    validCouponList() {
      let couponList = this.couponOriginList;
      let validCouponList = [];
      couponList.forEach(item => {
        if (item.is_use === 0) {
          validCouponList.push(item);
        }
      });
      return validCouponList.filter(item => item.is_valid === 1);
    },
    invalidCouponList() {
      let couponList = this.couponOriginList;
      let invalidCouponList = [];
      couponList.forEach(item => {
        if (item.is_use === 0) {
          invalidCouponList.push(item);
        }
      });
      return invalidCouponList.filter(item => item.is_valid === 0);
    },
    usedCouponList() {
      let couponList = this.couponOriginList;
      return couponList.filter(item => item.is_use === 1);
    },
    couponList() {
      let currentTabComponent = this.currentTabComponent;
      switch (currentTabComponent) {
        case "validCoupon":
          return this.validCouponList;
          break;
        case "invalidCoupon":
          return this.invalidCouponList;
          break;
        case "usedCoupon":
          return this.usedCouponList;
          break;
      }
    }
  },
  methods: {
    getPaginationData(pageInfo) {
      this.pageInfo.page = pageInfo.page;
      this.pageInfo.size = pageInfo.size;
      this.$fetch();
    },
    selectIndex(index) {
      this.conIndex = index;
      switch (index) {
        case 1:
          this.currentTabComponent = "validCoupon";
          break;
        case 2:
          this.currentTabComponent = "invalidCoupon";
          break;
        case 3:
          this.currentTabComponent = "usedCoupon";
          break;
      }
    }
  },
  async fetch() {
    let pageInfo = this.pageInfo;
    let res = await getUserCoupon({
      pageCount: pageInfo.size,
      page: pageInfo.page
    });
    pageInfo.total = Number(res.data.total_pages);
    this.couponOriginList = res.data.data;
  },
  created() {}
};
</script>

<style lang="scss" scoped>
.tab-header {
  background-color: #edf3f9;

  ul {
    @include px2rem(height, 90px);
    @include px2rem(line-height, 90px);

    li {
      text-align: center;
      @include px2rem(font-size, 24px);
    }
  }

  .active {
    color: #1296dd;
    font-weight: 700;
    background-color: #fff;
  }
}

@media screen and (min-width: $breakpoint-xl-min) {
  .tab-header {
    ul {
      height: 40px;
      line-height: 40px;

      li {
        font-size: 16px;
      }
    }
  }
}
</style>

<template>
  <div class="account bg-default">
    <div class="container p0 py-xl-4 py-0">
      <div class="row no-gutters bg-white">
        <div class="col-xl-2 d-none d-xl-block">
          <div
            class="d-flex justify-content-center align-items-center top border"
          >
            <p class="px-3 py-3 font-weight-bold" style="--pc: 16px">
              Account Dashboard
            </p>
          </div>
        </div>
        <div
          class="col-12"
          :class="text === 'Pending Orders' ? 'col-xl-6' : 'col-xl-10'"
        >
          <div
            class="
              d-flex
              justify-content-center
              align-items-center
              top
              textBorder
            "
          >
            <p class="px-4 py-3 font-weight-bold" style="--pc: 16px">
              {{ text }}
            </p>
          </div>
        </div>
        <div
          :class="
            text === 'Pending Orders' ? 'col-xl-4 d-none d-xl-block' : 'd-none'
          "
        >
          <div
            class="
              top
              border-top border-right border-left
              h-100
              d-flex
              justify-content-center
              align-items-center
            "
          >
            <p style="--pc: 16px" class="font-weight-bold">Order Information</p>
          </div>
        </div>
        <div class="col-xl-2 navLeft d-none d-xl-block border border-right-0">
          <nuxt-link
            exact
            v-for="(item, index) in linkArr"
            :key="index"
            @click.native="linkJump(item, index)"
            :to="item.link"
            class="
              row
              justify-content-center
              align-items-center
              bottom
              border-bottom
              py-1
              px-3
            "
          >
            <div class="col-auto px-0">
              <div class="left-icon">
                <Al-icon :icon="item.icon"></Al-icon>
              </div>
            </div>
            <div class="col px-0 ml-2">
              <span
                class="linkStyle py-2 text-nowrap"
                style="--pc: 16px"
                >{{ item.name }}</span
              >
            </div>
            <div class="col-auto px-0">
              <div class="right-icon">
                <Al-icon icon="arrow-left" color="#409eff"></Al-icon>
              </div>
            </div>
          </nuxt-link>
        </div>
        <div class="col-xl-10 col-12">
          <div class="bottom h-100 contentBorder">
            <NuxtChild />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      linkArr: [
        {
          link: "/account",
          name: "Account Settings",
          icon: "setting-filling",
        },
        {
          link: "/account/myCoupons",
          name: "My Coupons",
          icon: "sale",
        },
        {
          link: "/account/pendingOrders",
          name: "Pending Orders",
          icon: "order",
        },
        {
          link: "/account/paidOrders",
          name: "Paid Orders",
          icon: "icon-status-paid",
        },
        {
          link: "/account/historyOrders",
          name: "History Orders",
          icon: "time",
        },
        {
          link: "/account/addressBooks",
          name: "Address Books",
          icon: "GoogleMaterialiclocationonpx",
        },
      ],
      text: "Account Settings",
    };
  },

  methods: {
    linkJump(item, index) {
      this.text = item.name;
    },
    replaceText() {
      let temp = this.$route.path.replace(
        /\/\b(account)\b\/|\/\b(account)\b/,
        ""
      );
      switch (temp) {
        case "addressBooks":
          temp = "Address Books";
          break;
        case "historyOrders":
          temp = "History Orders";
          break;
        case "myCoupons":
          temp = "My Coupons";
          break;
        case "paidOrders":
          temp = "Paid Orders";
          break;
        case "pendingOrders":
          temp = "Pending Orders";
          break;
        default:
          temp = "Account Settings";
      }
      this.text = temp;
    },
  },
  created() {
    this.replaceText();
  },
  mounted() {
    this.$Bus.$on("textToNewAddress", () => {
      this.text = "New Address";
    });
    this.$Bus.$on("textToEditAddress", () => {
      this.text = "Edit Address";
    });
    this.$Bus.$on("backToAddressBooks", () => {
      this.text = "Address Books";
    });
  },
};
</script>

<style lang="scss" scoped>
.account {
  /deep/.border,
  /deep/.border-bottom,
  /deep/.border-top,
  /deep/.border-right,
  /deep/.border-left {
    border-color: #d6e1e9 !important;
  }
  .p0 {
    padding-left: 0;
    padding-right: 0;
    @media screen and (min-width: $breakpoint-xl-min) {
      padding-left: 15px;
      padding-right: 15px;
    }
  }
  .textBorder {
    border-bottom: 1px solid #d6e1e9;
    @media screen and (min-width: $breakpoint-xl-min) {
      border: 1px solid #d6e1e9;
    }
  }
  .contentBorder {
    @media screen and (min-width: $breakpoint-xl-min) {
      border: 1px solid #d6e1e9;
    }
  }
  img {
    object-fit: contain;
  }
  .top {
    background-color: #edf3f9;
    @media screen and (min-width: $breakpoint-xl-min) {
      margin: 0 -1px -1px 0;
    }
  }
  .bottom {
    @media screen and (min-width: $breakpoint-xl-min) {
      margin: 0 -1px -1px 0;
    }
  }
  a {
    text-decoration: none;
  }
  .linkStyle {
    width: 100%;
    height: 100%;
    display: block;
    color: black;
    @include px2rem(line-height, 16px);
    @media screen and (min-width: $breakpoint-xl-min) {
      line-height: 16px;
    }
  }
  .navLeft {
    .left-icon {
      color: #333333;
      display: flex;
    }
    .right-icon {
      display: none;
    }
    .nuxt-link-active {
      .left-icon {
        svg {
          color: #409eff;
        }
      }
      .linkStyle {
        color: #409eff;
        font-weight: bold;
      }
      .right-icon {
        display: flex;
      }
    }
  }
}
</style>
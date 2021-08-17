<template>
  <div class="app-wrap">
    <header class="header-wrap bg-white" ref="headWrap" id="headWrap">
      <div class="header-content">
        <div class="header-section-wrap container h-100">
          <div
            class="header-section row justify-content-between align-items-center h-100"
          >
            <div class="header-section-left full-height col-12 col-xl-7">
              <div
                class="d-flex full-height justify-content-center justify-content-xl-start align-items-center position-relative"
              >
                <div
                  class="header-menu flex-column d-flex align-items-center d-xl-none"
                  @click="drawer = true"
                >
                  <i class="el-icon-menu"></i> <span>Menu</span>
                </div>
                <div class="header-logo  pl-2 pointer">
                  <nuxt-link
                    to="/"
                    class="d-flex align-items-center h-100 w-100"
                  >
                    <img
                      class="img-fluid"
                      style="object-fit: contain"
                      src="https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210429/9ac3067dceb678f31a3785091793cc0e.png"
                      alt="custom sticker logo"
                      title="custom sticker logo"
                      width="346"
                      height="80"
                    />
                  </nuxt-link>
                </div>
              </div>
            </div>
            <div
              class="header-section-right d-none d-xl-block full-height col-4 col-xl-5"
            >
              <div
                class="d-flex full-height align-items-center justify-content-end"
              >
                <div class="text-center">
                  <div>
                    <p class="mb-1" style="color: rgba(114, 114, 114, 1)">
                      Give us a call M-F (7:00 AM - 6:00 PM)
                    </p>
                  </div>
                  <div>
                    <a href="mailto:Info@GS-JJ.com">
                      <Al-icon
                        class="align-middle"
                        icon="email1"
                        fontSize="20px"
                      ></Al-icon>
                      Info@GS-JJ.com</a
                    >
                    <a href="tel:1-888-864-4755">
                      <Al-icon
                        class="align-middle ml-1"
                        icon="weibiaoti-"
                        fontSize="20px"
                      ></Al-icon>
                      1-888-864-4755</a
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    <main id="mainContent">
      <div class="app-content flex-1 position-relative">
        <nuxt></nuxt>
      </div>
      <div>
        <el-drawer
          ref="drawer"
          custom-class="myDrawer"
          :append-to-body="true"
          :visible.sync="drawer"
          direction="ltr"
          :withHeader="false"
          size="300px"
        >
          <div class="header">
            <div class="d-flex align-items-center">
              <i
                class="el-icon-phone mr-1"
                style="font-size:30px;color:#1296db"
              ></i>
              <a href="tel:1-888-864-4755"> 1-888-864-4755 </a>
            </div>
            <div class="close-icon" @click="$refs.drawer.closeDrawer()">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="content" @click="closeDrawer">
            <div class="con con-account" v-if="$store.state.authInfo">
              <div class="title">
                Account
              </div>
              <ul class="mt-2">
                <li><a href="/account">My Info</a></li>
                <li><a href="/account/myCoupons">My Coupons</a></li>
                <li><a href="/account/pendingOrders">My Orders</a></li>
                <li><a href="/account/addressBooks">My Address</a></li>
              </ul>
            </div>
            <div class="con" v-for="(item, key) in customNavList" :key="key">
              <div class="title" @click="showExtendNav(key)">
                <nuxt-link :to="'/' + $utils.formatFirstCategoryName(key)"
                  >{{ key }}
                </nuxt-link>
                <i
                  class="el-icon-arrow-down"
                  :class="{ flipY: showMbNav === key }"
                  v-show="item"
                ></i>
              </div>
              <div
                v-for="(citem, ckey) in item"
                :key="ckey"
                class="mt-3"
                v-show="showMbNav === key"
              >
                <div class="small-title" @click="showExtendNav2(ckey)">
                  {{ ckey }}
                  <i
                    class="el-icon-caret-bottom"
                    :class="{ flipY: showMbNav2 === ckey }"
                  ></i>
                </div>
                <ul class="mt-2" v-show="showMbNav2 === ckey">
                  <li v-for="ccitem in citem" :key="ccitem">
                    <nuxt-link
                      :to="'/' + $utils.formatFirstCategoryName(ccitem)"
                      >{{ ccitem }}
                    </nuxt-link>
                  </li>
                </ul>
              </div>
            </div>
            <div class="con">
              <div class="title" @click="showExtendNav('make-your-own')">
                <nuxt-link to="/make-your-own"> Make Your Own</nuxt-link>
                <i class="el-icon-arrow-down"></i>
              </div>
              <ul class="mt-2" v-show="showMbNav === 'make-your-own'">
                <li>
                  <a href="/make-your-own-stickers">Make Your Own Stickers</a>
                </li>
                <li>
                  <a href="/make-your-own-labels">Make Your Own Labels</a>
                </li>
                <li>
                  <a href="/make-your-own-buttons">Make Your Own Buttons</a>
                </li>
              </ul>
            </div>
            <div class="con">
              <div class="title" @click="showExtendNav('about-us')">
                <nuxt-link to="/about-us"> About Us</nuxt-link>
                <i class="el-icon-arrow-down"></i>
              </div>
              <div v-show="showMbNav === 'about-us'">
                <ul class="mt-2">
                  <li><a href="/about-us">Get to Know Customsticker.com</a></li>
                  <li>
                    <a
                      href="https://www.customsticker.com/blog/"
                      target="_blank"
                      >View Our Blogs</a
                    >
                  </li>
                </ul>
                <div class="bottom">
                  <div class="title">
                    Our Brands
                  </div>
                  <div class="brand">
                    <a href="https://www.gs-jj.com/" target="_blank">
                      <div class="imgWrap">
                        <img
                          v-lazy="
                            `https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210709/GS-JJ.com.png`
                          "
                          width="116px"
                          height="43px"
                          alt="GS-JJ.com"
                          title="GS-JJ.com"
                        />
                      </div>
                    </a>
                    <a href="https://www.enamelpins.com/" target="_blank">
                      <div class="imgWrap">
                        <img
                          v-lazy="
                            `https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210709/Enamelpins.com.png`
                          "
                          width="120px"
                          height="51px"
                          alt="Enamelpins.com"
                          title="Enamelpins.com"
                        />
                      </div>
                    </a>
                    <a href="https://www.custompens.com/" target="_blank">
                      <div class="imgWrap">
                        <img
                          v-lazy="
                            `https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210709/Custompens.com.png`
                          "
                          width="119px"
                          height="34px"
                          alt="Custompens.com"
                          title="Custompens.com"
                        />
                      </div>
                    </a>
                    <a
                      href="https://www.customembroideredpatches.com/"
                      target="_blank"
                    >
                      <div class="imgWrap">
                        <img
                          v-lazy="
                            `https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210709/customembroideredpatches.com.png`
                          "
                          width="117px"
                          height="39px"
                          alt="customembroideredpatches.com"
                          title="customembroideredpatches.com"
                        />
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="loginBtnGroup">
              <template v-if="!$store.state.authInfo">
                <a
                  href="/login"
                  title="Log in"
                  class="logBtn"
                  >Log in</a
                >
                <a
                  href="j/register"
                  title="Join Free"
                  class="registerBtn"
                  >Join Free</a
                >
              </template>
              <template v-else>
                <a
                  href="javascript:;"
                  title="Sign Out"
                  class="signOutBtn logBtn"
                  @click="signOut"
                  >Sign Out</a
                >
              </template>
            </div>
          </div>
        </el-drawer>
      </div>
    </main>
  </div>
</template>

<script>
import { deviceType } from "@/utils/deviceType";
import { subscriptions } from "@/api/public";

export default {
  head() {
    return {
      __dangerouslyDisableSanitizers: ["script", "noscript"],
      script: [
        {
          src: "//at.alicdn.com/t/font_1065565_1tg1d7eb9a1.js", //阿里图标
          async: false,
          defer: true
        }
      ]
    };
  },
  data() {
    return {
      drawer: false,
      showMbNav: "",
      showMbNav2: "",
      customNavList: {
        "custom stickers": {
          craft: [
            "Die Cut Stickers",
            "Kiss Cut Stickers",
            "Sticker Sheets",
            "Transfer Stickers",
            "Clear Stickers",
            "Front Adhesive Stickers",
            "Vinyl Lettering",
            "Static Clings Decals"
          ],
          shape: [
            "Circle Stickers",
            "Square Stickers",
            "Rectangle Stickers",
            "Oval Stickers",
            "Rounded Corner Stickers"
          ],
          use: [
            "Bumper Stickers",
            "Logo Stickers",
            "Band Stickers",
            "Custom Laptop Stickers"
          ]
        },
        "custom labels": {
          shape: [
            "Die Cut Labels",
            "Clear Labels",
            "Circle Labels",
            "Custom Rectangle Labels",
            "Square Labels",
            "Oval Labels"
          ],
          use: ["Soap Labels", "Mailing Labels", "Custom Wine Labels"]
        },
        "custom buttons": {
          shape: [
            "Rectangle Buttons",
            "Custom Oval Buttons",
            "Square Buttons",
            "Circle Buttons"
          ]
        },
        "custom magnets": null,
        "wall graphics": null,
        "uses types": {
          labels: ["Soap Labels", "Mailing Labels", "Custom Wine Labels"],
          stickers: ["Band Stickers", "Custom Laptop Stickers", "Logo Stickers"]
        }
      }
    };
  },
  methods: {
    closeDrawer() {
      let e = event.target;
      if (e.tagName == "A") {
        this.$refs.drawer.closeDrawer();
      }
    },

    signOut() {
      this.$store.dispatch("logOut").then(() => {
        this.$router.go(0);
      });
    },

    formatFirstCategoryName(str) {
      return this.$utils.formatFirstCategoryName(str);
    },

    showExtendNav(val) {
      function get_object_first_attribute(data) {
        for (let key in data) {
          return key;
        }
      }
      if (this.showMbNav === val) {
        this.showMbNav = false;
      } else {
        this.showMbNav = val;
      }
      this.showMbNav2 = get_object_first_attribute(this.customNavList[val]);
    },

    showExtendNav2(val) {
      if (this.showMbNav2 === val) {
        this.showMbNav2 = false;
      } else {
        this.showMbNav2 = val;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.app-wrap {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  .header-wrap {
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2030;

    .header-content {
      @include px2rem(height, 118px);
      border-bottom: 1px solid #ccc;

      .header-section {
        .header-menu {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          left: 10px;
          @include px2rem(width, 90px);
          @include px2rem(height, 76px);

          i {
            @include px2rem(font-size, 44px);
          }

          span {
            @include px2rem(font-size, 28px);
          }
        }

        .header-logo {
          @include px2rem(width, 354px);
          @include px2rem(height, 113px);
        }
      }
    }
  }

  #mainContent {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}

@media screen and (min-width: $breakpoint-xl-min) {
  .app-wrap {
    .header-wrap {
      .header-content {
        height: 80px;

        .header-section {
          .header-logo {
            @include px2rem(width, 346px, pc);
            @include px2rem(height, 80px, pc);
          }
        }
      }
    }
  }
}

.flipY {
  transform: rotate(-180deg);
}

.myDrawer {
  .content {
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
    border-top: 1px solid #ddd;

    .con {
      padding: 20px 10px;
      border-bottom: 2px solid #e1e4e8;

      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 24px;
        text-transform: capitalize;

        a {
          color: #333;
          font-size: 24px;
        }
      }

      .small-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 21px;
        font-weight: 700;
        text-transform: uppercase;
      }

      .bottom {
        .title {
          font-size: 21px;
          font-weight: 700;
          margin: 15px 0 10px 0;
          text-transform: uppercase;
        }

        .brand {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;

          a {
            display: block;
            width: calc(50% - 10px);
            margin: 10px 5px;
          }
        }
      }

      a {
        color: #666666;
        font-size: 18px;
      }

      li {
        height: 40px;
        line-height: 40px;
      }
    }

    .loginBtnGroup {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px 20px 50px;
      font-size: 18px;

      a.logBtn {
        display: inline-block;
        width: 100px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background: #3797d9;
        border-radius: 33px;
        color: #fff;
      }

      a.registerBtn {
        color: #333;
        margin-left: 10px;
      }
    }
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    height: 70px;

    a {
      font-size: 24px;
      color: $primary;
    }

    .close-icon {
      font-size: 25px;
      color: #3f4952;
      font-weight: 700;
    }
  }
}
</style>

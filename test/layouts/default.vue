<template>
  <div
    class="app-wrap"
    :class="{
      isDesingPage: $route.name === 'create-your-own-stickers-categoryName',
      pc: $store.state.device.type === 'pc',
      mobile: $store.state.device.type !== 'pc'
    }"
  >
    <acceptCookies></acceptCookies>
    <activityBanner></activityBanner>
    <transition name="el-fade-in-linear">
      <div class="header-nav-extend-wrap" v-show="showDropDown"></div>
    </transition>
<!--    <oneDollarBanner></oneDollarBanner>-->
    <header class="header-wrap bg-white" ref="headWrap" id="headWrap">
      <div class="header-top-wrap d-none d-xl-block">
        <div class="header-top container">
          <div class="row justify-content-between h-100">
            <div class="col">{{ headInfo.config.SiteName }}</div>
            <div
              class="col"
              id="loginWrap"
              style="display: flex;flex-direction: column;justify-content: flex-end;align-items: flex-end;"
            >
              <div
                class="position-relative"
                style="height: 24px;line-height: 24px;"
              >
                <ul class="nav-account text-right">
                  <template v-if="!$store.state.authInfo">
                    <li class="h-100">
                      <i class="el-icon-user-solid userTotal"></i> &nbsp;
                      <a href="javascript:;" @click="goLogin" class="text-white"
                        >Log in</a
                      >
                      <span class="d-inline-block mx-2">or</span>
                      <a
                        href="javascript:;"
                        @click="goRegister"
                        class="text-white"
                        >Join Free</a
                      >
                    </li>
                  </template>
                  <template v-else>
                    <li>
                      <div
                        class="d-flex justify-content-end align-items-center"
                      >
                        <i class="el-icon-user-solid userTotal"></i>&nbsp;
                        <div>Welcome &nbsp;&nbsp;&nbsp;&nbsp;</div>
                        <el-dropdown
                          @command="handleCommand"
                          class="text-white"
                        >
                          <span class="el-dropdown-link">
                            {{ $store.state.authInfo.email }}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                          </span>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="info"
                              >My Info
                            </el-dropdown-item>
                            <el-dropdown-item command="coupons"
                              >My Coupons
                            </el-dropdown-item>
                            <el-dropdown-item command="orders"
                              >My Orders
                            </el-dropdown-item>
                            <el-dropdown-item command="addresss"
                              >My Address
                            </el-dropdown-item>
                            <!--                        <el-dropdown-item command="design"-->
                            <!--                          >My Favorite</el-dropdown-item-->
                            <!--                        >-->
                            <el-dropdown-item command="signOut"
                              >Sign Out
                            </el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </div>
                    </li>
                  </template>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="header-content">
        <div class="header-section-wrap container h-100">
          <div
            class="header-section row justify-content-between align-items-center h-100"
          >
            <div class="header-section-left full-height col-8 col-xl-7">
              <div class="d-flex full-height align-items-center">
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
                      :src="headInfo.config.LogoPath"
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
              class="designSystem-btn position-absolute d-none d-xl-block"
              v-if="$route.name === 'create-your-own-stickers-categoryName'"
            >
              <button
                type="button"
                class="btn btn-primary d-flex-center saveBtn"
                @click="saveTemplate"
              >
                <Al-icon icon="save" class="mr-2"></Al-icon>
                Save
              </button>
              <button
                type="button"
                class="btn btn-outline-primary d-flex-center saveBtn"
                @click="shareTemplate"
              >
                <i class="el-icon-share mr-2"></i>Share
              </button>
            </div>
            <div class="header-section-right full-height col-4 col-xl-5">
              <div
                class="d-flex full-height align-items-center justify-content-end"
              >
                <div class="d-none d-xl-block text-center">
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
                    <a :href="`tel:${headInfo.config.Telephone}`">
                      <Al-icon
                        class="align-middle ml-1"
                        icon="weibiaoti-"
                        fontSize="20px"
                      ></Al-icon>
                      {{ headInfo.config.Telephone }}</a
                    >
                  </div>
                </div>
                <el-divider
                  class="d-none d-xl-block mx-3"
                  direction="vertical"
                ></el-divider>
                <ul class="nav-cart">
                  <nuxt-link tag="li" to="/cart">
                    <a :class="{ active: cartNum > 0 }" class="d-flex-center">
                      <Al-icon
                        class="align-middle"
                        icon="iconfontcart-copy"
                      ></Al-icon>
                      <span>cart({{ cartNum }})</span>
                    </a>
                  </nuxt-link>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 导航栏 -->
      <div
        class="header-nav-wrap position-relative d-none d-xl-block"
        ref="headerNavWrap"
      >
        <div class="header-nav container">
          <nav
            class="d-flex justify-content-between align-items-center full-height position-relative"
          >
            <div
              v-for="item in headInfo.menu"
              :key="item.id"
              @mouseenter="enterOwn(item.product_cate_name.toLowerCase())"
              @mouseleave="leaveOwn"
              @click="closeDropDown"
            >
              <nuxt-link
                class="navLink"
                :class="{
                  'nuxt-link-active':
                    formatFirstCategoryName(item.product_cate_name) ===
                    $route.params.productName
                }"
                :to="
                  '/' + $utils.formatFirstCategoryName(item.product_cate_name)
                "
                :title="item.product_cate_name | addTitle"
                >{{ item.product_cate_name }}
              </nuxt-link>
              <transition name="el-fade-in-linear">
                <div
                  :class="
                    $utils.formatFirstCategoryName(item.product_cate_name)
                  "
                  class="extend-list-wrap clearfix"
                  v-show="
                    showDropDown === item.product_cate_name.toLowerCase() &&
                      customNavList[item.product_cate_name.toLowerCase()]
                  "
                >
                  <div
                    class="extend-list-con"
                    :class="'extend-list' + cindex"
                    v-for="(citem, ckey, cindex) in customNavList[
                      item.product_cate_name.toLowerCase()
                    ]"
                    :key="ckey"
                  >
                    <div class="extend-list-title flex-shrink-0">
                      {{ ckey }}
                    </div>
                    <div class="line flex-shrink-0"></div>
                    <ul class="extend-list-ul">
                      <li
                        class="extend-list-item"
                        v-for="ccitem in citem"
                        :key="ccitem"
                      >
                        <nuxt-link
                          :to="'/' + $utils.formatFirstCategoryName(ccitem)"
                          >{{ ccitem }} <i>></i></nuxt-link
                        >
                      </li>
                    </ul>
                  </div>
                </div>
              </transition>
            </div>
            <div
              @mouseenter="enterOwn('make-your-own')"
              @mouseleave="leaveOwn"
              @click="closeDropDown"
            >
              <nuxt-link
                to="/make-your-own"
                title="Make your own stickers"
                class="navLink"
                >Make Your own
              </nuxt-link>
              <transition name="el-fade-in-linear">
                <div
                  class="extend-list-wrap clearfix"
                  v-show="showDropDown === 'make-your-own'"
                >
                  <div>
                    <nuxt-link
                      tag="div"
                      to="/make-your-own-stickers"
                      class="extend-list"
                    >
                      <div class="categoryImg" style="--aspect-ratio: 250/200">
                        <img
                          v-lazy="
                            `https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210315/custom_sticker.jpg`
                          "
                          alt="custom laptop stickers"
                          title="custom laptop stickers"
                          class="absolute-center img-responsive"
                        />
                      </div>
                      <span class="ellipse">make your own stickers</span>
                    </nuxt-link>
                  </div>
                  <div>
                    <nuxt-link
                      tag="div"
                      to="/make-your-own-labels"
                      class="extend-list"
                    >
                      <div class="categoryImg" style="--aspect-ratio: 250/200">
                        <img
                          v-lazy="
                            `https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210315/custom_label.jpg`
                          "
                          alt="custom labels"
                          title="custom labels"
                          class="absolute-center img-responsive"
                        />
                      </div>
                      <span class="ellipse">make your own labels</span>
                    </nuxt-link>
                  </div>
                  <div>
                    <nuxt-link
                      tag="div"
                      to="/make-your-own-buttons"
                      class="extend-list"
                    >
                      <div class="categoryImg" style="--aspect-ratio: 250/200">
                        <img
                          v-lazy="
                            `https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210315/custom-button.jpg`
                          "
                          alt="make your own buttons"
                          title="make your own buttons"
                          class="absolute-center img-responsive"
                        />
                      </div>
                      <span class="ellipse">make your own buttons</span>
                    </nuxt-link>
                  </div>
                </div>
              </transition>
            </div>
            <div
              @mouseenter="enterOwn('about-us')"
              @mouseleave="leaveOwn"
              @click="closeDropDown"
            >
              <nuxt-link to="/about-us" title="About Us" class="navLink"
                >About us
              </nuxt-link>
              <transition name="el-fade-in-linear">
                <div
                  class="extend-list-wrap clearfix about-us"
                  v-show="showDropDown === 'about-us'"
                >
                  <div class="top">
                    <div>
                      <div class="imgWrap">
                        <img
                          v-lazy="
                            `https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210709/About-Customsticker.com.jpg`
                          "
                          width="289px"
                          height="162px"
                          alt="About Customsticker.com"
                          title="About Customsticker.com"
                        />
                      </div>
                      <div class="title">
                        About Us
                      </div>
                      <p class="desc">
                        Customsticker.com is committed to providing the best
                        service and the highest quality customized printing
                        products.
                      </p>
                      <nuxt-link
                        style="text-transform: none"
                        to="/about-us"
                        title="Get to Know Customsticker.com"
                        >Get to Know Customsticker.com >>
                      </nuxt-link>
                    </div>
                    <div>
                      <div class="imgWrap">
                        <img
                          v-lazy="
                            `https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210709/Blogs-about-custom-printing-products.jpg`
                          "
                          width="289px"
                          height="162px"
                          alt="Blogs about custom printing products"
                          title="Blogs about custom printing products"
                        />
                      </div>
                      <div class="title">
                        Blog
                      </div>
                      <p class="desc">
                        Let us show you many professional and funny blogs about
                        custom printing products.
                      </p>
                      <a
                        href="https://www.customsticker.com/blog/"
                        target="_blank"
                        title="View Our Blogs"
                        >View Our Blogs >></a
                      >
                    </div>
                  </div>
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
              </transition>
            </div>
          </nav>
        </div>
      </div>
    </header>
    <main id="mainContent">
      <div class="app-content">
        <nuxt></nuxt>
        <el-backtop :bottom="200" :right="20">
          <div
            style="
                 {
                  height: 100%;
                  width: 100%;
                  background-color: #1296db;
                  box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
                  text-align: center;
                  line-height: 40px;
                  color: #ffffff;
                  border-radius: 50%;
                }
              "
          >
            <i class="el-icon-arrow-up"></i>
          </div>
        </el-backtop>
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
              <a :href="`tel:${headInfo.config.Telephone}`">{{
                headInfo.config.Telephone
              }}</a>
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
                  href="javascript:;"
                  title="Log in"
                  class="logBtn"
                  @click="goLogin"
                  >Log in</a
                >
                <a
                  href="javascript:;"
                  title="Join Free"
                  class="registerBtn"
                  @click="goRegister"
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

      <loginComponent
        v-if="$route.name !== 'login'"
        :activeTab="activeTab"
        @logined="logined"
        :visible.sync="showLoginDialog"
      ></loginComponent>

      <subscribe
        :ret="retNum"
        @changeSubStatus="changeSubStatus"
        :code="code"
        :visible.sync="showSubscribeDialog"
      ></subscribe>
    </main>
    <footer
      class="footer bg-white mt-3"
      ref="footWrap"
      v-if="$route.name !== 'create-your-own-stickers-categoryName'"
    >
      <div class="pjLogonImg">
        <div class="imgWrap">
          <div style="--aspect-ratio: 149/68">
            <img
              v-lazy="
                `https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210325/Custom-Sticker-Logo.png`
              "
              alt="customsticker.com"
              title="customsticker.com"
            />
          </div>
        </div>
      </div>
      <div class="footer-top container py-4 clearfix">
        <div class="foot1">
          <ul
            class="row no-gutters justify-content-center justify-content-xl-between text-center link"
          >
            <li class="col-4 col-xl-auto">
              <nuxt-link to="/faq-help" title="FAQ & Help"
                >FAQ & Help
              </nuxt-link>
            </li>
            <li class="col-4 col-xl-auto">
              <nuxt-link to="/privacy-policy" title="Privacy Policy"
                >Privacy Policy
              </nuxt-link>
            </li>
            <li class="col-4 col-xl-auto">
              <nuxt-link to="/terms-and-conditions" title="Terms And Conditions"
                >Terms And Conditions
              </nuxt-link>
            </li>
            <li class="col-4 col-xl-auto">
              <nuxt-link to="/sponsorships" title="sponsorships"
                >Sponsorships
              </nuxt-link>
            </li>
            <li class="col-4 col-xl-auto">
              <nuxt-link to="/contact-us" title="Contact Us"
                >Contact Us
              </nuxt-link>
            </li>
            <li class="col-4 col-xl-auto">
              <nuxt-link to="/one-dollar-deal" title="one dollar deal">
                One Dollar Deal
              </nuxt-link>
            </li>
            <li class="col-4 col-xl-auto">
              <a
                href="https://www.customsticker.com/blog/"
                target="_blank"
                title="Blog"
                >Blog</a
              >
            </li>
          </ul>

          <div class="row align-items-center mt-3 mt-xl-5 pt-2">
            <div class="col-12 col-xl-3 order-1 order-xl-0 my-3 my-xl-0">
              <ul class="share d-flex align-items-center">
                <li class="flex-1" v-for="item in shareLink" :key="item.href">
                  <a
                    :href="item.href"
                    class="d-block"
                    target="_blank"
                    rel="noopener"
                  >
                    <div class="imgWrap">
                      <img
                        v-lazy="item.src"
                        :alt="item.alt"
                        :title="item.alt"
                      />
                    </div>
                  </a>
                </li>
              </ul>
            </div>
            <div class="col-12 col-xl-5 px-xl-4 order-0 order-xl-1">
              <div class="submit">
                <label>Subscribe to Save 10% Today</label>
                <div class="input-text flex items-center">
                  <label>
                    <el-input
                      placeholder="your email address"
                      v-model="email"
                      @keyup.enter.native="emailSubscriptions"
                    ></el-input>
                  </label>
                  <a href="javascript:" @click="emailSubscriptions">Submit</a>
                </div>
              </div>
            </div>
            <div class="col-12 col-xl-4 order-2">
              <p class="mb-2"><b>Custom Sticker Office Hours</b></p>
              <p class="text-secondary">Monday - Friday</p>
              <p class="text-secondary">
                7:30 AM to 6:00 PM Pacific Standard Time
              </p>
              <!--                <div v-html="headInfo.config.WorkTime"></div>-->
            </div>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="p-3">
          <span class="inline-block">{{
            headInfo.config.CopyrightInformation
          }}</span>
        </div>
      </div>
      <div class="footer-city d-flex-center">
        <div class="p-1">
          <div style="padding: 2px 0">
            New York | Los Angeles | Chicago | Houston | Phoenix | Philadelphia
            | Washington | San Francisco | San Diego | Boston | Dallas | Miami |
            Atlanta | Detroit | Seattle | Las Vegas | Wilmington City | New
            Orleans | Key West | Vancouver | Salem | Portland | Minneapolis |
            Montana City | Boise | Cheyenne
          </div>
          <div style="padding: 2px 0">
            | Salt Lake | Denver | Santa Fe | Oklahoma City | Austin | Bismarck
            | Fargo | Pierre | Sioux Falls | Lincoln | Omaha | Topeka | Wichita
            | Saint Paul | Baltimore | Jefferson City | Kansans City | Madison |
            Springfield | Orlando | Cleveland | St. Louis | Lansing |
            Indianapolis | Columbus | Little Rock
          </div>
          <div style="padding: 2px 0">
            | Baton Rouge | Jacksonville | Birmingham | Homer City | Columbia
            City | Tallahassee | Louisville | Nashville | Weirton | Raleigh |
            Memphis | Charlotte | Pittsburgh | Anchorage | Fairbanks | Honolulu.
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { subscriptions, addWebVisit } from "@/api/public";
import loginComponent from "@/components/loginComponent";
import acceptCookies from "@/components/acceptCookies";
import subscribe from "@/components/subscribe";
import activityBanner from "@/components/activity/activityBanner";
import { deviceType } from "@/utils/deviceType";
import oneDollarBanner from "@/components/activity/oneDollarBanner"

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
  filters: {
    addTitle(val) {
      let title = "";
      switch (val) {
        case "Custom Stickers":
          title = "custom stickers";
          break;
        case "Custom Labels":
          title = "custom sticker labels";
          break;
        case "Custom Buttons":
          title = "Custom Buttons";
          break;
        case "Custom Magnets":
          title = "Custom Magnets";
          break;
        case "Wall Graphics":
          title = "Custom Wall Graphics";
          break;
      }
      return title;
    }
  },
  computed: {
    headInfo() {
      return this.$store.state.headInfo;
    },
    cartNum() {
      return this.$store.getters.cartNum;
    },
    showLoginDialog: {
      get() {
        return this.$store.state.showLoginDialog;
      },
      set() {
        this.$store.commit("SET_LOGINDIALOG", false);
      }
    },
    // one_dollar() {
    //   let currentPage = this.$route.name;
    //   let pages = [
    //     "productName",
    //     "make-your-own",
    //     "make-your-own-stickers",
    //     "make-your-own-labels",
    //     "make-your-own-buttons",
    //     "about-us",
    //     "faq-help",
    //     "privacy-policy",
    //     "terms-and-conditions",
    //     "sponsorships",
    //     "contact-us",
    //     "index"
    //   ];
    //   return pages.includes(currentPage);
    // }
  },
  components: {
    loginComponent,
    acceptCookies,
    subscribe,
    activityBanner,
    oneDollarBanner
  },
  data() {
    return {
      showMbNav: "",
      showMbNav2: "",
      subscribeList: ["index", "productName"],
      activeTab: 1,
      showDropDown: false,
      email: "",
      drawer: false,
      shareLink: [
        {
          href: "https://www.facebook.com/Stickerspromo/",
          src:
            "https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210525/facebook.png",
          alt: "facebook",
          width: 97,
          height: 96
        },
        {
          href: "https://twitter.com/PromoSticker",
          src:
            "https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210525/twitter.png",
          alt: "twitter",
          width: 97,
          height: 82
        },
        {
          href: "https://www.instagram.com/stickerpromo/",
          src:
            "https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210525/ins.png",
          alt: "instagram",
          width: 89,
          height: 92
        },
        {
          href: "https://www.pinterest.com/Stickerpromo/_created/",
          src:
            "https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210525/pinterest.png",
          alt: "Pinterest",
          width: 93,
          height: 92
        },
        {
          href:
            "https://www.youtube.com/channel/UCEbai5QbNkaP35UU1Jeh-pQ/videos",
          src:
            "https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210525/youtube.png",
          alt: "youtube",
          width: 105,
          height: 70
        }
      ],
      timer: "",
      subscribeTimer: "",
      retNum: 0,
      code: "",
      showSubscribeDialog: false,
      subStatus: "",
      sessionRet: "",
      routerName: [
        "cart",
        "create-your-own-stickers-categoryName",
        "product-productName",
        "unsubscribe",
        "checkout",
        "activity"
      ],

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
    getDevice() {
      let userAgent = navigator.userAgent;
      let device = deviceType(userAgent);
      this.$store.commit("SetDeviceType", device);
    },
    appendTag(tagName, property) {
      let tag = document.createElement(tagName);
      for (let i in property) {
        tag[i] = property[i];
      }
      document.getElementsByTagName("head")[0].appendChild(tag);
    },

    changeSubStatus(status) {
      this.retNum = status;
    },

    saveTemplate() {
      this.$Bus.$emit("saveTemplate");
    },
    shareTemplate() {
      this.$Bus.$emit("shareTemplate");
    },

    enterOwn(name) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        if (this.customNavList[name]) {
          this.showDropDown = name;
          return;
        }
        if (name === "make-your-own") {
          this.showDropDown = name;
          return;
        }
        if (name === "about-us") {
          this.showDropDown = name;
          return;
        }
        this.showDropDown = false;
      }, 300);
    },

    leaveOwn() {
      this.timer = setTimeout(() => {
        this.showDropDown = false;
      }, 300);
    },

    closeDropDown() {
      clearTimeout(this.timer);
      this.showDropDown = false;
    },

    logined() {
      let name = this.$route.name;
      this.$store.commit("SET_LOGINDIALOG", false);
      this.routerName.find(item => {
        if (name === item) {
          this.$Bus.$emit("logined");
        }
      });
    },

    goLogin() {
      let name = this.$route.name;
      let temp = this.routerName.find(item => {
        return item === name;
      });
      if (temp) {
        this.activeTab = 1;
        this.$store.commit("SET_LOGINDIALOG", true);
      } else {
        this.$router.push("/login");
      }
    },

    goRegister() {
      let name = this.$route.name;
      let temp = this.routerName.find(item => {
        return item === name;
      });
      if (temp) {
        this.activeTab = 2;
        this.$store.commit("SET_LOGINDIALOG", true);
      } else {
        this.$router.push("/register");
      }
    },

    closeDrawer() {
      let e = event.target;
      if (e.tagName == "A") {
        this.$refs.drawer.closeDrawer();
      }
    },

    emailSubscriptions() {
      let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      let email = this.email;
      if (!reg.test(email)) {
        this.$message({
          type: "error",
          message: "Email format error"
        });
        return false;
      }
      let postData = {
        email: email
      };
      subscriptions(postData).then(res => {
        if (res.ret === 1) {
          this.retNum = 25;
          this.code = res.data.coupon_code;
          this.email = "";
          this.showSubscribeDialog = true;
          this.$utils.setCookie("cookieRet", "1", 30);
        } else if (res.ret === 25) {
          this.retNum = 2;
          this.email = "";
          this.showSubscribeDialog = true;
          this.$utils.setCookie("cookieRet", "1", 30);
        }
      });
    },
    signOut() {
      this.$store.dispatch("logOut").then(res => {
        this.$router.go(0);
      });
    },
    handleCommand(command) {
      switch (command) {
        case "info":
          this.$router.push({
            name: "account"
          });
          break;
        case "addresss":
          this.$router.push({
            name: "account-addressBooks"
          });
          break;
        case "coupons":
          this.$router.push({
            name: "account-myCoupons"
          });
          break;
        case "orders":
          this.$router.push({
            name: "account-pendingOrders"
          });
          break;
        case "design":
          this.$router.push({
            name: ""
          });
          break;
        case "signOut":
          this.$store.dispatch("logOut").then(res => {
            this.$router.go(0);
          });
          break;
      }
    },

    formatFirstCategoryName(str) {
      return this.$utils.formatFirstCategoryName(str);
    },

    goDesign(name) {
      this.$router.push({
        name: "productName",
        params: {
          productName: this.$utils.formatFirstCategoryName(name)
        }
      });
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
  },
  created() {
    addWebVisit();
  },
  mounted() {
    window.addEventListener("resize", this.getDevice);
    //延迟加载第三方插件
    setTimeout(() => {
      //加载聊天插件
      this.appendTag("script", {
        type: "text/javascript",
        src: "/js/chat.js"
      });
      //加载聊天插件
      this.appendTag("script", {
        type: "text/javascript",
        src: "/js/gtag.js"
      });
    }, 3000);
    if (this.subscribeList.includes(this.$route.name)) {
      this.subStatus = Number(this.$utils.getcookiesInClient("cookieRet"));
      if (this.subStatus) {
        this.retNum = 0;
        this.showSubscribeDialog = false;
        return false;
      }
      this.sessionRet = Number(sessionStorage.getItem("sessionRet"));
      if (this.sessionRet) {
        this.retNum = 0;
        this.showSubscribeDialog = false;
      } else {
        this.subscribeTimer = setTimeout(() => {
          this.retNum = 1;
          this.showSubscribeDialog = true;
        }, 1000);
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getDevice);
    if (this.subscribeTimer) {
      clearTimeout(this.subscribeTimer);
    }
  }
};
</script>

<style lang="scss" scoped>
.header-nav-extend-wrap {
  overflow: hidden auto;
  position: fixed;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: calc(100vh - 144px) !important;
  top: 144px;
  bottom: 0;
  z-index: 1000;
}

//pc端设计系统头部样式
.app-wrap.isDesingPage {
  .header-section-wrap.container {
    width: 100% !important;
    max-width: 95% !important;
  }

  .header-top-wrap {
    .container {
      width: 100% !important;
      max-width: 95% !important;
    }
  }

  .saveBtn {
    width: 210px;
    height: 44px;
    margin: 0;
    padding: 0;
    font-size: 24px;
  }

  .header-nav-wrap {
    display: none !important;
  }
}

//移动端设计系统头部样式
.app-wrap.mobile.isDesingPage {
  .header-section-wrap.container {
    width: 100% !important;
    max-width: 100% !important;
  }

  .header-top-wrap {
    display: none;
  }

  .saveBtn {
    display: none;
  }

  .header-nav-wrap {
    display: none !important;
  }
}

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

        .designSystem-btn {
          left: 50%;
          transform: translate(-50%);
          z-index: 10;
        }

        .header-section-right {
          .nav-cart {
            a {
              text-align: center;
              color: #999999;
              font-weight: 700;

              &.active {
                color: $primary;
              }

              &.active:hover {
                color: darken($primary, 10%);
              }

              &:hover {
                color: $primary;
                text-decoration: none;
              }

              svg {
                @include px2rem(font-size, 54px);
              }

              span {
                margin-left: 5px;
                vertical-align: middle;
                @include px2rem(font-size, 28px);
              }
            }
          }
        }
      }
    }
  }

  #mainContent {
    flex: 1;
  }

  .footer {
    .pjLogonImg {
      position: relative;
      text-align: center;
      height: 68px;

      .imgWrap {
        width: 149px;
        height: 68px;
        margin: 0 auto;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }

    .pjLogonImg::after {
      content: "";
      width: calc(50% - 100px);
      height: 1px;
      background: #797979;
      display: block;
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
    }

    .pjLogonImg::before {
      content: "";
      width: calc(50% - 100px);
      height: 1px;
      background: #797979;
      display: block;
      position: absolute;
      transform: translateY(-50%);
      left: 0;
      top: 50%;
    }

    .footer-top {
      .foot1 {
        @include px2rem(margin-top, 20px);

        ul.link {
          li {
            display: inline-block;
            font-weight: 600;
            cursor: pointer;
            @include px2rem(margin-bottom, 20px);
            @include px2rem(font-size, 32px);

            a {
              color: #333;

              &:hover {
                color: #1296db;
              }
            }
          }

          li:last-child {
            margin-right: 0;
          }
        }

        .imgWrap {
          text-align: center;
          @include px2rem(height, 80px);

          img {
            @include px2rem(height, 80px);
          }
        }

        .submit {
          @include px2rem(font-size, 32px);

          label {
            display: inline-block;
            font-weight: 600;
            @include px2rem(font-size, 32px);
          }

          .input-text {
            display: flex;
            align-items: center;
            @include px2rem(margin-top, 20px);
            @include px2rem(height, 94px);

            label {
              flex: 1;
              height: 100%;
              background-color: transparent;
              outline: none;

              /deep/ .el-input {
                height: 100%;
              }

              /deep/ input {
                height: 100%;
                @include px2rem(font-size, 32px);
                border-radius: 0;

                &::-webkit-input-placeholder {
                  /* placeholder字体大小 */
                  @include px2rem(font-size, 32px);
                }
              }
            }

            a {
              display: flex;
              align-items: center;
              justify-content: center;
              @include px2rem(width, 138px);
              height: 100%;
              color: #ffffff;
              background: #1296db;
              text-align: center;
              @include px2rem(font-size, 32px);
              transition: all 300ms ease-in-out;

              &:hover {
                background: darken(#1296db, 10%);
                text-decoration: none;
              }
            }
          }
        }
      }
    }

    .footer-bottom {
      width: 100%;
      background: #00111a;
      color: #ffffff;
      @include px2rem(font-size, 24px);
      text-align: left;
    }

    .footer-city {
      color: #cbc5cf;
      @include px2rem(font-size, 24px);
    }
  }
}

@media screen and (min-width: $breakpoint-xl-min) {
  .app-wrap {
    .header-wrap {
      .header-top-wrap {
        height: 24px;
        background-color: #333333;

        .header-top {
          margin: 0 auto;
          height: 24px;
          color: #ffffff;
        }
      }

      .header-content {
        height: 80px;

        .header-section {
          .header-logo {
            @include px2rem(width, 346px, pc);
            @include px2rem(height, 80px, pc);
          }

          .nav-cart {
            a {
              svg {
                font-size: 30px !important;
              }

              span {
                font-size: 18px !important;
              }
            }
          }
        }
      }

      .header-nav-wrap {
        border-bottom: 1px solid #ccc;
        height: 40px;

        .header-nav {
          font-size: 16px;

          nav {
            & > div {
              height: 100%;
              display: inline-block;
              text-transform: capitalize;

              &:hover {
                .navLink::after {
                  width: 100%;
                }

                .navLink {
                  color: #1296db;
                  text-decoration: none;
                }
              }

              .navLink {
                position: relative;
                display: block;
                padding: 10px 10px 0;
                height: 40px;
                color: #333;

                &::after {
                  content: "";
                  display: block;
                  height: 6px;
                  width: 0;
                  border-top: 2px solid #1296db;
                  position: absolute;
                  left: 0;
                  transition: all 0.2s ease-in-out;
                }
              }

              .navLink.nuxt-link-active {
                color: #1296db;
              }
            }
          }
        }

        .extend-list-wrap {
          display: flex;
          position: absolute;
          top: 40px;
          right: 0;
          left: auto;
          padding: 20px;
          background-color: #ffffff;
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
          box-shadow: 4px 5px 6px 0px rgba(31, 45, 55, 0.18);

          & > div {
            width: 200px;
            height: auto;
          }

          .extend-list {
            width: 100%;
            text-align: center;
            cursor: pointer;

            &:hover {
              img {
                opacity: 0.9;
              }

              span {
                color: $primary !important;
              }
            }

            span {
              font-weight: 600;
              font-size: 14px;
            }
          }

          .extend-list-con {
            display: flex;
            flex-direction: column;
          }

          .extend-list-title {
            padding-bottom: 5px;
            font-size: 20px;
            font-weight: bold;
            text-transform: uppercase;
          }

          .extend-list-ul {
            margin-top: 10px;
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
            flex: 1;
            height: 0;

            .extend-list-item {
              height: 30px;
              line-height: 30px;

              a {
                font-size: 16px;
                color: #626365;
                text-decoration: none;
                transition: all 0.2s ease-in-out;
                white-space: nowrap;

                i {
                  visibility: hidden;
                  font-style: normal;
                  vertical-align: middle;
                }
              }

              &:hover {
                a {
                  font-weight: bold;
                  color: #00a0e9;

                  i {
                    visibility: visible;
                  }
                }
              }
            }
          }

          .line {
            width: 52px;
            height: 2px;
            background: #333333;
          }
        }

        .extend-list-wrap.Custom-stickers {
          width: 857px;
          height: 250px;
          left: 0;
          right: auto;

          .extend-list0 {
            width: calc(50% - 20px);
            margin: 0 10px;

            .extend-list-ul {
              .extend-list-item {
                width: calc(50% - 10px);
                margin-right: 10px;
              }
            }
          }

          .extend-list1 {
            width: calc(25% - 20px);
            margin: 0 10px;
          }

          .extend-list2 {
            width: calc(25% - 20px);
            margin: 0 10px;
          }
        }

        .extend-list-wrap.Custom-labels {
          width: 452px;
          height: 280px;
          left: 0;
          right: auto;

          .extend-list0 {
            width: calc(60% - 20px);
            margin: 0 10px;

            .extend-list-ul {
              .extend-list-item {
                width: calc(50% - 10px);
                margin-right: 10px;
              }
            }
          }

          .extend-list1 {
            width: calc(40% - 20px);
            margin: 0 10px;
          }
        }

        .extend-list-wrap.Custom-buttons {
          width: 258px;
          height: 210px;
          left: 250px;
          right: auto;

          .extend-list0 {
            width: calc(60% - 20px);
            margin: 0 10px;

            .extend-list-ul {
              .extend-list-item {
                width: calc(50% - 10px);
                margin-right: 10px;
              }
            }
          }

          .extend-list1 {
            width: calc(40% - 20px);
            margin: 0 10px;
          }
        }

        .extend-list-wrap.Uses-types {
          width: 460px;
          height: 174px;
          left: 630px;
          right: auto;

          .extend-list0 {
            width: calc(60% - 20px);
            margin: 0 10px;

            .extend-list-ul {
              .extend-list-item {
                width: calc(50% - 10px);
                margin-right: 10px;
              }
            }
          }

          .extend-list1 {
            width: calc(40% - 20px);
            margin: 0 10px;
          }
        }

        .extend-list-wrap.about-us {
          flex-direction: column;
          width: 620px;
          height: 480px;
          right: 0;
          left: auto;

          .top {
            width: 100%;
            display: flex;
            justify-content: space-between;

            & > div {
              flex: 1;
              padding: 0 5px;
            }

            .title {
              font-size: 20px;
              font-weight: 700;
              margin: 15px 0 10px 0;
              text-transform: uppercase;
            }

            .desc {
              font-size: 16px;
              color: #626365;
              height: 90px;
              text-transform: none;
            }

            a {
              display: inline-block;
              font-size: 16px;
              color: #1296db;
              font-weight: 700;
              text-decoration: underline;
            }
          }

          .bottom {
            width: 100%;

            .title {
              font-size: 20px;
              font-weight: 700;
              margin: 15px 0 10px 0;
              text-transform: uppercase;
            }

            .brand {
              display: flex;
              justify-content: space-between;
              align-items: center;

              a {
                display: block;
              }
            }
          }
        }
      }
    }

    .footer {
      .footer-top {
        .foot1 {
          margin-top: 10px !important;

          ul.link {
            display: flex;

            li {
              text-align: center;
              font-size: 18px !important;
            }
          }

          .imgWrap {
            height: 38px;

            img {
              height: 38px;
            }
          }

          .submit {
            label {
              font-size: 18px;
            }

            .input-text {
              margin-top: 10px;
              height: 40px;
              line-height: 40px;

              label {
                /deep/ input {
                  font-size: 18px;

                  &::-webkit-input-placeholder {
                    /* placeholder字体大小 */
                    font-size: 18px;
                  }
                }
              }

              a {
                width: 64px;
                height: 100%;
                font-size: 18px;
              }
            }
          }
        }
      }

      .footer-bottom {
        font-size: 18px;
        text-align: center;
      }

      .footer-city {
        color: $secondary;
        font-size: 14px;
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

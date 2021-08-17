<template>
  <div>
    <div class="bannerWrap">
      <div class="banner">
        <div class="container banner-text-wrap">
          <div class="banner-text">
            <div class="t1 mb-1">
              ${{ couponInfo.discount_cash }} for
              {{ couponInfo.strict.quantity }}
            </div>
            <div class="t2 mb-1">
              Custom {{ couponInfo.strict.width }}" ×
              {{ couponInfo.strict.height }}"
              {{ couponInfo.category_name.product_category_name.toLowerCase() }}
            </div>
            <div class="t3">
              Normally ${{  Math.round(couponInfo.original_price) }}. Free Shipping
            </div>
            <div class="my-3 d-flex-center">
              <button
                type="button"
                class="nextBtn"
                title="Get It Now"
                @click="getNow"
              >
                Get It Now
              </button>
            </div>
            <nuxt-link
              :to="{
                name: 'productName',
                params: {
                  productName: this.$utils.formatFirstCategoryName(
                    couponInfo.category_name.product_category_name
                  )
                }
              }"
              class="t4 d-block"
              title="Or shop all quantities"
              >Or shop all quantities
            </nuxt-link>
          </div>
          <div class="active-content">
            <div class="t1">
              Limit to <span class="number">TOP {{couponInfo.limit_buy_people}}</span> every week
            </div>
            <div class="t2">
              <span class="number">{{couponInfo.week_buy_people}}</span> People have bought
            </div>
            <div class="lunbo">
              <div class="marquee_box">
                <ul :class="{ marquee_top: animate }">
                  <template v-for="(item, index) in lunboList">
                    <li :key="index">
                      <span>{{
                        item.last_name.substring(0, 1).toUpperCase()
                      }}</span>
                      {{ item.last_name.substring(0, 1).toUpperCase() }}***
                      Successfully Ordered
                    </li>
                  </template>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <el-dialog title="Tips" :visible.sync="fullAlert" width="30%">
          <span>Sorry,this activity has already been fully booked. Please wait for next week patiently.</span>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="fullAlert = false">Cancel</el-button>
          </span>
        </el-dialog>
        <picture>
          <source
            srcset="https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210713/1-dollar-deal-for-custom-die-cut-stickers.jpg"
            media="(min-width: 1201px)"
          />
          <source
            srcset="https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210713/1-dollar-deal-for-custom-die-cut-stickers-MB.jpg"
            media="(max-width: 1200px)"
          />
          <img
            class="banner-img"
            src="https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210713/1-dollar-deal-for-custom-die-cut-stickers.jpg"
            title="One dollar deal"
            alt="One dollar deal"
          />
        </picture>
      </div>
    </div>
    <div class="trait py-4">
      <div class="container">
        <div class="row row-cols-3 row-cols-xl-5 justify-content-center">
          <div
            class="d-flex flex-column justify-content-center align-items-center mb-2 mb-xl0"
          >
            <div class="imgWrap">
              <img
                src="https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210713/free-shipping.png"
                alt="10-12 Days Free Shipping By USPS"
                title="10-12 Days Free Shipping By USPS"
                width="82"
                height="72"
              />
            </div>
            <p>
              10-12 Days Free<br />
              Shipping By USPS
            </p>
          </div>
          <div
            class="d-flex flex-column justify-content-center align-items-center mb-2 mb-xl0"
          >
            <div class="imgWrap">
              <img
                src="https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210713/waterproof-and-durable.png"
                alt="Waterproof and Durable"
                title="Waterproof and Durable"
                width="82"
                height="72"
              />
            </div>
            <p>
              Waterproof and<br />
              Durable
            </p>
          </div>
          <div
            class="d-flex flex-column justify-content-center align-items-center mb-2 mb-xl0"
          >
            <div class="imgWrap">
              <img
                src="https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210713/brightly-and-colorful.png"
                alt="Brightly and Colourful"
                title="Brightly and Colourful"
                width="82"
                height="72"
              />
            </div>
            <p>
              Brightly and<br />
              Colourful
            </p>
          </div>
          <div
            class="d-flex flex-column justify-content-center align-items-center mb-2 mb-xl0"
          >
            <div class="imgWrap">
              <img
                src="https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210713/superior-quality.png"
                alt="Superior Quality Stickers"
                title="Superior Quality Stickers"
                width="82"
                height="72"
              />
            </div>
            <p>
              Superior Quality<br />
              Stickers
            </p>
          </div>
          <div
            class="d-flex flex-column justify-content-center align-items-center mb-2 mb-xl0"
          >
            <div class="imgWrap">
              <img
                src="https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210713/delicate-and-safety-package.png"
                alt="Delicate and Safety Package"
                title="Delicate and Safety Package"
                width="82"
                height="72"
              />
            </div>
            <p>
              Delicate and<br />
              Safety Package
            </p>
          </div>
        </div>
      </div>
    </div>
    <section v-lazy-container class="fwb">
      <article
        v-for="item in rowData"
        :key="item.id"
        v-html="item.row"
      ></article>
    </section>
    <pageReviews :data="reviewsData" :title="reviewsTitle"></pageReviews>
  </div>
</template>

<script>
import {
  getPageInfo,
  getActivityCouponTypeMessage,
  getActivityCouponCodeByName,
  getSiteReviews,
  getSiteReviewInfo
} from "@/api/public";
import pageReviews from "@/components/BasisComponents/pageReviews.vue";
export default {
  name: "one-dollar-deal",
  async asyncData({ app }) {
    let { data } = await getPageInfo({
      pageName: "one-dollar-deal"
    });
    let couponInfo = await getActivityCouponTypeMessage({
      title: "$1 15个活动"
    });
    let reviewsData = await getSiteReviews({
      page:'1',
      pageCount:'3',
      rating:'5'
    });
    let reviewsTitle = await getSiteReviewInfo();
    couponInfo = couponInfo.data;
    reviewsData = reviewsData.data
    reviewsTitle = reviewsTitle.data
    let myCouponInfo = {
      discount_cash: couponInfo.discount_cash,
      original_price: couponInfo.product_category_condition[0].original_price,
      limit_buy_people: couponInfo.limit_buy_people,
      week_buy_people: couponInfo.week_buy_people,
      coupon_activity_buy_people_list:
        couponInfo.coupon_activity_buy_people_list,
      strict: couponInfo.product_category_condition[0].strict.size_restrict[0],
      category_name: couponInfo.product_category_condition[0]
    };
    let { rowData, title, description, keyword, structuring } = data;
    return {
      rowData: rowData,
      seoTitle: title,
      seoDescription: description,
      seoKeyword: keyword,
      structuring,
      couponInfo: myCouponInfo,
      reviewsData:reviewsData,
      reviewsTitle:reviewsTitle
    };
  },
  head() {
    return {
      title: this.seoTitle,
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.seoDescription
        },
        {
          hid: "keywords",
          name: "keywords",
          content: this.seoKeyword
        },
        {
          hid: "google-site-verification",
          name: "google-site-verification",
          content: "tzkz32YFkUVUQpjIXX1xoRMV4MpFz4TLSCXjmrFABaQ"
        }
      ],
      script: this.structuring
        ? [
            {
              type: "application/ld+json",
              innerHTML: this.structuring
            }
          ]
        : []
    };
  },
  data() {
    return {
      loading: false,
      myCouponInfo: "",
      originLunboList: [
        {
          name: "Karen"
        },
        {
          name: "XWC"
        },
        {
          name: "SF"
        },
        {
          name: "HX"
        },
        {
          name: "fsc"
        },
        {
          name: "cx"
        }
      ],
      lunboList: [],
      lunboStartIndex: 6,
      timed: null,
      animate: false,
      fullAlert:false
    };
  },
  components:{
    pageReviews
  },
  methods: {
    toggleLunbo() {
      this.lunboList = this.originLunboList.slice(0, 6);
      if (this.originLunboList.length <= 5) {
        return;
      }
      let interval = () => {
        this.animate = true;
        setTimeout(() => {
          let originLunboList = this.originLunboList,
            lunboList = this.lunboList,
            startIndex = this.lunboStartIndex;
          if (startIndex >= originLunboList.length) {
            this.lunboStartIndex = startIndex = 0;
          }
          let nextItem = originLunboList.slice(startIndex, startIndex + 1);
          lunboList.push(nextItem[0]);
          lunboList.splice(0, 1);
          this.lunboStartIndex += 1;
          this.animate = false;
        }, 500);
        setTimeout(interval, 3000);
      };
      setTimeout(interval, 3000);
    },

    getNow() {
      this.loading = true;
      let postData = {
        title: "$1 15个活动"
      };
      getActivityCouponCodeByName(postData)
        .then(res => {
          sessionStorage.setItem("cid", res.data);
          this.$router.push({
            name: "custom-stickers-cheap"
          });
        })
        .finally(() => {
          this.loading = false;
        });
    }
  },
  mounted() {
    this.originLunboList = this.couponInfo.coupon_activity_buy_people_list;
    this.toggleLunbo();
    console.log(this.couponInfo.limit_buy_people,this.couponInfo.week_buy_people,this.couponInfo.week_buy_people>=this.couponInfo.limit_buy_people)
    this.couponInfo.week_buy_people>=this.couponInfo.limit_buy_people?this.fullAlert=true:''
  }
};
</script>

<style scoped lang="scss">
.bannerWrap {
  .marquee_top {
    transition: all 0.5s ease-out;
    @include px2rem(margin-top, -65px);
  }

  .banner {
    position: relative;
    @include px2rem(height, 915px);

    .banner-img {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }

    .banner-text-wrap {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      height: 100%;

      .banner-text {
        position: absolute;
        @include px2rem(width, 613px);
        @include px2rem(top, 70px);
        left: calc(50% + 10px);
        transform: translateX(-50%);
        text-align: center;

        .nextBtn {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #1296db;
          @include px2rem(width, 286px);
          @include px2rem(height, 80px);
          color: #fff;
          border: none;
          @include px2rem(border-radius, 4px);
          @include px2rem(font-size, 30px);
          font-weight: 700;
          transition: background-color 0.15s ease-in-out;

          &:hover {
            background-color: darken(#1296db, 2%);
          }
        }

        .t1 {
          color: #0580c1;
          @include px2rem(font-size, 60px);
          font-weight: 700;
        }

        .t2 {
          color: #444444;
          @include px2rem(font-size, 36px);
          font-weight: 700;
        }

        .t3 {
          color: #333333;
          @include px2rem(font-size, 24px);
          font-weight: 700;
        }

        .t4 {
          color: #333333;
          @include px2rem(font-size, 24px);
          font-weight: 700;
          text-decoration: underline;
        }
      }

      .active-content {
        position: absolute;
        @include px2rem(bottom, 20px);
        left: 50%;
        transform: translateX(-50%);
        @include px2rem(width, 577px);

        .t1 {
          @include px2rem(font-size, 24px);
          color: #fff;
          font-weight: 700;

          .number {
            color: #ffdc3a;
          }
        }

        .t2 {
          display: flex;
          align-items: center;
          @include px2rem(font-size, 36px);
          @include px2rem(margin-top, 10px);
          color: #fff;
          font-weight: 700;

          .number {
            display: inline-block;
            @include px2rem(width, 98px);
            @include px2rem(height, 44px);
            @include px2rem(line-height, 44px);
            text-align: center;
            background: #ff622b;
            @include px2rem(border-radius, 10px);
            @include px2rem(margin-right, 10px);
            color: #ffe346;
          }
        }

        .lunbo {
          display: flex;
          justify-content: center;
          align-items: center;
          @include px2rem(margin-top, 20px);
          width: 100%;
          @include px2rem(height, 345px);
          @include px2rem(padding, 10px);
          background: rgba(255, 255, 255, 0.4);
          @include px2rem(border-radius, 20px);

          .marquee_box {
            display: block;
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }

          ul {
            display: block;
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;

            li {
              @include px2rem(height, 60px);
              @include px2rem(line-height, 60px);
              background: rgba(61, 61, 65, 0.5);
              @include px2rem(border-radius, 30px);
              @include px2rem(font-size, 32px);
              color: #fff;
              @include px2rem(margin-top, 5px);
              @include px2rem(margin-bottom, 5px);

              span {
                display: inline-block;
                @include px2rem(width, 40px);
                @include px2rem(height, 40px);
                @include px2rem(line-height, 40px);
                @include px2rem(margin-left, 5px);
                text-align: center;
                background: #f3f4f6;
                border-radius: 50%;
                @include px2rem(font-size, 36px);
                color: #211e27;
                font-weight: 700;
              }
            }
          }
        }
      }
    }
  }
}

.trait {
  p {
    @include px2rem(margin-top, 10px);
    @include px2rem(font-size, 24px);
    text-align: center;
    font-weight: 700;
  }
}

.fwb /deep/ {
  p,
  span {
    @include px2rem(font-size, 32px);
  }

  .f1 {
    .circle-span {
      flex-shrink: 0;
      display: inline-block;
      @include px2rem(width, 40px);
      @include px2rem(height, 40px);
      @include px2rem(line-height, 40px);
      @include px2rem(margin-right, 20px);
      background: #ff902b;
      border-radius: 50%;
      text-align: center;
      color: #fff;
      @include px2rem(font-size, 32px);
    }
  }

  .f2 {
    .imgWrap {
      @include px2rem(width, 690px);
      @include px2rem(height, 390px);

      img {
        width: 100%;
        height: 100%;
      }
    }

    h2 {
      @include px2rem(font-size, 52px);
    }

    .small-title {
      position: relative;
      @include px2rem(margin-bottom, 20px);
      @include px2rem(font-size, 32px);
      font-weight: 700;

      &::after {
        content: "";
        position: absolute;
        @include px2rem(bottom, -10px);
        left: 0;
        @include px2rem(width, 80px);
        @include px2rem(height, 5px);
        background: #1296db;
        border-radius: 2px;
      }
    }
  }


}

@media screen and (min-width: $breakpoint-xl-min) {
  .bannerWrap {
    .marquee_top {
      transition: all 0.5s ease-out;
      margin-top: -41px;
    }

    .banner {
      height: 400px;

      .banner-text-wrap {
        .banner-text {
          width: 500px;
          top: 70px;
          left: calc(50% + 20px);

          .nextBtn {
            width: 225px;
            height: 44px;
            border-radius: 4px;
            font-size: 24px;
          }

          .t1 {
            font-size: 60px;
          }

          .t2 {
            font-size: 36px;
          }

          .t3 {
            font-size: 24px;
          }

          .t4 {
            font-size: 18px;
          }
        }

        .active-content {
          position: absolute;
          top: 50px;
          left: auto;
          transform: translateX(0);
          right: 20px;
          width: 286px;

          .t1 {
            color: #333333;
            font-size: 18px;

            .number {
              color: #ff622b;
            }
          }

          .t2 {
            font-size: 24px;
            color: #333333;

            .number {
              width: 48px;
              height: 24px;
              line-height: 24px;
              border-radius: 4px;
              margin-right: 10px;
            }
          }

          .lunbo {
            margin-top: 10px;
            width: 100%;
            height: 225px;
            padding: 10px;
            border-radius: 20px;

            ul {
              li {
                width: 260px;
                height: 36px;
                line-height: 36px;
                border-radius: 20px;
                font-size: 18px;
                margin: 5px 0;

                span {
                  width: 24px;
                  height: 24px;
                  line-height: 24px;
                  margin-left: 5px;
                  font-size: 20px;
                }
              }
            }
          }
        }
      }
    }
  }
  .trait {
    p {
      margin-top: 10px;
      font-size: 16px;
    }
  }
  .fwb /deep/ {
    p,
    span {
      font-size: 18px;
    }

    .f1 {
      .circle-span {
        width: 24px;
        height: 24px;

        line-height: 24px;
        margin-right: 10px;
        font-size: 16px;
      }
    }

    .f2 {
      .imgWrap {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;

        img {
          width: auto;
          height: auto;
        }
      }

      h2 {
        font-size: 36px;
      }

      .small-title {
        margin-bottom: 20px;
        font-size: 24px;

        &::after {
          content: "";
          bottom: -10px;
          width: 50px;
          height: 4px;
        }
      }
    }
  }
}
</style>

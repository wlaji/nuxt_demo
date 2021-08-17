<template>
  <div class="bannerWrap">
    <section v-html="fwbHtml"></section>

    <base-dialog :visible.sync="showDefaultAddress">
      <template v-slot:content>
        <div class="content-wrap">
          <div class="close-dialog" @click="showDefaultAddress = false">
            <i class="el-icon-circle-close"></i>
          </div>
          <div class="promotionWindow">
            <div class="h4 text-center">
              <img
                class="w-100"
                src="https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210601/pc_down_ban.png"
                alt="Custom Stickers"
                title="Custom Stickers"
                style="border-radius: 5px 5px 0 0"
              />
            </div>
            <div class="position-relative">
              <div class="p-0"></div>
              <div class="promotionWindow_index">
                <p
                  class="text-center mb-0 font-weight-bold"
                  style="color: #ed4940; --pc: 48px; --mb: 52rem"
                >
                  SAVE
                </p>
                <p
                  class="text-center mb-0 font-weight-bold"
                  style="color: #ed4940; --pc: 100px; --mb: 120rem"
                >
                  50% OFF
                </p>
                <p
                  class="text-center mb-0 pb-3 font-weight-bold"
                  style="
                    color: #545454;
                    border-bottom: 1px dashed #999;
                    --pc: 36px;
                    --mb: 42rem;
                  "
                >
                  ON YOUR NEXT ORDER
                </p>
                <p
                  class="text-center mb-0 font32-24 px-2"
                  style="color: #8f8f8f"
                >
                  This sales promotion is only available for customization of 2”
                  × 2” die cut stickers.
                </p>
                <p class="text-center mt-2">
                  <button
                    class="
                      text-center
                      py-2
                      border-0
                      px-2
                      justify-content-center
                      px-4
                      font36-24
                    "
                    size="small"
                    style="
                      background-color: #1296db;
                      color: #fff;
                      border-radius: 5px;
                    "
                    @click="submitCid"
                  >
                    Get It
                  </button>
                </p>

                <p class="text-center my-3 font24-18" style="color: #d6d6d6">
                  Note: This offer code cannot be used in combination with
                  others
                </p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </base-dialog>
  </div>
</template>

<script>
import { getActivityCouponCodeByName } from "@/api/activity";
export default {
  name: "banner",
  props: ["bannerHtml","totalReviews"],
  data() {
    return {
      showVideo: false,
      videoId: "",
      debounceSearchCategory: null,
      showDefaultAddress: false,
    };
  },
  computed: {
    fwbHtml() {
      let bannerHtml = this.bannerHtml;
      if (
        this.$store.state.device.type === "pc" ||
        (process.client && document.documentElement.clientWidth > 1200)
      ) {
        return bannerHtml.pcHtml ? bannerHtml.pcHtml : bannerHtml.mbHtml;
      } else {
        return bannerHtml.mbHtml ? bannerHtml.mbHtml : bannerHtml.pcHtml;
      }
    },
  },
  methods: {
    initBannerVideo(ele) {
      let parent = ele.parentNode;
      let videoId = ele.getAttribute("data-id");
      let mainBody = document.getElementById("mainBodyCategory");
      let videoDom = document.createElement("div");
      if (this.$store.state.device.type === "pc") {
        let ht = `
            <div class="video-play-banner">
            <div class="bg-dark p-2">
                <div style="--aspect-ratio: 16/9">
                  <lite-youtube
                    id="videoPlay"
                    videoid="${videoId}"
                    params="controls=1&amp;modestbranding=2&amp;rel=0&amp;enablejsapi=1"
                  ></lite-youtube>
                </div>
              </div>
            </div>
          `;
        videoDom.innerHTML = ht;
        parent.append(videoDom);
        document
          .getElementById("videoPlay")
          .getElementsByClassName("lty-playbtn")[0]
          .click();
      } else {
        let ht = `
          <div class="z-header dialog-model" id="videoPlayDialog">
            <div class="dialog-model-overlay"></div>
              <div class="dialog-model-con">
                <div class="bg-dark p-2">
                  <div style="--aspect-ratio: 16/9">
                    <lite-youtube
                      id="videoPlay"
                      videoid="${videoId}"
                      params="controls=1&amp;modestbranding=2&amp;rel=0&amp;enablejsapi=1"
                    ></lite-youtube>
                  </div>
                </div>
                <div class="close" id="closeVideoPlayDialog">
                  <i class="el-icon-circle-close"></i>
                </div>
              </div>
          </div>`;
        videoDom.innerHTML = ht;
        mainBody.append(videoDom);
        document
          .getElementById("closeVideoPlayDialog")
          .addEventListener("click", () => {
            let self = document.getElementById("videoPlayDialog");
            let parent = self.parentElement;
            parent.removeChild(self);
          });
      }
    },
    openCoupon() {
      let activitypop = document.getElementById("activitypop");
      if (!activitypop) {
        return false;
      }
      activitypop.onclick = () => {
        this.showDefaultAddress = true;
      };
    },
    submitCid() {
      getActivityCouponCodeByName({
        title: "50% die cut 活动",
      }).then((res) => {
        console.log(res);
        sessionStorage.setItem("cid", res.data);
        this.$router.push({
          name: "custom-stickers-cheap",
        });
      });
    },
    countTime() {
      let active = document.getElementById("activeTime");
      if (!active) {
        return false;
      }
      let activeText = document.getElementById("activeText");
      // 获取当前时间
      let date = new Date();
      let now = date.getTime();

      //ios兼容
      let dataTime = active.getAttribute("data-time").replace(/-/g,'/')

      //设置截止时间
      let endDate = new Date(dataTime);
      let end = endDate.getTime();
      //时间差 (秒)
      let leftTime = (end - now) / 1000;
      let time24H = 24 * 60 * 60;
      let time1H = 60 * 60;
      let time1M = 60;
      if (leftTime <= 0) {
        active.innerHTML = 0;
        activeText.innerHTML = "Day";
      } else if (leftTime < time1M) {
        //秒数直接显示
        // active.innerHTML = Math.floor(leftTime)
      } else if (leftTime < time1H) {
        //分钟数将leftTime转化为分钟
        active.innerHTML = Math.floor(leftTime / 60);
        activeText.innerHTML = "Min";
      } else if (leftTime < time24H) {
        //小时数将leftTime转化为小时
        active.innerHTML = Math.floor(leftTime / 60 / 60);
        activeText.innerHTML = "Hrs";
      } else {
        // active.innerHTML = (leftTime/60/60/24).toFixed(1)
        let dayTime = (leftTime / 60 / 60 / 24).toFixed(1);
        let timeDecimal = dayTime.split(".")[1];
        if (timeDecimal >= 0 && timeDecimal <= 3) {
          active.innerHTML = Math.floor(dayTime);
          activeText.innerHTML = "Day";
        } else if (timeDecimal > 3 && timeDecimal <= 7) {
          active.innerHTML = Math.floor(dayTime) + ".5";
          activeText.innerHTML = "Day";
        } else if (timeDecimal > 7 && timeDecimal <= 9) {
          active.innerHTML = Math.floor(dayTime) + 1;
          activeText.innerHTML = "Day";
        }
      }
      this.timerPromotion = setTimeout(() => {
        this.countTime();
      }, 1000);
    },
    closeVideo() {
      this.showVideo = false;
      this.$utils.toggleBody(0);
    },
  },
  mounted() {
    if(document.getElementById("reviews")){
      let rHtml = document.getElementById("reviews")
      rHtml.innerHTML = this.totalReviews
    }
    if (document.getElementById("playVideo")) {
      document
        .getElementById("playVideo")
        .addEventListener("click", (event) => {
          this.initBannerVideo(document.getElementById("playVideo"));
        });
    }
    this.countTime();
    this.openCoupon();
  },
};
</script>

<style scoped lang="scss">
.bannerWrap /deep/ {
  .d-flex-center{
    @include px2rem(font-size, 32px);
  }
  .banner {
    position: relative;
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
        width: 50%;
        position: relative;
        @include px2rem(top, 20px);
        text-align: left;
        @media screen and (max-width: $breakpoint-sm-max) {
          width: 100%;  //make your own 四个banner手机端样式修改
        }
        h1 {
          @include px2rem(font-size, 65px);
        }

        p {
          @include px2rem(font-size, 32px);
          /*line-height: 1.4em;*/
          color: #6c757d;
        }
      }
    }
    .aStyle2 {
      text-decoration: none;
      border-radius: 4px;
      background: linear-gradient(0deg, #eb4905 0%, #ffa647 100%);
      color: white;
      width: fit-content;
      @include px2rem(font-size, 24px);
      @media screen and (min-width: $breakpoint-xl-min) {
        font-size: 24px;
        line-height: 24px;
      }
      .s30 {
        @media screen and (min-width: $breakpoint-xl-min) {
          line-height: 30px;
        }
      }
      .r {
        @media screen and (min-width: $breakpoint-xl-min) {
          line-height: 18px;
        }
      }
      &:hover {
        text-decoration: none;
      }
    }
    .nextBtn {
      a {
        display: inline-block;
        @include px2rem(width, 280px);
        @include px2rem(height, 60px);
        @include px2rem(line-height, 60px);
        @include px2rem(margin-top, 20px);
        @include px2rem(border-radius, 30px);
        border: 1px solid #ccc;
        background-color: #feb355;
        color: #fff;
        @include px2rem(font-size, 28px);
        text-align: center;
        opacity: 1;
      }
    }
  }
  .banner.banner3 {
    .r {
      @include px2rem(line-height, 25px);
    }
    p {
      line-height: 1.3;
    }
  }
  .banner1 {
    @include px2rem(height, 600px);
    .offbackground {
      width: 111px;
      height: 111px;
      @media screen and (max-width: $breakpoint-sm-max) {
        @include px2rem(width, 110px);
        @include px2rem(height, 110px);
      }
    }
    .customstickers_banner {
      width: 60%;
      @media screen and (max-width: $breakpoint-sm-max) {
        width: 100%;
      }
      .customstickers_banner_left {
        @include px2rem(margin-left, -10px, pc, true);
        @media screen and (max-width: $breakpoint-sm-max) {
          margin-left: -10px !important;
        }
      }
      .customstickers_banner_time {
        @include px2rem(margin-left, -10px, pc, true);
        @media screen and (max-width: $breakpoint-sm-max) {
          margin-left: -10px !important;
        }
      }
      .customstickers_banner50 {
        top: 50%;
        left: 6%;
        @media screen and (max-width: $breakpoint-sm-max) {
          @include px2rem(left, 20px);
        }
        transform: translateY(-50%);
        background: linear-gradient(to bottom right, #79542a, #412d19);
        -webkit-background-clip: text;
        color: transparent !important;
      }
      .customstickers_banner_pcmb {
        line-height: 84px;
        @media screen and (max-width: $breakpoint-sm-max) {
          @include px2rem(line-height, 60px);
        }
      }
      .customstickers_banner_conter {
        height: 60px;
        @media screen and (max-width: $breakpoint-sm-max) {
          @include px2rem(height, 50px);
        }
      }
      #activitypop {
        @media screen and (max-width: $breakpoint-sm-max) {
          a {
            padding: 5px 5px;
          }
        }
      }
      .customstickers_banner_img {
        display: block;
        @media screen and (max-width: $breakpoint-sm-max) {
          display: none;
        }
      }
    }
    .customstickers_banner_mbimg {
      display: none;
      @media screen and (max-width: $breakpoint-sm-max) {
        display: block;
        @include px2rem(width, 111px);
        @include px2rem(height, 111px);
        p {
          @include px2rem(top, 20px);
          @include px2rem(left, 12px);
          background: linear-gradient(to bottom right, #79542a, #412d19);
          -webkit-background-clip: text;
          color: transparent !important;
        }
      }
    }
  }

  .banner2 {
    @include px2rem(height, 640px);

    h1 {
      color: $primary;
    }

    .banner-text-wrap {
      .banner-text {
        width: 100%;
      }
    }
  }
}
@media screen and (min-width: $breakpoint-xl-min) {
  .bannerWrap /deep/ {
    .banner {
      .banner-text-wrap {
        .banner-text {
          width: 40%;
          top: 20px;
          padding-left: 8px;
          text-align: left;
        }
      }

      .nextBtn {
        a {
          width: 280px;
          height: 60px;
          line-height: 60px;
          margin-top: 20px;
          border-radius: 30px;
          font-size: 20px;
        }
      }
    }

    .banner1 {
      height: 300px;

      .banner-text-wrap {
        .banner-text {
          h1 {
            font-size: 60px;
          }

          p {
            font-size: 20px;
          }
        }
      }
    }

    .banner2 {
      height: 750px;

      .banner-text-wrap {
        .banner-text {
          h1 {
            font-size: 60px;
          }

          p {
            font-size: 20px;
          }
        }
      }
    }
  }
}

.content-wrap {
  overflow: hidden;
  @include px2rem(width, 700px);
  border-radius: 10px;
  background: #fff;
  .content {
    @include px2rem(padding, 30px);
    text-align: center;

    .h3 {
      @include px2rem(font-size, 52px);
      font-weight: 700;
    }

    .des {
      width: 80%;
      margin: 10px auto;
    }

    p {
      @include px2rem(font-size, 18px);
    }

    /deep/ .el-input .el-input__inner {
      @include px2rem(width, 580px);
      @include px2rem(height, 90px);
      @include px2rem(font-size, 24px);
    }

    /deep/ .el-button {
      @include px2rem(width, 580px);
      @include px2rem(height, 90px);
      @include px2rem(font-size, 32px);
      @include px2rem(margin-top, 30px);
      background-color: #fa7a2a;
      color: #fff;
    }

    .link {
      @include px2rem(font-size, 24px);
      @include px2rem(margin-top, 10px);
      a {
        color: #333;
      }
    }
  }
  .close-dialog {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    position: absolute;
    left: 50%;
    bottom: -40px;
    transform: translateX(-50%);
    background-color: #fff;
    border-radius: 50%;
    cursor: pointer;

    i {
      font-size: 30px;
    }
  }
}

@media screen and (min-width: 1201px) {
  .content-wrap {
    width: 589px;

    .content {
      padding: 20px;

      .h3 {
        font-size: 48px;
      }

      p {
        font-size: 18px;
      }

      /deep/ .el-input .el-input__inner {
        width: 540px;
        height: 52px;
        font-size: 18px;
      }

      /deep/ .el-button {
        width: 540px;
        height: 52px;
        font-size: 24px;
        margin-top: 20px;
      }

      .link {
        font-size: 16px;
        margin-top: 20px;
      }
    }

    .close-dialog {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 30px;
      height: 30px;
      position: absolute;
      left: 50%;
      bottom: -40px;
      transform: translateX(-50%);
      background-color: #fff;
      border-radius: 50%;
      cursor: pointer;

      i {
        font-size: 30px;
      }
    }
  }
}
/*fsc ban*/
//视频播放按钮暂时隐藏

//.video-btn-banner {
//  display: flex;
//  justify-content: center;
//  align-items: center;
//  position: absolute;
//  left: 300px;
//  bottom: 210px;
//  cursor: pointer;
//  width: 80px;
//  height: 80px;
//  border-radius: 50%;
//  background: rgba(0, 0, 0, 0.8);
//
//  &:hover {
//    .play {
//      border-color: transparent transparent transparent $primary;
//    }
//  }
//
//  .play {
//    position: relative;
//    left: 5px;
//    height: 40px;
//    border-style: solid;
//    border-width: 20px 0 20px 30px;
//    border-color: transparent transparent transparent white;
//  }
//}
</style>

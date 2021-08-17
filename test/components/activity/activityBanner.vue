<template>
  <div v-if="routeName == 'index' && activeTime != 0">
    <div class="pHeder">
      <div class="pPc" v-if="this.$store.state.device.type === 'pc'">
        <div class="ppLeft">
          <div class="ppl">Ends In</div>
          <div class="ppr">
            <div class="pprTime">{{ h }} <span>Hrs</span></div>
            <div style="font-size: 30px; font-weight: bold; padding: 0 5px">
              :
            </div>
            <div class="pprTime">{{ m }} <span>Mins</span></div>
            <div style="font-size: 30px; font-weight: bold; padding: 0 5px">
              :
            </div>
            <div class="pprTime">{{ s }} <span>Sec</span></div>
          </div>
        </div>
        <div class="ppContent">
          <div class="ppcTop">
            <div class="ppctF">2" Square Stickers</div>
            <div class="">Free 4-Day Shipping</div>
          </div>
          <div class="ppcBot">1000pcs = $26</div>
        </div>
        <div class="ppRight" @click="buyNow">BUY NOW >></div>
      </div>
      <div class="pMb" v-else>
        <div class="ppLeft">
          <div class="ppl">TIME</div>
          <div class="ppr">
            <div class="pprTime">{{ h }} <span>Hrs</span></div>
            <div style="font-size: 30px; font-weight: bold; padding: 0 5px">
              :
            </div>
            <div class="pprTime">{{ m }} <span>Mins</span></div>
            <div style="font-size: 30px; font-weight: bold; padding: 0 5px">
              :
            </div>
            <div class="pprTime">{{ s }} <span>Sec</span></div>
          </div>
        </div>
        <div class="pmBot">
          <div class="ppcTop">
            <div class="ppctF">2" Square Stickers</div>
            <div class="">Free 4-Day Shipping</div>
          </div>
          <div class="ppcBot">1000pcs = $26</div>
          <div class="pmbBuy" @click="buyNow">BUY NOW>></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getActivityCouponCodeByName } from "@/api/public";

export default {
  name: "activityBanner",
  data() {
    return {
      begin: null,
      canTap: true,
      activeTime: 0,
      activeText: "DAY",
      h: 0,
      m: 0,
      s: 0
    };
  },
  computed: {
    routeName() {
      return this.$route.name;
    }
  },
  watch: {
    // 活动
    routeName(val, oldVal) {
      clearInterval(this.begin);
      if (val == "index") {
        this.begin = setInterval(() => {
          this.countTime1();
        }, 1000);
      }
    }
  },
  methods: {
    countTime1() {
      //获取当前时间
      let date = new Date();
      let now = (this.now = date.getTime());
      //设置截止时间
      //ios safari兼容 不能用- 只能用/
      let endDate = new Date("2018/09/30 23:23:23");
      let end = endDate.getTime();
      //时间差
      let leftTime = end - now;
      if (leftTime <= 0) {
        clearInterval(this.begin);
        this.activeTime = 0;
        return false;
      } else {
        this.activeTime = 1;
      }
      //定义变量 d,h,m,s保存倒计时的时间
      if (leftTime >= 0) {
        // this.d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
        this.h = Math.floor(leftTime / 1000 / 60 / 60);
        this.m = Math.floor((leftTime / 1000 / 60) % 60);
        this.s = Math.floor((leftTime / 1000) % 60);
      }
    },
    // 点击get code跳转
    buyNow() {
      if (!this.canTap) {
        return false;
      }
      this.canTap = false;
      let postData = {
        title: "1000个无圆角方形贴纸活动"
      };
      getActivityCouponCodeByName(postData)
        .then(res => {
          if (res.data) {
            sessionStorage.setItem("cid", res.data);
            this.$router.push({
              name: "custom-stickers-cheap"
            });
          }
        })
        .then(res => {
          this.canTap = true;
        });
    }
  },
  mounted() {
    // 活动
    if (this.routeName == "index") {
      // 设置截止时间
      this.begin = setInterval(() => {
        this.countTime1();
      }, 1000);
    }
  }
};
</script>

<style scoped lang="scss">
@media screen and (min-width: 1201px) {
  .pHeder {
    height: 120px;
    background: url("../../assets/images/indexHeader/pc_bg.jpg") center center
      no-repeat;
    background-size: 100% 100%;
    display: flex;
    position: relative;
  }
  .ppLeft {
    margin-left: 2vw;

    .ppl {
      font-size: 30px;
      font-weight: bold;
      line-height: 80px;
      padding: 0 17px;
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
    }

    .ppr {
      margin-left: 3px;
      height: 80px;
      line-height: 80px;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
      padding: 0 15px;
      font-size: 24px;

      div {
        padding: 0 21px;
      }

      .pprTime {
        // padding: 0 25px;
        font-size: 35px;
        font-weight: bold;
        width: 82px;
        padding-top: 16px;
        padding-left: 18px;
        line-height: 28px;

        span {
          font-size: 20px;
          display: block;
          font-weight: 400;
        }
      }
    }
  }
  .ppContent {
    width: 550px;
    height: 110px;
    position: absolute;
    bottom: 0;
    right: 30vw;
    background: url("../../assets/images/indexHeader/mb_yh.jpg");

    .ppcTop {
      margin-top: 10px;

      div {
        width: 227px;
        line-height: 42px;
        font-size: 26px;
        font-weight: bold;
        border-radius: 4px;
      }

      .ppctF {
        margin-right: 15px;
      }
    }

    .ppcBot {
      font-size: 50px;
      line-height: 52px;
    }
  }
  .pPc {
    display: flex;
    width: 100%;
    align-items: center;
  }
  .ppRight {
    margin-left: auto;
    background: url("../../assets/images/indexHeader/pc_btn.png") center center;
    background-size: 100% 100%;
    color: #e42c22;
    font-size: 28px;
    font-weight: bold;
    height: 54px;
    line-height: 54px;
    width: 200px;
    text-align: center;
    cursor: pointer;
    margin-right: 10vw;
  }
}

@media screen and (max-width: 1200px) {
  .pHeder {
    height: 133px;
    background: url("../../assets/images/indexHeader/mb_bg.jpg") center center
      no-repeat;
    background-size: 100% 100%;

    .pMb {
      height: 100%;

      .ppLeft {
        margin-left: 2vw;

        .ppl {
          font-size: 16px;
          font-weight: bold;
          line-height: 45px;
          padding: 0 10px;
          border-top-left-radius: 5px;
          border-bottom-left-radius: 5px;
        }

        .ppr {
          margin-left: 3px;
          line-height: 45px;
          border-top-right-radius: 5px;
          border-bottom-right-radius: 5px;
          font-size: 16px;

          div {
            padding: 0 10px;
          }

          .pprTime {
            padding: 0 5px;
            font-size: 23px;
            line-height: 20px;
            height: 50px;
            font-weight: bold;
            padding-top: 7px;
            width: 68px;
            background-size: 100% 90%;

            span {
              font-size: 16px;
              display: block;
              font-weight: 400;
            }
          }
        }
      }

      .pmBot {
        background: url("../../assets/images/indexHeader/mb_yh.jpg") center
          center no-repeat;
        background-size: 100% 100%;
        width: 99vw;
        margin: 0 auto;
        height: 88px;
        text-align: center;

        .ppcTop {
          div {
            margin-top: 5px;
            width: 156px;
            line-height: 26px;
            font-size: 14px;
            font-weight: bold;
            border-radius: 4px;
            padding: 0 5px;
          }

          .ppctF {
            margin-right: 10px;
          }
        }

        .ppcBot {
          font-size: 22px;
          // line-height: 52px;
        }

        .pmbBuy {
          width: 190px;
          margin: 0 auto;
          color: #fff;
          background: url("../../assets/images/indexHeader/mb_btn.png") center
            center no-repeat;
          background-size: 100% 100%;
          font-size: 20px;
          lin-height: 24px;
        }
      }
    }
  }
  .footer {
    font-size: 1.4rem;
  }
}

.ppLeft {
  color: #fff;
  display: flex;
  align-items: center;

  .ppl {
    background: rgba(0, 0, 0, 0.3);
  }

  .ppr {
    display: flex;
    background: rgba(0, 0, 0, 0.3);

    div {
      padding: 0 21px;
    }

    .pprTime {
      font-weight: bold;
      background: url("../../assets/images/indexHeader/pc_time.png") center
        center no-repeat;
      background-size: 100%;
      text-align: center;
    }
  }
}

.ppContent {
  background-size: 100% 100%;
  text-align: center;
}

.ppcTop {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;

  div {
    background: linear-gradient(to top, #f9533d 0%, #d40e0d 100%);
  }
}

.ppcBot {
  font-weight: bolder;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-image: -webkit-linear-gradient(bottom, #e12605, #ec5c15, yellow);
}
</style>
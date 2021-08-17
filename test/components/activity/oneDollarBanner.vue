<template>
  <div class="banner banner1" v-show="one_dollar">
    <div class="container banner-text-wrap">
      <div class="banner-text">
        <div class="banner-wrap text-center">
            <span class="left_span" style="--mb: 28rem; --pc: 30px;"
            >LIMITED AVAILABLITY:</span
            >
          <span class="right_span" style="--mb: 28rem; --pc: 30px;"
          >GET 15 STICKERS FOR $1</span
          >
        </div>
        <div class="btnStyle1">
          <a
            href="https://www.customsticker.com/one-dollar-deal"
            title="One Dollar Deal"
            class="dollar_btn font-weight-bold font28-24 d-flex-center"
            style="color: #012378;"
          >GET IT NOW >></a>
        </div>
      </div>
    </div>
    <picture class="banner_pc">
      <source
        srcset="https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210805/pc_banner.png"
        media="(min-width: 1201px)"
      />
      <img
        class="banner-img"
        src="https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210805/pc_banner.png"
        title="Custom Labels"
        alt="Custom Labels"
      />
    </picture>
    <picture class="banner_mb">
      <source
        srcset="https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210805/mb_bj.png"
        media="(min-width: 1201px)"
      />
      <img
        class="banner-img"
        src="https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210805/mb_bj.png"
        title="Custom Labels"
        alt="Custom Labels"
      />
    </picture>
  </div>
</template>

<script>
export default {
  name: "oneDollarBanner",
  computed: {
    one_dollar() {
      let currentPage = this.$route.name;
      let pages = [
        "productName",
        "make-your-own",
        "make-your-own-stickers",
        "make-your-own-labels",
        "make-your-own-buttons",
        "about-us",
        "faq-help",
        "privacy-policy",
        "terms-and-conditions",
        "sponsorships",
        "contact-us",
        "index"
      ];
      return pages.includes(currentPage);
    }
  },
  data(){
    return{
    }
  }
}
</script>

<style lang="scss" scoped>
.banner1 {
  height: 45px;
  position: relative;
}

.banner-img {
  object-fit: cover;
  width: 1920px;
  height: 45px;
}

.container {
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
}

.banner-text-wrap {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  height: 100%;
}

.banner-text {
  position: relative;
  width: 40%;
  top: 1px;
  padding-left: 272px;
  text-align: left;
  white-space: nowrap !important;
}

.left_span {
  font-weight: 400;
  color: #ffffff;
}

.right_span {
  font-weight: 400;
  color: #fdff02;
  text-shadow: 0px 1px 2px #212b68;
}

.banner-wrap {
  display: inline-block;
}

.btnStyle1 {
  display: inline-block;
  padding-left: 50px;
}

.dollar_btn {
  width: 204px;
  height: 38px;
  margin-left: 3%;
  line-height: 38px;
  background: linear-gradient(179deg, #fff7a6, #efe433);
  /*box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.5), 0px 2px 2px 0px #FFFFFF, 0px 2px 2px 0px #FFFFFF;*/
  border-radius: 19px;
}

.banner_pc {
  display: block;
}

.banner_mb {
  display: none;
}
@media screen and (max-width: $breakpoint-sm-max) {
  .banner1 {
    @include px2rem(width, 750px);
    @include px2rem(height, 130px);
    position: relative;
  }

  .banner-img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }

  .container {
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
  }

  .banner-text-wrap {
    position: absolute;
    height: 100%;
  }

  .banner-text {
    position: absolute;
    width: 94%;
    top: 17%;
    left: 9.5%;
    display: flex;
    align-items: center;
    padding-left: 0;
  }

  .left_span {
    display: block;
  }

  .banner-wrap {
    display: inline-block;
  }

  .btnStyle1 {
    display: inline-block;
    padding-left: 4.5%;
  }

  .dollar_btn {
    @include px2rem(width, 264px);
    @include px2rem(height, 80px);
    background: linear-gradient(179deg, #fff7a6, #efe433);
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.5), 0px 2px 2px 0px #ffffff;
    border-radius: 40px;
  }

  .banner_mb {
    display: block;
  }

  .banner_pc {
    display: none;
  }
}

</style>

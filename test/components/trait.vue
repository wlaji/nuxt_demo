<template>
  <section class="traitWrap position-relative pt-3">
    <div class="d-none d-xl-block"></div>
    <div class="container cp">
      <div class="row pb-2 pb-xl-0">
        <div class="col-xl-2 col-4 trait-item">
          <div class="imgWrap">
            <img
              src="@/assets/images/@2x/trait/1.png"
              alt="Start with 1 pc"
              title="Start with 1 pc"
            />
          </div>

          <p class="title">
            Start with 1 pc
          </p>
          <p class="dec d-none d-xl-block">
            Custom Stickers No Minimum Quantity
          </p>
        </div>
        <div class="col-xl-2 col-4 trait-item">
          <div class="imgWrap">
            <img
              src="@/assets/images/@2x/trait/2.png"
              alt="Direct Deal"
              title="Direct Deal"
            />
          </div>

          <p class="title">
            Direct Deal
          </p>
          <p class="dec d-none d-xl-block">
            Custom Stickers Cheap & Quality Guarantee
          </p>
        </div>
        <div class="col-xl-2 col-4 trait-item">
          <div class="imgWrap">
            <img
              src="@/assets/images/@2x/trait/3.png"
              alt="Free Design"
              title="Free Design"
            />
          </div>

          <p class="title">
            Free Design
          </p>
          <p class="dec d-none d-xl-block">
            Professional artwork with unlimited revisions
          </p>
        </div>
        <div class="col-xl-2 col-4 trait-item">
          <div class="imgWrap">
            <img
              src="@/assets/images/@2x/trait/4.png"
              alt="Easy Creation"
              title="Easy Creation"
            />
          </div>

          <p class="title">
            Easy Creation
          </p>
          <p class="dec d-none d-xl-block">
            Friendly and all-round design tool is online
          </p>
        </div>
        <div class="col-xl-2 col-4 trait-item">
          <div class="imgWrap">
            <img
              src="@/assets/images/@2x/trait/5.png"
              alt="Free Shipping"
              title="Free Shipping"
            />
          </div>

          <p class="title">
            Free Shipping
          </p>
          <p class="dec d-none d-xl-block">
            FREE Shipping to US / CA / UK / AU etc.
          </p>
        </div>
        <div class="col-xl-2 col-4 trait-item">
          <div class="imgWrap">
            <img
              src="@/assets/images/@2x/trait/6.png"
              alt="Enjoyable Shopping"
              title="Enjoyable Shopping"
            />
          </div>

          <p class="title">
            Enjoyable Shopping
          </p>
          <p class="dec d-none d-xl-block">
            Worry-free returns, thoughtful service
          </p>
        </div>
      </div>
    </div>

    <div class="p-4 d-none d-xl-block">
      <a
        href="https://www.shopperapproved.com/reviews/customsticker.com"
        class="comment text-decoration-none text-dark"
        target="_blank"
      >
        <div class="d-flex-center mb-3 mb-xl-0">
          <b>Excellent</b>
          <div class="d-inline-block mx-1">
            <span class="xin align-middle" v-for="item in 5"></span>
          </div>
          {{ totalReviews }}+ reviews on
        </div>
        <div class="logo">
          <img
            src="@/assets/images/@2x/ShopperApproved-Logo_Color-TB.png"
            alt="shopper approved logo"
            title="shopper approved logo"
          />
        </div>
      </a>
    </div>
  </section>
</template>

<script>
export default {
  props: ["totalReviews"],
  data() {
    return {
      showTrait: false
    };
  },
  methods: {
    showMoreTrait() {
      this.showTrait = !this.showTrait;
    }
  }
};
</script>

<style lang="scss" scoped>
@media screen and (min-width: $breakpoint-xl-min) {
  .traitWrap {
    font-size: 18px;
    .trait-item{
      text-align: center;
    }
    .xin {
      margin: 0 1px;
      background: url("../assets/images/@2x/xing.png") center/cover no-repeat;
    }

    .title {
      font-size: 18px;
      margin-bottom: 10px;
      font-weight: 700;
    }

    .dec {
      font-size: 16px;
      color: #a1a3a4;
      word-break: break-word;
    }

    img {
      width: auto;
      height: 60px;
      margin-bottom: 10px;
    }

    .comment {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 18px;

      .xin {
        display: inline-block;
        width: 25px;
        height: 25px;
      }

      .logo {
        display: inline-block;
        width: 220px;
        height: 33px;
        margin: 0 10px;

        img {
          width: 220px;
          height: 33px;
          margin: 0;
        }
      }
    }
  }
}

@media screen and (max-width: $breakpoint-sm-max) {
  .traitWrap {
    .trait-item{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      @include px2rem(margin-bottom, 20px);
      .title {
        @include px2rem(font-size, 24px);
        white-space: nowrap;
      }
    }
    .imgWrap {
      display: flex;
      justify-content: center;
      align-items: center;
      @include px2rem(width, 100px);
      @include px2rem(height, 100px);
    }
  }
}
</style>

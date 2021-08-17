<template>
  <div style="position: absolute;top:0;right:0;left:0;bottom:0">
    <div class="block-404 position-relative">
      <div class="imgWrap">
        <picture>
          <source
            srcset="https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210702/图层-75.png"
            media="(min-width: 1201px)"
          />
          <source
            srcset="https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210702/图层-73.png"
            media="(max-width: 1200px)"
          />
          <img
            class="banner-img"
            src="https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210702/图层-75.png"
            title="Customsticker.com--404 page"
            alt="Customsticker.com--404 page"
          />
        </picture>
      </div>
      <div class="desc">
        <p class="text-white">
          The page you are looking for might have been removed,<br
            class="d-none d-xl-block"
          />
          had its name changed, or temporality unavailable.
        </p>
        <div class="mt-4">
          <a href="/" class="home-btn" title="Go to Homepage">Go Back Home</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["error"],
  layout: "errorLayout",
  methods: {
    goHome() {
      this.$router.push("/");
    }
  }
};
</script>
<style lang="scss" scoped>
.block-no-results,
.block-404 {
  width: 100%;
  height: 100%;
}

.imgWrap {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;

  img {
    object-fit: cover;
    width: 100%;
    height: 707px;
  }
}

.desc {
  position: absolute;
  @include px2rem(right, 500px);
  bottom: 57px;

  p {
    font-size: 36px;
  }
}

.home-btn {
  display: inline-block;
  width: 333px;
  height: 81px;
  line-height: 81px;
  background: #ffffff;
  border-radius: 41px;
  color: #82baef;
  text-align: center;
  font-size: 40px;
  text-decoration: none;
  font-weight: 700;
}

@media screen and (max-width: 1200px) {
  .block-no-results,
  .block-404 {
    position: absolute !important;
    left: 0;
    right: 0;
    top: auto;
    bottom: 0;
    @include px2rem(height, 1086px);
  }
  .imgWrap {
    position: relative;
    width: 100%;
    height: 100%;

    img {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }

  .desc {
    @include px2rem(width, 622px);
    left: 50%;
    right: auto;
    transform: translateX(-50%);
    @include px2rem(bottom, 62px);
    text-align: center;

    p {
      @include px2rem(font-size, 32px);
      text-align: center;
    }
  }

  .home-btn {
    display: inline-block;
    @include px2rem(width, 416px);
    @include px2rem(height, 81px);
    @include px2rem(line-height, 81px);
    @include px2rem(border-radius, 41px);
    @include px2rem(font-size, 40px);
  }
}
</style>
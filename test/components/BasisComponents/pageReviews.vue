<template>
  <div class="py-4 f3 pagereviews" :class="{ 'bg-default': isBgDefault }">
    <div class="container">
      <div>
        <h2 class="text-center">
          Customer Reviews
        </h2>
      </div>
      <div class="mt-3 static-part5-star">
        <div class="d-flex-center star-display">
          <img
            src="https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210610/Decals_Star-1.png"
            alt="Star Rating"
            title="Star Rating"
            v-for="num in 5"
          />
        </div>
      </div>
      <div class="mt-3 text-center" style="--mb:36rem;--pc:18px">
        <span
          >{{ title.average_rating.toFixed(2) }}/5 average from
          {{ title.total_reviews }} reviews, <br class="d-xl-none" />see our
        </span>
        <a
          target="_blank"
          href="https://www.shopperapproved.com/reviews/customsticker.com"
          title="customer reviews"
          class="font-weight-bold"
          style="text-decoration: underline"
          >Customer reviews</a
        >
      </div>
      <div class="row mt-4 review-content">
        <div
          class="col-12 col-xl-4 mb-3 mb-xl-0"
          v-for="(value, key, index) in data.data"
        >
          <div
            class="p-3 h-100 d-flex flex-column justify-content-between"
            :class="isBgDefault?'bg-white':'bg-default'"
          >
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <span style="--mb:32rem;--pc:18px;color:#1D2F3A">{{
                  value.display_name
                }}</span>
                <div class="review-star mt-3">
                  <img
                    src="https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210610/Decals_Star-1.png"
                    alt="Star Rating"
                    title="Star Rating"
                    v-for="num in 5"
                  />
                </div>
              </div>
              <div class="profile">
                <img
                  src="https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210610/Decals_Customer-1.png"
                  alt="Customer 1"
                  title="Customer 1"
                />
              </div>
            </div>
            <div class="flex-1 py-4">
              <h3 class="text-left" style="--mb:32rem;--pc:24px">
                <!--                {{value.product_category_name}}-->Custom
                Stickers
              </h3>
              <p class="text-left" style="--mb:32rem;--pc:18px;color:#666">
                {{ value.comments }}
              </p>
            </div>
            <p style="color:#666">
              <!--              April 13, 2021-->{{ value.review_date }}
            </p>
          </div>
        </div>
        <div class="mt-4 view-style">
          <a
            target="_blank"
            title="custom sticker review"
            href="https://www.shopperapproved.com/reviews/customsticker.com"
            style="color:#3A74D6;width:100%;height:100%;"
            class="d-flex-center"
            >View More &gt;&gt;</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "pageReviews",
  data() {
    return {
      isBgDefault: true
    };
  },
  props: ["data", "title"],
  methods: {
    setBgcolor() {
      let article = Array.from(document.getElementsByTagName("article"));
      if (!article.length) {
        return false;
      }
      try {
        const LastArticle = article[article.length - 1];
        let LastArticleFirstChild = LastArticle.firstChild
        if (LastArticleFirstChild.classList.contains('bg-default')) {
          this.isBgDefault = false;
        } else {
          this.isBgDefault = true;
        }
      } catch (e) {
        console.log("html结构错误");
      }
    }
  },
  mounted() {
    this.setBgcolor();
  }
};
</script>

<style lang="scss" scoped>
.f3 {
  .static-part5-star .star-display img {
    width: 32px;
    height: 31px;
    @media screen and (max-width: $breakpoint-sm-max) {
      @include px2rem(width, 64px);
      @include px2rem(height, 62px);
      @include px2rem(margin-right, 5px);
    }
  }

  .review-content .review-star img {
    width: 20px;
    height: 19px;
    @media screen and (max-width: $breakpoint-sm-max) {
      @include px2rem(width, 55px);
      @include px2rem(height, 54px);
      @include px2rem(margin-right, 5px);
    }
  }

  .profile {
    width: 60px;
    height: 60px;
    @media screen and (max-width: $breakpoint-sm-max) {
      @include px2rem(width, 115px);
      @include px2rem(height, 115px);
    }

    img {
      width: 100%;
      height: 100%;
    }
  }
}

.view-style {
  width: 183px;
  height: 59px;
  margin: 0 auto;
  background: #ffffff;
  border: 2px solid #3a74d6;
  border-radius: 5px;
  cursor: pointer;

  a {
    font-size: 24px;
    font-weight: 700;
    text-decoration: none;
  }

  @media screen and (max-width: $breakpoint-sm-max) {
    border: 4px solid #3a74d6;
    @include px2rem(border-width, 4px);
    @include px2rem(width, 285px);
    @include px2rem(height, 77px);
    a {
      @include px2rem(font-size, 32px);
    }
  }
}
</style>

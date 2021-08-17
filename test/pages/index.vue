<template>
  <div class="home-wrap">
    <section v-html="fwbHtml" class="secion"></section>

    <trait :totalReviews="totalReviews"></trait>
    <section
      v-for="item in rowData"
      :key="item.id"
      v-html="item.row"
      v-lazy-container
    ></section>
    <faq></faq>
    <pageReviews :data="reviewsData" :title="reviewsTitle"></pageReviews>
  </div>
</template>

<script>
import {
  getPageInfo,
  getSiteReviews,
  getSiteReviewInfo,
  getSubProduct
} from '@/api/public'
import trait from "@/components/trait";
import faq from "@/components/faq";
import {hotjar} from "@/static/js/hotjar.js"
import pageReviews from "@/components/BasisComponents/pageReviews.vue";
export default {
  async asyncData({error}) {
    try {
      let { data } = await getPageInfo({
        pageName: "home",
      });
      //产品列表
      let reviewsData = await getSiteReviews({
        page:'1',
        pageCount:'3',
        rating:'5'
      });
      let reviewsTitle = await getSiteReviewInfo();
      reviewsData = reviewsData.data
      reviewsTitle = reviewsTitle.data
      let { banner, banner_phone , rowData, title, description, keyword, structuring } = data;
      return {
        banner: banner,
        banner_phone:banner_phone,
        rowData: rowData,
        seoTitle: title,
        seoDescription: description,
        seoKeyword: keyword,
        structuring,
        reviewsData:reviewsData,
        reviewsTitle:reviewsTitle,
        totalReviews:reviewsTitle.total_reviews
      };
    } catch (err) {
      error({
        statusCode: 404,
      });
    }
  },
  head() {
    return {
      title: this.seoTitle,
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.seoDescription,
        },
        {
          hid: "keywords",
          name: "keywords",
          content: this.seoKeyword,
        },
        {
          hid: "google-site-verification",
          name: "google-site-verification",
          content: "tzkz32YFkUVUQpjIXX1xoRMV4MpFz4TLSCXjmrFABaQ",
        },
      ],
      script: this.structuring?[
        {
          type: "application/ld+json",
          innerHTML: this.structuring,
        },
      ]:[],
    };
  },
  filters: {
    addTitle(val) {
      let title = "";
      switch (val) {
        case 0:
          title = "custom stickers cheap";
          break;
        case 1:
          title = "custom sticker labels";
          break;
        case 2:
          title = "Custom Buttons";
          break;
        case 3:
          title = "Custom Magnets";
          break;
        case 4:
          title = "Wall Graphices";
          break;
      }
      return title;
    },
    formatFirstCategoryName(str) {
      let newStr = str.toLowerCase();
      newStr = newStr.replace(/(^\s*)|(\s*$)/g, "");
      newStr = newStr.replace(/\s+/g, "-");
      return newStr.charAt(0).toUpperCase() + newStr.slice(1);
    },
  },
  computed: {
    productList() {
      return this.$store.state.headInfo.menu;
    },
    fwbHtml() {
      if (
        this.$store.state.device.type === "pc" ||
        (process.client && document.documentElement.clientWidth > 1200)
      ) {
        return this.banner;
      } else {
        return this.banner_phone;
      }
    },
  },
  data() {
    return {};
  },
  components: {
    trait,
    faq,
    pageReviews
  },
  methods: {
    appendTag(tagName, property) {
      let tag = document.createElement(tagName);
      for (let i in property) {
        tag[i] = property[i];
      }
      document.getElementsByTagName("head")[0].appendChild(tag);
    },
  },
  mounted() {
    if(document.getElementById("reviews")){
      let rHtml = document.getElementById("reviews")
      rHtml.innerHTML = this.totalReviews
    }
    hotjar()
    this.$nextTick(() => {
      if(document.getElementById("customNow")){
        document.getElementById("customNow").addEventListener(
        "click",
        () => {
          sessionStorage.setItem("customNow", 1);
          this.$router.push("/Custom-stickers");
        },
        true
      );
      }
    });
  },
};
</script>

<style lang="scss" scoped>
@import "assets/css/fwb/home";
.secion /deep/{
  .banner-description{
  @include px2rem(font-size, 32px);
  color: #333333;
}

#mbH1{
  color: #333;
  @include px2rem(margin-top, 32px);
}
.comment {
    
    @include px2rem(font-size, 32px!important);
    display: block !important;
    border: 0 !important;
    width: 100%!important;
    background: 0!important;
    margin-top: 0!important;
    .xin {
      display: inline-block;
      @include px2rem(width, 40px);
      @include px2rem(height, 40px);
      margin: 0 1px;
      background: url("../assets/images/@2x/xing.png") center/cover no-repeat;
    }

    .logo {
      @include px2rem(width, 421px);
      @include px2rem(height, 63px);
      margin: 0 auto;
      @include px2rem(margin-top, -10px);
      img {
        @include px2rem(width, 421px);
        @include px2rem(height, 63px);
      }
    }
  }
  @media screen and (max-width:1200px) {
  .hidden-lg{
    display: block;
    text-align: center;
    margin-top: 10px;
  }
  .banner-btn{
    margin: 20px auto 10px;
    @include px2rem(width, 290px);
    @include px2rem(height, 75px);
    @include px2rem(border-radius, 38px);
    border: 3px solid #1296DB;
    // border: 0;
    @include px2rem(font-size, 28px);
    font-weight: bold;
    a:hover{
      text-decoration: none !important;;
    }
    a{
      margin-top: 0 !important;
    }
  }
}
@media screen and (min-width:1200px) {
  .hidden-lg{
    display: none;
  }
  
}
}


</style>

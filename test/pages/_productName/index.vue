<template>
  <div id="mainBodyCategory">
    <div class="position-relative">
      <!--    banner图-->
      <banner :banner-html="{ pcHtml: banner, mbHtml: banner_phone}" :totalReviews="totalReviews" class="pBanner"></banner>

      <!--    价格列表,只有小类页面展示 type =0 代表小类 1 代表大类-->
      <priceList
        v-if="Type === 0"
        class="priceList"
        @getProductConfig="getProductConfig"
      ></priceList>
    </div>
    <trait :totalReviews="totalReviews"></trait>

    <!--    分类列表 只有大类页面展示-->
    <category
      v-if="Type === 1"
      :category="category"
      :productName="productName"
    ></category>
    <!--    富文本内容-->
    <categoryFwb :rowData="rowData"></categoryFwb>
    <pageReviews :data="reviewsData" :title="reviewsTitle"></pageReviews>
  </div>
</template>

<script>
import banner from "@/components/BasisComponents/banner";
import trait from "@/components/trait";
import category from "@/components/productList/productListStyle_A";
import priceList from "@/components/priceList";
import categoryFwb from "@/components/BasisComponents/category-fwb";
import { getPageInfo, getSubProduct ,getSiteReviews, getSiteReviewInfo} from "@/api/public";
import { hotjar } from "@/static/js/hotjar.js";
import pageReviews from "@/components/BasisComponents/pageReviews.vue";
export default {
  async asyncData({ params, app, error }) {
    try {
      const cateName = app.$utils.decodeName(params.productName);
      const relHrefName = app.$utils.formatFirstCategoryName(
        params.productName
      );
      const { data } = await getPageInfo({
        pageName: cateName,
      });
      //产品列表
      const info = await getSubProduct({
        product_category_name: cateName,
      });
      let reviewsData = await getSiteReviews({
        page:'1',
        pageCount:'3',
        rating:'5'
      });
      let reviewsTitle = await getSiteReviewInfo();
      let type = info.data.length ? 1 : 0;
      reviewsData = reviewsData.data
      reviewsTitle = reviewsTitle.data
      return {
        rowData: data.rowData,
        productName: cateName,
        relHrefName: relHrefName,
        category: info.data,
        banner: data.banner,
        banner_phone: data.banner_phone,
        pageContent: data.page_row,
        seoTitle: data.title,
        seoDescription: data.description,
        seoKeyWord: data.keyword,
        structuring: data.structuring,
        productId: data.product_category_id,
        Type: type, //用来判断样式 0则表示显示二级分类的样式 1显示1级分类的
        reviewsData:reviewsData,
        reviewsTitle:reviewsTitle,
        totalReviews:reviewsTitle.total_reviews
      };
    } catch {
      error({
        statusCode: 404,
      });
    }
  },
  head() {
    return {
      title: this.seoTitle,
      link: [
        {
          rel: "canonical",
          href: `https://www.customsticker.com/${this.relHrefName}`,
        },
      ],
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.seoDescription,
        },
        {
          hid: "keywords",
          name: "keywords",
          content: this.seoKeyWord,
        },
      ],
      script: this.structuring
        ? [
            {
              type: "application/ld+json",
              innerHTML: this.structuring,
            },
          ]
        : [],
    };
  },
  data() {
    return {
      productPicPath: "",
    };
  },
  components: {
    banner,
    category,
    priceList,
    categoryFwb,
    trait,
    pageReviews
  },
  methods: {
    getProductConfig(data) {
      this.productPicPath = data.pic_path;
    },
  },
  mounted() {
    if (
      this.$route.path === "/Die-cut-stickers" ||
      this.$route.path === "/Custom-stickers"
    ) {
      hotjar();
    }
    setTimeout(() => {
      // 首页banner点击过来时自动滚动到分类组件
      if (sessionStorage.getItem("customNow") == 1) {
        sessionStorage.removeItem("customNow");
        // this.$utils.scrollToElement(document.getElementById('product'))
      }
      //没有价格的分类点击button直接去询盘
      if (document.getElementById("nextBtn")) {
        document
          .getElementById("nextBtn")
          .addEventListener("click", (event) => {
            let params = this.$route.params;
            let cateName = params.productName;
            this.$store.commit("ADD_INQUIRY", {
              product_category_id: this.productId,
              product_cate_name: this.$utils.decodeName(cateName),
              param_id_list: "",
              pic_path: this.productPicPath,
            });
            this.$router.push({
              path: "/inquiry",
            });
          });
      }
    }, 100);
  },
};
</script>

<style lang="scss" scoped>
.pBanner /deep/{
  .position-absolute{
  left: 0;
  right: 0
}
.banner-description{
  @include px2rem(font-size, 32px);
  color: #333333;
}
.banner-btn{
  margin: 20px auto 10px;
  @include px2rem(width, 320px);
  @include px2rem(height, 80px);
  border: 3px solid #1296DB;
  border-radius: 40px;
  @include px2rem(font-size, 28px);
  font-weight: bold;
  a:hover{
    text-decoration: none !important;;
  }
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
      background: url("../../assets/images/@2x/xing.png") center/cover no-repeat;
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
  .aStyle2{
    text-decoration: none;
    border-radius: 4px;
    background: linear-gradient(0deg, #eb4905 0%, #ffa647 100%);
    color: white;
    width: fit-content;
    font-size: 0.32rem;
    margin: 0 auto;
  }
}
@media screen and (min-width:1200px) {
  .hidden-lg{
    display: none;
  }
}
}


</style>

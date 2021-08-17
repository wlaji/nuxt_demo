<template>
  <div class="makeYourOwnwrap">
    <!--    banner图-->
    <banner :banner-html="{ pcHtml: banner, mbHtml: banner_phone }"></banner>
    <section v-lazy-container>
      <article
        v-for="item in rowData"
        :key="item.id"
        v-html="item.row"
      ></article>
    </section>
    <videoYtb
      videoUrl="https://www.youtube.com/embed/uoxu-4430Zg"
      width="1920"
      height="937"
      :visible.sync="isShowVideo"
    ></videoYtb>
  </div>
</template>

<script>
import videoYtb from "@/components/video-ytb";
import banner from "@/components/BasisComponents/banner";
import { getPageInfo } from "@/api/public";

export default {
  async asyncData({ app, query }) {
    let { data } = await getPageInfo({
      pageName: "Make Your Own Buttons",
    });
    return {
      banner: data.banner,
      banner_phone: data.banner_phone,
      seoTitle: data.title,
      rowData: data.rowData,
      seoDescription: data.description,
      seoKeyword: data.keyword,
      structuring: data.structuring,
    };
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
      ],
      script: this.structuring?[
        {
          type: "application/ld+json",
          innerHTML: this.structuring,
        },
      ]:[],
    };
  },
  computed: {
    productList() {
      return this.$store.state.headInfo.menu;
    },
  },
  components: {
    videoYtb,
    banner
  },
  data() {
    return {
      activeInd: 0,
      showNum: 7,
      activeName: "all",
      isShowVideo: false,
    };
  },
  methods: {
    initVideo() {
      this.isShowVideo = true;
    },
    jumpToCategoryPage(name) {
      this.$router.push({
        name: "productName",
        params: {
          productName: this.$utils.formatFirstCategoryName(name),
        },
      });
    },
    beginDesign() {
      this.$utils.scrollToElement(document.getElementById("startDesign"));
    },
  },
  created() {
    console.log(this.rowData);
  },
  mounted() {
    this.$nextTick(() => {
      document.getElementById("videoStickers").addEventListener("click", () => {
        this.initVideo();
      });
      document.getElementById("getStart").addEventListener("click", () => {
        this.beginDesign();
      });
    });
  },
};
</script>

<style lang="scss" scoped>
.makeYourOwnwrap /deep/ {
  p {
    line-height: 1.5em;
  }
  img {
    object-fit: contain;
  }

  .part1 {
    .part1-left {
      &:hover {
        svg {
          color: #1296db;
        }
      }
    }
    .video-button {
      right: 20%;
      bottom: 20%;
      background-color: #ffffff;

      svg {
        font-size: 60px;
        color: #000000;
      }
    }
  }

  .part1-right{
    h2{
      @media screen and (max-width: $breakpoint-sm-max) {
        text-align: center;
      }
    }
    .btn_start{
      @media screen and (max-width: $breakpoint-sm-max) {
        display: flex;
        justify-content: center;
      }
    }
  }

  .own-part1 {
    ul {
      li {
        display: flex;
        flex-direction: column;

        .circle-img-wrap {
          @include px2rem(width, 160px);
          @include px2rem(height, 160px);
          @media screen and (min-width: $breakpoint-xl-min) {
            width: 80px;
            height: 80px;
          }
          background-color: #eee;
          border-radius: 50%;
          padding: 15px;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }

      li > div:nth-child(1) {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      li > div:nth-child(2) {
        position: relative;
        margin-top: 20px;
      }

      li > div:nth-child(2)::before {
        content: "";
        position: absolute;
        height: 4px;
        background-color: #f3f3f3;
        right: 0;
        top: -4px;
        width: 50%;
      }

      li > div:nth-child(2)::after {
        content: "";
        position: absolute;
        width: 4px;
        background-color: #f3f3f3;
        right: -4px;
        top: -4px;
        height: 50%;
      }

      .circle {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translate(50%, -50%);
        width: 20px;
        height: 20px;
        border-radius: 50%;
        z-index: 100;
      }
    }

    ul li:nth-child(1) .circle-img-wrap,
    ul li:nth-child(1) .circle {
      background-color: #fdc6a2;
    }

    ul li:nth-child(2) .circle-img-wrap,
    ul li:nth-child(2) .circle {
      background-color: #f16b6b;
    }

    ul li:nth-child(3) .circle-img-wrap,
    ul:nth-child(3) .circle {
      background-color: #8bce00;
    }

    ul li:nth-child(4) .circle-img-wrap,
    ul li:nth-child(4) .circle {
      background-color: #00a3c6;
    }

    ul li:nth-child(1) h3 {
      color: #fdc6a2;
    }

    ul li:nth-child(2) h3 {
      color: #f16b6b;
    }

    ul li:nth-child(3) h3 {
      color: #8bce00;
    }

    ul li:nth-child(4) h3 {
      color: #00a3c6;
    }

    ul > div:nth-child(2) {
      flex: 1;
    }
  }

  .part3 {
    img {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4), 0 0 6px rgba(0, 0, 0, 0.04);
    }
    h3 {
      margin-top: 10px;
    }
    .part3-col:hover {
      color: $primary;
      cursor: pointer;
      border-radius: 5px;
    }
  }

  .title-h2 {
    background-color: #1296db;
    color: #ffffff;
    font-family: Calibri;
    font-size: 36px;
  }

  .part5 {
    .top-line {
      padding-bottom: 50px;
      border-top: 4px solid #1296db;
      background-color: hsla(0, 0%, 100%, 0.5);
    }

    .relative-bg {
      position: relative;
      @media screen and (min-width: $breakpoint-xl-min) {
        height: 432px;
      }
    }

    .absolute-bottom {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      @media screen and (max-width: $breakpoint-sm-max) {
        top: 100%;
      }
    }

    li .circle-img-wrap {
      @include px2rem(width, 160px);
      @include px2rem(height, 160px);
      @media screen and (min-width: $breakpoint-xl-min) {
        width: 80px;
        height: 80px;
      }
      background-color: #eee;
      border-radius: 50%;
      padding: 15px;
    }

    .own-part4-content ul {
      position: relative;
      margin-top: -60px;
      @media screen and (max-width: $breakpoint-sm-max) {
        margin-top: 50%;
      }
    }
  }

  .part6-content {
    .list-item {
      position: relative;

      & > div {
        position: relative;
        border-radius: 20px;
        background-color: #dff2fd;
        padding-top: 105px !important;
      }

      &:nth-child(1) .item-banner {
        background-color: #249cef;

        &::before {
          border-color: transparent #249cef transparent transparent;
        }
      }

      &:nth-child(2) .item-banner {
        background-color: #485868;

        &::before {
          border-color: transparent #485868 transparent transparent;
        }
      }

      &:nth-child(3) .item-banner {
        background-color: #89c24c;

        &::before {
          border-color: transparent #89c24c transparent transparent;
        }
      }
    }

    .item-banner {
      position: absolute;
      left: 0;
      top: 30px;
      right: 0;
      height: 60px;
      background-color: #ccc;

      h3 {
        height: 100%;
        line-height: 60px;
        color: #fff;
      }

      &::before {
        content: "";
        position: absolute;
        left: -60px;
        width: 0;
        height: 0;
        border: 30px solid;
        border-color: transparent #eee transparent transparent;
      }

      @media screen and (max-width: $breakpoint-sm-max) {
        h3 {
          text-align: center;
        }
        &::before {
          display: none;
        }
      }
    }
  }

  .faq-part {
    background: url("https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20201216/26a1011518a74b040cea7ec9bd9b07a0.png")
      100% 100%/18% no-repeat;
  }

  .part7 {
    .item-banner {
      position: absolute;
      top: 50px;
      right: 0;
      width: 296px;
      height: 60px;
      background-color: #ccc;
    }

    .item-banner:before {
      content: "";
      position: absolute;
      left: -60px;
      width: 0;
      height: 0;
      border: 30px solid transparent;
      border-right-color: #eee;
    }

    .part7-item {
      position: relative;
      width: 252px;
      height: 342px;
      border-radius: 20px;
      padding: 150px 5px 20px;
      margin: 40px;
      background-color: #dff2fd;
    }

    .part7-item:nth-child(1) .item-banner {
      background-color: #249cef;
    }

    .part7-item:nth-child(2) .item-banner {
      background-color: #485868;
    }

    .part7-item:nth-child(3) .item-banner {
      background-color: #89c24c;
    }

    .part7-item:first-child .item-banner:before {
      border-color: transparent #249cef transparent transparent;
    }
    .part7-item:nth-child(2) .item-banner:before {
      border-color: transparent #485868 transparent transparent;
    }
    .part7-item:nth-child(3) .item-banner:before {
      border-color: transparent #89c24c transparent transparent;
    }
  }

  .part7-content {
    overflow: hidden;
    position: relative;
    height: 500px;
    background: url("https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210303/457a662.jpg")
    left center/50% 100% no-repeat;
    @media screen and (max-width: $breakpoint-sm-max) {
      height: 300px;
    }
    .part7-text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: absolute;
      right: 0;
      top: 0;
      width: 50%;
      height: 100%;
      @media screen and (max-width: $breakpoint-sm-max) {
        left: 0;
        width: 100%;
      }
    }

    .part7-text-wrap {
      position: absolute;
      right: 0;
      top: 0;
      width: 50%;
      height: 100%;
      background-color: #797979;

      &::before {
        content: "";
        position: absolute;
        left: -300px;
        top: 50%;
        transform: translateY(-25%);
        border-width: 300px 150px;
        border-style: solid;
        border-color: transparent #797979 transparent transparent;
      }

      @media screen and (max-width: $breakpoint-sm-max) {
        left: 0;
        right: 0;
        width: 100%;
      }
    }
  }


  .part8 {
    @media screen and (max-width: 768px) {
      .container{
        padding: 0 !important;
      }
      .part8-content {
        background: none;
      }
      .part8-item {
        position: relative;
        width: 100%;
        height: 100%;
        padding: 20px;

      }
    }
    @media screen and (min-width: 768px) {
      .part8_container{
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
        margin-right: auto;
        margin-left: auto;
      }
      .part8-content {
        background: url("https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210723/Customize-Your-Own-Buttons-PC.jpg")
        no-repeat -65px 0;
      }

      .part8-item {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        position: absolute;
        right: 0;
        top: 0;
        width: 35%;
        height: 100%;
        padding: 30px 20px 30px 0;
        background-color: #9fc4d7;
      }

      .part8-item:before {
        content: "";
        position: absolute;
        left: -300px;
        top: 50%;
        -webkit-transform: translateY(-25%);
        transform: translateY(-25%);
        border-color: transparent #9fc4d7 transparent transparent;
        border-style: solid;
        border-width: 300px 150px;
      }
    }

    .part8-content {
      overflow: hidden;
      position: relative;
      height: 300px;
      @media screen and (max-width: $breakpoint-sm-max) {
        background: url("https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210723/Customize-Your-Own-Buttons-MB.jpg") 0/100% 100% no-repeat;
      }
    }

    .btn {
      width: 60%;
      display: inline-block;
      font-weight: 400;
      cursor: pointer;
      border: 1px solid transparent;
      padding: 6px 12px;
      border-radius: 30px;
      background-color: #fff;
      font: 600 18px Calibri;
      color: #1296db;
      margin: 0 auto;
    }

    .btn:hover {
      background-color: #1296db;
      color: #fff;
      text-decoration: none;
    }
  }
}
</style>

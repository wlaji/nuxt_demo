<template>
  <div class="makeYourOwnLabelsWrap">
    <!--    banner图-->
    <banner :banner-html="{ pcHtml: banner, mbHtml: banner_phone }"></banner>
    <div class="content">
      <article
        v-for="item in rowData"
        :key="item.id"
        v-html="item.row"
      ></article>
    </div>
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
      pageName: "Make Your Own Labels",
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
  data() {
    return {
      tempInd: -1,
      modalVideo: false,
      activeName: "all",
      isShowVideo: false,
    };
  },
  components: {
    videoYtb,
    banner
  },
  methods: {
    initVideo() {
      this.isShowVideo = true;
    },
    beginDesign() {
      this.$utils.scrollToElement(document.getElementById("startDesign"));
    },
  },
  created() {},
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
.makeYourOwnLabelsWrap /deep/ {
  p {
    line-height: 1.5em;
  }
  .cls-1 {
    fill: #fff;
  }

  .myBtn {
    font-size: 18px;
    font-weight: bold;
  }

  .part1-left:hover .video-button svg {
    fill: #1296db;
  }
  .part1-right{
    .btn_start{
      @media screen and (max-width: $breakpoint-sm-max) {
        display: flex;
        justify-content: center;
      }
    }
  }

  .s-btn {
    color: #fff;
    padding: 8px 30px;
    border-radius: 4px;
    background-color: #1296db;
    transition: all 200ms ease-in;
  }

  .s-btn:hover {
    background-color: saturate(#1296db, 50%);
  }

  .content {
    background-color: #ffffff;

    .own-part {
      .own-part-content {
        width: 1170px;
        margin: 0 auto;
        padding: 40px 0;
      }

      .small-title {
        width: 60%;
        margin: 0 auto;
        text-align: center;
      }

      @media screen and (max-width: $breakpoint-sm-max) {
        .small-title {
          width: 100%;
        }
      }
    }

    .own-part1-content {
      ul {
        li {
          display: flex;
          flex-direction: column;

          .circle-img-wrap {
            width: 80px;
            height: 80px;
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

    .own-part2-content {
      ul {
        background-color: #1296db;
        color: #fff;
      }
    }

    .own-part3-content {
      ul {
        li {
          display: flex;
          flex-direction: column;
          align-items: center;

          .img-wrap {
            @include px2rem(width, 370px);
            @include px2rem(height, 350px);
            @media screen and (min-width: $breakpoint-xl-min) {
              width: 370px;
              height: 350px;
            }
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
          margin-top: 20px;
        }

        li > div:nth-child(2) {
          flex: 1;
        }
      }
    }

    .own-part4-content {
      .banner-text {
        padding-bottom: 50px;
        border-top: 4px solid #1296db;
        background-color: rgba(255, 255, 255, 0.5);
      }
      .img_pc{
        display: block;
        @media screen and (max-width: $breakpoint-sm-max) {
          display: none;
        }
      }

      .img_mb{
        display: none;
        @media screen and (max-width: $breakpoint-sm-max) {
          display: block;
        }
      }

      ul {
        position: relative;
        margin-top: -60px;

        li {
          display: flex;
          flex-direction: column;
          align-items: center;

          .circle-img-wrap {
            width: 80px;
            height: 80px;
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
          flex: 1;
        }
      }
    }

    .own-part4-content > div > img {
      @media screen and (max-width: $breakpoint-sm-max) {
        height: 300px !important;
      }
    }

    .faq-part {
      // background: #fff url('../static/images/buttons/Faq.png') right bottom/18%
      //   no-repeat;
    }

    .faq-part-content {
      .line {
        margin: 10px auto;
        width: 20%;
        height: 5px;
        background-color: #1296db;
      }

      ul {
        li {
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 10px;
          box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.25);
          margin-bottom: 10px;
          background-color: #fff;

          h3 {
            font-size: 16px;
          }

          p:first-child {
            font-weight: 700;
          }

          p:last-child {
            margin-top: 10px;
          }
        }

        li:last-child {
          margin-bottom: 0;
        }
      }
    }

    .own-part5-content {
      .own-part5-item {
        position: relative;
        height: 380px;
      }

      .own-part5-item > div {
        background-color: #dff2fd;
        height: 100%;
        border-radius: 20px;
      }

      .own-part5-item > div div:nth-child(2) p {
        padding-top: 13rem;
      }

      .own-part5-item:nth-child(1) .item-banner {
        background-color: #249cef;
      }

      .own-part5-item:nth-child(1) .item-banner::before {
        border-color: transparent #249cef transparent transparent;
      }

      .own-part5-item:nth-child(2) .item-banner {
        background-color: #485868;
      }

      .own-part5-item:nth-child(2) .item-banner::before {
        border-color: transparent #485868 transparent transparent;
      }

      .own-part5-item:nth-child(3) .item-banner {
        background-color: #89c24c;
      }

      .own-part5-item:nth-child(3) .item-banner::before {
        border-color: transparent #89c24c transparent transparent;
      }

      .item-banner {
        position: absolute;
        top: 50px;
        right: 4%;
        width: 90%;
        height: 60px;
        background-color: #ccc;

        h3 {
          height: 100%;
          line-height: 60px;
          color: #fff;
        }
      }

      .item-banner::before {
        content: "";
        position: absolute;
        left: -60px;
        width: 0;
        height: 0;
        border: 30px solid;
        border-color: transparent #eee transparent transparent;
      }

      @media screen and (max-width: $breakpoint-sm-max) {
        .own-part5-item {
          margin: 10px;
          height: 280px !important;
        }
      }
    }

    .own-part6 {
      margin: 0;
      @media screen and (max-width: $breakpoint-sm-max) {
        background-image: none !important;
        padding: 10% 0;
      }
    }

    .own-part6-content {
      height: 350px;
      display: flex;
      justify-content: center;
      align-content: center;
      overflow: hidden;
      position: relative;

      .part6-text-wrap {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        width: 50%;
      }
    }

    @media screen and (max-width: $breakpoint-sm-max) {
      .own-part6-content {
        background: none;
        height: 250px;
        .part6-text-wrap {
          width: 100%;
        }
      }
    }

    .blog-part-content {
      h2 {
        text-align: center;
        color: #1296db;
      }

      .line {
        margin: 10px auto;
        width: 10%;
        height: 5px;
        background-color: #1296db;
      }

      h3 > a {
        color: #333333;
      }

      h3 > a:hover {
        color: #1296db;
      }

      .blog-recommend > div {
        display: flex;

        img {
          flex-shrink: 0;
        }
      }

      @media screen and (max-width: $breakpoint-sm-max) {
        .blog-recommend > div > img:nth-child(1) {
          width: 100px !important;
          height: 80px !important;
        }
      }
    }
  }

  @media screen and (max-width: 1170px) {
    .content {
      /*padding: 10px;*/ //页边间距留白问题

      .own-part {
        .own-part-content {
          width: 100%;
          padding: 20px 0;
        }
      }
    }
  }

  .part11 {
    .part1-left {
      &:hover {
        svg {
          color: #1296db;
        }
      }
    }

    .part1-left:hover {
      svg {
        color: #1296db;
      }
    }

    .video-button {
      right: 20%;
      bottom: 20%;
      background-color: #ffffff;

      svg {
        @include px2rem(font-size, 60px);
        color: #000000;
      }
    }
  }

  .part1 {
    ul.part1-list {
      position: relative;

      li {
        .part1-header {
          cursor: pointer;
          text-transform: uppercase;
          background-color: #ddd;
          font-size: 16px;
        }

        .part1-header :hover {
          background-color: #1296db;
          color: #fff;
        }
      }

      li.active .part1-header {
        background-color: #1296db;
        color: #fff;
      }
    }

    .list-wrap {
      .categoryItem {
        border-radius: 4px;
        text-align: center;
        cursor: pointer;
        img {
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4), 0 0 6px rgba(0, 0, 0, 0.04);
        }
        h3 {
          margin-top: 10px;
        }
      }

      .categoryItem:hover {
        color: $primary;
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
}
</style>

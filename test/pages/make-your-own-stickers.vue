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
      videoUrl="https://www.youtube.com/embed/WtHkx7Ox9g4"
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
      pageName: "Make Your Own Stickers",
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
    getPrevElement(element) {
      let e = element.previousSibling;
      if (e == null) {
        //测试同胞节点是否存在，否则返回空
        return null;
      }
      if (e.nodeType == 3) {
        //如果同胞元素为文本节点
        let two = this.getPrevElement(e);
        if (two.nodeType == 1) return two;
      } else {
        if (e.nodeType == 1) {
          //确认节点为元素节点才返回
          return e;
        } else {
          return false;
        }
      }
    },
  },
  mounted() {
    let that = this;
    this.$nextTick(() => {
      document.getElementById("videoStickers").addEventListener("click", () => {
        this.initVideo();
      });
      document.getElementById("getStart").addEventListener("click", () => {
        this.beginDesign();
      });
      Array.from(document.getElementsByClassName("arrow")).forEach((item) => {
        item.addEventListener("click", function () {
          let node = that.getPrevElement(this);
          let originSrc = node.getAttribute("src"),
            replaceSrc = node.getAttribute("data-replace-src");
          node.setAttribute("src", replaceSrc);
          node.setAttribute("data-replace-src", originSrc);
        });
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
  .part1 {
    .part1-left {
      &:hover {
        svg {
          color: #1296db;
        }
      }
    }

    .video-button {
      right: 18%;
      bottom: 18%;
      background-color: #ffffff;

      svg {
        font-size: 60px;
        color: #000000;
      }
    }
  }

  .part2 {
    .part2-content {
      .list {
        .list-item {
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

          & > div:nth-child(1) {
            display: flex;
            justify-content: center;
            align-items: center;
          }

          & > div:nth-child(2) {
            position: relative;
            margin-top: 20px;

            &::before {
              content: "";
              position: absolute;
              height: 4px;
              background-color: #f3f3f3;
              right: 0;
              top: -4px;
              width: 50%;
            }

            &::after {
              content: "";
              position: absolute;
              width: 4px;
              background-color: #f3f3f3;
              right: -4px;
              top: -4px;
              height: 50%;
            }
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

          &:nth-child(1) .circle-img-wrap,
          &:nth-child(1) .circle {
            background-color: #fdc6a2;
          }

          &:nth-child(2) .circle-img-wrap,
          &:nth-child(2) .circle {
            background-color: #f16b6b;
          }

          &:nth-child(3) .circle-img-wrap,
          &:nth-child(3) .circle {
            background-color: #8bce00;
          }

          &:nth-child(4) .circle-img-wrap,
          &:nth-child(4) .circle {
            background-color: #00a3c6;
          }

          &:nth-child(1) h3 {
            color: #fdc6a2;
          }

          &:nth-child(2) h3 {
            color: #f16b6b;
          }

          &:nth-child(3) h3 {
            color: #8bce00;
          }

          &:nth-child(4) h3 {
            color: #00a3c6;
          }

          & > div:nth-child(2) {
            flex: 1;
          }
        }
      }
    }
  }

  .part4 {
    .list {
      .list-item {
        display: flex;
        flex-direction: column;
        align-items: center;

        .img-wrap {
          position: relative;
          @include px2rem(width, 365px);
          @include px2rem(height, 365px);
          @media screen and (min-width: $breakpoint-xl-min) {
            width: 365px;
            height:365px;
          }
          img {
            width: 100%;
            height: 100%;
          }

          .arrow {
            position: absolute;
            bottom: 10px;
            right: 10px;
            width: 50px;
            height: 50px;
            background-color: $primary;
            border-radius: 50%;
            padding: 10px;
            cursor: pointer;

            img {
              transition: all 0.2s linear;
            }

            &:hover {
              img {
                transform: scale(1.2);
              }
            }
          }
        }

        & > div:nth-child(1) {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        & > div:nth-child(2) {
          margin-top: 20px;
        }

        & > div:nth-child(2) {
          flex: 1;
        }
      }
    }
  }

  .part5 {
    .part5-content {
      .banner-text {
        padding-bottom: 20px;
        border-top: 4px solid $primary;
        background-color: rgba(255, 255, 255, 0.5);
        text-align: center;
      }

      .list {
        position: relative;
        margin-top: -60px;

        .list-item {
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

          & > div:nth-child(1) {
            display: flex;
            justify-content: center;
            align-items: center;
          }

          & > div:nth-child(2) {
            flex: 1;
          }
        }
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

  .product-item {
    img {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4), 0 0 6px rgba(0, 0, 0, 0.04);
    }
    h3 {
      margin-top: 10px;
    }
    &:hover {
      h3 {
        color: $primary;
      }
    }
  }
}
</style>

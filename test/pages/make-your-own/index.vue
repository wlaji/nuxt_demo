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
      pageName: "make your own",
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
    handlePart7NavClick(e) {
      if (e.target.nodeName.toLowerCase() === "li") {
        this.activeName = e.target.getAttribute("name");
      }
    },
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
  mounted() {
    let that = this;
    this.$nextTick(() => {
      document.getElementById("videoStickers").addEventListener("click", () => {
        this.initVideo();
      });
      document
        .getElementById("product-list")
        .addEventListener("click", (event) => {
          let node = event.target;
          Array.from(node.parentNode.children).forEach((item) => {
            item.classList.remove("active");
          });
          node.classList.add("active");
          let index = node.getAttribute("data-index");
          Array.from(document.getElementById("product-con").children).forEach(
            (item) => {
              if (item.getAttribute("data-index") === index) {
                item.classList.add("d-block");
                item.classList.remove("d-none");
              } else {
                item.classList.remove("d-block");
                item.classList.add("d-none");
              }
            }
          );
        });
      document
        .getElementById("part7Tab")
        .addEventListener("click", function (event) {
          let node = event.target;
          if (event.target.nodeName === "P") {
            node = event.target.parentNode;
          }
          Array.from(node.parentNode.children).forEach((item) => {
            item.classList.remove("active");
          });
          node.classList.add("active");
          let name = node.getAttribute("name");
          Array.from(
            document.getElementsByClassName("nav-con-item")[0].children
          ).forEach((item) => {
            if (item.getAttribute("name").indexOf(name) >= 0) {
              item.setAttribute("style", "display:block !important");
            } else {
              item.setAttribute("style", "display:none !important");
            }
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
  img {
    object-fit: cover;
  }
  .font14 {
    @include px2rem(font-size, 28px);
    @media screen and (min-width: $breakpoint-xl-min) {
      font-size: 14px;
    }
  }
  #product-list {
    & > div {
      cursor: pointer;
      &:hover {
        background: $primary;
        color: #fff;
      }
    }
    .active {
      background: $primary;
      color: #fff;
    }
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
    .img {
      @include px2rem(width, 487px);
      @include px2rem(height, 278px);
      @media screen and (min-width: $breakpoint-xl-min) {
        width: 487px;
        height: 278px;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .part1-right{
    .btn_start{
      @media screen and(max-width: $breakpoint-sm-max) {
        display: flex;
        justify-content: center;
      }
    }
  }

  .part2 {
    ul {
      text-align: center;

      li:nth-child(1) > div {
        box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.25), 10px 10px #1296db;
      }

      li:nth-child(2) > div {
        box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.25), 10px 10px #fc0;
      }

      li:nth-child(3) > div {
        box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.25), 10px 10px #fc6597;
      }

      li:nth-child(4) > div {
        box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.25), 10px 10px #f66200;
      }

      li {
        > div {
          width: 100%;
          height: 100%;
          border: 1px solid #000;
          padding: 10px;
        }
        .p2Img {
          @include px2rem(width, 140px);
          @include px2rem(height, 121px);
          @media screen and (min-width: $breakpoint-xl-min) {
            width: 140px;
            height: 121px;
          }
          margin: 0 auto;
        }
        .img {
          @include px2rem(width, 280px);
          @include px2rem(height, 222px);
          @media screen and (min-width: $breakpoint-xl-min) {
            width: 140px;
            height: 111px;
          }
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }

  .part3 {
    #product-list {
      div {
        @include px2rem(font-size, 24px);
      }
    }
    ul {
      li {
        padding: 10px;
        background-color: #ccc;

        &:hover {
          background-color: $primary;
          color: #fff;
        }
      }

      li.active {
        background-color: $primary;
        color: #fff;
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

  .part5 {
    h2 {
      position: relative;
      margin-left: 15px;

      &::before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: -10px;
        width: 5px;
        background-color: #1296db;
      }
    }
  }

  .part7 {
    .nav-title {
      li {
        font-size: 2rem;

        @media screen and(max-width: $breakpoint-sm-max) {
          font-size: 1.6rem;
        }
      }

      li.active {
        color: $primary !important;
      }

      li:hover {
        color: $primary !important;
      }
    }

    .nav-con-item {
      display: flex;
      flex-wrap: wrap;

      div {
        position: relative;
        overflow: hidden;
        text-align: center;

        img {
          transition: all 200ms ease-in;
        }

        span {
          opacity: 0;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 10px;
          text-align: center;
          white-space: nowrap;
          background-color: rgba(255, 255, 255, 0.8);
          color: $primary;
          @include px2rem(font-size, 26px);
          @media screen and (min-width: $breakpoint-xl-min) {
            font-size: 26px;
          }
          font-weight: 700;
          transition: all 200ms ease-in;
          cursor: pointer;
          text-transform: capitalize;
        }

        &:hover {
          img {
            transform: scale(1.2);
          }

          span {
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>

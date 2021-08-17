<template>
  <div class="py-4 faq">
    <div class="container">
      <h2 class="text-center">
        Frequently Asked Questions
      </h2>
      <ul class="mt-3" id="faq">
        <li class="mb-2 pb-2" v-for="(item, index) in faqdata" :key="index">
          <div
            class="d-flex justify-content-between align-items-center pointer pb-3 question"
          >
            <div class="font-weight-bold" v-html="item.question">
            </div>
            <div class="faq_img"></div>
          </div>
          <div class="answer mb-0" v-html="item.answer">
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getFaqByName } from "@/api/public";

export default {
  data() {
    return {
      faqdata: []
    };
  },
  methods: {
    toggleFaq() {
      let findParent = (node, k) => {
        let findNode = "";
        let find = (node, k) => {
          let nodeName = node.nodeName.toUpperCase();
          if (nodeName != k) {
            find(node.parentNode, k);
          } else {
            findNode = node;
          }
        };
        find(node, k);
        return findNode;
      };

      function isHidden(el) {
        return el.style.display === "none" || el.style.display === "";
      }

      let faq = document.getElementById("faq");
      faq.addEventListener("click", e => {
        let target = e.target;
        if (target.nodeName.toUpperCase() === "UL") {
          return;
        }
        let liNode = findParent(target, "LI");
        let answer = liNode.getElementsByClassName("answer")[0];
        let faqImg = liNode.getElementsByClassName("faq_img")[0];
        let answerList = Array.from(faq.getElementsByClassName("answer"));
        let faqImgList = Array.from(faq.getElementsByClassName("faq_img"));
        if (isHidden(answer)) {
          answer.style.display = "block";
          faqImg.style.transform = "rotate(45deg)";
        } else {
          answer.style.display = "none";
          faqImg.style.transform = "rotate(0deg)";
        }
        answerList.forEach(item => {
          if (item !== answer) {
            item.style.display = "none";
          }
        });
        faqImgList.forEach(item => {
          if (item !== faqImg) {
            item.style.transform = "rotate(0deg)";
          }
        });
      });
    }
  },
  async fetch() {
    const faq = await getFaqByName({
      faq_cate_name: "home"
    });
    this.faqdata = faq.data;
  },
  mounted() {
    if (document.getElementById("faq")) {
      this.toggleFaq();
    }
  }
};
</script>

<style lang="scss" scoped>
.faq {
  li {
    border-bottom: 3px solid #dcdcdc;
    @include px2rem(margin-bottom, 40px, mobile, true);
  }

  .question {
    /deep/ p {
      @include px2rem(font-size, 32px, mobile, true);
      margin-bottom: 0;
    }
  }

  .faq_img {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    @include px2rem(margin-left, 30px);
    background: url("https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210507/index_icon97.png")
      center/contain no-repeat;
  }

  .closeFaq {
    display: none;
  }

  .answer {
    display: none;
    color: #444444;

    /deep/ p {
      @include px2rem(font-size, 32px, mobile, true);
      margin-bottom: 0;
    }
  }

  @media screen and (min-width: $breakpoint-xl-min) {
    li {
      margin-bottom: 20px !important;
    }
    #faq {
      width: 800px;
      margin: 30px auto !important;
    }
    .question {
      /deep/ p {
        font-size: 24px !important;
        margin-bottom: 0;
      }
    }
    .answer {
      /deep/ p {
        font-size: 18px !important;
        margin-bottom: 0;
      }
    }
    .faq_img {
      position: relative;
      width: 20px;
      height: 20px;
      margin-left: 30px;
      top: 5px;
    }
  }
}
</style>
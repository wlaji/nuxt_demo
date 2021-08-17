<template>
  <div id="category-fwb" v-lazy-container>
    <!--            pc端富文本-->
    <section v-if="$store.state.device.type === 'pc'" class="fwb">
      <article
        v-for="item in rowData"
        :key="item.id"
        v-html="item.row"
      ></article>
    </section>
    <!--        手机端富文本-->
    <section v-else class="fwb">
      <article
        v-for="item in rowData"
        :key="item.id"
        v-html="item.row_mobile ? item.row_mobile : item.row"
      ></article>
    </section>
    <base-dialog :visible.sync="showDefaultAddress">
      <template v-slot:content>
        <div class="content-wrap" @click="showDefaultAddress = false">
          <div class="promotionWindow bg-white w-75 font48-36" style="margin: 0 auto">
            <div class="row py-3 px-3">
              <div class="col-xl-12">
                <h2 style="color: #000;text-align:center">
                  Popular Customized Products
                </h2>
              </div>
              <div class="col-xl-4 col-6">
                <div style="--aspect-ratio: 282/240">
                  <img data-src="https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210421/uses_icon9.png" alt="Soap Labels" title="Soap Labels"/>
                </div><a href="https://www.customsticker.com/Soap-labels" style="color:#000" title="Soap Labels"><p class="text-center font_wei font-weight-bold py-2">
                Soap Labels &gt;&gt;
              </p></a>
              </div>
              <div class="col-xl-4 col-6">
                <div style="--aspect-ratio: 282/240">
                  <img data-src="https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210421/uses_icon10.png" alt="Mailing Labels" title="Mailing Labels"/>
                </div><a href="https://www.customsticker.com/Mailing-labels" style="color:#000" title="Mailing Labels"><p class=" text-center font_wei font-weight-bold py-2">
                Mailing Labels &gt;&gt;
              </p></a>
              </div>
              <div class="col-xl-4 col-6">
                <div style="--aspect-ratio: 282/240">
                  <img data-src="https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210506/Elegant-Wine-Labels-For-Sale.jpg" alt="Custom Wine Labels" title="Custom Wine Labels"/>
                </div><a href="https://www.customsticker.com/Custom-wine-labels" style="color:#000" title="Custom Wine Labels"><p class="text-center font_wei font-weight-bold py-2">
                Custom Wine Labels &gt;&gt;
              </p></a>
              </div>
              <div class="col-xl-4 col-6">
                <div style="--aspect-ratio: 282/240">
                  <img data-src="https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210506/Cool-Band-Stickers-No-Min.jpg" alt="Band Stickers" title="Band Stickers"/>
                </div><a href="https://www.customsticker.com/Band-stickers" style="color:#000" title="Band Stickers"><p class="text-center font_wei font-weight-bold py-2">
                Band Stickers &gt;&gt;
              </p></a>
              </div>
              <div class="col-xl-4 col-6">
                <div style="--aspect-ratio: 282/240">
                  <img data-src="https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210421/uses_icon13.png" alt="Custom Laptop Stickers" title="Custom Laptop Stickers"/>
                </div><a href="https://www.customsticker.com/Custom-laptop-stickers" style="color:#000" title="Custom Laptop Stickers"><p class="text-center font_wei font-weight-bold py-2">
                Custom Laptop Stickers &gt;&gt;
              </p></a>
              </div>
              <div class="col-xl-4 col-6">
                <div style="--aspect-ratio: 282/240">
                  <img data-src="https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210422/Athletic-Logo-Stickers.jpg" alt="Logo Stickers" title="Logo Stickers"/>
                </div><a href="https://www.customsticker.com/Logo-stickers" style="color:#000" title="Logo Stickers"><p class="text-center font_wei font-weight-bold py-2">
                Logo Stickers &gt;&gt;
              </p></a>
              </div>
            </div>
          </div>
        </div>
      </template>
    </base-dialog>
  </div>
</template>

<script>
import Swiper from "swiper";
import "swiper/dist/css/swiper.css";
import "../../assets/js/TwentyTwenty"
import "../../assets/css/fwb/twentytwenty.css"
export default {
  name: "category-fwb",
  props: ["rowData"],
  data() {
    return {
      showAnswerIndex: 0,
      showDefaultAddress:false
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
    },
    closeBox() {
      let openBox = document.getElementById("openBox");
      if (openBox) {
        openBox.onclick = () => {
          this.showDefaultAddress = true
        };
      }
    },
    lunbo() {
      let next = document.getElementById("next");
      let prev = document.getElementById("prev");
      let list = document.getElementById("list");
      //    下一步
      if ((next, prev, list)) {
        next.onmousedown = function () {
          // 到达最后一张时跳回第一张
          if (parseInt(list.style.left) < 0) {
            list.style.left = 1140 + "px";
            list.style.transition = "";
          }
          next.onmouseup = function () {
            list.style.left = parseInt(list.style.left) + -1140 + "px";
            list.style.transition = "1000ms";
          };
        };
        // 上一步
        prev.onmousedown = function () {
          // 到达第一张时跳最后一张
          if (parseInt(list.style.left) > -1140) {
            list.style.left = -2280 + "px";
            list.style.transition = "";
          }
          prev.onmouseup = function () {
            list.style.left = parseInt(list.style.left) + 1140 + "px";
            list.style.transition = "1000ms";
          };
        };
      }
    },
  },
  components: {
    Swiper
  },
  mounted() {
    let slidesPerView = 3;
    if (this.$store.state.device.type !== "pc") {
      slidesPerView = 2;
    }
    var swiper = new Swiper(".swiper-container", {
      slidesPerView: slidesPerView,
      freeMode: true,
      spaceBetween: 30,
      loop: false,
      centeredSlides: false,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      }
    });

    this.$nextTick(() => {
      this.lunbo();
      this.closeBox();
      if (document.getElementById("faq")) {
        this.toggleFaq();
      }
    });
  }
};
</script>

<style scoped lang="scss">
@import "../../assets/css/fwb/category";
</style>

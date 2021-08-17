<template>
  <div>
    <template v-if="initDzxt">
      <componet
        :is="$store.state.device.type === 'pc' ? 'pcDzxt' : 'mbDzxt'"
      ></componet>
    </template>
    <template v-if="!noShowPreloader && !initDzxt">
      <preloader></preloader>
    </template>
  </div>
</template>

<script>
import preloader from "@/components/dzxt/preloader";
import pcDzxt from "@/components/dzxt/pcDzxt.vue";
import mbDzxt from "@/components/dzxt/mbDzxt.vue";
import { getShareSample } from "@/api/account";

export default {
  async asyncData({ store, params, query, app }) {
    const relHrefName = app.$utils.formatSecondCategoryName(
      params.categoryName
    );

    //服务端获取分享信息
    let shareData = {relHrefName},
      shareImg = '',
      shareParam = '';
    if (query.shareName) {
      shareData = await getShareSample({
        share_name: query.shareName
      });
      shareImg = shareData.data.pic_path;
      shareParam = shareData.data.param;
    }

    return {
      relHrefName: relHrefName,
      shareImg: shareImg,
      shareName: query.shareName,
      shareParam: shareParam
    };
  },
  head() {
    return {
      link: [
        {
          href:
            "https://fonts.font.im/css?family=Acme|Amaranth|Anton|Boogaloo|Chewy|Concert+One|Courgette|Dancing+Script|Fjalla+One|Francois+One|Fredoka+One|Fugaz+One|Great+Vibes|Hanalei+Fill|Kaushan+Script|Lobster+Two|MedievalSharp|Oleo+Script|Oswald|Pacifico|Palanquin+Dark|Passion+One|Permanent+Marker|Ranga|Righteous|Roboto|Ruslan+Display|Sigmar+One|Timmana|Viga",
          rel: "stylesheet"
        },
        {
          rel: "canonical",
          href: `https://www.customsticker.com/create-your-own-stickers/${this.relHrefName}`
        }
      ],
      script: [
        {
          src: "https://cdn.jsdelivr.net/npm/fabric@4.3.0/dist/fabric.min.js"
        },
        {
          src:
            "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.3.200/build/pdf.min.js",
          body: true,
          async: true,
          defer: true
        }
      ],
      meta: [
        {
          name: "twitter:title",
          content: "My Custom Sticker Design from CustomSticker"
        },
        {
          name: "twitter:description",
          content: "Let's check out my custom sticker design made by CustomSticker."
        },
        {
          name: "twitter:image",
          content: this.shareImg
        },
        {
          name: "twitter:card",
          content: "summary_large_image"
        },
        {
          property: "og:title",
          content: "My Custom Sticker Design from CustomSticker"
        },
        {
          property: "og:description",
          content: "Let's check out my custom sticker design made by CustomSticker."
        },
        {
          property: "og:image",
          content: this.shareImg
        },
        {
          property: "og:url",
          content: `https://www.customsticker.com/create-your-own-stickers/${this.relHrefName}?shareName=${this.shareName}`
        }
      ]
    };
  },

  data() {
    return {
      initDzxt: false,
      noShowPreloader: false
    };
  },
  computed: {
    familyList() {
      let arr = [
        "Arial",
        "Century Gothic",
        "Comic Sans MS",
        "Times New Roman",
        "Courier New",
        "Georgia",
        "Impact",
        "Hanalei Fill",
        "Oswald",
        "MedievalSharp",
        "Ruslan Display",
        "Ranga",
        "Lobster Two",
        "Pacifico",
        "Dancing Script",
        "Permanent Marker",
        "Great Vibes",
        "Roboto",
        "Timmana",
        "Anton",
        "Fjalla One",
        "Acme",
        "Francois One",
        "Palanquin Dark",
        "Righteous",
        "Concert One",
        "Courgette",
        "Kaushan Script",
        "Fredoka One",
        "Passion One",
        "Oleo Script",
        "Boogaloo",
        "Amaranth",
        "Sigmar One",
        "Chewy",
        "Fugaz One",
        "Viga"
      ];
      arr.sort((a, b) => a.localeCompare(b));
      return arr;
    }
  },
  components: {
    pcDzxt,
    mbDzxt,
    preloader
  },
  mounted() {
    //受vuex-persistedstate影响，数据回填失败,延迟执行数据回调操作
    setTimeout(()=>{
      if (this.shareParam)
        this.$store.commit("updateCartTemp", JSON.parse(this.shareParam));

      if (sessionStorage.getItem("changeCategory")) {
        this.noShowPreloader = true;
      }
      let observers = [];
      let FontFaceObserver = require("fontfaceobserver");
      this.familyList.forEach(item => {
        let obs = new FontFaceObserver(item);
        observers.push(obs.load(null, 500));
      });
      Promise.all(observers)
        .then(fonts => {
          console.log(fonts);
        })
        .catch(function(err) {
          console.warn("Some critical font are not available:", err);
        })
        .finally(() => {
          let timeId = setInterval(() => {
            if (window.fabric) {
              this.initDzxt = true;
              clearInterval(timeId);
            }
          }, 300);
        });
    },100)

  }
};
</script>

<style lang="scss" scoped></style>

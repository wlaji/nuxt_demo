<template>
  <div class="container">
    <section v-for="item in rowData" :key="item.id" v-html="item.row"></section>
  </div>
</template>

<script>
import { getPageInfo } from "@/api/public";

export default {
  async asyncData({ app }) {
    let { data } = await getPageInfo({
      pageName: "privacy policy"
    });
    return {
      rowData: data.rowData,
      seoTitle: data.title,
      seoDescription: data.description,
      seoKeyword: data.keyword,
      structuring: data.structuring
    };
  },
  head() {
    return {
      title: this.seoTitle,
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.seoDescription
        },
        {
          hid: "keywords",
          name: "keywords",
          content: this.seoKeyword
        }
      ],
      script: this.structuring?[
        {
          type: "application/ld+json",
          innerHTML: this.structuring,
        },
      ]:[]
    };
  },

  created() {}
};
</script>

<style lang="scss" scoped>
.container /deep/ {
  p {
    line-height: 1.4em;
    @include px2rem(margin-bottom, 20px);
    @media screen and (min-width: $breakpoint-xl-min) {
      margin-bottom: 10px;
    }
  }
}
</style>
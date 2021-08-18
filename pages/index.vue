<template>
  <div>
    <p>我刚发的那份来得及啊防空雷达</p>
    <a>3213222222222</a>
    <p>我刚发的那份来得及啊防空雷达</p>
    <a>3213222222222</a>
    <p>我刚发的那份来得及啊防空雷达</p>
    <a>3213222222222</a>
  </div>
</template>
<script>
import {getPageInfo} from '~/api/account'

export default {
  async asyncData({error}) {
    try {
      let { data } = await getPageInfo({
        pageName: "Die Cut Stickers",
      });
      let { banner, banner_phone , rowData, title, description, keyword, structuring } = data;
      return {
        banner: banner,
        banner_phone:banner_phone,
        rowData: rowData,
        seoTitle: title,
        seoDescription: description,
        seoKeyword: keyword,
        structuring,
      };
    } catch (err) {
      error({
        statusCode: 404,
        message:'接口调用失败'
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
  data() {
    return {}
  },
  methods:{

  },
  mounted() {

  }
}
</script>
<style lang="scss" scoped>
p{
  font-size:30px
}
a{
  font-size: 20px;
}
</style>

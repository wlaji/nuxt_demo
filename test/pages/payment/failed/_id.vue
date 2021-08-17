<template>
  <div>
    <paymentFailed :orderInfo="orderInfo"></paymentFailed>
  </div>
</template>

<script>
import paymentFailed from "@/components/payment/failed";
import { getOrderDetailInfo } from "@/api/account";

export default {
  middleware: "permission",
  async asyncData({ params, error }) {
    try {
      let { data } = await getOrderDetailInfo({
        id: params.id
      });
      return {
        orderInfo: data
      };
    } catch {
      error({
        statusCode: 404
      });
    }
  },
  head() {
    return {
      meta: [
        {
          hid: "robots",
          name: "robots",
          content: "noindex, nofollow" //禁止所有搜索引擎的收录和索引，也不追踪网页上的链接，
        }
      ]
    };
  },
  components: {
    paymentFailed
  }
};
</script>

<style scoped></style>
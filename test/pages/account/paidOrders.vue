<template>
  <div class="paidOrders p-2">
    <div
      class="d-flex-center"
      v-if="$fetchState.pending"
      style="height: 200px"
    >
      <span class="spinner-border"></span>
    </div>
    <div class="d-flex-center" style="height: 200px" v-else-if="$fetchState.error">An error occurred :(</div>
    <ul v-else>
      <template v-for="item in orderList">
        <orderItem
          class="mb-2"
          :key="item.id"
          :orderItemData="item"
        ></orderItem>
      </template>
    </ul>
    <div class="paging">
      <pagination
        v-show="pageInfo.total > 1"
        :size="pageInfo.size"
        :page="pageInfo.page"
        :total="pageInfo.total"
        @getPaginationData="getPaginationData"
      ></pagination>
    </div>
  </div>
</template>

<script>
import orderItem from "@/components/account/order/orderItem";
import pagination from "@/components/pagination/index";
import { getOrderList } from "@/api/account";

export default {
  middleware: 'permission',
  data() {
    return {
      orderList: [],
      pageInfo: {
        page: 1,
        size: 6,
        total: 0
      }
    };
  },
  filters: {},
  components: {
    pagination,
    orderItem
  },
  methods: {
    getPaginationData(pageInfo) {
      this.pageInfo.page = pageInfo.page;
      this.$fetch();
    }
  },
  async fetch() {
    let pageInfo = this.pageInfo;
    let res = await getOrderList({
      pageCount: pageInfo.size,
      page: pageInfo.page,
      status: "2,3"
    });
    this.pageInfo.total = Number(res.data.total_number);
    this.orderList = res.data.data;
  },
  created() {
  }
};
</script>

<style lang="scss" scoped></style>

<template>
<div class="container">
  <div class="bg-primary row p-3">
    <div class="col col-sm-auto">
      <span class="text-white font-weight-bold" style="font-size: 1.8rem" id="customTitle">CUSTOMIZE AN EXISTING DESIGN</span>
    </div>
    <mySelectA class="col-12 col-sm" :options="options" @changeSelectOption="changeSelectOption"></mySelectA>
  </div>
  <productList :category="category"></productList>
  <pagination v-show="pageInfo.total>0" class="row justify-content-center align-items-center bg-white w-auto" @getPaginationData="getPaginationData" :size="pageInfo.size" :page="pageInfo.page" :total="pageInfo.total"></pagination>
</div>
</template>

<script>
import productList from '@/components/productList/productListStyle_B'
import pagination from '@/components/pagination/index'
import mySelectA from '@/components/BasisComponents/selectStyle_A'
export default {
  props: {
    options: {
      Type: Array
    },
    category: {
      Type: Array
    },
    pageInfo: {
      Type: Object
    }
  },
  data() {
    return {

    }
  },
  methods: {
    changeSelectOption(id) {
      this.$emit('changeSelectOption', id)
    },
    getPaginationData(pageInfo) {
      this.$emit('getPaginationData', pageInfo);
      this.$utils.scrollToElement(document.getElementById('customTitle'))
    }
  },
  components: {
    productList,
    pagination,
    mySelectA,
  },
}
</script>

<style lang="scss" scoped>

</style>

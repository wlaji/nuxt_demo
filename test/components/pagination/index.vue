<template>
  <div class="pagination">
    <el-pagination
      background
      :pager-count="paginationConfig.pagerCount"
      :small="paginationConfig.isSmall"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="currentSize"
      :layout="paginationConfig.layout"
      :total="currentToal"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    page: {
      Type: Number,
      default: 1
    },
    size: {
      Type: Number,
      default: 20
    },
    total: {
      Type: Number,
      default: 0
    }
  },
  data() {
    return {
      currentPage: this.page,
      currentSize: this.size,
      currentToal: this.total
    }
  },
  computed: {
    paginationConfig() {
      let device = this.$store.state.device
      if (device.type === 'pc') {
        return {
          pagerCount: 7,
          isSmall: false,
          layout: 'total , prev, pager, next ,jumper'
        }
      } else {
        return {
          pagerCount: 5,
          isSmall: true,
          layout: 'prev,next,jumper'
        }
      }
      console.log(device)
    }
  },
  watch: {
    page(val) {
      this.currentPage = val
    },
    size(val) {
      this.currentSize = val
    },
    total(val) {
      this.currentToal = val
    }
  },
  methods: {
    //   currentPage 改变时会触发
    handleCurrentChange(val) {
      this.currentPage = val
      this.queyData(val, this.currentSize)
    },
    handleSizeChange(val) {
      this.currentSize = val
      this.queyData(this.currentPage, val)
    },
    //  page size 改变时，触发接口返回 数据
    queyData(page, size) {
      this.$emit('getPaginationData', {
        page: page,
        size: size,
        total: this.currentToal
      })
    }
  },
  mounted() {
    let device = this.$store.state.device
    console.log(device)
  }
}
</script>

<style scoped>
.pagination {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>

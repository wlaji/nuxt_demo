<template>
  <div class="my_select">
    <el-select v-model="sampleCateId" size="mini" @change="changeSelectOption">
      <el-option
        v-for="item in options"
        :key="item.SampleCateId"
        :label="item.Name"
        :value="item.SampleCateId"
      >
      </el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  props: {
    options: Array,
  },
  data() {
    return {
      sampleCateId: '',
    }
  },
  watch: {
    options(newVal){
      this.sampleCateId = newVal[0].SampleCateId
      this.$emit('changeSelectOption', this.sampleCateId)
    }
  },

  methods: {
    changeSelectOption(val) {
      this.$emit('changeSelectOption', this.sampleCateId)
    },
  },
  mounted() {
  },
}
</script>
<style lang="scss" scoped>
</style>
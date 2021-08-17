<template>
  <div class="customInput">
    <el-tooltip class="item" :manual="true" effect="dark" v-model="someting" :content="message" popper-class="sizeValidateToolTip" placement="top-start">
      <el-input placeholder="Enter Qty" size="small" :value="currentValue" :disabled="disabled" @input="handleInput"></el-input>
    </el-tooltip>
  </div>
</template>

<script>
import {
  validateQty
} from '@/utils/validate'
export default {
  props: {
    value: [String, Number],
    min: [String, Number],
    max: [String, Number],
    required: {
      default: false,
      Type: Boolean
    },
    disabled:{
      default: false,
      Type: Boolean
    }
  },
  data() {
    return {
      message: '',
      someting: false
    }
  },
  watch: {
    currentValue(newValue) {
      this.validateFun();
    },
  },
  computed: {
    currentValue: function () {
      return this.value
    }
  },
  methods: {
    handleInput(value) {
      value = value.replace(/\s*/g, ''); //去除所有空格;
      this.$emit('input', value) //触发 input 事件，并传入新值
      let result = validateQty(value, this.min, this.max);
      if (result.isValid) {
        this.someting = false
        this.$nextTick(() => {
          this.message = ''
        })
        this.$emit('validateResult', result);
      } else {
        this.someting = true
        this.$nextTick(() => {
          this.message = result.message
        })
      }
    },
    validateFun() {
      let result = validateQty(this.currentValue, this.min, this.max);
      if (result.isValid) {
        this.someting = false
        this.message = ''
      } else {
        this.someting = true
        this.message = result.message
      }
      return result
    },
  },
}
</script>

<style lang="scss" scoped>
.customInput {
  display: inline-block;
  position: relative;
}
</style>

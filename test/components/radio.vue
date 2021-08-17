<template>
  <div class="radio">
    <div class="d-flex align-items-center">
      <input type="radio" v-model="model" :value="label" />
      {{ c_info }}
      <span class="cRadio m-1"></span>
      {{ a_info }}
    </div>
  </div>
</template>
<script>
export default {
  props: ["value", "label", "c_info", "a_info"], // 获取父作用域中的value与label变量值
  name: "radio",
  computed: {
    model: {
      get() {
        return this.value; // 设置单选框 选项.  是通过当前值来判断当前选中项.
      },
      set(val) {
        this.$emit("input", val); // 选中单选框后,发布input事件; 这时子组件与父组件形成双向绑定.
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.radio {
  cursor: pointer;
  @include px2rem(font-size, 28px);
  @media screen and (min-width: $breakpoint-xl-min) {
    font-size: 16px;
  }
  .cRadio {
    display: inline-block;
    position: relative;
    border: 2px solid #dcdfe6;
    border-radius: 2px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 24px;
    height: 24px;
    background-color: #fff;
    z-index: 1;
  }
  input[type="radio"] {
    opacity: 0;
    outline: 0;
    position: absolute;
    margin: 0;
    width: 0;
    height: 0;
    z-index: -1;
    &:checked + .cRadio {
      background-color: #fff;
      border-color: #409eff;
    }
    &:checked + .cRadio::after {
      transform: rotate(45deg) scaleY(1);
      box-sizing: content-box;
      content: "";
      border: 2px solid #409eff;
      border-left: 0;
      border-top: 0;
      height: 13px;
      left: 6px;
      position: absolute;
      top: 1px;
      width: 6px;
      transition: transform 0.15s ease-in 0.05s;
      transform-origin: center;
    }
  }
}
</style>
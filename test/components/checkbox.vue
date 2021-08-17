<template>
  <div class="checkbox">
    <div class="d-flex align-items-center">
      <input
        :id="c_id"
        type="checkbox"
        v-bind:checked="checked"
        v-on:change="$emit('change', $event.target.checked)"
      />
      {{ c_info }}
      <span class="cCheckbox m-1"></span>
      {{ a_info }}
    </div>
  </div>
</template>
<script>
export default {
  model: {
    prop: "checked",
    event: "change",
  },
  props: {
    c_id: {
      Type: Array,
    },
    c_info: {
      Type: Array,
    },
    a_info: {
      Type: Array,
    },
    checked: {
      Type: Boolean,
      default:false,
    },
  },
};
</script>
<style lang="scss" scoped>
.checkbox {
  cursor: pointer;
  @include px2rem(font-size, 28px);
  @media screen and (min-width: $breakpoint-xl-min) {
    font-size: 16px;
  }
  .cCheckbox {
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
  input[type="checkbox"] {
    opacity: 0;
    outline: 0;
    position: absolute;
    margin: 0;
    width: 0;
    height: 0;
    z-index: -1;
    &:checked + .cCheckbox {
      background-color: #fff;
      border-color: #409eff;
    }
    &:checked + .cCheckbox::after {
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
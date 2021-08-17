<template>
  <div class="base-dialog" v-show="visible">
    <div class="base-dialog-model-overlay" @click.self="closeDialog"></div>
    <div class="base-dialog-model-con">
      <slot name="content">
        content
      </slot>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      lockScroll: {
        type: Boolean,
        default: false
      },
      isShow:{
        type: Boolean,
        default: false
      }
    },
    watch: {
      visible(newValue) {
        if (newValue && this.lockScroll) {
          this.$utils.toggleBody(true)
        } else {
          this.$utils.toggleBody(false)
        }
      }
    },
    methods: {
      closeDialog() {
        if(this.isShow){
          return
        }
        this.$emit('update:visible', false)
      }
    },
    beforeDestroy() {
      this.$utils.toggleBody(false)
    }
  }
</script>
<style lang="scss" scoped>
  .base-dialog {
    overflow: auto;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0;
    z-index: 2050;
    text-align: center;

    &::after {
      content: "";
      display: inline-block;
      height: 100%;
      vertical-align: middle;
    }

    .base-dialog-model-overlay {
      position: fixed;
      width: 100%;
      height: 100%;
      background-color: rgb(0, 0, 0);
      opacity: 0.5;
    }

    .base-dialog-model-con {
      position: relative;
      display: inline-block;
      vertical-align: middle;
      margin: 20px auto;
    }
  }

</style>

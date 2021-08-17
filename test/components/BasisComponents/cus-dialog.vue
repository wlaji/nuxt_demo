<template>
  <base-dialog :visible.sync="showDialog" :lockScroll="lockScroll">
    <template v-slot:content>
      <div class="content-box">
        <div class="dialog_header">
          <slot name="header" v-show="!hiddenHeader">
            <span class="dialog_title">Hint</span>
          </slot>
          <div class="close-dialog" @click="closeDialog" v-show="!hiddenClose">
            <i class="el-icon-circle-close"></i>
          </div>
        </div>
        <div class="dialog_body">
          <slot name="body">
            body
          </slot>
        </div>
        <div class="dialog_footer" v-show="!hiddenFooter">
          <slot name="footer">
            footer
          </slot>
        </div>
      </div>
    </template>
  </base-dialog>
</template>

<script>
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      hiddenClose: {
        type: Boolean,
        default: false
      },
      hiddenFooter: {
        type: Boolean,
        default: false
      },
      hiddenHeader:{
        type: Boolean,
        default: false
      },
      lockScroll:{
        type: Boolean,
        default: false
      }
    },
    computed: {
      showDialog: {
        get() {
          return this.visible
        },
        set() {
          this.closeDialog()
        }
      }
    },
    methods: {
      closeDialog() {
        this.$emit('update:visible', false)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .content-box {
    position: relative;
    @include px2rem(width,600px);
    background-color: #fff;
    border-radius: 10px;
    text-align: left;

    .dialog_header {
      @include px2rem(padding-top, 20px);
      @include px2rem(padding-right, 20px);
      @include px2rem(padding-left, 20px);
      @include px2rem(padding-bottom, 10px);
      .dialog_title {
        line-height: 24px;
        font-size: 18px;
        color: #303133;
      }
    }

    .dialog_body {
      @include px2rem(padding-top, 30px);
      @include px2rem(padding-left, 20px);
      @include px2rem(padding-right, 20px);
      @include px2rem(padding-bottom, 30px);
      color: #606266;
      word-break: break-word;
      @include px2rem(font-size, 28px);
    }

    .dialog_footer {
      @include px2rem(padding-top, 10px);
      @include px2rem(padding-right, 20px);
      @include px2rem(padding-left, 20px);
      @include px2rem(padding-bottom, 20px);
      text-align: right;
      box-sizing: border-box;
    }

    .close-dialog {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 30px;
      height: 30px;
      position: absolute;
      left: 50%;
      bottom: -40px;
      transform: translateX(-50%);
      background-color: #fff;
      border-radius: 50%;
      cursor: pointer;

      i {
        font-size: 30px;
      }
    }
  }

  @media screen and (min-width: 751px) {
    .content-box {
      width: 500px;
      font-size:16px;
      .dialog_header {
        padding: 20px 20px 10px;
      }

      .dialog_body {
        padding: 30px 20px;
        font-size: inherit;
      }

      .dialog_footer {
        padding: 10px 20px 20px;
      }

      .close-dialog {
        right: -30px;
        top: 0;
        left: auto;
        transform: translate(-50%, -50%);
      }
    }
    i {
      font-size:30px;
    }
  }
</style>

<template>
  <base-dialog :visible.sync="showDialog" :lockScroll="lockScroll" :isShow="isShow">
    <template v-slot:content>
      <div class="content-wrap">
        <div class="close-dialog" @click="closeDialog" v-if="!isShow">
          <img src="@/assets/images/@2x/close1.png" />
        </div>
        <div class="content">
          <div class="h3">Enter Promo Code</div>
          <p class="des">
            You should enter the exclusive code to enjoy your sales promotion at
            Customsticker.com
          </p>
          <el-input
            type="text"
            :value="value"
            @input="changeCode"
            placeholder="Enter Code"
          ></el-input>
          <el-button type="warning" @click="submitCode">Confirm</el-button>
          <p class="link">
            <a
              href="/contact-us"
              style="color:#333"
            >
              Any Questions? Contact Us
            </a>
          </p>
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
    lockScroll: {
      type: Boolean,
      default: false
    },
    value: [Number,String],
    isShow:{
      type:Boolean,
      default:false
    }
  },

  model: {
    prop: "value", //绑定的值，通过父组件传递
    event: "input" //自定义事件名
  },

  data() {
    return {

    };
  },

  computed: {
    showDialog: {
      get() {
        return this.visible;
      },
      set() {
        this.closeDialog();
      }
    }
  },

  methods: {
    changeCode(val){
      console.log(val)
      this.$emit('input',val)
    },
    closeDialog() {
      this.$emit("update:visible", false);
    },
    submitCode(){
      this.$emit('submitCode')
    }
  }
};
</script>

<style lang="scss" scoped>
.content-wrap {
  overflow: hidden;
  @include px2rem(width, 716px);
  @include px2rem(height, 516px);
  border-radius: 10px;
  background: #fff url("../assets/images/@2x/Free Stickers-MB.jpg") center/cover
    no-repeat;

  .content {
    @include px2rem(padding, 30px);
    text-align: center;

    .h3 {
      @include px2rem(font-size, 52px);
      font-weight: 700;
    }

    .des {
      width: 80%;
      margin: 10px auto;
    }

    p {
      @include px2rem(font-size, 18px);
    }

    /deep/ .el-input .el-input__inner {
      @include px2rem(width, 580px);
      @include px2rem(height, 90px);
      @include px2rem(font-size, 24px);
    }

    /deep/ .el-button {
      @include px2rem(width, 580px);
      @include px2rem(height, 90px);
      @include px2rem(font-size, 32px);
      @include px2rem(margin-top,30px);
      background-color: #fa7a2a;
      color: #fff;
    }

    .link {
      @include px2rem(font-size, 24px);
      @include px2rem(margin-top,10px);
      a {
        color: #333;
      }
    }
  }

  .close-dialog {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    @include px2rem(top, 10px);
    @include px2rem(right, 10px);
    width: 17px;
    height: 17px;
    cursor: pointer;

    img {
      width: 100%;
      height: 100%;
    }
  }
}

@media screen and (min-width: 751px) {
  .content-wrap {
    width: 656px;
    height: 380px;

    .content {
      padding: 20px;

      .h3 {
        font-size: 48px;
      }

      p {
        font-size: 18px;
      }

      /deep/ .el-input .el-input__inner {
        width: 540px;
        height: 52px;
        font-size: 18px;
      }

      /deep/ .el-button {
        width: 540px;
        height: 52px;
        font-size: 24px;
        margin-top: 20px;
      }

      .link {
        font-size: 16px;
        margin-top: 20px;
      }
    }

    .close-dialog {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 17px;
      height: 17px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>

<template>
  <base-dialog :visible.sync="showDialog" :lockScroll="lockScroll">
    <template v-slot:content>
      <div class="content-wrap">
        <!--        未订阅-->
        <div class="content" v-if="ret === 1">
          <div class="small_type text-center">
            <p class="title font-weight-bold">Be the First to Know</p>
            <p class="dec">
              <span style="color: #fb3030">10% off</span
              ><span> on your first order</span>
            </p>
          </div>
          <el-input v-model="userUmail" placeholder="Email"></el-input>
          <el-button type="warning" class="dbtn" @click="getDiscount($event)"
          >GET MY 10% OFF
          </el-button>
          <p class="reject_type " @click="closeDialog">
            No Thanks, l’ll Pay the Full Price
          </p>
        </div>

        <!--        订阅成功-->
        <div class="content" v-if="ret === 25">
          <div class="small_type text-center">
            <p class="title font-weight-bold">Your 10% OFF is here.</p>
            <p class="dec">
              First Order within 7 Days
            </p>
          </div>
          <div class="codeType">
            <p class="sale_code" id="copyText">{{ str }}</p>
            <el-button type="primary" @click="handleCopy">Copy</el-button>
          </div>
        </div>

        <!--        重复订阅-->
        <div class="content" v-if="ret === 2">
          <p class="dec dec3">This mailbox has been subscribed!</p>
        </div>

        <div class="close-dialog" @click="closeDialog">
          <img src="@/assets/images/@2x/close.png"/>
        </div>
      </div>
    </template>
  </base-dialog>
</template>

<script>
  import { subscriptions } from '@/api/public'

  export default {
    props: {
      ret: Number,
      code: String,
      visible: {
        type: Boolean,
        default: false
      },
      lockScroll: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        userUmail: '',
        str: '',
        newRet: ''
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
      getDiscount($event) {
        let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        let email = this.userUmail
        if (!reg.test(email)) {
          this.$message({
            type: 'error',
            message: 'Email format error'
          })
          return false
        }
        let postData = {
          email: email
        }
        subscriptions(postData).then(res => {
          if (res.ret === 1) {
            this.str = this.code
            this.str = res.data.coupon_code
            this.userUmail = ''
            this.$utils.setCookie('cookieRet', '1', 30)
            this.$emit('changeSubStatus', 25)
          } else if (res.ret !== 1) {
            this.$emit('changeSubStatus', 2)
            this.$utils.setCookie('cookieRet', '1', 30)
          }
        })
      },

      handleCopy() {
        this.$utils.copyText('copyText')
        this.$message.success('Copy success')
      },

      closeDialog() {
        this.$emit('update:visible', false)
        sessionStorage.setItem('sessionRet', 1)
      }
    },

    watch: {
      //监听prop变化，随时更新str
      code: {
        immediate: true,
        handler(val) {
          this.str = val
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .content-wrap {
    overflow: hidden;
    @include px2rem(width, 656px);
    @include px2rem(height, 638px);
    border-radius: 10px;
    background: #fff url('../assets/images/@2x/subscription-PC1.jpg') center/cover no-repeat;

    .content {
      position: absolute;
      left: 50%;
      width: 100%;
      transform: translateX(-50%);
      @include px2rem(top, 300px);
      @include px2rem(padding, 20px);
      text-align: center;
      @include px2rem(font-size, 24px);

      .title {
        @include px2rem(font-size, 48px);
      }

      .dec {
        @include px2rem(font-size, 24px);
        @include px2rem(margin-bottom, 20px);
      }

      .dec3 {
        @include px2rem(margin-top, 50px);
      }

      /deep/ {
        .el-input__inner {
          @include px2rem(width, 470px);
          @include px2rem(height, 50px);
          @include px2rem(line-height, 50px);
          @include px2rem(font-size, 24px);
          background-color: #ecebf2;
        }
      }

      .dbtn.el-button {
        @include px2rem(width, 242px);
        @include px2rem(height, 53px);
        padding: 0;
        @include px2rem(margin-top, 20px);
        @include px2rem(line-height, 53px);
        @include px2rem(font-size, 24px);
        @include px2rem(border-radius, 27px);
        background-color: #fa7a2a;
      }

      .reject_type {
        @include px2rem(margin-top, 10px);
        @include px2rem(font-size, 18px);
        color: #9ab1c1;
      }

      .codeType {
        display: flex;
        align-items: center;
        justify-content: center;
        @include px2rem(margin-top, 50px);
        @include px2rem(font-size, 24px);

        .sale_code {
          @include px2rem(width, 300px);
          @include px2rem(height, 50px);
          @include px2rem(padding-left, 20px);
          @include px2rem(padding-right, 20px);
          @include px2rem(line-height, 50px);
          background-color: #ecebf2;
          @include px2rem(font-size, 24px);
        }

        .el-button {
          @include px2rem(width, 100px);
          @include px2rem(height, 50px);
          padding: 0;
          @include px2rem(margin-top, 0);
          @include px2rem(line-height, 50px);
          @include px2rem(font-size, 24px);
          @include px2rem(border-radius, 0);
          background-color: #409eff;
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
      height: 638px;

      .content {
        top: 300px;
        padding: 20px;
        font-size: 24px !important;

        .title {
          font-size: 48px;
        }

        .dec {
          font-size: 24px;
          margin: 20px 0;
        }

        .dec3 {
          margin-top: 50px;
        }

        /deep/ {
          .el-input__inner {
            width: 470px;
            height: 50px;
            font-size: 24px;
          }
        }

        .dbtn.el-button {
          width: 242px;
          height: 53px;
          margin-top: 20px;
          line-height: 53px;
          font-size: 24px;
          border-radius: 27px;
        }

        .reject_type {
          margin-top: 10px;
          font-size: 18px;
        }

        .codeType {
          margin-top: 50px;
          font-size: 24px;

          .sale_code {
            width: 300px;
            height: 50px;
            line-height: 50px;
            padding-left: 20px;
            padding-right: 20px;
            background-color: #ecebf2;
            font-size: 24px;
          }

          .el-button {
            width: 100px;
            height: 50px;
            line-height: 50px;
            padding: 0;
            margin-top: 0;
            font-size: 24px;
            border-radius: 0;
            background-color: #409eff;
          }
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

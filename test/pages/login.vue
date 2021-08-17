<template>
  <div class="loginWrap">
      <div class="content">
        <div class="row no-gutters full-height">
          <div class="login-form col-xl-8 col-12">
            <div class="loginMethods">
              <div
                class="method"
                :class="{ active: loginMethod === 1 }"
                @click="loginMethod = 1"
              >
                Account login
              </div>
              <div
                class="method"
                :class="{ active: loginMethod === 2 }"
                @click="loginMethod = 2"
              >
                Email login
              </div>
            </div>
            <div class="form-con">
              <div class="text-primary py-2 mb-3 h1">Log in</div>
              <div v-show="loginMethod === 1">
                <el-form
                  :model="loginForm"
                  ref="loginForm"
                  :rules="loginRules"
                  label-position="top"
                  :hide-required-asterisk="true"
                  class="login"
                >
                  <el-form-item prop="email">
                    <el-input v-model="loginForm.email" placeholder="Email">
                      <img
                        slot="prefix"
                        src="~assets/images/user.png"
                        alt="user"
                      />
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="password">
                    <el-input
                      type="password"
                      v-model="loginForm.password"
                      placeholder="Password"
                      @keyup.enter.native="submitForm('loginForm')"
                    >
                      <img
                        slot="prefix"
                        src="~assets/images/lock.png"
                        alt="lock"
                      />
                    </el-input>
                  </el-form-item>
                  <div class="remember">
                    <div class="left">
                      <el-checkbox v-model="rememberPassword"
                        >Remember Me
                      </el-checkbox>
                    </div>
                    <a href="javascript:;" @click="forgotPassword"
                      >Forgot Password?</a
                    >
                  </div>
                </el-form>
                <el-button
                  type="primary"
                  class="submitBtn"
                  round
                  :loading="formLoading"
                  @click="submitForm('loginForm')"
                  >Log in
                </el-button>
              </div>
              <div v-show="loginMethod === 2">
                <el-form
                  :model="loginForm2"
                  ref="loginForm2"
                  :rules="loginRules2"
                  label-position="top"
                  :hide-required-asterisk="true"
                  class="login"
                >
                  <el-form-item prop="email">
                    <el-input v-model="loginForm2.email" placeholder="Email">
                      <img
                        slot="prefix"
                        src="~assets/images/user.png"
                        alt="user"
                      />
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="code">
                    <el-input
                      v-model="loginForm2.code"
                      placeholder="Verification code"
                      :disabled="waitTime==60"
                      @keyup.enter.native="submitForm2('loginForm2')"
                    >
                      <el-button
                        slot="append"
                        @click="getCode"
                        :loading="getCodeLoading"
                        :disabled="disabledBtn"
                        class="getCodeBtn"
                        style="width: 120px"
                        >{{ disabledBtn ? waitTime + 's' : 'Get Code' }}
                      </el-button>
                    </el-input>
                  </el-form-item>
                </el-form>
                <el-button
                  type="primary"
                  class="submitBtn"
                  round
                  :loading="form2Loading"
                  @click="submitForm2('loginForm2')"
                  >Log in
                </el-button>
              </div>
              <p class="goregister">
                Don't have an account? &nbsp;
                <nuxt-link to="/register" style="text-decoration: underline"
                  >JOIN FREE
                </nuxt-link>
              </p>
            </div>
            <div class="thirdLogin py-3">
              <thirdPartLogin @thirdPartyLoginAfter="loginAfter"></thirdPartLogin>
            </div>
          </div>
          <div
            class="wel d-none d-xl-block col-4 text-white"
          >
            <div class="text d-flex flex-column justify-content-center align-items-center h-100">
              <h3 class="p-2 mb-3">Hello, Friend!</h3>
              <p>
                Enter your personal details
                <br />and start journey with us
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { getPageInfo } from '@/api/public'
import { sendLoginEmail } from '@/api/account'
import thirdPartLogin from '@/components/thirdPartLogin'

export default {
  middleware: 'loginAndRegisterPer',
  async asyncData({ app }) {
    let { data } = await getPageInfo({
      pageName: 'login'
    })
    return {
      seoTitle: data.title,
      seoDescription: data.description,
      seoKeyword: data.keyword,
      structuring: data.structuring
    }
  },
  head() {
    return {
      title: this.seoTitle,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.seoDescription
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: this.seoKeyword
        }
      ],
      script: this.structuring?[
        {
          type: "application/ld+json",
          innerHTML: this.structuring,
        },
      ]:[]
    }
  },
  components: {
    thirdPartLogin,
  },
  data() {
    return {
      rememberPassword: false,
      loginForm: {
        email: '',
        password: ''
      },
      loginRules: {
        email: [
          {
            required: true,
            message: 'Please enter your email address',
            trigger: 'submitForm'
          },
          {
            type: 'email',
            message: 'Please enter the correct email address',
            trigger: 'submitForm'
          }
        ],
        password: [
          {
            required: true,
            message: ' Please enter your password',
            trigger: 'submitForm'
          }
        ]
      },
      loginForm2: {
        email: '',
        code: ''
      },
      loginRules2: {
        email: [
          {
            required: true,
            message: 'Please enter your email address',
            trigger: 'submitForm2'
          },
          {
            type: 'email',
            message: 'Please enter the correct email address',
            trigger: 'submitForm2'
          }
        ],
        code: [
          {
            required: true,
            message: ' Please enter your verification code',
            trigger: 'submitForm2'
          }
        ]
      },
      loginMethod: 1,
      formLoading: false,
      form2Loading: false,
      getCodeLoading: false,
      disabledBtn: false,
      waitTime: 60
    }
  },
  methods: {
    countDown() {
      let timer = setInterval(() => {
        this.waitTime--
        if (this.waitTime <= 0) {
          this.disabledBtn = false
          clearInterval(timer)
        }
      }, 1000)
    },

    getCode() {
      this.$refs['loginForm2'].validateField('email', res => {
        if (!res) {
          this.getCodeLoading = true
          sendLoginEmail({
            email: this.loginForm2.email
          })
            .then(res => {
              this.$message({
                type: 'success',
                message: res.msg
              })
              this.disabledBtn = true
              this.waitTime = 60
              this.countDown()
            })
            .finally(err => {
              this.getCodeLoading = false
            })
        }
      })
    },

    //登录之后的操作
    loginAfter(){
      console.log('第三方登录')
      try {
        let prevRouteName = JSON.parse(
          sessionStorage.getItem('prevRouteName')
        )
        if(prevRouteName && prevRouteName.name){
          console.log(prevRouteName)
          this.$router.push(prevRouteName)
        }else{
          this.$router.push({
            path: '/'
          })
        }
      } catch {
        this.$router.push({
          path: '/'
        })
      }
    },

    //账号密码登录
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.formLoading = true
          let postData = this.loginForm
          if (this.rememberPassword) {
            this.$utils.setCookie(
              'SUSER',
              this.$utils.encryptedFun(postData),
              30
            )
          } else {
            this.$utils.removeCookie('SUSER')
          }
          localStorage.setItem('rememberPassword', this.rememberPassword)
          this.$store
            .dispatch('logined', postData)
            .then(() => {
              this.loginAfter()
            })
            .finally(() => {
              this.formLoading = false
            })
        }
      })
    },

    //邮箱登录
    submitForm2(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form2Loading = true
          let postData = this.loginForm2
          this.$store
            .dispatch('emailLogin', postData)
            .then(() => {
              this.loginAfter()
            })
            .finally(() => {
              this.form2Loading = false
            })
        }
      })
    },
    forgotPassword() {
      let routeUrl = this.$router.resolve({
        path: '/forgot'
      })
      window.open(routeUrl.href, '_blank')
    }
  },
  mounted() {
    if (localStorage.getItem('rememberPassword') == 'true') {
      this.rememberPassword = true
      this.loginForm = this.$utils.getcookiesInClient('SUSER')
        ? this.$utils.decodeFun(this.$utils.getcookiesInClient('SUSER'))
        : {
            email: '',
            password: ''
          }
    } else {
      this.rememberPassword = false
    }
  }
}
</script>

<style lang="scss" scoped>
.loginWrap /deep/ .getCodeBtn{
  background-color: #409eff;
  color:#fff;
  border-radius: 0;
  border-color: #409eff;
  width: 100px !important;
}
.loginWrap {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
  width: 100%;
  height:100%;
  @include px2rem(padding,40px);
  background: url('https://sticker-static.oss-us-west-1.aliyuncs.com/image/uploads/20201216/9f3005ebf82f142dfaa0aa0d75df2769.jpg')
    center no-repeat;
  background-size: cover;

  .content {
    flex:1;
    overflow: hidden;
    border-radius: 20px;
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 2px 2px 5px 5px rgba(0, 0, 0, 0.1);

    .loginMethods {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      @include px2rem(height,80px);
      @include px2rem(line-height,80px);
      text-align: center;

      .method {
        flex: 1;
        background-color: #eee;
        cursor: pointer;
        @include px2rem(font-size,24px);
        &.active {
          background-color: #fff;
        }
      }
    }

    .login-form {
      .form-con {
        @include px2rem(padding,20px);
        text-align: center;

        .goregister {
          line-height: normal;
          color: #989898;
          @include px2rem(font-size,20px);

          a {
            color: $primary;
            font-weight: 700;
          }
        }
      }

      .remember {
        display: flex;
        justify-content: space-between;
        align-items: center;

        span,a {
          color: $primary;
          @include px2rem(font-size,20px);
          cursor: pointer;
        }
      }

      .submitBtn {
        @include px2rem(width,200px);
        margin: 20px auto;
        @include px2rem(font-size,18px);
        min-width: 200px;
      }
    }

    .wel {
      background: url('https://sticker-static.oss-us-west-1.aliyuncs.com/image/uploads/20201216/b5f0febad66938d8dc430a60c165a697.jpg')
        center no-repeat;
      background-size: cover;
    }
  }
}
@media screen and (min-width:$breakpoint-xl-min){
  .loginWrap{
    height:calc(100vh - 144px);
    .content{
      flex:none;
      width: 850px;
      .loginMethods {
        height: 40px;
        line-height: 40px;
        .method {
          font-size:18px;
        }
      }
      .login-form {
        .form-con {
          padding:20px;
          .goregister {
            font-size:16px;
          }
        }

        .remember {
          span,a {
            font-size:16px;
          }
        }

        .submitBtn {
          width: 200px;
          font-size:18px;
        }
      }
    }
  }
}
</style>

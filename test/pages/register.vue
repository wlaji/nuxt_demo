<template>
  <div class="registerWrap">
      <div class="content">
        <div class="row no-gutters full-height">
          <div
            class="wel d-none d-xl-block col-4 text-white"
          >
            <div class="text-center d-flex flex-column justify-content-center align-items-center h-100">
              <h3 class="p-2 mb-3">
                Welcom to
                <br />Custom Sticker!
              </h3>
              <p>
                To keep connected with us
                <br />please login with persona <br />into
              </p>
            </div>
          </div>
          <div class="register-form col-xl-8 col-12">
            <div class="form-con py-2">
              <div class="title">
                <div class="text-primary py-2 h1">Create Account</div>
                <p>
                  Already have an Account? &nbsp;
                  <nuxt-link to="/login">Sign In Now</nuxt-link>
                </p>
              </div>
              <el-form
                ref="registerForm"
                class="register"
                :model="registerForm"
                :rules="registerRules"
                label-width="120px"
                size="small"
              >
                <el-form-item prop="first_name" label="First Name">
                  <el-input
                    v-model="registerForm.first_name"
                    placeholder="First Name"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="last_name" label="Last Name">
                  <el-input
                    v-model="registerForm.last_name"
                    placeholder="Last Name"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="email" label="Email">
                  <el-input
                    v-model="registerForm.email"
                    placeholder="Email"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="password" label="Password">
                  <el-input
                    type="password"
                    v-model="registerForm.password"
                    placeholder="Password"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>

                <el-form-item label="Confirm password" prop="checkPassword">
                  <el-input
                    type="password"
                    v-model="registerForm.checkPassword"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>

                <el-form-item prop="country" label="Country">
                  <el-select
                    v-model="registerForm.country"
                    placeholder="Please select the country"
                    filterable
                    :filter-method="filterCountry"
                    style="width: 100%"
                  >
                    <el-option
                      :label="item.name"
                      :value="item.id"
                      v-for="item in countryList"
                      :key="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="Verify code" prop="verifyCode">
                  <el-input
                    v-model="registerForm.verifyCode"
                    placeholder="verification code"
                    @keyup.enter.native="submitForm('registerForm')"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <div class="float-left" @click="refreshCode">
                    <s-identify :identifyCode="identifyCode"></s-identify>
                  </div>
                </el-form-item>
              </el-form>
              <el-button
                type="primary"
                round
                :loading="registerFormLoading"
                class="submitBtn"
                href="javascript:"
                @click="submitForm('registerForm')"
                >SIGN UP
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import SIdentify from '@/components/identify.vue'
import { getPageInfo, getCountry } from '@/api/public'
import { register } from '@/api/account'

export default {
  middleware: 'loginAndRegisterPer',
  async asyncData({ app }) {
    let { data } = await getPageInfo({
      pageName: 'register'
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
  data() {
    let checkCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('Please enter your verification code'))
      }
      if (value != this.identifyCode) {
        callback(new Error('Verification code error'))
      }
      callback()
    }
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Enter Password'))
      } else {
        if (this.registerForm.checkPassword !== '') {
          this.$refs.registerForm.validateField('checkPassword')
        }
        callback()
      }
    }
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Password Enter Again'))
      } else if (value !== this.registerForm.password) {
        callback(new Error('Passwords Inconsistent!'))
      } else {
        callback()
      }
    }
    return {
      registerFormLoading: false,
      identifyCode: '',
      identifyCodes: '1234567890',
      code: '',
      getCode: '',
      countryList: [],
      countryListCopy: [],
      registerForm: {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        checkPassword: '',
        country: '',
        verifyCode: ''
      },
      registerRules: {
        first_name: [
          {
            required: true,
            message: ' Please enter your First Name',
            trigger: 'blur'
          }
        ],
        last_name: [
          {
            required: true,
            message: ' Please enter your Last Name',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: 'Please enter your email address',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: 'Please enter the correct email address',
            trigger: ['blur']
          }
        ],
        password: [
          {
            validator: validatePass,
            trigger: 'blur'
          }
        ],
        checkPassword: [
          {
            validator: validatePass2,
            trigger: 'blur'
          }
        ],
        country: [
          {
            required: true,
            message: 'Please select the country',
            trigger: 'change'
          }
        ],
        verifyCode: [
          {
            validator: checkCode,
            trigger: 'submitForm'
          }
        ]
      }
    }
  },
  components: {
    SIdentify: SIdentify
  },
  methods: {
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    refreshCode() {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ]
      }
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.registerFormLoading = true
          let registerFormData = this.registerForm
          register(registerFormData).then(res => {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.$store
              .dispatch('logined', {
                email: registerFormData.email,
                password: registerFormData.password
              })
              .then(() => {
                try {
                  let prevRouteName = JSON.parse(
                    sessionStorage.getItem('prevRouteName')
                  )
                  if(prevRouteName && prevRouteName.name){
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
              })
              .finally(() => {
                this.registerFormLoading = false
              })
          })
        }
      })
    },
    filterCountry(query) {
      if (query !== '') {
        let countryList = this.countryListCopy
        let filterCountryList = countryList.filter(item => {
          return item.name.toUpperCase().startsWith(query.toUpperCase())
        })
        this.countryList = filterCountryList
      } else {
        this.countryList = this.countryListCopy
      }
    }
  },

  mounted() {
    getCountry().then(res => {
      let { data } = res
      this.countryList = this.countryListCopy = data
      let defaultCountry = this.countryList.find(item => {
        return item.is_default === 1
      })
      this.registerForm.country = defaultCountry.id
    })
    this.refreshCode()
  }
}
</script>

<style lang="scss" scoped>
.registerWrap {
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

    .register-form {
      .form-con {
        @include px2rem(padding,20px);
        text-align: center;

        .title {
          @include px2rem(margin-bottom,10px);
          text-align: center;

          p {
            color: #989898;
            @include px2rem(font-size,20px);

            a {
              color: $primary;
              font-weight: 700;
            }
          }
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
      background: url('https://sticker-static.oss-us-west-1.aliyuncs.com/image/uploads/20201216/06ad1c5d315cbac0fd52554b3a03f792.jpg')
        center no-repeat;
      background-size: cover;
    }
  }
}

@media screen and (min-width:$breakpoint-xl-min){
  .registerWrap{
    height:calc(100vh - 144px);
    .content{
      flex:none;
      width: 850px;
      .register-form {
        .form-con {
          padding:20px;

          .title {
            margin-bottom: 10px;

            p {
              color: #989898;
              font-size:16px;
            }
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

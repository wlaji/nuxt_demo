<template>
  <div class="forgotWrap container">
    <div>
      <el-form
        :model="resetForm"
        ref="resetForm"
        :status-icon="true"
        :rules="resetRules"
        class="findPwd"
        @submit.native.prevent
      >
        <h3 class="text-center">Find Your Password</h3>
        <el-form-item prop="email">
          <el-input
            v-model="resetForm.email"
            placeholder="Please enter your Email"
          ></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <div class="row no-gutters">
            <div class="col-7">
              <el-input
                v-model="resetForm.code"
                placeholder="Please enter your code"
              ></el-input>
            </div>
            <div class="col-5 d-flex justify-content-end">
              <el-button
                type="warning"
                class="ml-2 w-100"
                @click="getCode('resetForm')"
              >
                {{ disabledBtn ? waitTime + 's' : 'Get Code' }}
              </el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item prop="new_pwd">
          <el-input
            type="password"
            v-model="resetForm.new_pwd"
            placeholder="Please enter new password"
            auto-complete="new-password"
          ></el-input>
        </el-form-item>
        <el-form-item prop="check_new_pwd">
          <el-input
            type="password"
            v-model="resetForm.check_new_pwd"
            auto-complete="new-password"
            placeholder="Please enter your password again"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            style="width: 100%"
            @click="resetPwd('resetForm')"
            >Reset</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { sendCode, resetPassword } from '@/api/account'

export default {
  middleware: 'loginAndRegisterPer',
  data() {
    let validatePass1 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter password'))
      } else {
        if (this.resetForm.check_new_pwd !== '') {
          this.$refs.resetForm.validateField('check_new_pwd')
        }
        callback()
      }
    }
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter your password again'))
      } else if (value !== this.resetForm.new_pwd) {
        callback(new Error('The two passwords do not match!'))
      } else {
        callback()
      }
    }
    return {
      waitTime: 60,
      disabledBtn: false,
      resetForm: {
        new_pwd: '',
        check_new_pwd: '',
        code: '',
        email: ''
      },
      resetRules: {
        email: [
          {
            required: true,
            message: 'Please enter your email address',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: 'Please enter the correct email address',
            trigger: 'blur'
          }
        ],
        new_pwd: [
          {
            validator: validatePass1,
            trigger: 'blur'
          }
        ],
        check_new_pwd: [
          {
            validator: validatePass2,
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: 'Please enter your verification code',
            trigger: 'blur'
          }
        ]
      }
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
    getCode(formName) {
      this.$refs[formName].validateField('email', valid => {
        console.log(valid)
        if (!valid) {
          let postData = {
            email: this.resetForm.email
          }
          sendCode(postData).then(res => {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.disabledBtn = true
            this.waitTime = 60
            this.countDown()
          })
        }
      })
    },

    resetPwd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let postData = this.resetForm
          resetPassword(postData).then(res => {
            this.$notify({
              message: 'succeed, jump to login page after 1 seconds.',
              type: 'success'
            })
            setTimeout(() => {
              this.$router.push({
                name: 'login'
              })
            }, 1000)
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.forgotWrap {
  position: relative;
}

.findPwd,
.resetPwd {
  margin: 50px auto;
  @include px2rem(width, 600px);
  @media screen and (min-width: 751px) {
    width:400px;
  }

  .error-msg {
    border: 1px #ffdb83 solid;
    color: $danger;
    padding: 5px;
    margin-bottom: 10px;
    background: #fff9e1;
    font-size: 1.4rem;
  }
}
</style>

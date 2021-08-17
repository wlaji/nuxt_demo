<template>
  <!-- 登录弹窗组件 -->
  <base-dialog :visible.sync="showDialog" :lockScroll="lockScroll">
    <template v-slot:content>
      <div class="login-content">
        <div class="position-relative login-bg d-flex-center">
          <div class="title">
            <div class="text-white text-center h2">
              {{ active === 1 ? "Log in" : "Join Free" }}
            </div>
          </div>
          <img
            v-lazy="
              `https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20210728/log-in-bg.d34439f.png`
            "
            alt="log in"
            title="log in"
          />
          <template v-if="active === 1">
            <a href="javascript:;" class="join" @click="active = 2"
              >Join Free>></a
            >
          </template>
          <template v-else>
            <a href="javascript:;" class="join" @click="active = 1">Log In>></a>
          </template>
        </div>
        <div>
          <div class="loginCon" v-if="active === 1">
            <div class="header">
              <ul>
                <li
                  :class="{ active: loginMethod === 1 }"
                  @click="loginMethod = 1"
                >
                  Account login
                </li>
                <li
                  :class="{ active: loginMethod === 2 }"
                  @click="loginMethod = 2"
                >
                  Email login
                </li>
              </ul>
            </div>
            <div class="login-form">
              <div class="form-con">
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
                      <el-checkbox v-model="rememberPassword"
                        >Remember Me
                      </el-checkbox>
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
                        :disabled="waitTime == 60"
                        @keyup.enter.native="submitForm2('loginForm2')"
                      >
                        <el-button
                          slot="append"
                          @click="getCode"
                          :loading="getCodeLoading"
                          :disabled="disabledBtn"
                          class="getCodeBtn"
                          style="width: 120px"
                          >{{ disabledBtn ? waitTime + "s" : "Get Code" }}
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
                <p class="noRegister">
                  Don't have an account? &nbsp;
                  <a
                    href="javascript:;"
                    style="text-decoration: underline"
                    @click="active = 2"
                    >JOIN FREE</a
                  >
                </p>
              </div>
              <div class="thirdLogin">
                <thirdPartLogin
                  @thirdPartyLoginAfter="loginAfter"
                ></thirdPartLogin>
              </div>
            </div>
          </div>
          <div class="registerCon" v-if="active === 2">
            <div class="register-form">
              <div class="form-con">
                <div class="title">
                  <div class="text-primary h2">Create Account</div>
                  <div>
                    Already have an Account? &nbsp;
                    <a href="javascript:;" @click="active = 1">Sign In Now</a>
                  </div>
                </div>
                <el-form
                  ref="registerForm"
                  class="register"
                  :model="registerForm"
                  :rules="registerRules"
                  label-width="120px"
                  size="mini"
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
                      placeholder="Confirm password"
                      v-model="registerForm.checkPassword"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>

                  <el-form-item prop="country" label="Country">
                    <el-select
                      v-model="registerForm.country"
                      popper-class="text-left"
                      :popper-append-to-body="false"
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
                      placeholder="Verification code"
                      @keyup.enter.native="registerUser('registerForm')"
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
                  @click="registerUser('registerForm')"
                >
                  Log in
                </el-button>
              </div>
              <div>
                <span class="line text-secondary">or</span>
              </div>
              <div class="thirdLogin">
                <thirdPartLogin
                  @thirdPartyLoginAfter="loginAfter"
                ></thirdPartLogin>
              </div>
            </div>
          </div>
        </div>
        <div class="close-dialog" @click="cancelLogin">
          <i class="el-icon-circle-close"></i>
        </div>
      </div>
    </template>
  </base-dialog>
</template>

<script>
import SIdentify from "@/components/identify.vue";
import { register, sendLoginEmail } from "@/api/account";
import { getCountry } from "@/api/public";
import thirdPartLogin from "@/components/thirdPartLogin";

export default {
  props: {
    activeTab: {
      type: Number,
      default: 1
    },
    visible: {
      type: Boolean,
      default: false
    },
    lockScroll: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    activeTab(val) {
      this.active = val;
    }
  },
  computed: {
    showDialog: {
      get() {
        return this.visible;
      },
      set() {
        this.cancelLogin();
      }
    }
  },
  data() {
    let checkCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("Please enter your verification code"));
      }
      if (value != this.identifyCode) {
        callback(new Error("Verification code error"));
      }
      callback();
    };
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Enter Password"));
      } else {
        if (this.registerForm.checkPassword !== "") {
          this.$refs.registerForm.validateField("checkPassword");
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Password Enter Again"));
      } else if (value !== this.registerForm.password) {
        callback(new Error("Passwords Inconsistent!"));
      } else {
        callback();
      }
    };
    return {
      active: this.activeTab,
      rememberPassword: "",
      loginForm: {
        email: "",
        password: ""
      },
      loginRules: {
        email: [
          {
            required: true,
            message: "Please enter your email address",
            trigger: "submitForm"
          },
          {
            type: "email",
            message: "Please enter the correct email address",
            trigger: "submitForm"
          }
        ],
        password: [
          {
            required: true,
            message: " Please enter your password",
            trigger: "submitForm"
          }
        ]
      },
      loginForm2: {
        email: "",
        code: ""
      },
      loginRules2: {
        email: [
          {
            required: true,
            message: "Please enter your email address",
            trigger: "submitForm2"
          },
          {
            type: "email",
            message: "Please enter the correct email address",
            trigger: "submitForm2"
          }
        ],
        code: [
          {
            required: true,
            message: " Please enter your verification code",
            trigger: "submitForm2"
          }
        ]
      },
      loginMethod: 1,
      formLoading: false,
      form2Loading: false,
      registerFormLoading: false,
      getCodeLoading: false,
      disabledBtn: false,
      waitTime: 60,
      identifyCode: "",
      identifyCodes: "1234567890",
      loginSet: "",
      countryList: [],
      countryListCopy: [],
      registerForm: {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        checkPassword: "",
        country: "",
        verifyCode: ""
      },
      registerRules: {
        first_name: [
          {
            required: true,
            message: " Please enter your First Name",
            trigger: "blur"
          }
        ],
        last_name: [
          {
            required: true,
            message: " Please enter your Last Name",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: "Please enter your email address",
            trigger: "blur"
          },
          {
            type: "email",
            message: "Please enter the correct email address",
            trigger: ["blur"]
          }
        ],
        password: [
          {
            validator: validatePass,
            trigger: "blur"
          }
        ],
        checkPassword: [
          {
            validator: validatePass2,
            trigger: "blur"
          }
        ],
        country: [
          {
            required: true,
            message: "Please select the country",
            trigger: "change"
          }
        ],
        verifyCode: [
          {
            validator: checkCode,
            trigger: "submitForm"
          }
        ]
      }
    };
  },
  components: {
    SIdentify: SIdentify,
    thirdPartLogin
  },
  methods: {
    //第三方登录之后的操作
    loginAfter() {
      this.$emit("logined");
    },

    cancelLogin() {
      this.$emit("update:visible", false);
    },

    forgotPassword() {
      let routeUrl = this.$router.resolve({
        path: "/forgot"
      });
      window.open(routeUrl.href, "_blank");
    },

    countDown() {
      let timer = setInterval(() => {
        this.waitTime--;
        if (this.waitTime <= 0) {
          this.disabledBtn = false;
          clearInterval(timer);
        }
      }, 1000);
    },

    getCode() {
      this.$refs["loginForm2"].validateField("email", res => {
        if (!res) {
          this.getCodeLoading = true;
          sendLoginEmail({
            email: this.loginForm2.email
          })
            .then(res => {
              this.$message({
                type: "success",
                message: res.msg
              });
              this.disabledBtn = true;
              this.waitTime = 60;
              this.countDown();
            })
            .finally(err => {
              this.getCodeLoading = false;
            });
        }
      });
    },

    //账号密码登录
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.formLoading = true;
          let postData = this.loginForm;
          if (this.rememberPassword) {
            this.$utils.setCookie(
              "SUSER",
              this.$utils.encryptedFun(postData),
              30
            );
          } else {
            this.$utils.removeCookie("SUSER");
          }
          localStorage.setItem("rememberPassword", this.rememberPassword);
          this.$store
            .dispatch("logined", postData)
            .then(() => {
              this.$emit("logined");
            })
            .finally(() => {
              this.formLoading = false;
            });
        }
      });
    },

    //邮箱登录
    submitForm2(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form2Loading = true;
          let postData = this.loginForm2;
          this.$store
            .dispatch("emailLogin", postData)
            .then(() => {
              this.$emit("logined");
            })
            .finally(() => {
              this.form2Loading = false;
            });
        }
      });
    },

    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },

    refreshCode() {
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
    },

    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ];
      }
    },

    registerUser(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.registerFormLoading = true;
          let registerFormData = this.registerForm;
          register(registerFormData).then(res => {
            this.$message({
              type: "success",
              message: res.msg
            });
            this.$store
              .dispatch("logined", {
                email: registerFormData.email,
                password: registerFormData.password
              })
              .then(() => {
                this.$emit("logined");
              })
              .finally(() => {
                this.registerFormLoading = false;
              });
          });
        }
      });
    },

    filterCountry(query) {
      if (query !== "") {
        let countryList = this.countryListCopy;
        let filterCountryList = countryList.filter(item => {
          return item.name.toUpperCase().startsWith(query.toUpperCase());
        });
        this.countryList = filterCountryList;
      } else {
        this.countryList = this.countryListCopy;
      }
    }
  },
  created() {
    getCountry().then(res => {
      let { data } = res;
      this.countryList = this.countryListCopy = data;
      let defaultCountry = this.countryList.find(item => {
        return item.is_default === 1;
      });
      this.registerForm.country = defaultCountry.id;
    });
  },
  mounted() {
    this.refreshCode();
    if (localStorage.getItem("rememberPassword") == "true") {
      this.rememberPassword = true;
      this.loginForm = this.$utils.getcookiesInClient("SUSER")
        ? this.$utils.decodeFun(this.$utils.getcookiesInClient("SUSER"))
        : {
            email: "",
            password: ""
          };
    } else {
      this.rememberPassword = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.login-content /deep/ .getCodeBtn {
  background-color: #409eff;
  color: #fff;
  border-radius: 0;
  border-color: #409eff;
  width: 100px !important;
}

//登录弹窗包裹层
.login-content {
  @include px2rem(width, 600px);
  background-color: #fff;
  border-radius: 10px;

  .login-bg {
    .title {
      position: absolute;
      text-align: center;
    }

    .join {
      position: absolute;
      @include px2rem(top, 10px);
      @include px2rem(right, 10px);
      text-decoration: underline;
      color: #fff;
      @include px2rem(font-size, 18px);
    }

    img {
      width: 100%;
      @include px2rem(height, 111px);
    }
  }

  .header {
    @include px2rem(padding, 20px);

    ul {
      display: flex;

      li {
        margin: 0 10px;
        @include px2rem(padding, 10px);
        flex: 1;
        text-align: center;
        color: #608fa6;
        border-bottom: 4px solid $primary;
        opacity: 0.5;
        cursor: pointer;
        @include px2rem(font-size, 24px);
      }

      li:hover {
        color: $primary;
        opacity: 1;
      }

      li.active {
        color: $primary;
        opacity: 1;
      }
    }
  }

  .submitBtn {
    @include px2rem(width, 242px);
    @include px2rem(height, 53px);
    padding: 0;
    @include px2rem(margin-top, 20px);
    @include px2rem(line-height, 53px);
    @include px2rem(font-size, 24px);
    @include px2rem(border-radius, 27px);
  }

  .login-form,
  .register-form {
    @include px2rem(padding, 20px);

    .form-con {
      margin: 0 auto;
      text-align: center;
    }

    .remember {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
    }
  }

  .register-form .title {
    @include px2rem(margin-bottom, 20px);
    @include px2rem(font-size, 24px);
  }

  .noRegister {
    line-height: normal;
    color: #989898;
    @include px2rem(font-size, 20px);
    @include px2rem(margin-top, 20px);

    a {
      color: $primary;
      font-weight: 700;
    }
  }

  .register-form .thirdLogin .thirdPartLoginWrap {
    flex-direction: column;
    align-items: center;
  }

  .thirdLogin {
    @include px2rem(margin-top, 20px);
  }
}

.line {
  display: block;
  position: relative;
  margin: 10px 0 0;
  text-align: center;
  font-size: 18px;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: calc(50% - 1px);
    right: 55%;
    height: 2px;
    background-color: #ccc;
  }

  &::after {
    content: "";
    position: absolute;
    left: 55%;
    right: 0;
    top: calc(50% - 1px);
    height: 2px;
    background-color: #ccc;
  }
}

.close-dialog {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: auto;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  background: #fff;
  border-radius: 50%;
  font-size: 0;

  i {
    font-size: 30px;
  }
}

@media screen and (min-width: 751px) {
  .login-content {
    width: 600px;

    h2 {
      font-size: 30px !important;
    }

    .login-bg {
      .join {
        top: 10px;
        right: 10px;
        font-size: 16px;
      }

      img {
        height: 111px;
      }
    }

    .header {
      padding: 10px;

      ul {
        li {
          padding: 10px;
          font-size: 24px;
        }
      }
    }

    .submitBtn {
      width: 242px;
      height: 53px;
      margin-top: 10px;
      line-height: 53px;
      font-size: 24px;
      border-radius: 27px;
    }

    .login-form,
    .register-form {
      padding: 10px;
    }

    .noRegister {
      margin-top: 20px;
      font-size: 20px;
    }

    .register-form .title {
      margin-bottom: 10px;
      font-size: 14px;
    }

    .register-form .thirdLogin .thirdPartLoginWrap {
      flex-direction: column;
      align-items: center;
    }

    .thirdLogin {
      margin-top: 10px;
    }
  }

  .close-dialog {
    position: absolute;
    top: 0;
    right: 0;
    bottom: auto;
    left: auto;
    transform: translate(50%, -50%);
  }
}
</style>
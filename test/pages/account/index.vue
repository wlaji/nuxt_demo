<template>
  <div class="accountSetting p-2">
    <div class="container">
      <div class="info mt-3">
        <h3><span class="text-danger">*</span> Personal Information</h3>
        <div class="setting-section">
          <el-form
            :label-position="labelPosition"
            :model="personalInfoForm"
            :disabled="!editAccountInfo"
            :hide-required-asterisk="true"
            ref="personalInfoForm"
            :rules="personalInfoRules"
            label-width="140px"
          >
            <el-form-item prop="first_name" label="FirstName">
              <el-input v-model="personalInfoForm.first_name"></el-input>
            </el-form-item>
            <el-form-item prop="last_name" label="LastName">
              <el-input v-model="personalInfoForm.last_name"></el-input>
            </el-form-item>
            <el-form-item prop="age" label="Age">
              <el-input v-model="personalInfoForm.age"></el-input>
            </el-form-item>

            <el-form-item prop="birthday" label="Birthday">
              <el-date-picker
                type="date"
                v-model="personalInfoForm.birthday"
                style="width: 100%"
                format="yyyy - MM - dd"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>

            <el-form-item prop="phone" label="Telephone">
              <el-input v-model="personalInfoForm.phone"></el-input>
            </el-form-item>

            <el-form-item prop="sex">
              <el-radio-group class="mt-2" v-model="personalInfoForm.sex">
                <el-radio :label="0">men</el-radio>
                <el-radio :label="1">women</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="">
              <div class="d-flex-center mt-4">
                <template v-if="editAccountInfo">
                  <button
                    type="button"
                    class="btn btn-primary mr-2"
                    @click="updateInfo('personalInfoForm')"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-primary"
                    @click="cancelEditAccountInfo('personalInfoForm')"
                  >
                    Cancel
                  </button>
                </template>
                <template v-else>
                  <button
                    type="button"
                    class="btn btn-primary"
                    @click="editInfo"
                  >
                    Edit
                  </button>
                </template>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="info mt-3">
        <h3><span class="text-danger">*</span> Password</h3>
        <div class="setting-section">
          <el-form
            :label-position="labelPosition"
            :model="resetPwdForm"
            :disabled="!editAccountPassword"
            ref="resetPwdForm"
            :rules="resetPwdRules"
            label-width="140px"
          >
            <el-form-item label="Current Password" prop="old_pwd">
              <el-input
                type="password"
                v-model="resetPwdForm.old_pwd"
              ></el-input>
            </el-form-item>
            <el-form-item label="New Password" prop="new_pwd">
              <el-input
                type="password"
                v-model="resetPwdForm.new_pwd"
              ></el-input>
            </el-form-item>
            <el-form-item label="Confirm Password" prop="checkPassword">
              <el-input
                type="password"
                v-model="resetPwdForm.checkPassword"
                @keyup.enter.native="updatePwd('resetPwdForm')"
              ></el-input>
            </el-form-item>
            <el-form-item label="">
              <div class="d-flex-center mt-4">
                <template v-if="editAccountPassword">
                  <button
                    type="button"
                    class="btn btn-primary mr-2"
                    @click="updatePwd('resetPwdForm')"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-primary"
                    @click="cancelEditAccountPassword('resetPwdForm')"
                  >
                    Cancel
                  </button>
                </template>
                <template v-else>
                  <button
                    type="button"
                    class="btn btn-primary"
                    @click="editAccountPassword = true"
                  >
                    Edit
                  </button>
                </template>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { updateUserInfo, updateUserPwd } from "@/api/account";

export default {
  middleware: 'permission',
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please enter password"));
      } else {
        if (this.resetPwdForm.checkPassword !== "") {
          this.$refs.resetPwdForm.validateField("checkPassword");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please enter your password again"));
      } else if (value !== this.resetPwdForm.new_pwd) {
        callback(new Error("The two passwords do not match!"));
      } else {
        callback();
      }
    };
    return {
      editAccountInfo: false,
      editAccountPassword: false,
      personalInfoForm: {
        first_name: "",
        last_name: "",
        age: "",
        sex: "",
        birthday: "",
        phone: ""
      },
      personalInfoRules: {
        first_name: [
          {
            required: true,
            trigger: "blur"
          }
        ],
        last_name: [
          {
            required: true,
            trigger: "blur"
          }
        ],
        age: [
          {
            required: true,
            trigger: "blur"
          }
        ],
        sex: [
          {
            required: true,
            trigger: "blur"
          }
        ],
        birthday: [
          {
            required: true,
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            trigger: "blur"
          }
        ]
      },
      resetPwdForm: {
        old_pwd: "",
        new_pwd: "",
        checkPassword: ""
      },
      resetPwdRules: {
        old_pwd: [
          {
            validator: validatePass,
            trigger: "blur"
          }
        ],
        new_pwd: [
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
        ]
      }
    };
  },
  computed: {
    labelPosition() {
      let device = this.$store.state.device.type;
      console.log(device);
      if (device === "pc") {
        return "left";
      } else {
        return "top";
      }
    }
  },
  methods: {
    editInfo(){
      this.initPersonalInfoForm();
      this.editAccountInfo = true;
    },
    cancelEditAccountInfo(formName) {
      this.editAccountInfo = false;
      this.initPersonalInfoForm()
    },
    cancelEditAccountPassword(formName) {
      this.editAccountPassword = false;
      this.$refs[formName].resetFields();
    },
    updateInfo(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let postData = this.personalInfoForm;
          updateUserInfo(postData).then(res => {
            if (res.ret === 1) {
              this.editAccountInfo = false;
              this.$message.success(res.msg);
              this.$store.dispatch("getUserInfo");
            }
          });
        }
      });
    },
    updatePwd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let postData = this.resetPwdForm;
          updateUserPwd(postData).then(res => {
            this.editAccountPassword = false;
            this.$nextTick(()=>{
              this.$refs[formName].resetFields();
              this.$message.success(res.msg);
            })
          });
        }
      });
    },
    initPersonalInfoForm(){
      let {
        first_name,
        last_name,
        phone,
        age,
        sex,
        birthday
      } = this.$store.state.authInfo;
      this.personalInfoForm = {
        first_name,
        last_name,
        phone,
        age,
        sex,
        birthday
      };
    }
  },
  mounted() {
    this.initPersonalInfoForm()
  }
};
</script>

<style lang="scss" scoped>
.accountSetting {
  .info {
    h3 {
      @include px2rem(font-size, 28px);
      @include px2rem(margin-bottom, 40px);
    }

    .setting-section {
      /deep/ .el-form-item__label {
        @include px2rem(font-size, 28px);
        @include px2rem(line-height, 40px);
        color: #333;
        font-weight: 600;
        text-align: right;
      }

      /deep/ .el-radio-group {
        display: flex;
      }

      /deep/ .el-radio {
        display: flex;
        align-items: center;
      }

      /deep/ .el-radio__input {
        font-size: 0;
      }

      /deep/ .el-radio__label {
        @include px2rem(font-size, 28px);
        color: #333;
        font-weight: 600;
        vertical-align: middle;
      }

      /deep/ .el-input {
        @include px2rem(height, 83px);

        .el-input__inner {
          height: 100%;
          @include px2rem(font-size, 24px);
          background-color: #edf3f9;
          color: #333;
        }
      }

      /deep/ .el-input__icon {
        color: #333;
      }

      .btn {
        display: flex;
        justify-content: center;
        align-items: center;
        @include px2rem(width, 315px);
        @include px2rem(height, 83px);
        padding: 0;
        @include px2rem(font-size, 32px);
      }
    }
  }
}

@media screen and (min-width: $breakpoint-xl-min) {
  .accountSetting {
    width: 80%;
    margin: 0 auto;

    .info {
      h3 {
        font-size: 16px;
        margin-bottom: 20px;
      }

      .setting-section {
        margin-left: 50px;

        /deep/ .el-form-item__label {
          font-size: 16px;
          line-height: 40px;
        }

        /deep/ .el-radio__label {
          font-size: 16px;
        }

        /deep/ .el-input {
          height: 40px;

          .el-input__inner {
            height: 100%;
            font-size: 16px;
          }
        }

        .btn {
          width: 125px;
          height: 36px;
          line-height: 36px;
          font-size: 18px;
        }
      }
    }
  }
}
</style>

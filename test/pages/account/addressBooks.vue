<template>
  <div class="addressBooks px-3">
    <div class="edit" v-if="isEdit">
      <div class="w-100 mt-3 mt-xl-4">
        <span class="font-weight-bold" style="--pc: 16px; --mb: 28rem"
          >Indicates required fields</span
        >
      </div>
      <div class="my-4 my-xl-5">
        <el-form
          ref="form"
          :label-position="clientWidth < 1200 ? 'top' : 'right'"
          :model="form"
          label-width="200px"
        >
          <el-form-item
            label="First Name :"
            prop="first_name"
            :rules="[
              {
                required: true,
                message: 'First Name is required',
                trigger: 'blur',
              },
            ]"
          >
            <el-input v-model="form.first_name"></el-input>
          </el-form-item>
          <el-form-item
            label="Last Name :"
            prop="last_name"
            :rules="[
              {
                required: true,
                message: 'Last Name is required',
                trigger: 'blur',
              },
            ]"
          >
            <el-input v-model="form.last_name"></el-input>
          </el-form-item>
          <el-form-item
            label="Address :"
            prop="address_line"
            :rules="[
              {
                required: true,
                message: 'Address is required',
                trigger: 'blur',
              },
            ]"
          >
            <el-input v-model="form.address_line"></el-input>
          </el-form-item>
          <el-form-item
            label="City :"
            prop="city_name"
            :rules="[
              { required: true, message: 'City is required', trigger: 'blur' },
            ]"
          >
            <el-input v-model="form.city_name"></el-input>
          </el-form-item>
          <el-form-item
            label="Country :"
            prop="country_id"
            :rules="[
              {
                required: true,
                message: 'Country is required',
                trigger: 'blur',
              },
            ]"
          >
            <el-select
              v-model="form.country_id"
              filterable
              :popper-append-to-body="false"
              @change="changeCountryFun(form.country_id)"
            >
              <el-option
                v-for="item in countryList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="State/Province/Region :"
            prop="state_id"
            :rules="[
              {
                required: true,
                message: 'State/Province/Region is required',
                trigger: 'blur',
              },
            ]"
          >
            <el-select
              v-model="form.state_id"
              filterable
              :popper-append-to-body="false"
            >
              <el-option
                v-for="item in stateList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="Zip/Postal Code :"
            prop="zip"
            :rules="[
              {
                required: true,
                message: 'Zip/Postal Code is required',
                trigger: 'blur',
              },
            ]"
          >
            <el-input v-model="form.zip"></el-input>
          </el-form-item>
          <el-form-item
            label="Phone Number :"
            class="sp"
            prop="phone"
            :rules="[
              {
                required: true,
                message: 'Phone Number is required',
                trigger: 'blur',
              },
            ]"
          >
            <el-input v-model="form.phone">
              <template slot="prepend">+1</template>
            </el-input>
          </el-form-item>
          <el-form-item label=" " class="noLabel">
            <span class="example">Example : +1 954522255-532</span>
          </el-form-item>
          <div class="mb-0 row">
            <div
              class="
                col-12
                order-0
                col-xl-4
                d-flex
                align-items-center
                justify-content-xl-end justify-content-start
                my-1 my-xl-0
              "
            >
              <div class="submitZ">
                <label for="default" class="myCheckbox">
                  <checkbox
                    v-model="form.default"
                    c_id="default"
                    c_info="Set as default address"
                    class="ml-1"
                  ></checkbox>
                </label>
              </div>
            </div>

            <div
              class="
                col-12 col-xl-4
                order-xl-1 order-2
                text-center
                my-1 my-xl-0
              "
            >
              <el-button
                class="font-weight-bold"
                style="--pc: 18px; --mb: 32rem"
                @click="cancelFun"
                >Cancel</el-button
              >
            </div>
            <div
              class="
                col-12 col-xl-4
                order-xl-2 order-1
                text-center
                my-1 my-xl-0
              "
            >
              <el-button
                @click="submitAddressFun()"
                class="font-weight-bold"
                type="primary"
                style="--pc: 18px; --mb: 32rem"
                >{{ addBtn ? "Submit" : "Update" }}</el-button
              >
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <div class="w-100 py-4 px-3" v-else>
      <div class="row">
        <div
          class="col-xl-6 my-1 h-auto"
          v-for="item in addressList"
          :key="item.id"
        >
          <el-card
            class="box-card h-100"
            :style="item.default === 1 ? 'border-color:#409eff' : ''"
            :body-style="{ padding: '0px' }"
          >
            <div slot="header" class="clearfix">
              <div class="text item">
                <div class="font-weight-bold my-1">
                  <span style="--pc: 16px; --mb: 32rem"
                    >{{ item.first_name }} {{ item.last_name }}</span
                  >
                </div>
                <div class="my-1">
                  <span style="--pc: 16px; --mb: 28rem">{{
                    item.address_line
                  }}</span>
                </div>
                <div class="my-1">
                  <span style="--pc: 16px; --mb: 28rem">{{
                    item.city_name
                  }}</span>
                </div>
                <div class="my-1">
                  <span style="--pc: 16px; --mb: 28rem">{{
                    item.country
                  }}</span>
                </div>
                <div class="my-1">
                  <span style="--pc: 16px; --mb: 28rem">{{ item.state }}</span>
                </div>
                <div class="my-1">
                  <span style="--pc: 16px; --mb: 28rem">{{ item.zip }}</span>
                </div>
                <div class="my-1">
                  <span style="--pc: 16px; --mb: 28rem">{{ item.phone }}</span>
                </div>
              </div>
            </div>
            <div class="d-flex justify-content-between px-xl-3 pr-2 py-2">
              <div class="d-flex">
                <div>
                  <el-button
                    @click="editAddressFun('edit', item)"
                    type="text"
                    class="px-2"
                    style="--pc: 18px; --mb: 28rem"
                    >Edit</el-button
                  >
                </div>
                <div>
                  <el-button
                    @click="deleteAddress(item)"
                    type="text"
                    class="px-2"
                    style="--pc: 18px; --mb: 28rem"
                    >Delete</el-button
                  >
                </div>
              </div>
              <div class="submitZ">
                <label :for="item.id" class="myCheckbox">
                  <checkbox
                    :c_id="item.id"
                    c_info="Set as default address"
                    class="ml-1"
                    v-model="item.default"
                    @change="submitAddressFun('checkbox', item)"
                  ></checkbox>
                </label>
              </div>
            </div>
          </el-card>
        </div>
      </div>
      <div class="mt-4 d-flex flex-column align-items-center">
        <div
          class="no-address-info text-center mb-3"
          v-if="!addressList.length > 0"
        >
          <p class="font-weight-bold">No address information</p>
        </div>
        <div class="w-100 text-center">
          <el-button
            type="primary"
            class="new-address"
            @click="editAddressFun('new')"
            style="--pc: 18px; --mb: 32rem"
            >+ ADD NEW ADDRESS</el-button
          >
        </div>
      </div>
    </div>

    <div></div>
  </div>
</template>

<script>
import checkbox from "@/components/checkbox.vue";
import { delAddress, getUserAddressList, editAddress } from "@/api/account";
import { getCountry, getState } from "@/api/public";

export default {
  middleware: "permission",
  data() {
    return {
      form: {
        first_name: "",
        last_name: "",
        country_id: "",
        state_id: "",
        city_name: "",
        address_line: "",
        zip: "",
        phone: "",
        default: "",
        id: "",
      },
      isEdit: false,
      clientWidth: "",
      addressList: [],
      value: "",
      addBtn: false,
      countryList: [],
      stateList: [],
    };
  },
  components: { checkbox },
  methods: {
    reset() {
      this.form = {
        first_name: "",
        last_name: "",
        country_id: "",
        state_id: "",
        city_name: "",
        address_line: "",
        zip: "",
        phone: "",
        default: "",
        id: "",
      };
    },
    deleteAddress(item) {
      this.$confirm("Confirm delete?", "Hint", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          delAddress({
            id: item.id,
          }).then((res) => {
            this.$message.success(res.msg);
            this.getUserAddressList();
          });
        })
        .catch(() => {});
    },
    //提交
    submitAddressFun(type, val) {
      let postData;
      // if (postData.default == false) {
      //   postData.default = 0;
      // } else {
      //   postData.default = 1;
      // }
      let loading = this.$loading({
        background: "rgba(0, 0, 0, 0.8)",
        spinner: "el-icon-loading",
        text: "Updating",
      });
      if (type === "checkbox") {
        postData = {
          first_name: val.first_name,
          last_name: val.last_name,
          country_id: val.country_id,
          state_id: val.state_id,
          city_name: val.city_name,
          address_line: val.address_line,
          zip: val.zip,
          phone: val.phone,
          id: val.id,
          default: val.default ? "1" : "0",
        };
        editAddress(postData).then((res) => {
          this.getUserAddressList();
          this.reset();
          this.isEdit = false;
          loading.close();
        });
      } else {
        postData = this.form;
        postData.default = postData.default ? "1" : "0";
        this.$refs["form"].validate((valid) => {
          if (valid) {
            editAddress(postData).then((res) => {
              this.getUserAddressList();
              this.reset();
              this.isEdit = false;
              loading.close();
            });
          } else {
            loading.close();
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    changeCountryFun(id) {
      let postData = {
        id: id,
      };
      this.form.state_id = null
      getState(postData).then((res) => {
        this.stateList = res.data;
      });
    },
    //地址列表
    getUserAddressList() {
      getUserAddressList().then((res) => {
        this.addressList = res.data;
      });
    },
    cancelFun() {
      this.isEdit = false;
      this.reset();
      this.$Bus.$emit("backToAddressBooks");
    },
    //地址form
    editAddressFun(val, item) {
      this.isEdit = true;
      this.getCountryFun();
      this.changeCountryFun(item.country_id);
      if (val === "new") {
        this.addBtn = true;
        this.$Bus.$emit("textToNewAddress");
      } else if (val === "edit") {
        this.addBtn = false;
        this.form = {
          first_name: item.first_name,
          last_name: item.last_name,
          country_id: item.country_id,
          state_id: item.state_id,
          city_name: item.city_name,
          address_line: item.address_line,
          zip: item.zip,
          phone: item.phone,
          id: item.id,
          default: item.default,
        };
        this.$Bus.$emit("textToEditAddress");
      }
    },
    getCountryFun() {
      getCountry().then((res) => {
        this.countryList = res.data;
      });
    },
  },
  mounted() {
    this.clientWidth = document.documentElement.clientWidth;
  },
  created() {
    this.getUserAddressList();
  },
};
</script>

<style lang="scss" scoped>
.addressBooks {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  .example {
    color: #666666;
    @include px2rem(font-size, 28px);
    @media screen and (min-width: $breakpoint-xl-min) {
      font-size: 16px;
    }
  }
  .no-address-info {
    @include px2rem(font-size, 16px);
    @media screen and (min-width: $breakpoint-xl-min) {
      font-size: 16px;
    }
  }
  .new-address {
    @include px2rem(font-size, 18px);
    @media screen and (min-width: $breakpoint-xl-min) {
      font-size: 18px;
    }
    font-weight: bold;
  }
  /deep/.el-card {
    border-width: 2px;
  }
  /deep/.el-input__inner {
    @include px2rem(font-size, 28px);
    @include px2rem(height, 83px);
    @include px2rem(line-height, 83px);
    @media screen and (min-width: $breakpoint-xl-min) {
      width: 512px;
      font-size: inherit;
      height: 40px;
      line-height: 40px;
    }
  }
  /deep/.el-select {
    width: 100%;
  }

  /deep/.el-input {
    @include px2rem(font-size, 28px);
    @media screen and (min-width: $breakpoint-xl-min) {
      font-size: 14px;
    }
  }
  /deep/.sp {
    .el-input__inner {
      @media screen and (min-width: $breakpoint-xl-min) {
        width: 456px;
      }
    }
  }
  /deep/.el-button {
    width: 100%;
    @include px2rem(padding-top, 25px);
    @include px2rem(padding-bottom, 25px);
    @media screen and (min-width: $breakpoint-xl-min) {
      padding: 8px 35px;
      width: auto;
    }
  }
  /deep/.el-form-item__label {
    font-weight: bold;
    color: #333333;
    @media screen and (min-width: $breakpoint-xl-min) {
      font-size: 16px;
    }
  }
  /deep/.el-form-item__label {
    @include px2rem(font-size, 28px);
    @media screen and (min-width: $breakpoint-xl-min) {
      font-size: 16px;
    }
  }
  /deep/.el-form-item.noLabel {
    .el-form-item__label {
      display: none;
    }
  }
  /deep/.el-select-dropdown__item {
    @include px2rem(font-size, 28px);
    @include px2rem(height, 68px);
    @include px2rem(line-height, 68px);
    @media screen and (min-width: $breakpoint-xl-min) {
      font-size: 14px;
      height: 34px;
      line-height: 34px;
    }
  }
  .edit {
    width: 100%;
    @media screen and (min-width: $breakpoint-xl-min) {
      width: auto;
    }
  }
  .submitZ {
    width: fit-content;
    display: flex;
    align-items: center;
    line-height: 1.4em;
  }
}
</style>
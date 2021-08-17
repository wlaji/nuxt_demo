<template>
  <div class="inquiryWrap bg-default">
    <div class="container py-3">
      <div class="steps row align-items-center border-bottom pb-3">
        <h3 class="col-12 mb-0 text-secondary">
          <i class="el-icon-shopping-cart-1 h2 mb-0 align-middle"></i> Inquiry
        </h3>
      </div>
      <div class="cart-list mt-3">
        <el-table :data="inquiryObj" style="width: 100%">
          <el-table-column label="Product">
            <template slot-scope="scope">
              <div class="cart-item container-fluid bg-white border my-2 py-2">
                <div class="h5">
                  {{ scope.row.product_cate_name }}
                </div>
                <div class="row">
                  <div class="col-12 col-xl-4 d-flex-center">
                    <div class="designImg">
                      <div class="imgWrap p-2">
                        <img
                          v-lazy="scope.row.pic_path"
                          class="img-fluid"
                          preview="0"
                          alt="product"
                          title="product"
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    class="col-12 col-xl-8 mt-2 mt-xl-0"
                    v-if="scope.row.quantity"
                  >
                    <div class="container-fluid">
                      <div class="row">
                        <div class="params-item col-12 col-xl row">
                          <p class="col-6 col-xl-12 font-weight-bold">Size</p>
                          <p class="col-6 col-xl-12 text-right text-xl-left">
                            {{
                              scope.row.width + '” x ' + scope.row.height + '”'
                            }}
                          </p>
                        </div>
                        <div class="params-item col-12 col-xl row">
                          <p class="col-6 col-xl-12 font-weight-bold">Quantity</p>
                          <p class="col-6 col-xl-12 text-right text-xl-left">
                            <span>{{ scope.row.quantity }}</span>
                          </p>
                        </div>
                      </div>
                      <div class="d-none d-xl-block">
                        <div class="row mt-2">
                          <div class="col-8">
                            <div class="row">
                              <label class="col-12 col-xl-3"
                                ><b>Options:</b></label
                              >
                              <div
                                class="col-12 col-xl-9 text-right text-xl-left"
                              >
                                <template v-if="scope.row.select_params">
                                  <div
                                    style="word-break: break-word"
                                    v-for="(value, key, index) in JSON.parse(
                                      scope.row.select_params
                                    )"
                                    :key="index"
                                  >
                                    {{ key }} : {{ value }}
                                  </div>
                                </template>
                                <template v-else>------</template>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="row mt-2">
                          <div class="col-12 col-xl-8">
                            <div class="row">
                              <label class="col-12 col-xl-3"
                                ><b>Comments:</b></label
                              >
                              <div class="col">
                                <el-input
                                  type="textarea"
                                  disabled
                                  :autosize="{ minRows: 2, maxRows: 4 }"
                                  v-model="scope.row.remark"
                                >
                                </el-input>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="d-xl-none" v-if="scope.row.quantity">
                  <div class="container-fluid">
                    <div class="row mt-2">
                      <div class="col-12 col-xl-8">
                        <div class="row">
                          <label class="col-12"><b>Options:</b></label>
                          <div class="col-12 text-left">
                            <template v-if="scope.row.select_params">
                              <div
                                style="word-break: break-word"
                                v-for="(value, key, index) in JSON.parse(
                                  scope.row.select_params
                                )"
                                :key="index"
                              >
                                {{ key }} : {{ value }}
                              </div>
                            </template>
                            <template v-else>------</template>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row mt-2">
                      <div class="col-12 col-xl-8">
                        <div class="row">
                          <label class="col-12 col-xl-3"
                            ><b>Comments:</b></label
                          >
                          <div class="col">
                            <el-input
                              type="textarea"
                              disabled
                              :autosize="{ minRows: 2, maxRows: 4 }"
                              v-model="scope.row.remark"
                            >
                            </el-input>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="formWrap mt-3 border bg-white p-4">
        <div class="inquiryForm">
          <el-form
            :model="inquiryForm"
            :rules="inquiryRules"
            ref="inquiryForm"
            label-width="200px"
            class="shipping-form"
            :label-position="$store.state.device.type === 'pc' ? 'left' : 'top'"
            :size="$store.state.device.type === 'pc' ? 'medium' : 'small'"
            @submit.native.prevent
          >
            <template v-if="!$store.state.authInfo">
              <el-form-item label="Email" prop="email">
                <el-input
                  v-model="inquiryForm.email"
                  placeholder="please enter your email"
                ></el-input>
              </el-form-item>
              <el-form-item label="First Name:" prop="first_name">
                <el-input
                  v-model="inquiryForm.first_name"
                  placeholder="First name"
                ></el-input>
              </el-form-item>
              <el-form-item label="Last Name:" prop="last_name">
                <el-input
                  v-model="inquiryForm.last_name"
                  placeholder="Last name"
                ></el-input>
              </el-form-item>
            </template>
            <el-form-item label="Inquiry content" prop="inquiry_content">
              <el-input
                type="textarea"
                :rows="4"
                v-model="inquiryForm.inquiry_content"
                placeholder="Describe your problem here, you can also leave your contact information"
              ></el-input>
            </el-form-item>
            <el-form-item label="Destination Country/Region" prop="country_id">
              <el-select
                v-model="inquiryForm.country_id"
                filterable
                :filter-method="filterCountry"
                @change="changeCountry"
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
            <el-form-item
              label="State/Province/Region"
              prop="states_id"
              :rules="
                stateListCopy.length > 0
                  ? inquiryRules.states_id
                  : [{ required: false }]
              "
            >
              <el-select
                v-model="inquiryForm.states_id"
                filterable
                :filter-method="filterState"
                style="width: 100%"
              >
                <el-option
                  :label="item.name"
                  :value="item.id"
                  v-for="item in stateList"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Phone Number" prop="phone">
              <el-input v-model="inquiryForm.phone">
                <template slot="prepend">+{{ areaCode }}</template>
              </el-input>
              <span class="info">Example:+1 9549031647-535</span>
            </el-form-item>
            <el-form-item label="Artwork">
              <fileUpload
                :limit="5"
                :multiple="true"
                accept=".jpg,.jpeg,.gif,.png,.pdf,.ai,.bmp,.tif,.eps,"
                :originFileList="[]"
                @getFileList="getFileList($event)"
              >
                <template v-slot:btn>
                  <el-button size="small" type="primary"
                    >Upload File
                  </el-button>
                </template>
                <template v-slot:tip>
                  <div class="el-upload__tip" style="word-break:break-word">
                    ( Vector diagram is preferred to upload ) Allow the
                    following file formats:
                    <span class="text-danger"
                      >JPG, JPEG, GIF, PNG ,PDF, AI, BMP, TIF, EPS.</span
                    >
                  </div>
                </template>
              </fileUpload>
            </el-form-item>
            <el-form-item label="Verify code" prop="verifyCode">
              <el-input
                v-model="inquiryForm.verifyCode"
                @keyup.enter.native="submit('inquiryForm')"
                placeholder="verification code"
              ></el-input>
              <div
                class="coderight"
                @click="refreshCode"
                style="margin-top: 10px"
              >
                <s-identify :identifyCode="identifyCode"></s-identify>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                size="large"
                :loading="isLoading"
                @click="submit('inquiryForm')"
                >Submit
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SIdentify from '@/components/identify'
import { addInquiry } from '@/api/inquiry'
import { getCountry, getState } from '@/api/public'
import fileUpload from '@/components/fileUpload'
export default {
  data() {
    var checkCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('Please enter your verification code'))
      }
      if (value != this.identifyCode) {
        callback(new Error('Verification code error'))
      }
      callback()
    }
    return {
      formSize: 'medium',
      identifyCode: '',
      identifyCodes: '1234567890',
      countryList: [],
      countryListCopy: [],
      stateList: [],
      stateListCopy: [],
      inquiryForm: {
        email: '',
        first_name: '',
        last_name: '',
        inquiry_content: '',
        phone: '',
        country_id: '',
        states_id: '',
        verifyCode: '',
        accessory:[],
      },
      inquiryRules: {
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
        first_name: [
          {
            required: true,
            trigger: 'blur'
          }
        ],
        last_name: [
          {
            required: true,
            trigger: 'blur'
          }
        ],
        inquiry_content: [
          {
            message: 'inquiry content is required',
            required: true,
            trigger: 'blur'
          }
        ],
        country_id: [
          {
            required: true,
            trigger: 'change'
          }
        ],
        states_id: [
          {
            required: true,
            trigger: 'change'
          }
        ],
        phone: [
          {
            message: 'phone is required',
            required: true,
            trigger: 'blur'
          }
        ],
        verifyCode: [
          {
            validator: checkCode,
            trigger: 'submit'
          }
        ]
      },
      isLoading: false
    }
  },
  computed: {
    inquiryObj() {
      return this.$store.state.inquiry
    },
    areaCode() {
      let countryList = this.countryList
      let countryItem = countryList.find(item => {
        return item.id === this.inquiryForm.country_id
      })
      if (countryItem) {
        return countryItem.code
      }
    }
  },
  components: {
    SIdentify: SIdentify,
    fileUpload
  },
  methods: {
    getFileList(fileList) {
      let returnList = []
      fileList.forEach(file => {
        const returnFile = {
          name: file.name,
          url: file.url
        }
        returnList.push(returnFile)
      })
      this.inquiryForm.accessory = returnList
    },

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

    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isLoading = true
          let formData = new FormData()
          formData.append(
            'product_category_id',
            this.inquiryObj[0].product_category_id
          )
          formData.append(
            'param_description',
            JSON.stringify({
              width: this.inquiryObj[0].width || '',
              height: this.inquiryObj[0].height || '',
              quantity: this.inquiryObj[0].quantity || '',
              select_params: this.inquiryObj[0].select_params || ''
            })
          )
          formData.append('pic_path', this.inquiryObj[0].pic_path)
          formData.append('inquiry_content', this.inquiryForm.inquiry_content)
          formData.append('email', this.inquiryForm.email)
          formData.append('first_name', this.inquiryForm.first_name)
          formData.append('last_name', this.inquiryForm.last_name)
          formData.append('country_id', this.inquiryForm.country_id)
          formData.append('states_id', this.inquiryForm.states_id)
          formData.append('phone', this.inquiryForm.phone)
          formData.append('accessory', JSON.stringify(this.inquiryForm.accessory))
          formData.append('is_mobile', this.$store.state.device.type==='pc'?0:'1')
          addInquiry(formData)
            .then(res => {
              let firstName, lastName
              if (this.$store.state.authInfo) {
                firstName = this.$store.state.authInfo.first_name
                lastName = this.$store.state.authInfo.last_name
              } else {
                firstName = this.inquiryForm.first_name
                lastName = this.inquiryForm.last_name
              }
              this.$alert(
                `Dear ${lastName} ${firstName}, a link including proof, price and details of your inquiry will be send within 24 hours. Your inquiry was succesfully submited. Thank you! If you have further questions, please email us to info@gs-jj.com"`,
                'Hint',
                {
                  confirmButtonText: 'Confirm',
                  cancelButtonText: '',
                  type: 'success'
                }
              )
                .catch(err => {})
                .finally(() => {
                  //清空询盘信息
                  this.$store.commit('CLEAR_INQUIRY')
                  this.$router.replace('/')
                })
            })
            .finally(() => {
              this.isLoading = false
            })
        }
      })
    },

    async changeCountry(id) {
      await this.getState(id)
      this.inquiryForm.states_id = ''
    },

    getState(id) {
      return new Promise(resolve => {
        getState({
          id: id
        }).then(res => {
          this.stateList = this.stateListCopy = res.data
          resolve()
        })
      })
    },

    getDefaultCountry() {
      let defaultCountry = this.countryList.find(item => {
        return item.is_default === 1
      })
      this.inquiryForm.country_id = defaultCountry.id
      this.getState(defaultCountry.id)
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
    },

    filterState(query) {
      if (query !== '') {
        let stateList = this.stateListCopy
        let filterStateList = stateList.filter(item => {
          return item.name.toUpperCase().startsWith(query.toUpperCase())
        })
        this.stateList = filterStateList
      } else {
        this.stateList = this.stateListCopy
      }
    }
  },
  created() {
    //国家列表
    getCountry().then(res => {
      this.countryList = this.countryListCopy = res.data
      this.getDefaultCountry()
    })
  },
  mounted() {
    this.refreshCode()
    setTimeout(() => {
      //如果询盘内容为空,跳转到主页
      if (!this.$store.state.inquiry.length) {
        this.$router.replace('/')
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.cart-list {
  p {
    @include px2rem(font-size, 28px);
  }
  div {
    @include px2rem(font-size, 28px);
  }
  /deep/ thead {
    display: none;
  }

  .designImg {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 250px;
    border-radius: 4px;
  }

  .imgWrap {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    cursor: zoom-in;
  }
}

.inquiryForm {
  width: 100%;
}
@media screen and (min-width: $breakpoint-xl-min) {
  .cart-list {
    p {
      font-size: 14px;
    }
    div {
      font-size: 14px;
    }
  }
  .inquiryForm {
    width: 50%;
  }
}
</style>

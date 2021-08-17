<template>
  <div class="checkoutWrap bg-default">
    <div class="container py-3">

      <div class="cart mt-3 border bg-white p-4">
        <h3 class="border-bottom mb-2">Product List</h3>
        <div class="cart-list">
          <el-table :data="cList" style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="Comments" v-if="props.row.remark">
                    <span>
                      {{ props.row.remark }}
                    </span>
                  </el-form-item>
                  <el-form-item label="Options">
                    <div>
                      <template v-if="props.row.select_params">
                        <div
                          style="word-break: break-word"
                          v-for="(value, key, index) in JSON.parse(
                            props.row.select_params
                          )"
                          :key="index"
                        >
                          {{ key }}: {{ value }}
                        </div>
                      </template>
                      <template v-else>------</template>
                    </div>
                  </el-form-item>
                  <el-form-item label="Artwork">
                    <div>
                      <fileUpload
                        class="mb-2"
                        :limit="5"
                        :multiple="true"
                        accept=".jpg,.jpeg,.gif,.png,.pdf,.ai,.bmp,.tif,.eps,"
                        :originFileList="
                          props.row.accessory
                            ? JSON.parse(props.row.accessory)
                            : []
                        "
                        @getFileList="getFileList($event, props.row)"
                      >
                        <template v-slot:btn>
                          <el-button size="small" type="primary"
                          >Upload File
                          </el-button>
                        </template>
                        <template v-slot:tip>
                          <div
                            class="el-upload__tip"
                            style="word-break:break-word"
                          >
                            ( Vector diagram is preferred to upload ) Allow the
                            following file formats:
                            <span class="text-danger"
                            >JPG, JPEG, GIF, PNG ,PDF, AI, BMP, TIF,
                              EPS.</span
                            >
                          </div>
                        </template>
                      </fileUpload>
                    </div>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="Picture" width="250">
              <template slot-scope="scope">
                <div class="designImg">
                  <div class="imgWrap">
                    <img
                      v-lazy="scope.row.pic_path"
                      class="img-fluid"
                      preview="0"
                      alt="product"
                      title="product"
                    />
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="Product name" width="150">
              <template slot-scope="scope">
                {{ scope.row.product_cate_name }}
              </template>
            </el-table-column>
            <template>
              <el-table-column label="Size">
                <template slot-scope="scope"
                >{{ scope.row.width + '” x ' + scope.row.height + '”' }}
                </template>
              </el-table-column>
              <el-table-column label="Unit Price">
                <template slot-scope="scope"
                >{{ currencyItem.symbol
                  }}{{
                  (parseFloat(scope.row.unit_price) * currencyItem.rate)
                  | formatPrice
                  }}
                </template>
              </el-table-column>
              <el-table-column label="Quantity">
                <template slot-scope="scope">
                  {{ scope.row.quantity }}
                </template>
              </el-table-column>
            </template>
            <el-table-column label="Total">
              <template slot-scope="scope">
                <span class="text-danger"
                >{{ currencyItem.symbol
                  }}{{
                    (parseFloat(scope.row.price) * currencyItem.rate)
                      | formatPrice
                  }}</span
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="paymentMethods mt-3 border bg-white p-4">
        <h3 id="payment" class="border-bottom mb-2">Payment Method</h3>
        <div class="content">
          <div class="memthods">
            <b>Currency:</b>
            <div class="currency">
              <div style="padding: 10px 0">
                <el-input
                  readonly
                  :value="currencyItem.code"
                  style="width: 185px"
                ></el-input>
                <!--                <el-select-->
                <!--                  v-model="currencyId"-->
                <!--                  placeholder="Select Your Currency"-->
                <!--                >-->
                <!--                  <el-option-->
                <!--                    v-for="item in currencyInfo"-->
                <!--                    :key="item.id"-->
                <!--                    :label="item.code"-->
                <!--                    :value="item.id"-->
                <!--                  >-->
                <!--                    <span style="float: left">-->
                <!--                      {{ item.code }}-->
                <!--                      <img-->
                <!--                        :src="item.flag_path"-->
                <!--                        style="-->
                <!--                          position: relative;-->
                <!--                          max-width: 16px;-->
                <!--                          max-height: 10px;-->
                <!--                          top: -2px;-->
                <!--                        "-->
                <!--                      />-->
                <!--                    </span>-->
                <!--                    <span-->
                <!--                      style="float: right; color: #8492a6; font-size: 13px"-->
                <!--                      >{{ item.symbol }}</span-->
                <!--                    >-->
                <!--                  </el-option>-->
                <!--                </el-select>-->
              </div>
            </div>
            <b>Choose payment methods:</b>
            <div style="padding: 10px 0">
              <el-select
                style="width: 185px"
                v-model="paymentMethods"
                placeholder="Please select your payment method"
              >
                <el-option
                  v-for="item in paymentOptions"
                  :key="item.name"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div class="card-info" v-if="paymentMethods === 'Authorize'">
              <el-form
                label-position="top"
                :model="cardForm"
                ref="cardForm"
                :rules="cardRules"
                :inline="true"
              >
                <el-form-item label="CARD NUMBER:" prop="CardNumber">
                  <el-input v-model="cardForm.CardNumber"></el-input>
                </el-form-item>
                <el-form-item label="CVV:" prop="CardCode">
                  <el-input v-model="cardForm.CardCode"></el-input>
                </el-form-item>
                <el-form-item label="Expiration date:">
                  <el-form-item prop="MM" class="mr-0">
                    <el-input
                      v-model="cardForm.MM"
                      style="width: 80px"
                      placeholder="MM"
                    ></el-input>
                  </el-form-item>
                  <span class="mx-1">/</span>
                  <el-form-item prop="YY">
                    <el-input
                      v-model="cardForm.YY"
                      style="width: 80px"
                      placeholder="YY"
                    ></el-input>
                  </el-form-item>
                </el-form-item>
              </el-form>
            </div>

          </div>
        </div>
      </div>
      <div class="row mt-3">
        <div
          class="col-12"
          :class="paymentMethods !== 'PayPal' ? 'col-xl-6' : 'col-xl-12'"
        >
          <div
            class="form-wrap full-height border bg-white p-4 d-flex flex-column justify-content-between"
          >
            <div>
              <h3 id="shippingTitle" class="border-bottom mb-2">
                Shipping Address
              </h3>
              <div class="formCon">
                <div class="shippingForm" :class="{ isPaypel: paymentMethods === 'PayPal' }">
                  <div v-show="!showShippingForm">
                    <ul>
                      <li>
                        <strong>Shipped To:</strong>
                        <span
                        >{{ shippingForm.first_name
                          }}{{ shippingForm.last_name }} ({{
                            shippingForm.address_line
                          }},{{ shippingForm.city_name }},{{
                            shippingForm.zip
                          }}-{{ state_id }},{{ country_id }})</span
                        >
                        <el-link @click="showShippingForm = true">Edit</el-link>
                      </li>
                    </ul>
                  </div>
                  <div v-show="showShippingForm">
                    <el-form
                      :model="shippingForm"
                      :rules="shippingRules"
                      autocomplete="off"
                      ref="shippingForm"
                      label-width="200px"
                      class="shipping-form"
                      :label-position="
                        $store.state.device.type === 'pc' ? 'left' : 'top'
                      "
                      :size="
                        $store.state.device.type === 'pc' ? 'medium' : 'small'
                      ">
                      <el-form-item label="Save Address" v-if="$store.state.authInfo">
                        <el-select
                          v-model="addressId"
                          clearable
                          @change="changeAddress"
                          size="small"
                        >
                          <el-option
                            v-for="item in addressList"
                            :key="item.id"
                            :label="item.address_line"
                            :value="item.id"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item
                        prop="email"
                        label="Email"
                        v-else
                        :rules="[
                          {
                            required: true,
                            message: 'Please enter email address',
                            trigger: 'blur'
                          },
                          {
                            type: 'email',
                            message: 'Please enter the correct email address',
                            trigger: ['blur', 'change']
                          }
                        ]"
                      >
                        <el-input
                          v-model="shippingForm.email"
                          @blur="blurEmail"
                        ></el-input>
                      </el-form-item>
                      <el-form-item label="First Name:" prop="first_name">
                        <el-input v-model="shippingForm.first_name"></el-input>
                      </el-form-item>
                      <el-form-item label="Last Name:" prop="last_name">
                        <el-input v-model="shippingForm.last_name"></el-input>
                      </el-form-item>
                      <el-form-item label="Address Line:" prop="address_line">
                        <el-input
                          v-model="shippingForm.address_line"
                        ></el-input>
                      </el-form-item>
                      <el-form-item label="City:" prop="city_name">
                        <el-input v-model="shippingForm.city_name"></el-input>
                      </el-form-item>
                      <el-form-item
                        label="Destination Country/Region"
                        prop="country_id"
                      >
                        <el-select
                          v-model="shippingForm.country_id"
                          @change="changeShippingCountry"
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
                      <el-form-item
                        label="State/Province/Region"
                        prop="state_id"
                        :rules="
                          shippingStateListCopy.length > 0
                            ? shippingRules.state_id
                            : [{ required: false }]
                        "
                      >
                        <el-select
                          v-model="shippingForm.state_id"
                          filterable
                          :filter-method="filterShippingState"
                          style="width: 100%"
                        >
                          <el-option
                            :label="item.name"
                            :value="item.id"
                            v-for="item in shippingStateList"
                            :key="item.id"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="Zip/Postal Code" prop="zip">
                        <el-input v-model="shippingForm.zip"></el-input>
                      </el-form-item>
                      <el-form-item label="Phone Number" prop="phone">
                        <el-input v-model="shippingForm.phone">
                          <template slot="prepend"
                          >+{{ shippingAreaCode }}
                          </template>
                        </el-input>
                        <span class="info">Example:+1 9549031647-535</span>
                      </el-form-item>
                      <el-form-item>
                        <el-button
                          class="align-self-end mt-2"
                          type="primary"
                          @click="validateShippingForm"
                        >Click here to Confirm Again
                        </el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="col-12 col-xl-6 mt-3 mt-xl-0"
          v-show="paymentMethods !== 'PayPal'"
        >
          <div
            class="form-wrap full-height border bg-white p-4 d-flex flex-column justify-content-between"
          >
            <div>
              <h3 id="billingTitle" class="border-bottom mb-2">
                Billing Address
              </h3>
              <div class="formCon">
                <div class="billingForm">
                  <div class="sameAddress py-2 mb-3">
                    Billing Address as same as Shipping Address
                    <el-checkbox
                      v-model="billingType"
                      @change="changeBillingType"
                    ></el-checkbox>
                  </div>
                  <div v-show="!showBillingForm && !billingType">
                    <ul>
                      <li>
                        <strong>Billed To:</strong>
                        <span
                        >{{ billingForm.bill_first_name
                          }}{{ billingForm.bill_last_name }} ({{
                            billingForm.bill_address_line
                          }},{{ billingForm.bill_city_name }},{{
                            billingForm.bill_zip
                          }}-{{ billingState }},{{ billingCountry }})</span
                        >
                        <el-link @click="showBillingForm = true">Edit</el-link>
                      </li>
                    </ul>
                  </div>
                  <div v-show="showBillingForm && !billingType">
                    <el-form
                      v-show="showBillingForm"
                      :disabled="billingType"
                      :model="billingForm"
                      :rules="billingRules"
                      autocomplete="off"
                      ref="billingForm"
                      label-width="200px"
                      class="billing-form"
                      :label-position="
                        $store.state.device.type === 'pc' ? 'left' : 'top'
                      "
                      :size="
                        $store.state.device.type === 'pc' ? 'medium' : 'small'
                      "
                    >
                      <el-form-item label="First Name:" prop="bill_first_name">
                        <el-input
                          v-model="billingForm.bill_first_name"
                        ></el-input>
                      </el-form-item>
                      <el-form-item label="Last Name:" prop="bill_last_name">
                        <el-input
                          v-model="billingForm.bill_last_name"
                        ></el-input>
                      </el-form-item>
                      <el-form-item
                        label="Address Line:"
                        prop="bill_address_line"
                      >
                        <el-input
                          v-model="billingForm.bill_address_line"
                        ></el-input>
                      </el-form-item>
                      <el-form-item label="City:" prop="bill_city_name">
                        <el-input
                          v-model="billingForm.bill_city_name"
                        ></el-input>
                      </el-form-item>
                      <el-form-item
                        label="Destination Country/Region"
                        prop="bill_country_id"
                      >
                        <el-select
                          v-model="billingForm.bill_country_id"
                          @change="changeBillingCountry"
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
                      <el-form-item
                        label="State/Province/Region"
                        prop="bill_state_id"
                        :rules="
                          billingStateListCopy.length > 0
                            ? billingRules.bill_state_id
                            : [{ required: false }]
                        "
                      >
                        <el-select
                          v-model="billingForm.bill_state_id"
                          filterable
                          :filter-method="filterBillingState"
                          style="width: 100%"
                        >
                          <el-option
                            :label="item.name"
                            :value="item.id"
                            v-for="item in billingStateList"
                            :key="item.id"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="Zip/Postal Code" prop="bill_zip">
                        <el-input v-model="billingForm.bill_zip"></el-input>
                      </el-form-item>
                      <el-form-item label="PhoneNumber" prop="bill_phone">
                        <el-input v-model="billingForm.bill_phone">
                          <template slot="prepend"
                          >+{{ billingAreaCode }}
                          </template>
                        </el-input>
                        <span class="info">Example:+1 9549031647-535</span>
                      </el-form-item>
                      <el-form-item>
                        <el-button
                          class="align-self-end mt-2"
                          type="primary"
                          @click="validateBillingForm"
                        >Click here to Confirm Again
                        </el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="shippingAndDelivery mt-3 border bg-white p-4">
        <h3 class="border-bottom mb-2">Shipping & Delivery</h3>
        <div class="content">
          <ul class="h6">
            <li class="list py-2">
              <div class="d-flex align-items-center">
                <span>Shipping Method:</span>
                <div
                  class="methodItem pl-2"
                  v-show="shippingMethodList.length > 1"
                >
                  <el-radio-group v-model="shippingtype">
                    <el-radio
                      v-for="item in shippingMethodList"
                      :key="item.ShippingId"
                      :label="item.ShippingId"
                    >
                      {{ item.Express }}
                    </el-radio>
                  </el-radio-group>
                </div>
                <span class="pl-2 text-primary">Free Shipping</span>
              </div>
            </li>
            <div>
              <li class="my-2">
                <i class="el-icon-time"></i>
                <b class="text-danger">When will my order arrive?</b>
              </li>
              <li>
                <img
                  v-lazy="
                    `https://sticker-static.oss-us-west-1.aliyuncs.com/image/uploads/20201217/3a077d7741920c80bdaf9866b77b8e31.jpg`
                  "
                  alt="order arrive"
                />
              </li>
            </div>
            <!-- <li>
              Learn more about
              <a href="javascript:;" class="red" @click="arriveSlide=!arriveSlide">processing time</a>
            </li>

            <li v-show="arriveSlide">
              <p>
                Processing time is the time it takes to get your order ready to leave our warehouses. This includes
                preparing your items, performing quality checks, and packing for shipment. Processing time is
                displayed on the product detail page.
                <br />Items marked
                <strong>“Ships in 24hrs”:</strong> Processing time is guaranteed to be shorter than 24 hours.
              </p>
            </li> -->
          </ul>
        </div>
      </div>

      <div class="submit-wrap text-right mt-3 py-4">
        <div
          class="submit-cart d-inline-block h6 float-right"
          style="width: 300px"
        >
          <div class="row mb-2 py-2 border-bottom">
            <div class="col-6">
              <div>Subtotal ({{ cList.length }} items)</div>
            </div>
            <div class="col-2">
              <div class="text-danger font-weight-bold">
                {{ currencyItem.symbol }}
              </div>
            </div>
            <div class="col-4">
              <div class="text-danger font-weight-bold">{{ unit_price }}</div>
            </div>
          </div>
          <div class="row mb-2 py-2 border-bottom">
            <div class="col-6">
              <div>(+) Shipping charges</div>
            </div>
            <div class="col-2">
              <div class="text-danger font-weight-bold">
                {{ currencyItem.symbol }}
              </div>
            </div>
            <div class="col-4">
              <div class="text-danger font-weight-bold">{{pStrict}}</div>
            </div>
          </div>

          <div class="row mb-2 py-2 border-bottom">
            <div class="col-6">
              <div>(+) Tax</div>
            </div>
            <div class="col-2">
              <div class="text-danger font-weight-bold">
                {{ currencyItem.symbol }}
              </div>
            </div>
            <div class="col-4">
              <div class="text-danger font-weight-bold">
                {{ duty_rate_price }}
              </div>
            </div>
          </div>
          <div class="row mb-2 py-2 border-bottom">
            <div class="col-6">
              <div class="font-weight-bold">Discount</div>
            </div>
            <div class="col-2">
              <div class="text-danger font-weight-bold">
                {{ currencyItem.symbol }}
              </div>
            </div>
            <div class="col-4">
              <div class="text-danger font-weight-bold">
                - {{ discountPrice }}
              </div>
            </div>
          </div>
          <div class="row mb-2 py-2 border-bottom">
            <div class="col-6">
              <div class="font-weight-bold">GRAND TOTAL</div>
            </div>
            <div class="col-2">
              <div class="text-danger font-weight-bold">
                {{ currencyItem.symbol }}
              </div>
            </div>
            <div class="col-4">
              <div class="text-danger font-weight-bold">{{ total }}</div>
            </div>
          </div>
        </div>
        <div class="clearfix"></div>
        <fileUpload
          ref="fileUpload"
          class="mb-2 float-right"
          :originFileList="[]"
          v-if="!$store.state.authInfo.duty_free_certificate"
        ></fileUpload>
        <div class="clearfix"></div>
        <div class="submit-btn float-right">
          <el-button
            type="success"
            @click="submitOrder"
            :loading="submitLoading"
          >
            Place your Order add GO TO PAY
            <i class="el-icon-right"></i>
          </el-button>
          <p class="mt-2">
            <a
              target="_blank"
              href="https://seal.godaddy.com/getSeal?sealID=CK8MVNXGf3kYsXkniLgwHL5Y5sXJUlpKpZW6ZFl8Jiz4gFg3Ya0JqSi9QNq0"
            >
              <img
                v-lazy="
                  `https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20201216/0a1bde9cac07007118e1d3e285bb2a84.jpg`
                "
                alt="secure ssl"
              />
            </a>
          </p>
          <p class="text-muted">
            Every order you place with us is safe and secure.
          </p>
        </div>
        <div class="clearfix"></div>
      </div>
    </div>
    <div class="z-header dialog-model" v-show="visible">
      <div class="dialog-model-overlay"></div>
      <div class="dialog-model-con rounded">
        <div class="text-center w-100">
          <div class="p-2 py-4">
            <p>Thanks for your order and your immense trust!</p>
            <p>
              The delivery to your address is beyond our free shipping service
              area.
            </p>
            <p>
              We will confirm whether there is an EXTRA SHIPPING FEE and contact
              you by email ASAP!
            </p>
          </div>
          <el-button type="primary" class="w-100 rounded-0" @click="close"
          >Confirm
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { checkCardNumber, checkCvv, checkYY, checkMM } from '@/utils/validate'
  import { getCountry, getState, getCurrency,isRegister } from '@/api/public'
  import { pay, getAndCheckCouponByCouponCode,addActivityOrder } from '@/api/checkout'
  import { getUserAddressList } from "@/api/account";
  import { getCustomProductInfo } from '@/api/customProduct'
  import fileUpload from '@/components/fileUpload'
  import { addCartAccessory } from '@/api/cart'

  export default {
    data() {
      return {
        windowWidth: 0,
        discountPrice:'',
        unit_price:0,
        total:0,
        cList:[],
        couponInfo: '',
        couponForm: {
          couponCode: ''
        },
        showCoupon: false,
        visible: false,
        duty_rate: 0, //关税
        activeInd: 1,
        showShippingForm: true,
        showBillingForm: true,
        submitLoading: false,
        customProductInfo: '',
        localCartList: [],
        currencyInfo: [],
        currencyId: [],
        checkedBillingForm: true,
        checkedShippingForm: true,
        paymentMethods: 'PayPal',
        paymentOptions: [
          {
            name: 'PayPal',
            value: 'PayPal'
          },
          {
            name: 'Credit Card / Debit card',
            value: 'Authorize'
          }
        ],
        shippingMethodList: [],
        billingType: false,
        activeProName: 0,
        loginDialog: false,
        addressId: '',
        arriveSlide: false,
        shippingtype: '',
        countryList: [],
        countryListCopy: [],
        shippingStateList: [],
        shippingStateListCopy: [],
        billingStateList: [],
        billingStateListCopy: [],
        shippingForm: {
          first_name: '',
          last_name: '',
          address_line: '',
          city_name: '',
          country_id: '',
          state_id: '',
          zip: '',
          phone: ''
        },
        shippingRules: {
          GsOId: [
            {
              required: true,
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
          address_line: [
            {
              required: true,
              trigger: 'blur'
            }
          ],
          city_name: [
            {
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
          state_id: [
            {
              required: true,
              trigger: 'change'
            }
          ],
          zip: [
            {
              required: true,
              trigger: 'blur'
            }
          ],
          phone: [
            {
              required: true,
              trigger: 'blur'
            }
          ]
        },
        billingForm: {
          bill_first_name: '',
          bill_last_name: '',
          bill_address_line: '',
          bill_city_name: '',
          bill_country_id: '',
          bill_state_id: '',
          bill_zip: '',
          bill_phone: ''
        },
        billingRules: {
          bill_first_name: [
            {
              required: true,
              trigger: 'blur'
            }
          ],
          bill_last_name: [
            {
              required: true,
              trigger: 'blur'
            }
          ],
          bill_address_line: [
            {
              required: true,
              trigger: 'blur'
            }
          ],
          bill_city_name: [
            {
              required: true,
              trigger: 'blur'
            }
          ],
          bill_country_id: [
            {
              required: true,
              trigger: 'change'
            }
          ],
          bill_state_id: [
            {
              required: true,
              trigger: 'change'
            }
          ],
          bill_zip: [
            {
              required: true,
              trigger: 'blur'
            }
          ],
          bill_phone: [
            {
              required: true,
              trigger: 'blur'
            }
          ]
        },
        cardForm: {
          CardNumber: '',
          CardCode: '',
          MM: '',
          YY: ''
        },
        cardRules: {
          CardNumber: [
            {
              required: true,
              validator: checkCardNumber,
              trigger: 'blur'
            }
          ],
          CardCode: [
            {
              required: true,
              validator: checkCvv,
              trigger: 'blur'
            }
          ],
          MM: [
            {
              required: true,
              validator: checkMM,
              trigger: 'blur'
            }
          ],
          YY: [
            {
              required: true,
              validator: checkYY,
              trigger: 'blur'
            }
          ]
        },
        country_id: '',
        state_id: '',
        billingCountry: '',
        billingState: '',
        addressList: [],
        pStrict:0.00,
      }
    },
    watch: {
      shippingForm: {
        handler: function(newValue) {
          this.changeShippingState(newValue.state_id)
        },
        deep: true
      }
    },
    components: {
      fileUpload
    },
    computed: {
      currencyItem() {
        let currencyItem = this.currencyInfo.find(item => {
          return item.id === this.currencyId
        })
        if (currencyItem) {
          return currencyItem
        } else {
          return {
            symbol: '',
            rate: ''
          }
        }
      },
      orderList() {
        return this.localCartList
      },
      shippingAreaCode() {
        let countryList = this.countryList
        let countryItem = countryList.find(item => {
          return item.id === this.shippingForm.country_id
        })
        if (countryItem) {
          return countryItem.code
        }
      },
      billingAreaCode() {
        let countryList = this.countryList
        let countryItem = countryList.find(item => {
          return item.id === this.billingForm.bill_country_id
        })
        if (countryItem) {
          return countryItem.code
        }
      },
      priceTotal() {
        let total = 0
        if (this.$route.query.Buynow != 1) {
          this.cList.forEach(item => {
            total += parseFloat(item.price)
          })
          total = total * Number(this.currencyItem.rate)
        } else {
          let cPrice = this.customProductInfo.price || 0
          total = cPrice * this.currencyItem.rate
        }
        total+=Number(this.pStrict)
        return Number(total).toFixed(2)
      },
      //税费
      duty_rate_price() {
        if(process.server){
          return
        }
        let drp = 0
        let dp = parseInt(sessionStorage.getItem('discountPrice')) || 0
        if(dp){
          drp =  Number((Number(sessionStorage.getItem('discountPrice')) * this.duty_rate) / 100).toFixed(2)
        }else{
          drp = Number((Number(this.priceTotal) * this.duty_rate) / 100).toFixed(2)
        }
        return drp
      },
      payType(){
        return sessionStorage.getItem('payType')
      }
    },
    methods: {
      initAddress() {
        return new Promise(resolve => {
          getUserAddressList().then(res => {
            let addressList = res.data;
            this.addressList = addressList;
            if (addressList.length) {
              let findItem = addressList.find(item => {
                return item.default === 1;
              });
              if (findItem) {
                this.addressId = findItem.id;
                this.changeAddress();
                resolve(true);
              } else {
                resolve(false);
              }
            }else{
              resolve(false);
            }
          });
        });
      },
      blurEmail() {
        this.$refs.shippingForm.validateField('email', valid => {
          console.log(valid)
          if (!valid) {
            isRegister({
              email: this.shippingForm.email
            }).then(res => {
              console.log(res)
              if (res.data) {
                this.$store.commit('SET_LOGINDIALOG', true)
              }
            })
          }
        })
      },
      addCoupon() {
        this.showCoupon = true
        this.couponForm.couponCode = ''
      },
      getFileList(fileList, row) {
        let resultList = []
        fileList.forEach(file => {
          const returnFile = {
            name: file.name,
            url: file.url
          }
          resultList.push(returnFile)
        })
        //更新此页面的数据
        let cartList = this.localCartList
        let findItem = cartList.find(item => {
          return item.id === row.id
        })
        findItem.accessory = JSON.stringify(resultList)
        //更新vuex的数据
        this.$store.commit('UPDATE_CART', {
          id: row.id,
          data: {
            accessory: JSON.stringify(resultList)
          }
        })
        //更新数据库的数据
        addCartAccessory({
          accessory: JSON.stringify(resultList),
          cart_id: row.id
        })
      },
      close() {
        this.visible = false
        this.$utils.toggleBody(0)
      },
      postOrder() {
        this.submitLoading = true
        let shippingForm = this.shippingForm,
          billingForm = this.billingForm,
          postData,
          billingType = this.billingType,
          paymentMethods = this.paymentMethods,
          cList = this.cList[0]
        if (billingType) {
          billingForm.bill_first_name = shippingForm.first_name
          billingForm.bill_last_name = shippingForm.last_name
          billingForm.bill_address_line = shippingForm.address_line
          billingForm.bill_city_name = shippingForm.city_name
          billingForm.bill_country_id = shippingForm.country_id
          billingForm.bill_state_id = shippingForm.state_id
          billingForm.bill_zip = shippingForm.zip
          billingForm.bill_phone = shippingForm.phone
        }
        let shipping_address_id = this.addressId
        if (this.$route.query.Buynow == 1) {
          postData = Object.assign({}, shippingForm, billingForm, {
            email: this.$store.state.authInfo.email,
            currency_id: this.currencyId,
            cartIdList: '',
            custom_product_id: this.$route.query.p_id, //1代表定制
            coupon_code: this.couponForm.couponCode,
            is_mobile:this.$store.state.device.type==='pc'?0:'1'
          })
        } else {
          postData = Object.assign({}, shippingForm, billingForm, {
            currency: this.defaultCurrency,
            coupon_code: sessionStorage.getItem('cid'),
            width:cList.width,
            height:cList.height,
            quantity:cList.quantity,
            param_id_list:sessionStorage.getItem('optionIdList') || '',
            custom_params_id_list:sessionStorage.getItem('optionIdList1') || '',
            product_category_id:sessionStorage.getItem('product_category_id') || '',
            unit_price:cList.unit_price,
            pic_path:cList.pic_path,
            is_mobile:this.$store.state.device.type==='pc'?0:'1'
          })
        }
        //支付方式
        postData.payment = this.paymentMethods
        if (this.$refs.fileUpload) {
          if (this.$refs.fileUpload.getFileList().length) {
            postData.duty_free_certificate = this.$refs.fileUpload.getFileList()[0].url
          } else {
            postData.duty_free_certificate = ''
          }
        } else {
          postData.duty_free_certificate = ''
        }
        if (shipping_address_id) {
          postData.shipping_address_id = shipping_address_id
        }
        if(sessionStorage.getItem('discountName')){
          let pJson = [{
            shipping_price_description:sessionStorage.getItem('discountName'),
            price:this.pStrict
          }]
          postData.shipping_price_info = JSON.stringify(pJson)
        }
        if(this.windowWidth>=1201){
          postData.is_mobile = 0
        }else{
          postData.is_mobile = 1
        }

        addActivityOrder(postData).then(async res => {
          this.$utils.setCookie('token', res.data.token)
          try{
            await this.$store.dispatch('getUserInfo')
          }catch(e){}
          let orderId = res.data.order_id
          if(this.payType==1){
            this.$router.push({
              name: 'payment-success-id',
              params: {
                id: res.data.order_id
              }
            })
          }else{
            this.$store.dispatch('getUserInfo')
            setTimeout(() => {
              let postData
              if (paymentMethods === 'PayPal') {
                postData = {
                  order_id: orderId
                }
              } else if (paymentMethods === 'Authorize') {
                let cardForm = this.cardForm
                postData = {
                  order_id: orderId,
                  JsonStr: JSON.stringify({
                    CardNumber: cardForm.CardNumber,
                    ExpirationDate: '20' + cardForm.YY + '-' + cardForm.MM,
                    CardCode: cardForm.CardCode
                  })
                }
              }
              this.payment(postData, paymentMethods)
            }, 300)
          }

        })
          .finally(() => {
            this.submitLoading = false
          })
      },

      payment(postData, type) {
        const loading = this.$loading({
          lock: true,
          text: 'In payment...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
          customClass: 'cus-loading'
        })
        pay(postData)
          .then(res => {
            sessionStorage.removeItem('discountName')
            sessionStorage.removeItem('discountPrice')
            sessionStorage.removeItem('payType')
            sessionStorage.removeItem('cartTemp')
            sessionStorage.removeItem('pStrict')
            sessionStorage.removeItem('discountType')
            sessionStorage.removeItem('price')
            sessionStorage.removeItem('product_category_id')
            sessionStorage.removeItem('optionIdList1')
            sessionStorage.removeItem('optionIdList')
            sessionStorage.removeItem('cid')
            if (type === 'PayPal') {
              let div = document.createElement('div')
              let page = document.body
              div.innerHTML = res.data
              page.appendChild(div)
              document.getElementById('paypal_form').submit()
            }
            if (type === 'Authorize') {
              //信用卡支付失败，跳转到订单详情页面继续支付
              if (res.ret === 2) {
                this.$router.push({
                  name: 'payment-failed-id',
                  params: {
                    id: res.data
                  }
                })
              } else {
                this.$router.push({
                  name: 'payment-success-id',
                  params: {
                    id: res.data
                  }
                })
              }
            }
            this.submitLoading = false
          })
          .finally(() => {
            setTimeout(() => {
              loading.close()
            }, 3000)
          })
      },

      submitOrder() {
        //验证发货地址
        this.$refs['shippingForm'].validate(validShippingForm => {
          if (!validShippingForm) {
            this.$utils.scrollToElement(document.getElementById('shippingTitle'))
            this.checkedShippingForm = false
            return false
          }
          this.checkedShippingForm = true
          //发货地址验证通过，如果是paypal付款 不需要验证账单地址和信用卡可以提交订单
          if (this.paymentMethods === 'PayPal') {
            this.postOrder()
          } else {
            //如果选中账单地址和发货地址相同，只需验证信用卡，都通过后提交订单
            if (this.billingType) {
              this.$refs['cardForm'].validate(validCardForm => {
                if (validCardForm) {
                  this.postOrder()
                } else {
                  this.$utils.scrollToElement(document.getElementById('payment'))
                }
              })
            } else {
              //验证账单地址和信用卡信息,都通过后提交订单
              this.$refs['billingForm'].validate(validBillingForm => {
                if (!validBillingForm) {
                  this.$utils.scrollToElement(
                    document.getElementById('billingTitle')
                  )
                  this.checkedBillingForm = false
                  return false
                }
                this.checkedBillingForm = true
                this.$refs['cardForm'].validate(validCardForm => {
                  if (validCardForm) {
                    this.postOrder()
                  } else {
                    this.$utils.scrollToElement(
                      document.getElementById('payment')
                    )
                  }
                })
              })
            }
          }
        })
      },

      changeBillingType() {
        this.$refs['billingForm'].resetFields()
      },

      async changeAddress() {
        this.$refs['shippingForm'].resetFields()
        this.shippingStateList = []
        if (!this.addressId) {
          return false
        }
        let aid = this.addressId
        let addressItem = this.addressList.find(item => {
          return item.id === aid
        })
        let shippingForm = {
          first_name: addressItem.first_name,
          last_name: addressItem.last_name,
          address_line: addressItem.address_line,
          city_name: addressItem.city_name,
          country_id: addressItem.country_id,
          state_id: addressItem.state_id ? addressItem.state_id : '',
          zip: addressItem.zip,
          phone: addressItem.phone
        }
        await this.getShippingState(addressItem.country_id)
        this.$nextTick(() => {
          this.shippingForm = shippingForm
        })
      },

      validateShippingForm() {
        this.$refs['shippingForm'].validate(valid => {
          if (valid) {
            this.showShippingForm = false
            let selectCountry = this.countryList.find(item => {
              return item.id === this.shippingForm.country_id
            })
            let selectState = this.shippingStateList.find(item => {
              return item.id === this.shippingForm.state_id
            })
            this.country_id = selectCountry.name
            this.state_id = selectState ? selectState.name : ''
          } else {
            this.showShippingForm = true
          }
        })
      },

      validateBillingForm() {
        this.$refs['billingForm'].validate(valid => {
          if (valid) {
            this.showBillingForm = false
            let selectCountry = this.countryList.find(item => {
              return item.id === this.billingForm.bill_country_id
            })
            let selectState = this.billingStateList.find(item => {
              return item.id === this.billingForm.bill_state_id
            })
            this.billingCountry = selectCountry.name
            this.billingState = selectState ? selectState.name : ''
          } else {
            this.showBillingForm = true
          }
        })
      },

      async changeBillingCountry(id) {
        await this.getBillingState(id)
        this.billingForm.bill_state_id = ''
      },

      async changeShippingCountry(id) {
        this.shippingtype = ''
        await this.getShippingState(id)
        this.shippingForm.state_id = ''
        let findItem = this.countryList.find(item => {
          return item.id === id
        })
        if (!findItem.freight_free) {
          this.visible = true
          // this.$utils.toggleBody(1)
        }
      },

      changeShippingState(id) {
        let shippingStateList = this.shippingStateList
        let findState = shippingStateList.find(item => {
          return item.id === id
        })
        let dutyRate= findState ? findState.duty_rate : 0
        this.duty_rate = dutyRate
        let t= Number(this.priceTotal)
        //零元订单不加税费
        if(this.payType!="1"){
          t+=Number(this.duty_rate_price)
        }
        this.total = t.toFixed(2)
      },

      getShippingState(id) {
        return new Promise(resolve => {
          getState({
            id: id
          }).then(res => {
            this.shippingStateList = this.shippingStateListCopy = res.data
            resolve()
          })
        })
      },

      getBillingState(id) {
        return new Promise(resolve => {
          getState({
            id: id
          }).then(res => {
            this.billingStateList = this.billingStateListCopy = res.data
            resolve()
          })
        })
      },

      getDefaultCountry() {
        let defaultCountry = this.countryList.find(item => {
          return item.is_default === 1
        })
        if(!defaultCountry){
          return false
        }
        this.shippingForm.country_id = this.billingForm.bill_country_id =
          defaultCountry.id
        this.getShippingState(defaultCountry.id)
        this.getBillingState(defaultCountry.id)
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

      filterShippingState(query) {
        if (query !== '') {
          let stateList = this.shippingStateListCopy
          let filterStateList = stateList.filter(item => {
            return item.name.toUpperCase().startsWith(query.toUpperCase())
          })
          this.shippingStateList = filterStateList
        } else {
          this.shippingStateList = this.shippingStateListCopy
        }
      },

      filterBillingState(query) {
        if (query !== '') {
          let stateList = this.billingStateListCopy
          let filterStateList = stateList.filter(item => {
            return item.name.toUpperCase().startsWith(query.toUpperCase())
          })
          this.billingStateList = filterStateList
        } else {
          this.billingStateList = this.billingStateListCopy
        }
      }
    },

    async created() {
      //货币列表
      getCurrency().then(res => {
        this.currencyInfo = res.data
        let defaultCurrency = this.currencyInfo.find(item => {
          return item.is_default === 1
        })
        this.currencyId = defaultCurrency.id
        this.defaultCurrency = defaultCurrency.code
      })
      //国家列表
      getCountry().then(res => {
        this.countryList = this.countryListCopy = res.data
        this.getDefaultCountry()
      })
      if (this.$route.query.Buynow == 1) {
        getCustomProductInfo({
          name: this.$route.query.Name
        }).then(res => {
          this.customProductInfo = res.data
          let proList = this.customProductInfo.productList,
            totalPrice = 0,
            totalQuantity = 0
          proList.forEach(item => {
            totalPrice += Number(item.price)
            totalQuantity += Number(item.quantity)
          })
          this.customProductInfo['price'] = totalPrice
          this.customProductInfo['quantity'] = totalQuantity
        })
      }
    },

    async mounted() {

      if(!sessionStorage.getItem("cid")){
          this.$router.replace("/");
          return
      }
      this.windowWidth=document.documentElement.clientWidth,
      this.localCartList = this.$utils.deepCopy(this.$store.state.cart)
      let pStrict = Number(sessionStorage.getItem('pStrict')) || 0
      this.pStrict = pStrict.toFixed(2)
      // this.cList = this.$utils.deepCopy(this.$store.state.cartTemp)
      let cartTemp = []
      if(this.$store.state.cartTemp){
        cartTemp[0] = this.$utils.deepCopy(this.$store.state.cartTemp)
        sessionStorage.setItem('cartTemp',JSON.stringify(this.$store.state.cartTemp))
      }else{
        cartTemp[0] = JSON.parse(sessionStorage.getItem('cartTemp'))
      }
      this.cList = cartTemp
      this.unit_price = (cartTemp[0].unit_price *cartTemp[0].quantity).toFixed(2)  || 0

      let dp = 0
      let dp1 = parseInt(sessionStorage.getItem('discountPrice'))
      let dpType = parseInt(sessionStorage.getItem('payType'))
      let pPice = 0
      if(dpType==3){
        pPice = this.cList[0].price
        dp = 0
      }else{
        dp = dp1
        if(dpType==0){
          // pPice = this.cList[0].price * (100-dp1)/100

          pPice = this.unit_price * (100-dp1) /100
          dp = this.unit_price - pPice
        }else{
          // pPice = this.cList[0].price-dp1
          dp = (parseInt(this.cList[0].quantity) * this.cList[0].unit_price) - dp1
          pPice = Number(this.cList[0].price)-pStrict
          this.cList[0].price = pPice
        }
      }
      this.discountPrice = dp.toFixed(2)
      this.total = Number(pPice).toFixed(2)

      if(this.$route.query.Buynow != 1){
        if(this.$store.state.authInfo){
          await this.initAddress().then(async res => {
            //res为true代表用户设置了默认地址
            if (!res) {
              let addressData = localStorage.getItem("addressData");
              if (addressData) {
                try {
                  this.shippingForm = JSON.parse(addressData);
                  this.shippingForm.default = 0;
                  if (this.shippingForm.country_id) {
                    await this.getShippingState(this.shippingForm.country_id);
                    this.changeShippingState(this.shippingForm.state_id);
                  }
                } catch {}
              } else {
                this.getDefaultCountry();
              }
            }
          });
        }
      }
    },
  }
</script>
<style lang="scss" scoped>
.checkoutWrap {
  font-size: 16px;

  h3 {
    padding-bottom: 20px;
    font-size: 24px !important;
  }

  .h5 {
    font-size: 16px !important;
  }

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand /deep/ .el-form-item__label {
    flex-shrink: 0;
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand /deep/ .el-form-item {
    display: flex;
    margin-right: 0;
    margin-bottom: 0;
    width: 400px;
  }

  .shippingForm.isPaypel {
    width: 50%;
    @media screen and (max-width: $breakpoint-xl-min) {
      width: 100%;
    }
  }

  .cart-list {
    .designImg {
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 4px;
      height: 150px;
    }

    .imgWrap {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      cursor: zoom-in;
    }

    /deep/ .el-icon-arrow-right {
      color: #333;
      font-weight: 700;
    }
  }
}
</style>

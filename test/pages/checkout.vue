<template>
  <div class="checkoutWrap bg-default">
    <div class="container py-3">
      <div class="steps row align-items-center border-bottom pb-3">
        <h3 class="col-12 col-xl-3 mb-0 pb-0 text-secondary">
          <i class="el-icon-goods h2 mb-0 align-middle"></i> Checkout
        </h3>
        <div class="col-xl-9 d-none d-xl-block">
          <el-steps :active="activeInd" simple class="bg-white">
            <el-step title="1.Shopping Cart"></el-step>
            <el-step title="2.Checkout"></el-step>
            <el-step title="3.Complete"></el-step>
          </el-steps>
        </div>
      </div>

      <div class="cart mt-3 border bg-white p-4">
        <h3 class="border-bottom mb-2">Product List</h3>
        <div class="cart-list" v-if="$route.query.Buynow != 1">
          <el-table :data="orderList" style="width: 100%">
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
                            style="word-break: break-word"
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
                      :src="scope.row.pic_path"
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
                  >{{ scope.row.width + "” x " + scope.row.height + "”" }}
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
        <div class="cart-list" v-else>
          <el-table :data="orderList" style="width: 100%">
            <el-table-column label="Picture" width="250">
              <template slot-scope="scope">
                <div class="designImg">
                  <div class="imgWrap">
                    <img
                      :src="scope.row.pic_path"
                      class="img-fluid"
                      preview="0"
                      alt="product"
                      title="product"
                    />
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="Product description">
              <template slot-scope="scope">
                {{ scope.row.product_description }}
              </template>
            </el-table-column>
            <el-table-column label="Price">
              <template slot-scope="scope">
                <span> {{ scope.row.price }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Quantity">
              <template slot-scope="scope">
                <span> {{ scope.row.quantity }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Total">
              <template slot-scope="scope">
                <div class="text-danger">
                  {{ currencyItem.symbol
                  }}{{
                    (parseFloat(scope.row.price) * currencyItem.rate)
                      | formatPrice
                  }}
                </div>
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
              <div class="py-2" style="width: 185px">
                <el-input
                  readonly
                  :value="currencyItem.code"
                  class="width185"
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
            <div class="py-2">
              <el-select
                class="width185"
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
                      style="width: 100px"
                      placeholder="MM"
                    ></el-input>
                  </el-form-item>
                  <span class="mx-1">/</span>
                  <el-form-item prop="YY">
                    <el-input
                      v-model="cardForm.YY"
                      style="width: 100px"
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
            v-if="
              $route.query.Buynow != 1 ||
                ($route.query.Buynow == 1 && show_address_bar == 1)
            "
          >
            <div>
              <h3 id="shippingTitle" class="border-bottom">
                Shipping Address
              </h3>
              <div class="formCon">
                <div
                  class="shippingForm"
                  :class="{ isPaypel: paymentMethods === 'PayPal' }"
                >
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
                        <el-link @click="showShippingForm = true" type="primary"
                          >Edit</el-link
                        >
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
                      "
                    >
                      <el-form-item
                        label="Save Address"
                        v-if="$store.state.authInfo"
                      >
                        <el-select
                          class="w-100"
                          v-model="addressId"
                          clearable
                          @change="changeAddress"
                          size="small"
                        >
                          <el-option
                            v-for="item in addressList"
                            :key="item.id"
                            :label="item.city_name"
                            :value="item.id"
                          >
                            <span
                              >({{ item.address_line }},{{ item.city_name }},{{
                                item.zip
                              }}-{{ item.state }},{{ item.country }})</span
                            >
                          </el-option>
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
          v-show="
            (paymentMethods !== 'PayPal' && $route.query.Buynow != 1) ||
              (paymentMethods !== 'PayPal' &&
                $route.query.Buynow == 1 &&
                show_address_bar == 1)
          "
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
                        <el-link @click="showBillingForm = true" type="primary"
                          >Edit</el-link
                        >
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
        <h3 class="border-bottom mb-2 font24">Shipping & Delivery</h3>
        <div class="content">
          <ul style="font-weight: 600">
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
                <div class="tipImg mt-2">
                  <img
                    class="img-fluid"
                    width="628"
                    height="108"
                    src="
                      https://sticker-static.oss-us-west-1.aliyuncs.com/image/uploads/20201217/3a077d7741920c80bdaf9866b77b8e31.jpg
                    "
                    alt="order arrive"
                  />
                </div>
              </li>
            </div>
          </ul>
        </div>
      </div>
      <template v-if="orderList.length">
        <div class="mt-3 pView float-right" v-if="orderList[0].use_coupon != 0">
          <div class="pjhCoupon bg-white border">
            <div class="pTop">
              <div class="title">Pick Up Your Discounts</div>
              <span class="des"
                >Notes: Just enjoy one type of discount per order.</span
              >
            </div>
            <div class="pBot">
              <div
                class="pbTop row no-gutters align-items-center"
                v-for="(item, index) in cList"
                :key="index"
              >
                <el-checkbox
                  v-model="checkBoxList.cl[index]"
                  :class="'cc' + index"
                  @change="changeCheckBox"
                  >COUPON</el-checkbox
                >
                <div class="pbContent">
                  <span v-if="item.type == 1 && item.condition > 0"
                    >{{ item.condition }}-{{ item.discount_cash }}</span
                  >
                  <span v-if="item.type == 1 && item.condition == 0"
                    >-{{ item.discount_cash }} $</span
                  >
                  <span v-show="item.type == 0"
                    >{{ item.discount_cash }}% off</span
                  >
                </div>
                <div class="pbLaster">
                  Deadline: {{ item.validity_end_time }}
                </div>
              </div>
              <div class="pbTop row no-gutters align-items-center">
                <div
                  class="col-12 col-xl-6 d-flex align-items-center"
                  style="margin-left: 0"
                >
                  <el-checkbox
                    v-model="checkBoxList.cc"
                    class="cc99"
                    @change="changeCheckBox"
                    v-if="$store.state.authInfo"
                    >Promo Code</el-checkbox
                  >
                  <!--                <el-radio v-model="radio" :label="99"  @change="changeUserCoupon">Promo Code</el-radio>-->
                  <el-input
                    size="small"
                    v-model="pbcp"
                    @input="resetCoupon"
                    @focus="checkInput"
                  ></el-input>
                  <el-button
                    type="primary"
                    class="submitBtn"
                    @click="submitCp"
                    v-show="!canSubmitCP"
                    >Apply</el-button
                  >
                </div>
                <div
                  class="col-12 col-xl-6"
                  v-show="canSubmitCP"
                  style="margin-left: 0"
                >
                  <div
                    style="    margin-left: 15px;"
                    class="pbLaster h-100 mt-3 mt-xl-0"
                    v-show="isError == 'succes'"
                  >
                    {{ validity_end_time }}
                  </div>
                  <div
                    class="pbLaster lasterRed mt-3 mt-xl-0"
                    v-show="isError == true"
                  >
                    <img src="../static/images/pc_icon1.png" alt="" />
                    <span class="align-middle">Your code is invalid.</span>
                  </div>
                </div>
              </div>
              <div class="pbTop row no-gutters align-items-center">
                <div
                  class="col-12 col-xl-12 d-flex align-items-center"
                  style="margin-left: 0"
                >
                  <!--                <el-radio v-model="radio" :label="100"  @change="changeUserCoupon">I do not want to use any discounts.</el-radio>-->
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="clearfix"></div>
      </template>

      <div class="submit-wrap text-right mt-3 py-4">
        <div
          class="submit-cart d-inline-block float-right"
          style="width: 350px"
        >
          <div class="row mb-2 py-2 border-bottom">
            <div class="col-6">
              <div class="font-weight-bold">
                Subtotal ({{ orderList.length }} items)
              </div>
            </div>
            <div class="col-2">
              <div class="text-danger font-weight-bold">
                {{ currencyItem.symbol }}
              </div>
            </div>
            <div class="col-4">
              <div class="text-danger font-weight-bold">{{ priceTotal }}</div>
            </div>
          </div>
          <div
            class="row mb-2 py-2 border-bottom"
            v-show="$route.query.Buynow != 1"
          >
            <div class="col-6">
              <div class="font-weight-bold">(+) Shipping charges</div>
            </div>
            <div class="col-2">
              <div class="text-danger font-weight-bold">
                {{ currencyItem.symbol }}
              </div>
            </div>
            <div class="col-4">
              <div class="text-danger font-weight-bold">0.00</div>
            </div>
          </div>

          <div class="row mb-2 py-2 border-bottom">
            <div class="col-6">
              <div class="font-weight-bold">(+) Tax</div>
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

          <template v-if="orderList.length">
            <div
              class="row mb-2 py-2 border-bottom"
              v-show="orderList[0].use_coupon != 0"
            >
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
          </template>

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
          class="mb-2 btnStyle3 float-right"
          :originFileList="[]"
          v-if="!$store.state.authInfo.duty_free_certificate"
        ></fileUpload>
        <div class="clearfix"></div>
        <div class="submit-btn float-right">
          <el-button
            class="btnStyle2"
            type="success"
            @click="submitOrder"
            :loading="submitLoading"
          >
            Place your Order add GO TO PAY <i class="el-icon-right"></i>
          </el-button>
          <p class="mt-2">
            <a
              target="_blank"
              href="https://seal.godaddy.com/verifySeal?sealID=CK8MVNXGf3kYsXkniLgwHL5Y5sXJUlpKpZW6ZFl8Jiz4gFg3Ya0JqSi9QNq0"
            >
              <img
                src="
                  https://sticker-static.oss-accelerate.aliyuncs.com/image/uploads/20201216/0a1bde9cac07007118e1d3e285bb2a84.jpg
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

    <base-dialog :visible.sync="showTips" :lockScroll="true">
      <template v-slot:content>
        <div class="content-box">
          <div class="text-center w-100">
            <div class="p-2 py-4">
              <p>Thanks for your order and your immense trust!</p>
              <p>
                The delivery to your address is beyond our free shipping service
                area.
              </p>
              <p>
                We will confirm whether there is an EXTRA SHIPPING FEE and
                contact you by email ASAP!
              </p>
            </div>
            <el-button
              type="primary"
              class="w-100 rounded-0"
              @click="showTips = false"
              >Confirm
            </el-button>
          </div>
        </div>
      </template>
    </base-dialog>
    <cus-dialog :visible.sync="showDefaultAddress" :hiddenClose="true">
      <template v-slot:header>
        <div class="font-weight-bold text-center">Tips</div>
      </template>
      <template v-slot:body>
        <div>
          <p class="w-75 m-auto text-center">
            Do you want to set the current address as a common address
          </p>
        </div>
      </template>
      <template v-slot:footer>
        <div class="d-flex justify-content-center">
          <el-button type="primary" @click="setDefaultAddress">Yes</el-button>
          <el-button @click="showDefaultAddress = false">No</el-button>
        </div>
      </template>
    </cus-dialog>
  </div>
</template>

<script>
import { checkCardNumber, checkCvv, checkYY, checkMM } from "@/utils/validate";
import { getCountry, getState, getCurrency, isRegister } from "@/api/public";
import {
  pay,
  addOrder,
  getAndCheckCouponByCouponCode,
  getBestCoupons,
  getUserCoupon,
  changeUserCoupon
} from "@/api/checkout";
import { getCustomProductInfo } from "@/api/customProduct";
import { getUserAddressList, editAddress } from "@/api/account";
import fileUpload from "@/components/fileUpload";
import { addCartAccessory } from "@/api/cart";

export default {
  data() {
    return {
      cList: [],
      isError: false,
      canSubmitCP: false,
      validity_end_time: "",
      radio: "1",
      showDefaultAddress: false,
      couponInfo: "",
      couponForm: {
        couponCode: ""
      },
      showTips: false,
      duty_rate: 0, //关税
      activeInd: 1,
      showShippingForm: true,
      showBillingForm: true,
      submitLoading: false,
      customProductInfo: "",
      currencyInfo: [],
      currencyId: [],
      checkedBillingForm: true,
      checkedShippingForm: true,
      paymentMethods: "PayPal",
      paymentOptions: [
        {
          name: "PayPal",
          value: "PayPal"
        },
        {
          name: "Credit Card / Debit card",
          value: "Authorize"
        }
      ],
      shippingMethodList: [],
      billingType: false,
      activeProName: 0,
      loginDialog: false,
      addressId: "",
      arriveSlide: false,
      shippingtype: "",
      countryList: [],
      countryListCopy: [],
      shippingStateList: [],
      shippingStateListCopy: [],
      billingStateList: [],
      billingStateListCopy: [],
      shippingForm: {
        default: 0,
        email: "",
        first_name: "",
        last_name: "",
        address_line: "",
        city_name: "",
        country_id: "",
        state_id: "",
        zip: "",
        phone: ""
      },
      show_address_bar: 1,
      shippingRules: {
        GsOId: [
          {
            required: true,
            trigger: "blur"
          }
        ],
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
        address_line: [
          {
            required: true,
            trigger: "blur"
          }
        ],
        city_name: [
          {
            required: true,
            trigger: "blur"
          }
        ],
        country_id: [
          {
            required: true,
            trigger: "change"
          }
        ],
        state_id: [
          {
            required: true,
            trigger: "change"
          }
        ],
        zip: [
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
      billingForm: {
        bill_first_name: "",
        bill_last_name: "",
        bill_address_line: "",
        bill_city_name: "",
        bill_country_id: "",
        bill_state_id: "",
        bill_zip: "",
        bill_phone: ""
      },
      billingRules: {
        bill_first_name: [
          {
            required: true,
            trigger: "blur"
          }
        ],
        bill_last_name: [
          {
            required: true,
            trigger: "blur"
          }
        ],
        bill_address_line: [
          {
            required: true,
            trigger: "blur"
          }
        ],
        bill_city_name: [
          {
            required: true,
            trigger: "blur"
          }
        ],
        bill_country_id: [
          {
            required: true,
            trigger: "change"
          }
        ],
        bill_state_id: [
          {
            required: true,
            trigger: "change"
          }
        ],
        bill_zip: [
          {
            required: true,
            trigger: "blur"
          }
        ],
        bill_phone: [
          {
            required: true,
            trigger: "blur"
          }
        ]
      },
      cardForm: {
        CardNumber: "",
        CardCode: "",
        MM: "",
        YY: ""
      },
      cardRules: {
        CardNumber: [
          {
            required: true,
            validator: checkCardNumber,
            trigger: "blur"
          }
        ],
        CardCode: [
          {
            required: true,
            validator: checkCvv,
            trigger: "blur"
          }
        ],
        MM: [
          {
            required: true,
            validator: checkMM,
            trigger: "blur"
          }
        ],
        YY: [
          {
            required: true,
            validator: checkYY,
            trigger: "blur"
          }
        ]
      },
      country_id: "",
      state_id: "",
      billingCountry: "",
      billingState: "",
      addressList: [],
      pPricetotal: 0,
      pDiscountPrice: 0,
      checkBoxList: {}
    };
  },
  watch: {
    shippingForm: {
      handler: function(newValue) {
        this.changeShippingState(newValue.state_id);
      },
      deep: true
    }
  },
  components: {
    fileUpload
  },
  computed: {
    pbcp: {
      get() {
        return this.couponForm.couponCode;
      },
      set(val) {
        this.couponForm.couponCode = val.toUpperCase();
      }
    },
    currencyItem() {
      let currencyItem = this.currencyInfo.find(item => {
        return item.id === this.currencyId;
      });
      if (currencyItem) {
        return currencyItem;
      } else {
        return {
          symbol: "",
          rate: ""
        };
      }
    },
    localCartList() {
      return this.$utils.deepCopy(this.$store.state.checkoutCart);
    },
    orderList() {
      if (this.$route.query.Buynow == 1) {
        let arr = [];
        arr.push(this.customProductInfo);
        return arr;
      } else {
        return this.localCartList;
      }
    },
    shippingAreaCode() {
      let countryList = this.countryList;
      let countryItem = countryList.find(item => {
        return item.id === this.shippingForm.country_id;
      });
      if (countryItem) {
        return countryItem.code;
      }
    },
    billingAreaCode() {
      let countryList = this.countryList;
      let countryItem = countryList.find(item => {
        return item.id === this.billingForm.bill_country_id;
      });
      if (countryItem) {
        return countryItem.code;
      }
    },
    total() {
      return Number(this.priceTotal) +
        Number(this.duty_rate_price) -
        Number(this.discountPrice) <
        0
        ? "0.00"
        : (
            Number(this.priceTotal) +
            Number(this.duty_rate_price) -
            Number(this.discountPrice)
          ).toFixed(2);
    },
    discountPrice: {
      get(e) {
        let num = 0;
        if (!this.ischange) {
          let total = this.priceTotal;
          let couponInfo = this.couponInfo;
          if (couponInfo) {
            //优惠券类型 0 折扣 1 抵现金
            if (couponInfo.type === 0) {
              total = (total * Number(couponInfo.discount_cash)) / 100;
            } else if (couponInfo.type === 1) {
              total = couponInfo.discount_cash;
            }
            this.pDiscountPrice = Number(total).toFixed(2);
          } else {
            this.pDiscountPrice = Number(0).toFixed(2);
          }
        }
        num = Number(this.pDiscountPrice).toFixed(2);
        return num;
      },
      set(val) {
        if (val) {
          this.pDiscountPrice = val;
        } else {
          if (this.radio != 100) {
            let total = this.priceTotal;
            let couponInfo = this.couponInfo;
            if (couponInfo) {
              //优惠券类型 0 折扣 1 抵现金
              if (couponInfo.type === 0) {
                total = (total * Number(couponInfo.discount_cash)) / 100;
              } else if (couponInfo.type === 1) {
                total = couponInfo.discount_cash;
              }
              this.pDiscountPrice = Number(total).toFixed(2);
            } else {
              this.pDiscountPrice = Number(0).toFixed(2);
            }
          } else {
            this.pDiscountPrice = Number(0).toFixed(2);
          }
        }
      }
    },
    priceTotal: {
      get() {
        if (!this.ischange) {
          if (this.radio != 100) {
            let total = 0;
            if (this.$route.query.Buynow != 1) {
              this.orderList.forEach(item => {
                total += parseFloat(item.price);
              });
              total = total * this.currencyItem.rate;
            } else {
              total = this.customProductInfo.price * this.currencyItem.rate;
            }
            this.pPricetotal = Number(total).toFixed(2);
          } else {
            let priceTotal = Number(this.priceTotal);
            let duty_rate_price = Number(this.duty_rate_price);
            let num = priceTotal + duty_rate_price;
            this.pPricetotal = Number(num).toFixed(2);
          }
        }
        return this.pPricetotal;
      },
      set(val) {
        if (val) {
          this.pPricetotal = val;
        } else {
          let total = 0;
          if (this.radio != 100) {
            if (this.$route.query.Buynow != 1) {
              this.orderList.forEach(item => {
                total += parseFloat(item.price);
              });
              total = total * this.currencyItem.rate;
            } else {
              total = this.customProductInfo.price * this.currencyItem.rate;
            }
            this.pPricetotal = Number(total).toFixed(2);
          } else {
            let priceTotal = Number(this.priceTotal);
            this.pPricetotal = priceTotal.toFixed(2);
            // let duty_rate_price = Number(this.duty_rate_price)
            // console.log(priceTotal)
            // console.log(duty_rate_price)
            // let num = priceTotal + duty_rate_price
            // this.pPricetotal = Number(num).toFixed(2);
          }
        }
      }
    },
    duty_rate_price() {
      return Number(
        ((this.priceTotal - this.discountPrice) * this.duty_rate) / 100
      ) < 0
        ? "0.00"
        : Number(
            ((this.priceTotal - this.discountPrice) * this.duty_rate) / 100
          ).toFixed(2);
    }
  },
  methods: {
    cFun() {
      console.log(this.$store.state.authInfo)
      if (!this.$store.state.authInfo) {
        return;
      }
      let product_list = [];
      if (this.$route.query.Buynow == 1) {
        let that = this;
        let timed = setInterval(function() {
          let orderList = that.orderList;
          if (orderList[0]) {
            console.log(that.orderList);
            that.orderList[0].productList.forEach(item => {
              let temp1 = {
                product_category_id: item.product_category_id,
                unit_price: item.unit_price,
                quantity: item.quantity
              };
              product_list.push(temp1);
            });
            if (that.orderList[0].use_coupon == 1) {
              that.getbest(product_list);
            }
            clearInterval(timed);
          }
        }, 100);
      } else {
        this.orderList.forEach(item => {
          let temp1 = {
            product_category_id: item.product_category_id,
            unit_price: item.unit_price,
            quantity: item.quantity
          };
          product_list.push(temp1);
        });
        this.getbest(product_list);
      }
    },
    getbest(product_list) {
      if (product_list.length >= 1) {
        let str = JSON.stringify(product_list);
        this.product_list = str;
        let postData = {
          product_list: str
        };
        getBestCoupons(postData)
          .then(res => {
            this.bestCouponId = res.data.bestCouponId;
          })
          .then(() => {
            getUserCoupon(postData).then(res => {
              if (res.data) {
                let index = 0;
                let dataList = res.data;
                dataList.forEach((item, i) => {
                  if (item.id == this.bestCouponId) {
                    index = i;
                  }
                  let str = "";
                  let y = item.validity_end_time.substr(0, 4);
                  let m = item.validity_end_time.substr(5, 2);
                  let d = item.validity_end_time.substr(8, 2);
                  switch (m) {
                    case "01":
                      str = `Jan ${d},${y}`;
                      break;
                    case "02":
                      str = `Feb ${d},${y}`;
                      break;
                    case "03":
                      str = `Mar ${d},${y}`;
                      break;
                    case "04":
                      str = `Apr ${d},${y}`;
                      break;
                    case "05":
                      str = `May ${d},${y}`;
                      break;
                    case "06":
                      str = `Jun ${d},${y}`;
                      break;
                    case "07":
                      str = `Jul ${d},${y}`;
                      break;
                    case "08":
                      str = `Aug ${d},${y}`;
                      break;
                    case "09":
                      str = `Sept ${d},${y}`;
                      break;
                    case "10":
                      str = `Oct ${d},${y}`;
                      break;
                    case "11":
                      str = `Nov ${d},${y}`;
                      break;
                    case "12":
                      str = `Dec ${d},${y}`;
                      break;
                  }

                  item.validity_end_time = str;
                });
                this.cList = res.data;
                let list = [];
                let list1 = [];
                res.data.forEach((item, index) => {
                  list[index] = item.id == this.bestCouponId ? true : false;
                  list1[index] = false;
                });
                let obj = {
                  cl: list,
                  cc: false
                };
                let obj1 = {
                  cl: list1,
                  cc: false
                };
                this.checkBoxList = obj;
                this.dcbList = JSON.stringify(obj1);
                this.changeUserCoupon(index);
              }
            });
          });
      }
    },
    checkInput() {
      this.radio = 99;
      let list = this.dcbList || "[]";
      this.checkBoxList = JSON.parse(list);
      this.checkBoxList.cc = true;
      this.discountPrice = this.aDiscount_cash || "";
    },
    changeCheckBox(e, v) {
      let str = v.srcElement.labels[0].classList.value;
      let n = Number(
        str.substring(str.indexOf("cc") + 2, str.indexOf("cc") + 4)
      );
      let num = 100;
      if (n === 0 || n > 0) {
        num = n;
      }
      let list = this.dcbList || "[]";
      this.checkBoxList = JSON.parse(list);

      if (num != this.radio) {
        this.radio = num;
        if (num == 99 || this.cList.length < 1) {
          this.checkBoxList.cc = e;
          this.radio = 99;
          this.priceTotal = undefined;
          this.discountPrice =
            this.aDiscount_cash != undefined ? this.aDiscount_cash : undefined;
          return;
        }
        this.checkBoxList.cl[num] = e;
        this.radio = num;

        this.user_coupon_id = this.cList[num].id || "";
        let postData = {
          user_coupon_id: this.cList[num].id,
          product_list: this.product_list
        };
        changeUserCoupon(postData).then(res => {
          this.priceTotal = Number(res.data.original_price).toFixed(2);
          this.discountPrice = Number(res.data.discount_price).toFixed(2);
        });
      } else {
        //取消选择
        this.radio = 100;
        this.priceTotal = undefined;
        this.discountPrice = undefined;
        this.couponForm.couponCode = "";
        this.user_coupon_id = "";
      }
    },
    changeUserCoupon(e) {
      this.ischange = true;
      if (e == 100) {
        this.priceTotal = undefined;
        this.discountPrice = undefined;
        this.couponForm.couponCode = "";
        this.user_coupon_id = "";
        return;
      }

      if (e == 99 || this.cList.length < 1) {
        this.priceTotal = undefined;
        this.discountPrice =
          this.aDiscount_cash != undefined ? this.aDiscount_cash : undefined;
        return;
      }

      this.radio = e;
      this.user_coupon_id = this.cList[e].id || "";
      let postData = {
        user_coupon_id: this.cList[e].id,
        product_list: this.product_list
      };
      changeUserCoupon(postData).then(res => {
        this.priceTotal = Number(res.data.original_price).toFixed(2);
        this.discountPrice = Number(res.data.discount_price).toFixed(2);
      });
    },
    resetCoupon() {
      this.couponInfo = "";
      this.canSubmitCP = false;
    },
    submitCp() {
      let mounthObject = {
        1: "January",
        2: "February",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December"
      };
      let that = this;
      let cpCode = this.couponForm.couponCode;
      if (cpCode) {
        getAndCheckCouponByCouponCode({
          coupon_code: cpCode,
          product_price: this.priceTotal
        })
          .then(res => {
            this.canSubmitCP = true;
            if (res.ret === 1) {
              this.$message.success("Promo code applied successfully.");
              this.couponInfo = res.data;
              let y = new Date(res.data.validity_end_time).getFullYear(); // 当前年份
              let m = new Date(res.data.validity_end_time).getMonth() + 1; // 当前月份
              let d = new Date(res.data.validity_end_time).getDate(); // 当前日期
              this.validity_end_time = `Deadline: ${mounthObject[m]} ${d}, ${y}`;
              this.isError = "succes";
              this.priceTotal = undefined;
              let pPricetotal = Number(this.pPricetotal); //总价
              let discount_cash = Number(res.data.discount_cash);
              let type = res.data.type;
              if (type == 0) {
                //折扣
                this.discountPrice =
                  pPricetotal -
                  (pPricetotal -
                    (pPricetotal * (100 - (100 - discount_cash))) / 100);
              } else if (type == 1) {
                //抵扣
                this.discountPrice = discount_cash;
              }
              this.aDiscount_cash = Number(this.discountPrice).toFixed(2);
            } else if (res.ret === 24) {
              this.couponInfo = "";
              that.isError = true;
            }
          })
          .catch(error => {
            this.couponInfo = "";
            that.isError = true;
          });
      }
    },
    setDefaultAddress() {
      this.shippingForm.default = 1;
      this.showDefaultAddress = false;
    },
    logined() {
      this.initAddress();
      this.cFun();
    },
    blurEmail() {
      this.$refs.shippingForm.validateField("email", valid => {
        if (!valid) {
          isRegister({
            email: this.shippingForm.email
          }).then(res => {
            if (res.data) {
              this.$store.commit("SET_LOGINDIALOG", true);
            }
          });
        }
      });
    },
    getFileList(fileList, row) {
      let resultList = [];
      fileList.forEach(file => {
        const returnFile = {
          name: file.name,
          url: file.url
        };
        resultList.push(returnFile);
      });
      //更新此页面的数据
      let cartList = this.localCartList;
      let findItem = cartList.find(item => {
        return item.id === row.id;
      });
      findItem.accessory = JSON.stringify(resultList);
      //更新vuex的数据
      this.$store.commit("update_checkoutCart", {
        id: row.id,
        data: {
          accessory: JSON.stringify(resultList)
        }
      });
      if (this.$store.state.authInfo) {
        //更新数据库的数据
        addCartAccessory({
          accessory: JSON.stringify(resultList),
          cart_id: row.id
        });
      }
    },
    postOrder() {
      this.submitLoading = true;
      let shippingForm = this.shippingForm,
        billingForm = this.billingForm,
        postData,
        billingType = this.billingType,
        paymentMethods = this.paymentMethods;
      if (billingType) {
        billingForm.bill_first_name = shippingForm.first_name;
        billingForm.bill_last_name = shippingForm.last_name;
        billingForm.bill_address_line = shippingForm.address_line;
        billingForm.bill_city_name = shippingForm.city_name;
        billingForm.bill_country_id = shippingForm.country_id;
        billingForm.bill_state_id = shippingForm.state_id;
        billingForm.bill_zip = shippingForm.zip;
        billingForm.bill_phone = shippingForm.phone;
      }
      let shipping_address_id = this.addressId;
      let cartIdList = [];
      this.orderList.forEach(item => {
        cartIdList.push(item.id);
      });
      if (this.$route.query.Buynow == 1) {
        postData = Object.assign({}, shippingForm, billingForm, {
          email: this.$store.state.authInfo.email,
          currency_id: this.currencyId,
          cartIdList: "",
          custom_product_id: this.$route.query.p_id, //1代表定制
          coupon_code: this.couponForm.couponCode,
          is_mobile: this.$store.state.device.type === "pc" ? 0 : "1"
        });
      } else {
        postData = Object.assign({}, shippingForm, billingForm, {
          email: this.$store.state.authInfo.email,
          currency_id: this.currencyId,
          cartIdList: cartIdList,
          custom_product_id: "", //0代表非定制
          coupon_code: this.canSubmitCP ? this.couponForm.couponCode : "",
          is_mobile: this.$store.state.device.type === "pc" ? 0 : "1"
        });
      }

      //是否使用优惠券
      if (this.orderList[0].use_coupon == 0) {
        postData.use_coupon = 0;
      } else {
        postData.use_coupon = 1;
      }

      if (!this.$store.state.authInfo) {
        let productListPost = [];
        this.orderList.forEach(item => {
          let temp = {
            product_category_id: item.product_category_id,
            pic_path: item.pic_path,
            quantity: item.quantity,
            param_id_list: item.param_id_list,
            height: item.height,
            width: item.width,
            select_params: item.select_params,
            accessory: item.accessory
          };
          productListPost.push(temp);
        });
        postData = Object.assign({}, postData, {
          email: this.shippingForm.email,
          productList: JSON.stringify(productListPost),
          cartIdList: ""
        });
      }
      //支付方式
      postData.payment = this.paymentMethods;
      if (this.radio == 99 || this.radio == 100) {
        postData.user_coupon_id = "";
      } else {
        postData.coupon_code = "";
        postData.user_coupon_id = this.user_coupon_id || "";
      }

      if (this.$refs.fileUpload) {
        if (this.$refs.fileUpload.getFileList().length) {
          postData.duty_free_certificate = this.$refs.fileUpload.getFileList()[0].url;
        } else {
          postData.duty_free_certificate = "";
        }
      } else {
        postData.duty_free_certificate = "";
      }
      if (shipping_address_id) {
        postData.shipping_address_id = shipping_address_id;
      }
      addOrder(postData)
        .then(async res => {
          let orderId = res.data.order_id;
          //下单成功 bigin
          this.$store.commit("SET_CART", []);
          this.orderList.forEach(item => {
            let delItem = this.$store.state.cart.find(cartObj => {
              return cartObj.id == item.id;
            });
            if (delItem) {
              this.$store.commit("REMOVE_CARTLIST", [delItem.id]);
            }
          });
          this.$store.commit("set_checkoutCart", []);
          this.$utils.setCookie("token", res.data.token);
          //下单成功结束
          try {
            //重新获取用户信息
            await this.$store.dispatch("getUserInfo");
            let addressData = Object.assign({}, this.shippingForm, {
              id: this.addressId
            });
            await editAddress(addressData);
            localStorage.setItem(
              "addressData",
              JSON.stringify(this.shippingForm)
            );
          } catch {}
          setTimeout(() => {
            let postData;
            if (paymentMethods === "PayPal") {
              postData = {
                order_id: orderId
              };
            } else if (paymentMethods === "Authorize") {
              let cardForm = this.cardForm;
              postData = {
                order_id: orderId,
                JsonStr: JSON.stringify({
                  CardNumber: cardForm.CardNumber,
                  ExpirationDate: "20" + cardForm.YY + "-" + cardForm.MM,
                  CardCode: cardForm.CardCode
                })
              };
            }
            this.payment(postData, paymentMethods);
          }, 300);
        })
        .finally(() => {
          this.submitLoading = false;
        });
    },

    payment(postData, type) {
      const loading = this.$loading({
        lock: true,
        text: "In payment...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
        customClass: "cus-loading"
      });
      pay(postData)
        .then(res => {
          if (type === "PayPal") {
            let div = document.createElement("div");
            let page = document.body;
            div.innerHTML = res.data;
            page.appendChild(div);
            document.getElementById("paypal_form").submit();
          }
          if (type === "Authorize") {
            //信用卡支付失败，跳转到订单详情页面继续支付
            if (res.ret === 2) {
              this.$router.push({
                name: "payment-failed-id",
                params: {
                  id: res.data
                }
              });
            } else {
              this.$router.push({
                name: "payment-success-id",
                params: {
                  id: res.data
                }
              });
            }
          }
          this.submitLoading = false;
        })
        .finally(() => {
          setTimeout(() => {
            loading.close();
          }, 3000);
        });
    },

    submitOrder() {
      //验证发货地址
      if (this.show_address_bar == 1) {
        this.$refs["shippingForm"].validate(validShippingForm => {
          if (!validShippingForm) {
            this.$utils.scrollToElement(
              document.getElementById("shippingTitle")
            );
            this.checkedShippingForm = false;
            return false;
          }
          this.checkedShippingForm = true;
          //发货地址验证通过，如果是paypal付款 不需要验证账单地址和信用卡可以提交订单
          if (this.paymentMethods === "PayPal") {
            this.postOrder();
          } else {
            //如果选中账单地址和发货地址相同，只需验证信用卡，都通过后提交订单
            if (this.billingType) {
              this.$refs["cardForm"].validate(validCardForm => {
                if (validCardForm) {
                  this.postOrder();
                } else {
                  this.$utils.scrollToElement(
                    document.getElementById("payment")
                  );
                }
              });
            } else {
              //验证账单地址和信用卡信息,都通过后提交订单
              this.$refs["billingForm"].validate(validBillingForm => {
                if (!validBillingForm) {
                  this.$utils.scrollToElement(
                    document.getElementById("billingTitle")
                  );
                  this.checkedBillingForm = false;
                  return false;
                }
                this.checkedBillingForm = true;
                this.$refs["cardForm"].validate(validCardForm => {
                  if (validCardForm) {
                    this.postOrder();
                  } else {
                    this.$utils.scrollToElement(
                      document.getElementById("payment")
                    );
                  }
                });
              });
            }
          }
        });
      } else {
        if (this.paymentMethods === "PayPal") {
          this.postOrder();
        } else {
          this.$refs["cardForm"].validate(validCardForm => {
            if (validCardForm) {
              this.postOrder();
            } else {
              this.$utils.scrollToElement(document.getElementById("payment"));
            }
          });
        }
      }
    },

    changeBillingType() {
      this.$refs["billingForm"].resetFields();
    },

    async changeAddress() {
      try {
        this.$refs["shippingForm"].resetFields();
      } catch {}
      this.shippingStateList = [];
      if (!this.addressId) {
        return false;
      }
      let aid = this.addressId;
      let addressItem = this.addressList.find(item => {
        return item.id === aid;
      });
      if (!addressItem.default) {
        this.showDefaultAddress = true;
      }
      let shippingForm = {
        first_name: addressItem.first_name,
        last_name: addressItem.last_name,
        address_line: addressItem.address_line,
        city_name: addressItem.city_name,
        country_id: addressItem.country_id,
        state_id: addressItem.state_id ? addressItem.state_id : "",
        zip: addressItem.zip,
        phone: addressItem.phone
      };
      await this.getShippingState(addressItem.country_id);
      this.$nextTick(() => {
        this.shippingForm = shippingForm;
      });
    },

    validateShippingForm() {
      this.$refs["shippingForm"].validate(valid => {
        if (valid) {
          this.showShippingForm = false;
          let selectCountry = this.countryList.find(item => {
            return item.id === this.shippingForm.country_id;
          });
          let selectState = this.shippingStateList.find(item => {
            return item.id === this.shippingForm.state_id;
          });
          this.country_id = selectCountry.name;
          this.state_id = selectState ? selectState.name : "";
        } else {
          this.showShippingForm = true;
        }
      });
    },

    validateBillingForm() {
      this.$refs["billingForm"].validate(valid => {
        if (valid) {
          this.showBillingForm = false;
          let selectCountry = this.countryList.find(item => {
            return item.id === this.billingForm.bill_country_id;
          });
          let selectState = this.billingStateList.find(item => {
            return item.id === this.billingForm.bill_state_id;
          });
          this.billingCountry = selectCountry.name;
          this.billingState = selectState ? selectState.name : "";
        } else {
          this.showBillingForm = true;
        }
      });
    },

    async changeBillingCountry(id) {
      await this.getBillingState(id);
      this.billingForm.bill_state_id = "";
    },

    async changeShippingCountry(id) {
      this.shippingtype = "";
      await this.getShippingState(id);
      this.shippingForm.state_id = "";
      let findItem = this.countryList.find(item => {
        return item.id === id;
      });
      if (!findItem.freight_free) {
        this.showTips = true;
      }
    },

    changeShippingState(id) {
      let shippingStateList = this.shippingStateList;
      let findState = shippingStateList.find(item => {
        return item.id === id;
      });
      this.duty_rate = findState ? findState.duty_rate : 0;
    },

    getShippingState(id) {
      return new Promise(resolve => {
        getState({
          id: id
        }).then(res => {
          this.shippingStateList = this.shippingStateListCopy = res.data;
          resolve();
        });
      });
    },

    getBillingState(id) {
      return new Promise(resolve => {
        getState({
          id: id
        }).then(res => {
          this.billingStateList = this.billingStateListCopy = res.data;
          resolve();
        });
      });
    },

    getDefaultCountry() {
      let defaultCountry = this.countryList.find(item => {
        return item.is_default === 1;
      });
      if(!defaultCountry){
        return false
      }
      this.shippingForm.country_id = this.billingForm.bill_country_id =
        defaultCountry.id;
      this.getShippingState(defaultCountry.id);
      this.getBillingState(defaultCountry.id);
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
    },

    filterShippingState(query) {
      if (query !== "") {
        let stateList = this.shippingStateListCopy;
        let filterStateList = stateList.filter(item => {
          return item.name.toUpperCase().startsWith(query.toUpperCase());
        });
        this.shippingStateList = filterStateList;
      } else {
        this.shippingStateList = this.shippingStateListCopy;
      }
    },

    filterBillingState(query) {
      if (query !== "") {
        let stateList = this.billingStateListCopy;
        let filterStateList = stateList.filter(item => {
          return item.name.toUpperCase().startsWith(query.toUpperCase());
        });
        this.billingStateList = filterStateList;
      } else {
        this.billingStateList = this.billingStateListCopy;
      }
    },

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
    }
  },

  async created() {
    //货币列表
    getCurrency().then(res => {
      this.currencyInfo = res.data;
      let defaultCurrency = this.currencyInfo.find(item => {
        return item.is_default === 1;
      });
      this.currencyId = defaultCurrency.id;
    });
    //国家列表
    getCountry().then(res => {
      this.countryList = this.countryListCopy = res.data;
    });
  },

  async mounted() {
    this.$Bus.$on("logined", e => {
      this.logined();
    });
    setTimeout(() => {
      if (this.orderList.length < 1 && !this.$route.query.Buynow) {
        this.$router.replace("/cart");
      }
    }, 100);

    //地址回填逻辑1,如果用户登录,回填用户设置的默认地址，如果用户没有设置默认地址，回填上次下单时前台存储的地址(addressData),如果前台保存的数据为空,只回填默认国家
    //地址回填逻辑1,如果用户未登录,回填上次下单时前台存储的地址(addressData),如果前台保存的数据为空,只回填默认国家

    if (this.$route.query.Buynow != 1) {
      if (this.$store.state.authInfo) {
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
      } else {
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
    } else {
      if (this.$store.state.authInfo) {
        getUserAddressList().then(res => {
          let addressList = res.data;
          this.addressList = addressList;
        });
      }
      getCustomProductInfo({
        name: this.$route.query.Name
      }).then(async res => {
        this.customProductInfo = res.data;
        let proList = this.customProductInfo.productList,
          totalPrice = 0,
          totalQuantity = 0;
        proList.forEach(item => {
          totalPrice += Number(item.price);
          totalQuantity += Number(item.quantity);
        });
        this.show_address_bar = res.data.show_address_bar;
        this.shippingForm.email = res.data.email;
        this.shippingForm.first_name = res.data.first_name;
        this.shippingForm.last_name = res.data.last_name;
        this.shippingForm.address_line = res.data.address_line;
        this.shippingForm.city_name = res.data.city_name;
        this.shippingForm.country_id = res.data.country_id;
        this.shippingForm.phone = res.data.phone;
        this.shippingForm.zip = res.data.zip;
        this.customProductInfo["price"] = totalPrice;
        this.customProductInfo["quantity"] = totalQuantity;
        if (this.shippingForm.country_id) {
          await this.getShippingState(this.shippingForm.country_id);
          this.shippingForm.state_id = res.data.state_id
            ? res.data.state_id
            : "";
          this.changeShippingState(this.shippingForm.state_id);
        }
        if (this.show_address_bar == 0) {
          this.billingType = 1;
        }
      });
    }
    this.cFun()
  },

  beforeDestroy() {
    this.$store.commit("set_checkoutCart", []);
    this.$Bus.$off("logined");
  }
};
</script>

<style lang="scss" scoped>
.pView {
  width: 100%;

  .pjhCoupon {
    margin-left: auto;
    width: 100%;

    .pTop {
      display: flex;
      flex-direction: column;
      justify-content: center;
      @include px2rem(height, 154px);
      @include px2rem(padding, 20px);
      border-bottom: 1px solid #ccc;

      .title {
        @include px2rem(font-size, 36px);
        font-weight: 600;
      }

      .des {
        @include px2rem(margin-top, 10px);
        @include px2rem(font-size, 24px);
        color: #666;
      }
    }

    .pBot {
      .pbTop {
        margin-bottom: 10px;
        padding-left: 10px;

        .pbContent {
          text-align: center;
          padding-right: 0;
          background: url("../static/images/bg_cup.png");
          background-size: 100% 100%;
          color: #c31f2a;
        }

        label {
          margin-left: 10px;
          width: 95px;
          font-weight: bold !important;
        }
      }

      @include px2rem(padding, 20px);

      .submitBtn {
        flex-shrink: 0;
        @include px2rem(width, 150px);
        @include px2rem(height, 60px);
        @include px2rem(line-height, 60px);
        @include px2rem(font-size, 28px);
        padding: 0;
      }

      .el-input {
        width: auto !important;
      }

      /deep/ .el-radio {
        width: auto !important;
        margin-right: 0;

        .el-radio__input {
          font-size: 0;
        }

        .el-radio__inner {
          @include px2rem(width, 40px);
          @include px2rem(height, 40px);

          &::after {
            @include px2rem(width, 20px);
            @include px2rem(height, 20px);
          }
        }

        .el-radio__label {
          @include px2rem(font-size, 26px, mobile, true);
          vertical-align: middle;
        }
      }

      /deep/ .el-input {
        .el-input__inner {
          @include px2rem(width, 252px);
          @include px2rem(height, 60px);
          @include px2rem(line-height, 60px);
          @include px2rem(font-size, 28px, mobile, true);
        }
      }

      .pbLaster {
        color: #999;
        @include px2rem(margin-left, 40px);
        padding-left: 10px;
        @include px2rem(font-size, 28px);
      }

      .lasterRed {
        color: #c31f2a !important;
      }
    }
  }

  @media screen and (min-width: $breakpoint-xl-min) {
    width: 550px;
    .pjhCoupon {
      width: 100%;

      .pTop {
        height: 74px;
        padding: 10px;

        .title {
          font-size: 24px;
        }

        .des {
          margin-top: 8px;
          font-size: 14px;
        }
      }

      .pBot {
        padding: 10px;
        .pbTop{
          div {
            margin-left: 15px;
          }
          .pbContent {
            padding-left: 20px;
            padding-right: 0;
            font-size: 30px;
            width: 140px;
          }
        }
        .submitBtn {
          width: 150px;
          height: 40px;
          line-height: 40px;
          margin-left: 15px;
          font-size: 16px;
          padding: 0;
        }

        /deep/ .el-radio {
          display: flex;
          align-items: center;

          .el-radio__inner {
            width: 14px;
            height: 14px;

            &::after {
              width: 4px;
              height: 4px;
            }
          }

          .el-radio__label {
            font-size: 18px !important;
          }
        }

        /deep/ .el-input {
          .el-input__inner {
            width: 140px;
            height: 40px;
            line-height: 44px;
            font-size: 16px !important;
          }
        }

        .pbLaster {
          color: #999;
          font-size: 18px;
          margin-left: 0;
        }
      }
    }
  }
}

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

.content-box {
  position: relative;
  @include px2rem(width, 600px);
  background-color: #fff;
  text-align: left;
}

@media screen and (min-width: $breakpoint-xl-min) {
  .content-box {
    width: 400px;
  }
}

@media screen and (max-width: 1200px) {
  .pbContent {
    font-size: 14px !important;
    width: 49px !important;
    line-height: 28px !important;
  }
  .el-radio__label {
    font-size: 14px !important;
  }
  .pBot {
    .pbLaster{
      margin-left: 0!important;
    }
    .el-input {
      .el-input__inner {
        width: 100px !important;
      }
    }
    .pbTop{
      padding-left: 0!important;
      label{
        width: 86px !important;
        margin-left: 0!important;
        /deep/span{
          font-size: 12px!important;
        }
      }
      div{
        margin-left: 9px;
      }
    }
    .submitBtn {
      @include px2rem(margin-left, 10px);
    }
  }

}
</style>

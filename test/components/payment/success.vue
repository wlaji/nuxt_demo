<template>
  <div class="bg-default h-100">
    <div class="container py-3">
      <div class="steps row align-items-center border-bottom no-gutters pb-3">
        <h3 class="col-12 col-xl-3 mb-0 text-secondary">
          <i class="el-icon-shopping-cart-1 h2 mb-0 align-middle"></i> Shopping
          Cart
        </h3>
        <div class="col-9 gt-md d-none d-xl-block">
          <el-steps :active="activeInd" simple class="bg-white">
            <el-step title="1.Shopping Cart"></el-step>
            <el-step title="2.Checkout"></el-step>
            <el-step title="3.Complete"></el-step>
          </el-steps>
        </div>
      </div>
      <div class="bg-white my-2 py-5 px-2">
        <div
          class="text-primary d-flex flex-column justify-content-center align-items-center"
        >
          <i class="el-icon-success custom-icon"></i>
          <h3 class="mt-2">Payment Successful</h3>
        </div>
        <ul class="list mt-3">
          <li>
            <label> Order Number : </label>
            <span>
              <nuxt-link to="/account/paidOrders">{{
                orderInfo.oid
              }}</nuxt-link>
            </span>
          </li>
          <li>
            <label> Total Amount : </label>
            <span>${{ orderInfo.order_price }}</span>
          </li>
          <li>
            <label> Order Status : </label>
            <span>{{ orderInfo.status | formatStatus }}</span>
          </li>
          <li>
            <label> Payment Method : </label>
            <span>{{ orderInfo.payment }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    orderInfo: Object,
  },
  data() {
    return {
      activeInd: 2,
    }
  },
}
</script>

<style scoped lang="scss">
.list {
  width: 50%;
  min-width: 350px;
  margin: 0 auto;
  @include px2rem(font-size, 16px);
  @media screen and (min-width: $breakpoint-xl-min) {
    font-size: 16px;
  }
  @media screen and (max-width: $breakpoint-sm-max) {
    width: 100%;
    min-width: 100%;
  }
  li {
    display: flex;
    margin: 10px 0;
    color: #666666;
  }
  label {
    display: inline-block;
    width: 140px;
    text-align: left;
    white-space: nowrap;
  }
  span {
    flex: 1;
    text-align: right;
  }
}
.custom-icon{
  font-size: 180px;
  @media screen and (max-width: $breakpoint-sm-max){
    font-size:5rem;
  }
}
</style>
<template>
  <li class="coupon-item">
    <div class="container-fluid">
      <div class="row no-gutters align-items-center">
        <div class="col-auto">
          <slot name="left">
            <!--        左侧图片-->
          </slot>
        </div>
        <div class="col">
          <slot name="right">
            <!--        右侧内容-->
          </slot>
        </div>
      </div>
    </div>
  </li>
</template>

<script>
export default {};
</script>

<style scoped lang="scss">
.coupon-item>div>div{
  background-color: #F9F9F9;
}
</style>

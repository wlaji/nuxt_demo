<template>
  <div v-if="acceptCookiesBanner">
    <div
      id="CookieReportsBanner"
      style="background: linear-gradient(to bottom,#fffee8,#fffcb7);"
    >
      <div class="container p-2">
        <div class="d-flex align-items-center">
          <div class="float-left">
            <i class="el-icon-warning text-warning h3"></i>
          </div>
          <div class="ml-2">
            <div class="h4 mb-2">Your cookies are disabled.</div>
            <div class="h5 font-weight-normal">
              We use cookies to login, save login status, shopping cart, and
              other related functions.<br />
              When you enable cookies in your browser settings, our site will
              run better and you’ll get more out of it.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "acceptCookies",
  computed: {
    acceptCookiesBanner() {
      return this.$store.state.acceptCookiesBanner;
    }
  },
  methods: {},
  mounted() {
    if (!navigator.cookieEnabled) {
      this.$store.commit("SET_AcceptCookiesBanner", true);
    } else {
      this.$store.commit("SET_AcceptCookiesBanner", false);
    }
  }
};
</script>

<style scoped lang="scss">
#CookieReportsBanner {
  display: flex;
  align-items: center;
  z-index: 32002;
  position: relative;
  border-bottom: 1px #c8cbcc solid;
  @include px2rem(height, 180px);
  line-height: 1.2;

  i {
    @include px2rem(font-size, 30px);
  }
}

@media screen and (min-width: $breakpoint-xl-min) {
  #CookieReportsBanner {
    height: 80px;

    i {
      font-size: 30px;
    }
  }
}
</style>
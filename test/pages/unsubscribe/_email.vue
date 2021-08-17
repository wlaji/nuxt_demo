<template>
  <div>
    <div class="container h-100 py-3 d-flex-center">
      <div class="content">
        <h3>Unsubscribe</h3>
        <p class="my-3">
          Confirm your decision to unsubscribe from receiving the email for
          Custom Sticker. Please click the Unsubscribe button to stop receiving
          emails.
        </p>
        <div class="w-100 d-flex justify-content-between">
          <el-button
            type="primary"
            style="width: 120px"
            @click="cancelUnsubscribe"
            >Cancel</el-button
          >
          <el-button
            type="default"
            plain
            style="width: 120px"
            @click="unsubscribe"
            >Unsubscribe
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { emailUnsubscribe } from '@/api/public'
import Cookies from 'js-cookie'

export default {
  name: 'unsubscribe',
  head() {
    return {
      meta: [
        {
          hid: 'robots',
          name: 'robots',
          content: 'noindex, nofollow' //禁止所有搜索引擎的收录和索引，也不追踪网页上的链接，
        }
      ]
    }
  },
  methods: {
    unsubscribe() {
      console.log(this.$route.params.email)
      // if (this.$store.state.authInfo) {
      //   emailUnsubscribe({
      //     token: this.$utils.getcookiesInClient('token')
      //   }).then(res => {
      //     this.$notify({
      //       title: 'Success',
      //       message: 'Email unsubscribed successfully',
      //       type: 'success'
      //     })
      //     setTimeout(() => {
      //       this.$router.push('/')
      //     }, 2000)
      //   })
      // } else {
      //   this.$store.commit('SET_LOGINDIALOG', true)
      // }
      emailUnsubscribe({
        email: this.$route.params.email
      }).then(res => {
        this.$notify({
          title: 'Success',
          message: 'Email unsubscribed successfully',
          type: 'success'
        })
      })
    },
    cancelUnsubscribe() {
      this.$router.push('/')
    }
  },
  mounted() {
    this.$Bus.$on('logined', e => {
      this.unsubscribe()
    })
  },
  beforeDestroy() {
    this.$Bus.$off("logined");
  }
}
</script>

<style scoped lang="scss">
.content {
  width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  @media screen and (max-width: $breakpoint-sm-max) {
    width: 100%;
  }
}
</style>

<template>
  <div>
    <v-data-iterator></v-data-iterator>
    <p v-for="item in 100">312321</p>
  </div>
</template>
<script>
import {getPageInfo} from '~/api/account'

export default {
  data() {
    return {
      banner:''
    }
  },
  methods:{

  },
  mounted() {
  }
}
</script>
<style lang="scss" scoped>

</style>

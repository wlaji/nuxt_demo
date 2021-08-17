<template>
<div class="userInfoList">
  <ul>
    <nuxt-link tag="li" class="py-2 px-1" :to="item.path" v-for="item in list" :key="item.path" :class="{active:item.path===$route.path}">
      <i class="el-icon-d-arrow-right"></i>
      {{item.text}}
    </nuxt-link>
  </ul>
</div>
</template>

<script>
export default {
  data() {
    return {
      list: [{
          path: '/account4',
          text: 'Account Dashboard'
        },
        {
          path: '/account4/orders',
          text: 'My Order'
        },
        {
          path: '/account4/setting',
          text: 'Account Settings'
        },
        {
          path: '/account4/address',
          text: 'Address Book'
        },
        // {
        //   path: '/account4/favorite',
        //   text: 'My Favorite'
        // }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.userInfoList {
  ul {
    li {
      color: #1296db;
      @include px2rem(font-size,24px);
      font-weight: 600;
      cursor: pointer;

      i {
        display: none;
      }

      &:hover {
        background-color: #f2f2f2;
      }
    }

    li.active {
      display: flex;
      align-items: center;

      &:hover {
        color: #777777;
        background-color: #fff;
      }

      i {
        display: block;
      }

      color: #777777;
    }
  }
}


@media screen and (min-width: $breakpoint-xl-min) {
  .userInfoList {
    ul {
      li {
        font-size:18px;
      }
    }
  }
}
</style>

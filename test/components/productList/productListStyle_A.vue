<template>
  <section class="product_list py-4 bg-default" id="product">
    <div class="container">
      <h2 class="text-center">
        Select {{ productCateName }} Types to See the Pricing
      </h2>
      <div class="row mt-4 pt-3 product_list_wrap">
        <template v-for="(item, index) in category">
          <div
            v-show="index < maxNumber || $store.state.device.type === 'pc'"
            :key="item.product_cate_name"
            class="col-6 col-xl-3 mb-2 pointer rounded text-center product-item"
            @click="jumpToThirdPage(item)"
            @mouseenter="divJump(index)"
            @mouseleave="divNoJump()"
            :class="hoverIndex === index ? '' : 'product-item-hover'"
          >
            <div>
              <div class="imgWrap">
                <div style="--aspect-ratio: 250/200" class="">
                  <img
                    v-lazy="item.pic_path"
                    :alt="item.product_cate_name"
                    :title="item.product_cate_name"
                  />
                </div>
              </div>
              <h3 class="p-2" :title="item.product_cate_name">
                {{ item.product_cate_name }}
              </h3>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div
      class="more-btn mt-3 d-xl-none"
      v-if="category.length > 4"
    >
      <el-button
        type="primary"
        class="w-100"
        title="View More Types"
        @click="showMoreCategory"
        ><i
          class="el-icon-d-arrow-left"
          :class="{
            showMore: maxNumber === 4,
            showSmall: maxNumber === 10000
          }"
        ></i>
        View More Types
      </el-button>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    category: Array,
    productName: String
  },
  data() {
    return {
      hoverIndex: null,
      maxNumber: 4
    }
  },
  computed: {
    productCateName() {
      if (this.productName === 'Uses Types') {
        return 'Uses'
      }
      return this.productName
    }
  },

  methods: {
    showMoreCategory() {
      if (this.maxNumber === 4) {
        this.maxNumber = 10000
      } else {
        this.maxNumber = 4
      }
    },
    divNoJump() {
      this.hoverIndex = ''
    },
    divJump(index) {
      this.hoverIndex = index
    },
    jumpToThirdPage(val) {
      this.$router.push({
        name: 'productName',
        params: {
          productName: this.$utils.formatFirstCategoryName(
            val.product_cate_name
          )
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.product_list {
  h2 {
    @include px2rem(font-size, 52px);
  }

  h3 {
    @include px2rem(font-size, 32px);
  }

  .imgWrap {
    @include px2rem(width, 250px);
    @include px2rem(height, 200px);
    margin: 0 auto;
  }

  .more-btn {
    @include px2rem(height, 100px);
  }

  /deep/ .el-button {
    height: 100%;
    @include px2rem(font-size, 36px);
    @media screen and (min-width: $breakpoint-xl-min) {
      font-size: 18px;
    }
  }
}

.showMore {
  transform: rotate(-90deg);
}

.showSmall {
  transform: rotate(90deg);
}

@media screen and (min-width: $breakpoint-xl-min) {
  .product-item {
    transition: all 0.2s ease;

    &:hover {
      color: $primary;
    }
  }
  .product-item-hover {
    transform: translateY(10px);
    transition: all 0.2s ease;
  }
  h2 {
    font-size: 36px !important;
  }

  h3 {
    font-size: 24px !important;
  }
  .imgWrap {
    width: 250px !important;
    height: 200px !important;
  }
  .product_list_wrap{
    background: #FFFFFF;
    border: 1px solid #E8E8E8;
    box-shadow: 1px 1px 2px 0px rgba(0, 0, 0, 0.27);
    border-radius: 10px;
  }
}
</style>

<template>
  <div>
    <template v-for="item in list">
      <div
        class="row no-gutters align-items-center border-bottom"
        :class="{ error: !item.isChecked && !item.selectId }"
        style="padding: 10px 0"
        :key="item.id"
        v-if="
          item.data &&
            item.data.length &&
            (selectId === item.parent_id || selectId === -1)
        "
      >
        <div class="col-4 text-left">
          <label class="m-0">
            <b
              ><span class="status-point align-middle mr-2"></span
              >{{ item.param_name }}</b
            >
          </label>
        </div>
        <div class="col-8 position-relative text-right">
          <el-select
            :class="[
              'mySelect',
              'w-100',
              `${item.id}`,
              item.selectId ? 'selected' : ''
            ]"
            :popper-append-to-body="false"
            v-model="item.selectId"
            :placeholder="'Please Select ' + item.param_name"
            @change="changeSelect(item)"
          >
            <el-option
              v-for="(childItem, childIndex) in item.data"
              :key="childIndex"
              :label="childItem.param_name"
              :value="childItem.id"
            >
              <div class="text-break text-left">{{ childItem.param_name }}</div>
            </el-option>
          </el-select>
        </div>
      </div>
      <div v-for="(childItem, childIndex) in item.data" :key="childItem.id">
        <designTree
          :list="childItem.data"
          :selectId="item.selectId"
          v-if="childItem.data && childItem.data.length && item.selectId"
          @changeSelect="$emit(`changeSelect`)"
        ></designTree>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    list: Array,
    selectId: {
      type: Number,
      default: -1
    }
  },
  name: 'designTree',
  data() {
    return {}
  },
  methods: {
    resetSelect(folder) {
      folder.forEach(item => {
        item.selectId = ''
        item.isChecked = true
        if (item.data) {
          this.resetSelect(item.data)
        }
      })
    },
    changeSelect(folder) {
      this.resetSelect(folder.data)
      this.$emit('changeSelect')
      setTimeout(() => {
        let elSelectArr = Array.from(
          document.getElementsByClassName('mySelect')
        )
        elSelectArr.forEach((item, index) => {
          if (item === document.getElementsByClassName(folder.id)[0]) {
            if (elSelectArr[index + 1]) {
              elSelectArr[index + 1].click()
            }
          }
        })
      }, 100)
    },

    getChildName(selectData) {
      let findItem = selectData.data.find(item => {
        return selectData.selectId === item.id
      })
      return findItem
    },

    getSelectId(tree) {
      const obj = {
        optionIdList: [],
        select_params: {}
      }
      let getFn = tree => {
        tree.forEach(item => {
          if (item.selectId) {
            obj.optionIdList.push(item.selectId)
            obj.select_params[item.param_name] = this.getChildName(
              item
            ).param_name
          }
          if (item.data && item.data.length) {
            getFn(item.data)
          }
        })
      }
      getFn(tree)
      return obj
    }
  }
}
</script>

<style lang="scss" scoped>
.errorMsg {
  line-height: 1;
  padding-top: 4px;
  position: absolute;
  top: 100%;
  left: 15px;
}
.row /deep/ .el-select-dropdown {
  border-color: $primary;
}
.row /deep/ .popper__arrow {
  border-bottom-color: $primary;
}
.error {
  color: $danger;
}
</style>
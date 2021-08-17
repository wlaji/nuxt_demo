<template>
  <div class="tree">
    <template v-for="item in list">
      <div
        class="row align-items-center"
        style="margin-bottom: 22px"
        :key="item.id"
        v-if="
          item.data &&
          item.data.length &&
          (selectId === item.parent_id || selectId === -1)
        "
      >
        <div class="col-5 text-right">
          <label class="d-flex align-items-center justify-content-end">
            <i class="text-danger">*</i>
            <b>{{ item.param_name }}</b>
            <div
              class="treeTool d-flex justify-content-center align-items-center"
            >
              <el-tooltip
                popper-class="treeTool"
                v-if="item.description"
                class="item pl-1"
                effect="light"
                :content="item.description"
                placement="bottom-end"
                :visible-arrow="false"
              >
                <Al-icon icon="wen-hao" class="share-btn-icon h3"></Al-icon>
              </el-tooltip>
            </div>
          </label>
        </div>
        <div class="col-7 position-relative">
          <el-select
            :class="['mySelect', `${item.id}`, item.selectId ? 'selected' : '']"
            :popper-append-to-body="false"
            v-model="item.selectId"
            :placeholder="'Please Select ' + item.param_name"
            @change="changeSelect(item)"
            @visible-change="visibleChange"
            :disabled="item.isSelect == 1"
          >
            <el-option
              v-for="(childItem, childIndex) in item.data"
              :key="childIndex"
              :label="childItem.param_name"
              :value="childItem.id"
            >
              <div class="text-break">{{ childItem.param_name }}</div>
            </el-option>
          </el-select>
          <span class="errorMsg" v-if="!item.isChecked && !item.selectId"
            >{{ item.param_name }} is required</span
          >
        </div>
      </div>
      <div v-for="childItem in item.data" :key="childItem.id">
        <tree
          :list="childItem.data"
          :selectId="item.selectId"
          v-if="childItem.data && childItem.data.length && item.selectId"
          @changeSelect="$emit(`changeSelect`)"
          @visibleChange="visibleChange"
        ></tree>
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
      default: -1,
    },
  },
  name: "tree",
  data() {
    return {};
  },
  methods: {
    visibleChange(bool) {
      this.$emit("visibleChange", bool);
    },

    resetSelect(folder) {
      folder.forEach((item) => {
        item.selectId = "";
        item.isChecked = true;
        if (item.data) {
          this.resetSelect(item.data);
        }
      });
    },

    changeSelect(folder) {
      this.resetSelect(folder.data);
      let temp = folder.data.find((item) => {
        return folder.selectId === item.id;
      });
      if (temp.description) {
        folder.description = temp.description;
      }

      this.$emit("changeSelect");
    },

    getChildName(selectData) {
      let findItem = selectData.data.find((item) => {
        return selectData.selectId === item.id;
      });
      return findItem;
    },

    getSelectId(tree) {
      const obj = {
        optionIdList: [],
        select_params: {},
      };
      let getFn = (tree) => {
        tree.forEach((item) => {
          if (item.selectId) {
            obj.optionIdList.push(item.selectId);
            obj.select_params[item.param_name] =
              this.getChildName(item).param_name;
          }
          if (item.data && item.data.length) {
            getFn(item.data);
          }
        });
      };
      getFn(tree);
      return obj;
    },
  },
};
</script>

<style lang="scss" scoped></style>

<template>
  <div class="colorcodeWrap d-flex-center">
    <div class="myColorPicker" id="colorPicker">
      <div class="myColorPicker_trigger" @click.stop="showPanel">
        <span class="myColorPicker_color">
          <span
            class="myColorPicker_colorInner"
            :style="{ backgroundColor: drawColor }"
          ></span>
        </span>
        <span class="myColorPicker_icon">
          <i class="el-icon-arrow-down"></i>
        </span>
      </div>
    </div>
    <div
      class="myColorPicker_panel"
      :style="panelStyles"
      v-if="showMyColorPickerPanel"
      @click.stop
    >
      <div class="myColorPicker_predefine">
        <div style="width:100%;max-height: 250px;overflow:auto;">
          <div class="myColorPicker_predefine_colors">
            <div
              class="myColorPicker_predefine_colors_selector"
              :class="{
                selected: item.code === drawColor,
                bor: item.code == '#ffffff' || item.code == 'rgb(255,255,255)'
              }"
              v-for="(item, index) in colorCodeList"
              :key="index"
            >
              <div
                :style="{ background: item.code }"
                :title="item.pantone"
                @click="selectColor(item)"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div class="myColorPicker_panel_btns">
<!--        <span class="myColorPicker_panel_value">-->
<!--          <el-input :value="drawColor" size="mini"></el-input>-->
<!--        </span>-->

        <el-button type="primary" size="mini" @click="hideColorPanel"
          >Confirm</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    colorCodeList: Array,
    drawColor: String
  },
  data() {
    return {
      showMyColorPickerPanel: false,
      panelStyles: ''
    }
  },
  methods: {
    hideColorPanel() {
      this.showMyColorPickerPanel = false
    },
    showPanel() {
      if (this.showMyColorPickerPanel) {
        this.showMyColorPickerPanel = false
        window.removeEventListener('click', this.hideColorPanel, false)
      } else {
        this.showMyColorPickerPanel = true
        window.addEventListener('click', this.hideColorPanel, false)
      }

      this.$nextTick(() => {
        if (!document.getElementsByClassName('myColorPicker_panel')[0]) {
          return
        }
        let sW = document.body.clientWidth,
          sH = document.body.clientHeight,
          oW = document.getElementsByClassName('myColorPicker_panel')[0]
            .offsetWidth,
          oH = document.getElementsByClassName('myColorPicker_panel')[0]
            .offsetHeight
        let position = this.$utils.getDivPosition(event.currentTarget)
        let leftOff = oW + position.x > sW ? sW - oW : position.x
        this.panelStyles = {
          position: 'fixed',
          top:
            position.y + oH + 50 > sH
              ? position.y - oH - 10 + 'px'
              : position.y + 50 + 'px',
          left: leftOff + 'px'
        }
      })
    },
    selectColor(item) {
      this.$emit('selectColor', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.myColorPicker {
  display: inline-block;
  position: relative;
  line-height: normal;
  height: 30px;

  .myColorPicker_trigger {
    display: inline-block;
    box-sizing: border-box;
    height: 30px;
    width: 30px;
    padding: 2px;
    border: 1px solid #e6e6e6;
    border-radius: 4px;
    font-size: 0;
    position: relative;
    cursor: pointer;

    .myColorPicker_color {
      position: relative;
      display: block;
      box-sizing: border-box;
      border: 1px solid #999;
      border-radius: 2px;
      width: 100%;
      height: 100%;
      text-align: center;

      .myColorPicker_colorInner {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
      }
    }

    .myColorPicker_icon {
      position: absolute;
      left: 50%;
      top: 50%;
      color: #fff;
      font-size: 14px;
      transform: translate(-50%, -50%);
    }
  }
}

.myColorPicker_panel {
  position: absolute;
  width: 300px;
  padding: 6px;
  box-sizing: content-box;
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 10000000000;

  .myColorPicker_predefine {
    font-size: 12px;
    margin-top: 8px;
    width: 100%;

    .myColorPicker_predefine_colors,
    .myColorPicker_predefine__history_colors {
      display: flex;
      flex: 1;
      flex-wrap: wrap;
      padding: 4px;

      .myColorPicker_predefine_colors_selector {
        margin: 0 0 8px 8px;
        width: 20px;
        height: 20px;
        border-radius: 4px;
        cursor: pointer;

        & > div {
          display: flex;
          height: 100%;
          border-radius: 3px;
        }
      }

      .myColorPicker_predefine_colors_selector.selected {
        box-shadow: 0 0 3px 2px #409eff;
      }

      .myColorPicker_predefine_colors_selector:nth-child(10n + 1) {
        margin-left: 0;
      }
    }

    .myColorPicker_predefine__history_colors {
      width: 280px;
    }

    .myColorPicker_predefine_colors {
      width: 280px;
    }
  }

  .myColorPicker_panel_btns {
    margin-top: 6px;
    text-align: right;

    .myColorPicker_panel_value {
      float: left;
      line-height: 26px;
      font-size: 12px;
      color: #000;
      width: 160px;

      .inputWrap {
        position: relative;
        font-size: 12px;
        display: inline-block;
        width: 100%;

        input {
          height: 28px;
          line-height: 28px;
        }
      }
    }
  }
}

.el-row {
  width: 100%;
  overflow: auto;

  .el-col {
    margin-bottom: 5px;

    & > div {
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: #ffffff;
      font-size: 12px;
      cursor: pointer;
    }
  }
}

.bor {
  border: 1px solid #000;
}
</style>
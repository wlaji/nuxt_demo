<template>
  <div class="crop-area-wrap">
    <div class="crop-area">
      <div class="title">
        <h3 class="mb-0">Crop Area</h3>
        <i class="el-icon-close" @click="closeCropArea"></i>
      </div>
      <div class="content">
        <no-ssr>
          <vueCropper
            ref="cropper"
            :img="cropUrl"
            :outputSize="options.outputSize"
            :outputType="options.outputType"
            :info="options.info"
            :canScale="options.canScale"
            :autoCrop="options.autoCrop"
            :centerBox="options.centerBox"
            :infoTrue="options.infoTrue"
            :original="options.original"
            :maxImgSize="options.maxImgSize"
            :enlarge="options.enlarge"
            :mode="options.mode"
          ></vueCropper>
        </no-ssr>
        <div class="zoom-tools">
          <el-button
            type="info"
            @click="changeCropScale(2)"
            icon="el-icon-zoom-in"
            circle
          ></el-button>
          <el-button
            type="info"
            @click="changeCropScale(-2)"
            icon="el-icon-zoom-out"
            circle
          ></el-button>
        </div>
      </div>
      <div class="foot-button">
        <el-button type="info" @click="closeCropArea">Cancel</el-button>
        <el-button type="primary" @click="finishedCrop">Continue</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { ossUpload } from '@/api/public'
if (process.client) {
  let vueCropper = require('vue-cropper')
  Vue.use(vueCropper.default)
}
export default {
  props: {
    cropUrl: String
  },
  data() {
    return {
      options: {
        outputSize: 1, //输出的图片质量
        outputType: 'png', //输出图片格式
        info: true, //裁剪框的大小信息
        canScale: true, //图片是否允许滚轮缩放
        autoCrop: true, //是否默认生成截图框
        autoCropWidth: '100%', //默认生成截图框宽度
        autoCropHeight: '100%', //默认生成截图框高度
        centerBox: true, //	截图框是否被限制在图片里面
        infoTrue: false, //true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        original: true, //上传图片按照原始比例渲染
        maxImgSize: 800, //限制图片最大宽度和高度
        enlarge: '3', //	图片根据截图框输出比例倍数
        mode: '100% auto' //图片默认渲染方式
      }
    }
  },
  methods: {
    closeCropArea() {
      this.$emit('closeCropArea')
    },
    //结束裁剪
    finishedCrop() {
      this.$refs.cropper.getCropData(b64 => {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
          customClass: 'cus-loading'
        })

        this.$refs.cropper.stopCrop()
        this.closeCropArea()
        const file = this.$utils.dataURLtoFile(b64, new Date().getTime())
        let formData = new FormData()
        formData.append('photo[]', file)
        formData.append('isRandom', 1)
        formData.append('isTemp', 0)
        ossUpload(formData)
          .then(res => {
            let picArr = Object.values(res.data)
            this.$emit('addCropImg', picArr[0])
          })
          .finally(() => {
            loading.close()
          })
      })
    },

    //开始裁剪
    startCrop() {
      this.crap = true
      this.$refs.cropper.startCrop()
    },

    //结束裁剪
    stopCrop() {
      this.crap = false
      this.$refs.cropper.stopCrop()
    },

    //清除裁剪框
    clearCrop() {
      this.$refs.cropper.clearCrop()
    },

    //图片缩放
    changeCropScale(num) {
      num = num || 1
      console.log(num)
      this.$refs.cropper.changeScale(num)
    }
  }
}
</script>

<style lang="scss" scoped>
.crop-area-wrap {
  overflow: auto;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: 0;
  z-index: 2050;
  background: rgba(0, 0, 0, 0.5);

  .crop-area {
    display: flex;
    flex-direction: column;
    margin: 0 auto 50px;
    background: #fff;

    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      padding: 0 20px;

      i {
        font-size: 30px;
        font-weight: 500;
        cursor: pointer;
      }
    }

    .content {
      position: relative;
      flex: 1;
      padding: 20px;
      border-top: 1px solid #ccc;
      border-bottom: 1px solid #ccc;

      .button-tools {
        position: absolute;
        top: 25px;
        left: 25px;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .el-button {
          margin: 10px;
          text-align: center;
        }
      }

      .zoom-tools {
        position: absolute;
        top: 25px;
        right: 25px;
        display: flex;
      }
    }

    .foot-button {
      width: 100%;
      height: 60px;
      line-height: 60px;
      padding: 0 20px;
      text-align: right;
    }
  }

  @media screen {
    @media (min-width: 1199px) {
      .crop-area {
        margin-top: 10vh;
        width: 1000px;
        height: 750px;
        border-radius: 2px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      }
    }

    @media (max-width: 768px) {
      .crop-area {
        margin: 0;
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
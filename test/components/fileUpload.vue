<template>
  <div class="fileUpload">
    <el-upload
      class="upload-demo"
      ref="uploadFile"
      action="#"
      :http-request="httpRequest"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-progress="onProgress"
      :on-success="onSuccess"
      :on-exceed="onExceed"
      :before-upload="beforeUpload"
      :accept="accept"
      :file-list="fileList"
      :limit="limit"
      :multiple="multiple"
    >
      <slot name="btn" slot="trigger">
        <el-button size="small" type="primary"
        >Upload Tax Exemption Certificate
        </el-button>
      </slot>
      <slot name="tip" slot="tip" >
        <div class="el-upload__tip">Accept  JPG, PNG and PDF files only</div>
      </slot>
    </el-upload>
  </div>
</template>

<script>
import { ossUploadFile } from '@/api/public'

export default {
  props: {
    limit: {
      type: Number,
      default: 1
    },
    multiple: {
      type: Boolean,
      default: false
    },
    accept:{
      type:String,
      default:'.jpg,.jpeg,.png,.gif'
    },
    originFileList:{
      type:Array,
      default:[]
    }
  },
  data() {
    return {
      fileList: this.originFileList,
      fileData: {}
    }
  },
  methods: {
    validateImageAttribute(file) {
      let validityType = this.accept.split(',');
      let fileExtension = file.name.substring(file.name.lastIndexOf('.'));
      console.log(fileExtension,validityType)
      if (validityType.indexOf(fileExtension) === -1) {
        return {
          isValid: false,
          message: 'Upload type error!'
        }
      }
      const maxSizeInMb = 100
      if (file.size > maxSizeInMb * 1024 * 1024) {
        return {
          isValid: false,
          message: "Upload file size must not exceed '+ maxSizeInMb + 'MB!"
        }
      }
      return {
        isValid: true,
        message: 'File check qualified'
      }
    },
    handlePreview(file) {
      if (file.url) {
        window.open(file.url, '_blank')
      }
    },
    //文件超出个数限制时的钩子
    onExceed(files, fileList) {
      this.$message.error("Exceed the limit, the maximum value is " + " " + this.limit);
    },
    handleRemove(file, fileList) {
      this.$refs.uploadFile.abort(file) //取消上传
      this.fileList = fileList
      this.$emit('getFileList',fileList)
    },
    beforeUpload(file) {
      console.log(file)
      let validateResult = this.validateImageAttribute(file)
      if (!validateResult.isValid) {
        this.$message.error(validateResult.message)
        return false
      }
    },
    onSuccess(response, file, fileList) {
      file.url = response.url
      this.fileList = fileList
      this.$emit('getFileList',fileList)
    },
    onProgress(event, file) {},
    httpRequest(file) {
      let formData = new FormData()
      formData.append(file.file.name, file.file)
      ossUploadFile(formData, progressEvent => {
        let num = ((progressEvent.loaded / progressEvent.total) * 100) | 0 //百分比
        file.onProgress({ percent: num },file) //进度条
      })
        .then(res => {
          let { data } = res
          file.onSuccess(data[0], file)
        })
        .catch(err => {
          file.onError()
        })
    },
    /**
     * 向父级开放方法获取上传成功的文件信息
     */
    getFileList() {
      let returnList = []
      this.fileList.forEach(file => {
        const returnFile = {
          name: file.name,
          url: file.url
        }
        returnList.push(returnFile)
      })
      return returnList
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ {
  .el-icon-close-tip {
    display: none !important;
  }
}
</style>
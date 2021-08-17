<template>
  <div class="categoryBlockWrap">
    <div class="categoryBlock">
      <div class="header p-2">
        <strong>My Desgin</strong>
        <div>
          <i class="el-icon-close" @click="closeTemplateDialog"></i>
        </div>
      </div>
      <div class="title p-2 d-flex">
        <div class="search-area">
          <el-input
            type="text"
            v-model="userTemplateForm.keyword"
            clearable
            class="border-20"
            @input="debounceGetUserSampleList"
            placeholder="Keyword search"
            suffix-icon="el-icon-search"
          ></el-input>
          <small class="p-1 text-nowrap"
            >Total {{ userTemplateForm.total }}</small
          >
        </div>
      </div>
      <div class="categoryBlock-list">
        <div class="row no-gutters h-100">
          <div class="col-12 h-100 p-2">
            <div
              class="content h-100 p-2 bg-white"
              ref="userTemplateWrap"
              style="overflow-y: scroll"
            >
              <ul
                class="row no-gutters userTemplateList"
                v-infinite-scroll="loadUserTemplateList"
                infinite-scroll-disabled="disabledLoadUserTemplate"
              >
                <li class="col-2 p-1 pointer">
                  <el-upload
                    class="uploader"
                    ref="uploadBox"
                    :limit="1"
                    action="#"
                    :show-file-list="false"
                    :before-upload="beforeUpload"
                    :on-change="uploadOnChange"
                    :http-request="file => file"
                  >
                    <div
                      class="border rounded bg-white position-relative h-100 squareDiv"
                    >
                      <div class="text-center d-flex flex-column">
                        <i
                          class="el-icon-plus font-weight-bold"
                          style="font-size:30px"
                        ></i>
                        <span class="font-weight-bold">Upload</span>
                      </div>
                    </div>
                  </el-upload>
                </li>
                <li
                  class="col-2 p-1 pointer userItem"
                  v-for="(item, index) in userTemplateList"
                  :key="index"
                >
                  <div class="border rounded bg-white h-100 squareDiv">
                    <img
                      v-lazy="item.pic_path"
                      :alt="item.sample_name"
                      :title="item.sample_name"
                    />
                    <div class="options-wrap">
                      <div class="options-btn">
                        <el-button
                          type="primary"
                          icon="el-icon-edit"
                          circle
                          @click.stop="selectTemplate(item.id, 'private')"
                        ></el-button>
                        <el-button
                          type="danger"
                          icon="el-icon-delete"
                          circle
                          @click.stop="deleteUserTemplate(item.id)"
                        ></el-button>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
              <p v-if="loadingUserTemplate" class="text-center p-2 m-0">
                loading...
              </p>
              <!--                  <p v-if="noMoreUserTemplate" class="text-center p-2 m-0">-->
              <!--                    No more(Total:{{ userTemplateForm.total }})-->
              <!--                  </p>-->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { deleteUserSample, getUserSample } from '@/api/account'

export default {
  name: 'templateDialog_user',
  data() {
    return {
      debounceGetUserSampleList: null,
      loadingUserTemplate: false,
      userTemplateList: [],
      userTemplateForm: {
        product_category_name: '',
        userSampleCategoryId: '',
        keyword: '',
        page: 1,
        pageCount: 48,
        total: 0,
        totalPages: 1
      }
    }
  },
  computed: {
    cateName() {
      return this.$utils.decodeName(this.$route.params.categoryName)
    },
    noMoreUserTemplate() {
      //当起始页数大于总页数时停止加载
      return this.userTemplateForm.page >= this.userTemplateForm.totalPages
    },
    disabledLoadUserTemplate() {
      return this.loadingUserTemplate || this.noMoreUserTemplate
    }
  },
  methods: {
    closeTemplateDialog() {
      this.$emit('closeTemplateDialog')
    },

    //加载模板
    selectTemplate(id, type) {
      if(this.$parent.fabricStage.getObjects().filter(o => !o.isShade).length){
        this.$confirm(
          'Are you sure you want to replace your design with our template?',
          'Hint',
          {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        )
          .then(() => {
            this.$emit('selectTemplate',{
              id,
              type
            })
          })
          .catch(() => {})
      }else{
        this.$emit('selectTemplate',{
          id,
          type
        })
      }
    },

    deleteUserTemplate(id) {
      this.$confirm('Are you sure you want to delete it?', 'Hint', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(() => {
          deleteUserSample({
            sampleIdList: id
          }).then(res => {
            this.$message.success(res.msg)
            this.debounceGetUserSampleList()
          })
        })
        .catch(() => {})
    },

    getUserSampleList({ type } = { type: 'search' }) {
      if (type === 'search') {
        this.userTemplateForm.page = 1
        this.$refs.userTemplateWrap.scrollTop = 0
      }
      this.userTemplateForm.product_category_name = this.cateName
      let postData = this.userTemplateForm
      getUserSample(postData).then(res => {
        this.userTemplateForm.total = res.data.total_number
        this.userTemplateForm.totalPages = res.data.total_pages
        if (type === 'scroll') {
          this.userTemplateList = this.userTemplateList.concat(res.data.data)
          this.loadingUserTemplate = false
        } else {
          this.userTemplateList = res.data.data
        }
      })
    },

    loadUserTemplateList() {
      this.loadingUserTemplate = true
      this.userTemplateForm.page++
      this.debounceGetUserSampleList({
        type: 'scroll'
      })
    },

    beforeUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10
      const isUploadType = /\.(gif|jpg|jpeg|png|svg|psd|pdf|bmp|ai|)$/.test(
        file.name.toLowerCase()
      )
      if (!isLt10M) {
        this.$message.error(
          'The size of the uploaded profile picture should not exceed 10MB!'
        )
        return isLt10M
      }
      if (!isUploadType) {
        this.$message.error('Error uploading file type')
        return isUploadType
      }
    },

    uploadOnChange(file, fileList) {
      this.$nextTick(() => {
        if (fileList.length) {
          let reader = new FileReader()
          reader.readAsDataURL(fileList[0].raw)
          reader.onload = async e => {
            let src
            if (/\.(gif|jpg|jpeg|png|svg|bmp)$/.test(file.name.toLowerCase())) {
              src = e.target.result
            } else if (/\.(pdf|ai)$/.test(file.name.toLowerCase())) {
              src = await this.$utils.pdfToImg(e.target.result)
            } else if (/\.(psd)/.test(file.name.toLowerCase())) {
              let PSD = require('psd.js')
              let psd = await PSD.fromURL(e.target.result)
              src = psd.image.toBase64()
            }
            this.$refs.uploadBox.clearFiles()
            this.$emit('uploadImg', src)
          }
        }
      })
    }
  },
  created() {},
  mounted() {
    this.debounceGetUserSampleList = this.$utils.debounce(
      this.getUserSampleList,
      300
    )
    if (this.$store.state.authInfo) {
      this.debounceGetUserSampleList()
    }
  }
}
</script>

<style scoped lang="scss">
.categoryBlockWrap {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 100px;
  right: 0;
  min-height: 700px;
  background: #d8d8d8;
  box-shadow: 5px 5px 8px 0 rgba(0, 0, 0, 0.35);
  z-index: 1000;

  .categoryBlock {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #fff;
      text-transform: capitalize;
      strong{
        font-size:18px;
      }
      i {
        font-size: 30px;
        cursor: pointer;
      }
    }

    .title {
      .search-area {
        display: flex;
        align-items: center;
      }
    }

    .categoryBlock-list {
      overflow: hidden;
      flex: 1;
      width: 100%;
      font-size: 14px;

      .selected a {
        color: #fff !important;
      }

      .tagList.isfixed {
        .selected {
          position: absolute;
          top: 0;
          left: 0;
          right: 17px;
          padding: 10px;
          border: 1px solid #ccc;
          background-color: #eee;
          z-index: 10;
        }

        .category {
          margin-top: 75.5px;
        }
      }

      .tagList li {
        cursor: pointer;

        a.active {
          background: #333;
          color: #fff !important;
        }
      }

      .tag:last-child {
        border-bottom: none !important;
      }
    }
  }
}

.userItem > div {
  position: relative;

  .options-wrap {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    transition: all 0.2s ease-in-out;

    .options-btn {
      display: flex;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 1;
    }
  }

  .sizeInfo {
    position: absolute;
    top: 5px;
    left: 5px;

    .el-tag {
      background: rgba(255, 255, 255, 0.8);
    }
  }

  &:hover {
    .options-wrap {
      display: block;
      opacity: 1;
    }
  }
}

.uploader /deep/ .el-upload {
  display: block;
  width: 100%;
  height: 100%;
}
</style>

<template>
  <div class="categoryBlockWrap">
    <div class="categoryBlock">
      <div class="header p-2">
        <strong>My Symbol</strong>
        <div>
          <i class="el-icon-close" @click="closeSymbolDialog"></i>
        </div>
      </div>
      <div class="title p-2 d-flex">
        <div class="search-area">
          <el-input
            type="text"
            v-model="userSymbolForm.keyword"
            clearable
            class="border-20"
            @input="debounceGetUserSymbolList"
            placeholder="Keyword search"
            suffix-icon="el-icon-search"
          ></el-input>
          <small class="p-1 text-nowrap"
            >Total {{ userSymbolForm.total }}</small
          >
        </div>
      </div>
      <div class="categoryBlock-list">
        <div class="row no-gutters h-100">
          <div class="col-12 h-100 p-2">
            <div
              class="content h-100 p-2 bg-white"
              ref="userSymbolWrap"
              style="overflow-y: scroll"
            >
              <ul
                class="row no-gutters"
                v-infinite-scroll="loadUserSymbolList"
                infinite-scroll-disabled="disabledLoadUserSymbol"
              >
                <li class="col-2 p-1 pointer">
                  <el-upload
                    class="uploader"
                    ref="uploadUserSymbolBox"
                    :limit="1"
                    action="#"
                    :show-file-list="false"
                    :before-upload="beforeUpload"
                    :on-change="uploadUserSymbolOnChange"
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
                  v-for="(item, index) in userSymbolList"
                  :key="index"
                  @click="addEleImg(item, 'private')"
                >
                  <div class="border rounded bg-transparent h-100 squareDiv">
                    <img
                      v-lazy="item.url"
                      :alt="item.element_name"
                      :title="item.element_name"
                    />
                    <div class="options-wrap">
                      <div class="options-btn">
                        <el-button
                          type="primary"
                          icon="el-icon-plus"
                          circle
                          @click.stop="addEleImg(item, 'private')"
                        ></el-button>
                        <el-button
                          type="danger"
                          icon="el-icon-delete"
                          circle
                          @click.stop="deleteUserSymbol(item.id)"
                        ></el-button>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
              <p v-if="loadingUserSymbol" class="text-center p-2 m-0">
                loading...
              </p>
              <!--                  <p v-if="noMoreUserSymbol" class="text-center p-2 m-0">-->
              <!--                    No more(Total:{{ userSymbolForm.total }})-->
              <!--                  </p>-->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  deleteUserElement,
  editUserElement,
  getUserElement
} from '@/api/account'
import { ossUpload } from '@/api/public'

export default {
  name: 'symbolDialog_user',
  data() {
    return {
      debounceGetUserSymbolList: null,
      loadingUserSymbol: false,
      userSymbolList: [],
      userSymbolForm: {
        elementCategoryId: '',
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
    noMoreUserSymbol() {
      //当起始页数大于总页数时停止加载
      return this.userSymbolForm.page >= this.userSymbolForm.totalPages
    },
    disabledLoadUserSymbol() {
      return this.loadingUserSymbol || this.noMoreUserSymbol
    }
  },
  methods: {
    addEleImg(item, type) {
      this.$emit('addEleImg', {
        item,
        type
      })
    },

    closeSymbolDialog() {
      this.$emit('closeSymbolDialog')
    },

    getUserSymbolList({ type } = { type: 'search' }) {
      if (type === 'search') {
        this.userSymbolForm.page = 1
        this.$refs.userSymbolWrap.scrollTop = 0
      }
      let postData = this.userSymbolForm
      getUserElement(postData).then(res => {
        this.userSymbolForm.total = res.data.total_number
        this.userSymbolForm.totalPages = res.data.total_pages
        if (type === 'scroll') {
          this.userSymbolList = this.userSymbolList.concat(res.data.data)
          this.loadingUserSymbol = false
        } else {
          this.userSymbolList = res.data.data
        }
      })
    },

    loadUserSymbolList() {
      this.loadingUserSymbol = true
      this.userSymbolForm.page++
      this.debounceGetUserSymbolList({
        type: 'scroll'
      })
    },

    deleteUserSymbol(id) {
      this.$confirm('Are you sure you want to delete it?', 'Hint', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(() => {
          deleteUserElement({
            elementIdList: id
          }).then(res => {
            this.$message.success(res.msg)
            this.debounceGetUserSymbolList()
          })
        })
        .catch(() => {})
    },

    upOssImg(file) {
      return new Promise(resolve => {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
          customClass: 'cus-loading'
        })
        let formData = new FormData()
        if (typeof file === 'string') {
          file = this.$utils.dataURLtoFile(file, new Date().getTime())
        }
        formData.append('photo[]', file)
        formData.append('isRandom', 1)
        formData.append('isTemp', 0)
        ossUpload(formData)
          .then(res => {
            let picArr = Object.values(res.data)
            resolve(picArr[0])
          })
          .finally(() => {
            loading.close()
          })
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

    uploadUserSymbolOnChange(file, fileList) {
      this.$nextTick(async () => {
        if (fileList.length) {
          let url = await this.upOssImg(fileList[0].raw)
          editUserElement({
            element_name: fileList[0].raw.name,
            url
          }).then(res => {
            this.$message.success(res.msg)
            this.debounceGetUserSymbolList()
          })
          //清空上传input
          this.$refs.uploadUserSymbolBox.clearFiles()
        }
      })
    }
  },
  mounted() {
    this.debounceGetUserSymbolList = this.$utils.debounce(
      this.getUserSymbolList,
      300
    )
    if (this.$store.state.authInfo) {
      this.debounceGetUserSymbolList()
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

.bg-transparent {
  background: url('../../static/images/transparentBg.png');
}
</style>

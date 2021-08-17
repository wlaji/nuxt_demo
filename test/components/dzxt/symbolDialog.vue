<template>
  <div class="categoryBlockWrap">
    <div class="categoryBlock">
      <div class="header p-2">
        <strong>Choose Symbol</strong>
        <div>
          <i class="el-icon-close" @click="closeSymbolDialog"></i>
        </div>
      </div>
      <div class="title p-2 d-flex">
        <div class="search-area">
          <el-input
            type="text"
            clearable
            v-model="symbolForm.keyword"
            @input="debounceGetSymbolList"
            placeholder="Keyword search"
            suffix-icon="el-icon-search"
          ></el-input>
          <small class="p-1 text-nowrap">Total {{ symbolForm.total }}</small>
        </div>
      </div>
      <div class="categoryBlock-list">
        <div class="row no-gutters h-100">
          <div class="col-3 h-100 p-2">
            <div class="h-100 position-relative">
              <div
                class="tagList overflow-auto p-2 bg-white h-100"
                :class="{ isfixed: tagBar }"
                ref="symbolTagListWrap"
              >
                <div
                  class="selected py-2 border-bottom"
                  ref="symbolSelectedTag"
                >
                  <p><b>Selected</b></p>
                  <ul class="d-flex flex-wrap no-gutters text-center">
                    <li
                      class="px-2 py-1"
                      v-if="symbolForm.elementCategoryName === 'All'"
                    >
                      <a
                        href="javascript:;"
                        class="text-reset text-decoration-none px-1 bg-primary text-white"
                      >
                        All
                      </a>
                    </li>
                    <li class="px-2 py-1" v-else @click="deleteSymbolTag">
                      <a
                        href="javascript:;"
                        class="text-reset text-decoration-none px-1 bg-primary text-white"
                      >
                        {{ symbolForm.elementCategoryName }}
                        <i class="el-icon-close"></i>
                      </a>
                    </li>
                  </ul>
                </div>
                <div class="category py-2">
                  <p><b>Field</b></p>
                  <ul class="d-flex flex-wrap no-gutters text-center">
                    <li
                      class="px-2 py-1"
                      @click="
                        debounceGetSymbolList({
                          id: 0,
                          name: 'All',
                          type: 'category'
                        })
                      "
                    >
                      <a
                        href="javascript:;"
                        class="text-reset text-decoration-none px-1"
                        :class="{ active: !symbolForm.elementCategoryId }"
                        >All</a
                      >
                    </li>
                    <li
                      class="px-2 py-1"
                      v-for="item in symbolCategoryList"
                      :key="item.id"
                      @click="
                        debounceGetSymbolList({
                          id: item.id,
                          name: item.category_name,
                          type: 'category'
                        })
                      "
                    >
                      <a
                        href="javascript:;"
                        class="text-reset text-decoration-none px-1"
                        :class="{
                          active: symbolForm.elementCategoryId === item.id
                        }"
                        >{{ item.category_name }}</a
                      >
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="col-9 h-100 p-2">
            <div
              class="content h-100 p-2 bg-white"
              ref="symbolWrap"
              style="overflow-y: scroll"
            >
              <ul
                class="row no-gutters"
                v-infinite-scroll="loadSymbolList"
                infinite-scroll-disabled="disabledLoadSymbol"
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
                  class="col-2 p-1 pointer"
                  v-for="(item, index) in symbolList"
                  :key="index"
                  @click="addEleImg(item, 'public')"
                >
                  <div class="border rounded bg-transparent h-100 squareDiv">
                    <img v-lazy="item.url" :alt="item.element_name" />
                  </div>
                </li>
              </ul>
              <p v-if="loadingSymbol" class="text-center p-2 m-0">
                loading...
              </p>
              <!--                  <p v-if="noMoreSymbol" class="text-center p-2 m-0">-->
              <!--                    No more(Total:{{ symbolForm.total }})-->
              <!--                  </p>-->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getElement, getElementCategory } from '@/api/sample'

export default {
  name: 'symbolDialog',
  data() {
    return {
      debounceGetSymbolList: null,
      symbolCategoryList: [],
      symbolList: [],
      loadingSymbol: false,
      tagBar: false,
      symbolForm: {
        elementCategoryId: '',
        elementCategoryName: 'All',
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
    noMoreSymbol() {
      //当起始页数大于总页数时停止加载
      return this.symbolForm.page >= this.symbolForm.totalPages
    },
    disabledLoadSymbol() {
      return this.loadingSymbol || this.noMoreSymbol
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

    deleteSymbolTag() {
      this.symbolForm.elementCategoryId = ''
      this.symbolForm.elementCategoryName = 'All'
      this.debounceGetSymbolList()
    },

    getSymbolList({ id, name, type } = { type: 'search' }) {
      if (type === 'search') {
        this.symbolForm.page = 1
        this.$refs.symbolWrap.scrollTop = 0
      } else if (type === 'scroll') {
        //不做处理
      } else if (type === 'category') {
        this.symbolForm.page = 1
        this.$refs.symbolWrap.scrollTop = 0
        this.symbolForm.elementCategoryId = id
        this.symbolForm.elementCategoryName = name
      }
      getElement({
        ...this.symbolForm
      }).then(res => {
        this.symbolForm.total = res.data.total_number
        this.symbolForm.totalPages = res.data.total_pages
        if (type === 'scroll') {
          this.symbolList = this.symbolList.concat(res.data.data)
          this.loadingSymbol = false
        } else {
          this.symbolList = res.data.data
        }
      })
    },

    loadSymbolList() {
      this.loadingSymbol = true
      this.symbolForm.page++
      this.debounceGetSymbolList({
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
    },
  },
  created() {
    getElementCategory().then(res=>{
      this.symbolCategoryList = res.data
    })
  },
  mounted() {
    this.debounceGetSymbolList = this.$utils.debounce(this.getSymbolList, 300)
    //获取元素列表
    this.debounceGetSymbolList()
    this.$refs.symbolTagListWrap.addEventListener(
      'scroll',
      () => {
        let c = this.$refs.symbolTagListWrap.scrollTop
        let d = this.$refs.symbolSelectedTag.offsetHeight
        if (c >= d) {
          this.tagBar2 = true
        }
        if (c < d) {
          this.tagBar2 = false
        }
      },
      true
    )
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
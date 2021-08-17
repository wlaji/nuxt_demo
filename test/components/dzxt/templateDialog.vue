<template>
  <div class="categoryBlockWrap">
    <div class="categoryBlock">
      <div class="header p-2">
        <strong>Choose Template</strong>
        <div>
          <i class="el-icon-close" @click="closeTemplateDialog"></i>
        </div>
      </div>
      <div class="title p-2 d-flex">
        <div class="search-area">
          <el-input
            type="text"
            clearable
            round
            v-model="templateForm.keyword"
            @input="debounceGetSampleList"
            placeholder="Keyword search"
            suffix-icon="el-icon-search"
          ></el-input>
          <small class="p-1 text-nowrap">Total {{ templateForm.total }}</small>
        </div>
      </div>
      <div class="categoryBlock-list">
        <div class="row no-gutters h-100">
          <div class="col-3 h-100 p-2">
            <div class="h-100 position-relative">
              <div
                class="tagList overflow-auto p-2 bg-white h-100"
                :class="{ isfixed: tagBar }"
                ref="templateTagListWrap"
              >
                <div
                  class="selected py-2 border-bottom"
                  ref="templateSelectedTag"
                >
                  <p><b>Selected</b></p>
                  <ul class="d-flex flex-wrap no-gutters text-center">
                    <li class="px-2 py-1">
                      <a
                        href="javascript:;"
                        class="text-reset text-decoration-none px-1 bg-primary text-white"
                      >
                        {{ templateForm.name ? templateForm.name : 'All' }}
                      </a>
                    </li>
                    <li
                      class="px-2 py-1"
                      v-for="(item, key) in templateForm.tagId"
                      :key="key"
                      @click="deleteTemplateTag({ type: 'tag', key })"
                    >
                      <a
                        href="javascript:;"
                        class="text-reset text-decoration-none px-1 bg-primary text-white"
                        >{{ item.name }} <i class="el-icon-close"></i
                      ></a>
                    </li>
                  </ul>
                </div>
                <!--                <div class="category py-2 border-bottom">-->
                <!--                  <p><b>Field</b></p>-->
                <!--                  <ul class="d-flex flex-wrap no-gutters text-center">-->
                <!--                    <li-->
                <!--                      class="px-2 py-1"-->
                <!--                      @click="-->
                <!--                        debounceGetSampleList({-->
                <!--                          key: cateName,-->
                <!--                          name: 'All',-->
                <!--                          id: 0,-->
                <!--                          type: 'category'-->
                <!--                        })-->
                <!--                      "-->
                <!--                    >-->
                <!--                      <a-->
                <!--                        href="javascript:;"-->
                <!--                        class="text-reset text-decoration-none px-1"-->
                <!--                        :class="{-->
                <!--                          active: !templateForm.sampleCategoryId-->
                <!--                        }"-->
                <!--                        >All</a-->
                <!--                      >-->
                <!--                    </li>-->
                <!--                    <li-->
                <!--                      class="px-2 py-1"-->
                <!--                      v-for="item in templateCategoryList"-->
                <!--                      :key="item.id"-->
                <!--                      @click="-->
                <!--                        debounceGetSampleList({-->
                <!--                          key: cateName,-->
                <!--                          name: item.category_name,-->
                <!--                          id: item.id,-->
                <!--                          type: 'category'-->
                <!--                        })-->
                <!--                      "-->
                <!--                    >-->
                <!--                      <a-->
                <!--                        href="javascript:;"-->
                <!--                        class="text-reset text-decoration-none px-1"-->
                <!--                        :class="{-->
                <!--                          active: templateForm.sampleCategoryId === item.id-->
                <!--                        }"-->
                <!--                        >{{ item.category_name }}</a-->
                <!--                      >-->
                <!--                    </li>-->
                <!--                  </ul>-->
                <!--                </div>-->
                <div class="category py-2 border-bottom">
                  <p><b>Category</b></p>
                  <ul class="d-flex flex-wrap no-gutters text-center">
<!--                    <li-->
<!--                      class="px-2 py-1"-->
<!--                      @click="-->
<!--                        debounceGetSampleList({-->
<!--                          name: '',-->
<!--                          type: 'category'-->
<!--                        })-->
<!--                      "-->
<!--                    >-->
<!--                      <a-->
<!--                        href="javascript:;"-->
<!--                        class="text-reset text-decoration-none px-1"-->
<!--                        :class="{-->
<!--                          active: !templateForm.name-->
<!--                        }"-->
<!--                        >All</a-->
<!--                      >-->
<!--                    </li>-->
                    <li
                      class="px-2 py-1"
                      v-for="item in categoryList"
                      :key="item.id"
                      @click="
                        debounceGetSampleList({
                          name: item.product_cate_name,
                          type: 'category'
                        })
                      "
                    >
                      <a
                        href="javascript:;"
                        class="text-reset text-decoration-none px-1"
                        :class="{
                          active: templateForm.name === item.product_cate_name
                        }"
                        >{{ item.product_cate_name }}</a
                      >
                    </li>
                  </ul>
                </div>
                <div
                  class="tag py-2 border-bottom"
                  v-for="item in templateTagList"
                  :key="item.id"
                >
                  <p>
                    <b>{{ item.category_name }}</b>
                  </p>
                  <ul class="d-flex flex-wrap no-gutters text-center">
                    <li
                      class="px-2 py-1"
                      @click="
                        debounceGetSampleList({
                          key: item.id,
                          name: 'All',
                          id: 0,
                          type: 'tag'
                        })
                      "
                    >
                      <a
                        href="javascript:;"
                        class="text-reset text-decoration-none px-1"
                        :class="{
                          active:
                            !templateForm.tagId[item.id] ||
                            templateForm.tagId[item.id].id === 0
                        }"
                        >All</a
                      >
                    </li>
                    <li
                      class="px-2 py-1"
                      v-for="tagItem in item.tag"
                      :key="tagItem.id"
                      @click="
                        debounceGetSampleList({
                          key: item.id,
                          name: tagItem.name,
                          id: tagItem.id,
                          type: 'tag'
                        })
                      "
                    >
                      <a
                        href="javascript:;"
                        class="text-reset text-decoration-none px-1"
                        :class="{
                          active:
                            templateForm.tagId[item.id] &&
                            templateForm.tagId[item.id].id == tagItem.id
                        }"
                        >{{ tagItem.name }}</a
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
              style="overflow-y: scroll"
              ref="templateWrap"
            >
              <ul
                class="row no-gutters"
                v-infinite-scroll="loadSampleList"
                infinite-scroll-disabled="disabledLoadTemplate"
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
                  class="col-2 p-1 pointe userItem"
                  v-for="(item, index) in templateList"
                  :key="index"
                >
                  <div class="border rounded bg-white h-100 squareDiv">
                    <img v-lazy="item.pic_path" :alt="item.sample_name" />
                    <div class="options-wrap">
                      <div class="options-btn">
                        <el-button
                          type="primary"
                          icon="el-icon-edit"
                          circle
                          @click.stop="selectTemplate(item.id, 'public')"
                        ></el-button>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
              <p v-if="loadingTemplate" class="text-center p-2 m-0">
                loading...
              </p>
              <!--                  <p v-if="noMoreTemplate" class="text-center p-2 m-0">-->
              <!--                    No more(Total:{{ templateForm.total }})-->
              <!--                  </p>-->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getSample, getSampleInfo, getTag } from '@/api/sample'

export default {
  name: 'templateDialog',
  props: ['categoryList'],
  data() {
    return {
      loadingTemplate: false,
      tagBar: false,
      debounceGetSampleList: null,
      templateForm: {
        sampleCategoryId: '',
        sampleCategoryName: 'All',
        tagId: {},
        keyword: '',
        page: 1,
        pageCount: 48,
        total: 0,
        totalPages: 1,
        name: ''
      },
      templateCategoryList: [],
      templateTagList: [],
      templateList: []
    }
  },
  computed: {
    cateName() {
      return this.$utils.decodeName(this.$route.params.categoryName)
    },
    noMoreTemplate() {
      //当起始页数大于总页数时停止加载
      return this.templateForm.page >= this.templateForm.totalPages
    },
    disabledLoadTemplate() {
      return this.loadingTemplate || this.noMoreTemplate
    }
  },
  methods: {
    closeTemplateDialog() {
      this.$emit('closeTemplateDialog')
    },

    getSampleList({ key, name, id, type } = { type: 'search' }) {
      if (type === 'category') {
        //重置页码,模板列表父级滚动到顶部去
        this.templateForm.page = 1
        this.templateForm.tagId = {}
        this.templateForm.name = name
        this.$refs.templateWrap.scrollTop = 0
        if (name) {
          getTag({
            name: name
          }).then(res => {
            this.templateTagList = res.data
          })
        }
      } else if (type === 'search') {
        this.templateForm.page = 1
        this.$refs.templateWrap.scrollTop = 0
      } else if (type === 'scroll') {
        //不做处理
      } else if (type === 'tag') {
        this.templateForm.page = 1
        this.$refs.templateWrap.scrollTop = 0
        let tagId = this.templateForm.tagId
        tagId[key] = tagId[key] ? tagId[key] : this.$set(tagId, key, '')
        if (id === 0) {
          this.$delete(tagId, key)
        } else {
          tagId[key] = {
            id,
            name
          }
        }
      }
      let tagIdArr = []
      Object.values(this.templateForm.tagId).forEach(item => {
        tagIdArr.push(item.id)
      })
      let postData = Object.assign({}, this.templateForm, {
        tagId: tagIdArr
      })
      getSample(postData).then(res => {
        this.templateForm.total = res.data.total_number
        this.templateForm.totalPages = res.data.total_pages
        if (type === 'scroll') {
          this.templateList = this.templateList.concat(res.data.data)
          this.loadingTemplate = false
        } else {
          this.templateList = res.data.data
        }
      })
    },

    loadSampleList() {
      this.loadingTemplate = true
      this.templateForm.page++
      this.debounceGetSampleList({
        type: 'scroll'
      })
    },

    deleteTemplateTag({ type, key }) {
      if (type === 'category') {
        this.templateForm.sampleCategoryId = ''
        this.templateForm.sampleCategoryName = 'All'
      } else if (type === 'tag') {
        this.$delete(this.templateForm.tagId, key)
      }
      this.debounceGetSampleList()
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

    //加载模板
    selectTemplate(id, type) {
      if (this.cateName !== this.templateForm.name) {
        this.$confirm(
          "The template's category is different from the one you selected, are you sure to change the customization options and replace your current design with this template?",
          'Hint',
          {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        )
          .then(() => {
            this.$emit('selectTemplate', {
              id,
              type
            })
          })
          .catch(() => {})
      } else {
        if (
          this.$parent.fabricStage.getObjects().filter(o => !o.isShade).length
        ) {
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
              this.$emit('selectTemplate', {
                id,
                type
              })
            })
            .catch(() => {})
        } else {
          this.$emit('selectTemplate', {
            id,
            type
          })
        }
      }
    }
  },
  created() {},
  mounted() {
    console.log(this.$refs.templateWrap)
    this.templateForm.name = this.cateName
    this.debounceGetSampleList = this.$utils.debounce(this.getSampleList, 300)
    //获取公共模板列表
    this.debounceGetSampleList()
    getTag({
      name: this.templateForm.name
    }).then(res => {
      this.templateTagList = res.data
    })
    //监听元素滚动
    this.$refs.templateTagListWrap.addEventListener(
      'scroll',
      () => {
        let c = this.$refs.templateTagListWrap.scrollTop
        let d = this.$refs.templateSelectedTag.offsetHeight
        if (c >= d) {
          this.tagBar = true
        }
        if (c < d) {
          this.tagBar = false
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
    right:0;
    bottom:0;
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
<template>
  <div class="designSystemWrap overflow-hidden mbDzxt position-relative">
    <base-dialog :visible.sync="showParamDialog" :lockScroll="true">
      <template v-slot:content>
        <div class="content-wrap">
          <paramsSelect
            ref="paramsSelect"
            class="mb-paramsSelect"
            :categoryList="categoryList"
            @changeShape="changeShape"
            @changeSize="changeSize"
            @finishedDesign="finishedDesign"
            @selectTemplate="selectTemplate"
            @loadTemplate="loadTemplate"
            @close="showParamDialog = false"
          ></paramsSelect>
          <div class="close-dialog" @click="showParamDialog = false">
            <img src="@/assets/images/@2x/close1.png" />
          </div>
        </div>
      </template>
    </base-dialog>

    <!--上传图片裁剪区域-->
    <crop-img
      v-show="showCropArea"
      :cropUrl="cropUrl"
      @closeCropArea="showCropArea = false"
      @addCropImg="addCropImg"
    ></crop-img>
    <!-- 手机端 -->
    <div
      id="text-option"
      ref="textOption"
      v-show="
        selectedEle &&
          (selectedEle.type === 'text' || selectedEle.type === 'curved-text')
      "
    >
      <div class="top d-flex justify-content-between">
        <el-select
          class="fontSelect"
          v-model="textProperty.fontFamily"
          @change="changeNodeProperty('fontFamily', $event)"
          placeholder="please select"
          :style="{ fontFamily: textProperty.fontFamily }"
        >
          <el-option
            v-for="item in familyList"
            :key="item"
            :label="item"
            :value="item"
            :style="{ fontFamily: item }"
          ></el-option>
        </el-select>

        <el-select
          v-if="selectedEle.type === 'text'"
          class="fontSizeSelect"
          v-model="textProperty.fontSize"
          filterable
          allow-create
          default-first-option
          @change="changeNodeProperty('fontSize', $event)"
        >
          <el-option label="30" :value="30"></el-option>
          <el-option label="40" :value="40"></el-option>
          <el-option label="50" :value="50"></el-option>
          <el-option label="60" :value="60"></el-option>
          <el-option label="70" :value="70"></el-option>
          <el-option label="80" :value="80"></el-option>
          <el-option label="90" :value="90"></el-option>
          <el-option label="100" :value="100"></el-option>
        </el-select>

        <el-popover
          v-if="selectedEle.type === 'curved-text'"
          placement="bottom"
          width="200"
          trigger="manual"
          v-model="visibleRadianBtn"
        >
          <el-button
            type="primary"
            class="fontCurvedSelect"
            slot="reference"
            @click="visibleRadianBtn = !visibleRadianBtn"
          >
            Curve
            <i class="el-icon-arrow-down"></i>
          </el-button>
          <div>
            <div class="d-flex align-items-center">
              <label class="pr-2">Flip</label>
              <el-switch
                v-model="textProperty.flipped"
                @change="changeNodeProperty('flipped', textProperty.flipped)"
              ></el-switch>
            </div>
            <div class="d-flex align-items-center">
              <label class="pr-2">Text curve</label>
              <el-slider
                class="flex-1"
                :show-tooltip="false"
                v-model="textProperty.radian"
                :min="100"
                :max="5000"
                @change="changeNodeProperty('radian', textProperty.radian)"
              ></el-slider>
            </div>
          </div>
        </el-popover>

        <div
          class="color-text"
          :style="{ background: textProperty.fill }"
          @click="
            showColorList = !showColorList;
            colorStatus = 1;
          "
        >
          <span class="text">Color</span>
          <span class="thumb"></span>
        </div>
      </div>
      <div class="bottom d-flex justify-content-between">
        <el-button
          type="primary"
          class="editText"
          @click="editText(textProperty.text)"
        >
          Edit Text
          <i class="el-icon-edit el-icon--right"></i>
        </el-button>
        <div class="btnText btnCopy" @click="copyItem">
          <img
            src="~/assets/images/copy.png"
            width="20"
            alt="copy"
            title="copy"
          />
          <span>Copy</span>
        </div>
        <div
          class="btnText"
          :class="{ active: textProperty.fontWeight !== 'normal' }"
          @click="changeNodeProperty('fontWeight')"
        >
          <span class="font-weight-bold">B</span>
        </div>
        <div
          class="btnText"
          :class="{ active: textProperty.fontStyle !== 'normal' }"
          @click="changeNodeProperty('fontStyle')"
        >
          <span class="font-weight-bold"><i>I</i></span>
        </div>
        <div
          class="btnText"
          :class="{ active: textProperty.underline }"
          @click="changeNodeProperty('underline')"
        >
          <span class="font-weight-bold"><u>U</u></span>
        </div>
      </div>
    </div>

    <div
      id="img-option"
      :class="{ hiddenColor: !selectedImgColor.isOne }"
      ref="imgOption"
      v-show="selectedEle && selectedEle.type === 'image'"
    >
      <div class="top d-flex justify-content-between align-items-center">
        <el-button type="primary" class="replaceBtn" @click="getReplaceImgList">
          <img
            class="align-middle"
            src="~/assets/images/replace.png"
            alt="replace"
            title="replace"
          />
          Replace
        </el-button>
        <div class="btnText btnCopy" @click="copyItem">
          <img
            src="~/assets/images/copy.png"
            width="20"
            alt="copy"
            title="copy"
          />
          <span>Copy</span>
        </div>
        <div
          v-if="selectedImgColor.isOne"
          class="color-text"
          :style="{ background: selectedImgColor.color }"
          @click="
            showColorList = !showColorList;
            colorStatus = 2;
          "
        >
          <span class="text">Color</span>
          <span class="thumb"></span>
        </div>
      </div>
    </div>

    <transition
      tag="div"
      enter-active-class="animated slideInUp faster"
      leave-active-class="animated slideOutDown faster"
    >
      <div class="colorWrap" v-show="showColorList">
        <div class="h-100 bg-white d-flex flex-column">
          <div class="flex-1 p-2 position-relative">
            <div class="h-100">
              <div class="swiper" v-swiper:swiperColor="colorSwiperOptions">
                <div class="swiper-wrapper">
                  <div
                    class="swiper-slide"
                    v-for="item in colorData"
                    :key="item.id"
                    @click="changeColor(item)"
                  >
                    <div
                      class="color-item border rounded-sm"
                      :style="{ background: item.code }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tips" v-show="showColorListTime <= 1">
              <img src="~/assets/images/slide.png" alt="slide" title="slide" />
            </div>
          </div>
          <div class="d-flex-center p-2">
            <i
              class="el-icon-circle-close"
              style="font-size:30px"
              @click.stop="showColorList = false"
            ></i>
          </div>
        </div>
      </div>
    </transition>

    <transition
      tag="div"
      enter-active-class="animated slideInUp faster"
      leave-active-class="animated slideOutDown faster"
    >
      <div class="imgReplaceWrap" v-show="showImgReplace">
        <div class="h-100 bg-default d-flex flex-column">
          <div class="top border-bottom row align-items-center">
            <div class="col-12 text-center h-100 d-flex-center">
              <b class="h-100 d-flex-center top-text active">Edit Image</b>
            </div>
          </div>
          <div
            class="flex-1 p-2 position-relative d-flex flex-column overflow-hidden"
          >
            <div class="row p-2 border-bottom">
              <div class="col-5">
                <div class="border rounded-sm bg-transparent">
                  <div class="squareDiv p-2">
                    <img
                      :src="
                        selectedEle
                          ? selectedEle.get('type') === 'image'
                            ? selectedEle.get('_element').src
                            : ''
                          : ''
                      "
                      alt="Current Symbol"
                    />
                    <div
                      class="text-white position-absolute p-2 text-center"
                      style="bottom:0;left:0;right:0;background:rgba(0,0,0,.4)"
                    >
                      Current Symbol
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-7 d-flex flex-column justify-content-center">
                <el-button
                  type="default"
                  class="w-100"
                  :class="{ 'bg-primary text-white': replaceTabActive === 1 }"
                  @click="replaceTabActive = 1"
                >
                  Symbol Gallery
                </el-button>
                <el-button
                  type="default"
                  class="w-100 ml-0 mt-2"
                  :class="{ 'bg-primary text-white': replaceTabActive === 2 }"
                  @click="showMySymbol"
                >
                  My Symbol
                </el-button>
              </div>
            </div>
            <div class="flex-1 d-flex flex-column overflow-hidden">
              <p class="text-muted py-2 tips">
                <i class="el-icon-warning-outline"></i>
                Please replace your current symbol with the below symbol:
              </p>
              <div
                class="content overflow-auto flex-1"
                v-show="replaceTabActive === 1"
                ref="replaceWrap"
              >
                <ul class="row no-gutters">
                  <li class="col-3 p-1">
                    <el-upload
                      class="uploader"
                      ref="uploadBox2"
                      :limit="1"
                      action="#"
                      :show-file-list="false"
                      :before-upload="beforeUpload"
                      :on-change="uploadOnChange"
                      :http-request="file => file"
                    >
                      <div
                        class="border rounded-sm bg-white position-relative h-100 squareDiv"
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
                    class="col-3 p-1"
                    v-for="item in replaceImgList"
                    :key="item.id"
                  >
                    <div
                      class="border rounded-sm bg-transparent position-relative h-100 squareDiv"
                      @click="replaceEleImg(item, 'public')"
                    >
                      <img v-lazy="item.url" :alt="item.element_name" />
                    </div>
                  </li>
                </ul>
              </div>
              <div
                class="content overflow-auto flex-1"
                v-show="replaceTabActive === 2"
                ref="userSymbolReplaceWrap"
              >
                <ul class="row no-gutters">
                  <li class="col-3 p-1">
                    <el-upload
                      class="uploader"
                      ref="uploadUserSymbolBox1"
                      :limit="1"
                      action="#"
                      :show-file-list="false"
                      :before-upload="beforeUpload"
                      :on-change="uploadUserSymbolOnChange"
                      :http-request="file => file"
                    >
                      <div
                        class="border rounded-sm bg-white position-relative h-100 squareDiv"
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
                    class="col-3 p-1"
                    v-for="item in replaceUserSymbolList"
                    :key="item.id"
                  >
                    <div
                      class="border rounded-sm bg-transparent position-relative h-100 squareDiv"
                      @click="replaceEleImg(item, 'private')"
                    >
                      <img v-lazy="item.url" :alt="item.element_name" />

                      <div
                        class="delete"
                        @click.stop="deleteUserSymbol(item.id)"
                      >
                        <img
                          src="~/assets/images/delete.png"
                          class="deleteIcon"
                          alt="close"
                          title="close"
                        />
                      </div>
                    </div>
                  </li>
                </ul>
                <p v-if="loadingUserSymbol" class="text-center load">
                  loading...
                </p>
                <!--                <p v-if="noMoreUserSymbol" class="text-center p-2 m-0">-->
                <!--                  No more(Total:{{ userSymbolForm.total }})-->
                <!--                </p>-->
              </div>
            </div>
          </div>
          <div class="d-flex-center p-2">
            <i
              class="el-icon-circle-close"
              style="font-size:30px"
              @click.stop="showImgReplace = false"
            ></i>
          </div>
        </div>
      </div>
    </transition>
    <div class="designContent">
      <div class="d-flex align-items-center justify-content-between p-2 title">
        <div>
          <button type="button" class="btn btn-primary" @click="saveTemplate">
            <Al-icon icon="save" class="mr-2"></Al-icon>
            Save
          </button>
          <button
            type="button"
            class="btn btn-outline-primary"
            @click="shareTemplate"
          >
            <i class="el-icon-share mr-2"></i>
            Share
          </button>
        </div>
        <div>
          <button
            type="button"
            class="btn btn-warning"
            @click="showParamDialog = true"
          >
            Next
          </button>
        </div>
      </div>
      <div class="p-2 content">
        <div class="d-flex flex-column w-100 h-100">
          <div
            class="designBody flex-1 d-flex justify-content-center align-items-start"
            ref="designBody"
            @click.self="blurFabric"
          >
            <div
              class="fabric-wrap"
              ref="fabricWrap"
              @click.self="blurFabric"
              v-loading="loadTemp"
              element-loading-background="rgba(238, 238, 238, 0.8)"
            >
              <canvas id="fabricCanvas"></canvas>
            </div>
          </div>

          <div class="p-2 d-flex-center undoAndRedo">
            <div class="mx-3 expand-selection" @click="undo">
              <img src="~/assets/images/withdraw.png" alt="undo" title="undo" />
            </div>
            <div class="mx-3 expand-selection" @click="redo">
              <img src="~/assets/images/cancel.png" alt="redo" title="redo" />
            </div>
            <div
              class="mx-3 expand-selection d-flex-center"
              @click="clearCanvas"
            >
              <img
                class="clear"
                src="~/assets/images/clear1.png"
                alt="clear"
                title="clear"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分享弹窗 -->
    <base-dialog :visible.sync="showShareTemplate">
      <template v-slot:content>
        <div class="shareTemplateWrap bg-white">
          <img class="share-img" :src="shareImg" />
          <div class="share-title">SHARE MY DESIGN</div>
          <div class="share-sub-title">
            Share this link to allow others to see your design and order a copy
            for themselves
          </div>
          <div class="share-link-box d-flex">
            <div class="share-link">{{ shareUrl }}</div>
            <el-button class="share-copy" @click="copyShareUrl">
              COPY LINK
            </el-button>
          </div>
          <div class="share-other-line">or</div>
          <div class="share-other-box d-flex">
            <a
              class="share-btn-facebook"
              :href="
                'https://www.facebook.com/sharer/sharer.php?u=' +
                  encodeURIComponent(shareUrl)
              "
              target="_blank"
            >
              <Al-icon icon="facebook1" class="share-btn-icon"></Al-icon>
            </a>
            <a
              class="share-btn-twitter"
              :href="
                'https://twitter.com/intent/tweet?url=' +
                  encodeURIComponent(shareUrl)
              "
              target="_blank"
            >
              <Al-icon icon="twitter" class="share-btn-icon"></Al-icon>
            </a>
            <a
              class="share-btn-pinterest"
              :href="
                'https://www.pinterest.com/pin/create/button/?url=' +
                  shareUrl +
                  '&media=' +
                  shareImg
              "
              target="_blank"
            >
              <Al-icon icon="pinterest" class="share-btn-icon"></Al-icon>
            </a>
          </div>
          <div class="close-dialog" @click="showShareTemplate = false">
            <i class="el-icon-circle-close"></i>
          </div>
        </div>
      </template>
    </base-dialog>

    <div class="tab-content" :class="`con${tabIndex}`" v-show="tabIndex !== -1">
      <transition-group
        tag="div"
        class="h-100 position-relative"
        enter-active-class="animated slideInUp faster"
        leave-active-class="animated slideOutDown faster"
      >
        <div
          class="tab-item tab-templates container-fluid"
          key="templates"
          v-show="tabIndex === 0"
        >
          <div class="h-100">
            <div
              class="top d-flex align-items-center justify-content-between py-2"
            >
              <div
                class="d-flex flex-column align-items-center filter"
                @click="showTemplateTagList = !showTemplateTagList"
              >
                <Al-icon icon="ego-menu"></Al-icon>
                <span>Filter</span>
              </div>
              <div>
                <el-input
                  type="text"
                  round
                  v-model="templateForm.keyword"
                  @input="debounceGetSampleList"
                  class="border-20"
                  placeholder="Keyword search"
                  suffix-icon="el-icon-search"
                ></el-input>
              </div>
              <div class="text-right closeIcon" @click="tabIndex = -1">
                <i class="el-icon-close"></i>
              </div>
            </div>
            <div class="content" ref="templateWrap">
              <ul
                class="row no-gutters"
                v-infinite-scroll="loadSampleList"
                infinite-scroll-disabled="disabledLoadTemplate"
              >
                <li class="col-4 p-1 userItem">
                  <el-upload
                    class="uploader"
                    ref="uploadBox3"
                    :limit="1"
                    action="#"
                    :show-file-list="false"
                    :before-upload="beforeUpload"
                    :on-change="uploadOnChange"
                    :http-request="file => file"
                  >
                    <div
                      class="border rounded-sm bg-white position-relative h-100 squareDiv"
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
                  class="col-4 p-1 userItem"
                  v-for="(item, index) in templateList"
                  :key="index"
                >
                  <div
                    class="border rounded-sm bg-white h-100 squareDiv"
                    @click="
                      selectTemplate({
                        id: item.id,
                        type: 'public'
                      })
                    "
                  >
                    <img v-lazy="item.pic_path" :alt="item.sample_name" />
                  </div>
                </li>
              </ul>
              <p v-if="loadingTemplate" class="text-center load">loading...</p>
              <!--              <p v-if="noMoreTemplate" class="text-center p-2 m-0">-->
              <!--                No more(Total:{{ templateForm.total }})-->
              <!--              </p>-->
            </div>

            <div
              class="zhezhao1"
              v-show="showTemplateTagList"
              @click="showTemplateTagList = !showTemplateTagList"
            ></div>
            <div
              class="zhezhao2"
              v-show="showTemplateTagList"
              @click="showTemplateTagList = !showTemplateTagList"
            ></div>
            <transition
              enter-active-class="animated slideInLeft faster"
              leave-active-class="animated slideOutLeft faster"
            >
              <div class="tagList overflow-auto" v-show="showTemplateTagList">
                <div class="category container-fluid">
                  <h3 class="px-3 py-2">Category</h3>
                  <ul class="row no-gutters text-center">
                    <!--                    <li-->
                    <!--                      class="col-6 p-1"-->
                    <!--                      @click="-->
                    <!--                        debounceGetSampleList({-->
                    <!--                          name: '',-->
                    <!--                          type: 'category'-->
                    <!--                        })-->
                    <!--                      "-->
                    <!--                    >-->
                    <!--                      <a-->
                    <!--                        href="javascript:;"-->
                    <!--                        class="h-100 p-2 border rounded-sm bg-white text-reset font-weight-bold text-decoration-none d-flex-center"-->
                    <!--                        :class="{-->
                    <!--                          active: !templateForm.name-->
                    <!--                        }"-->
                    <!--                        >All</a-->
                    <!--                      >-->
                    <!--                    </li>-->
                    <li
                      class="col-6 p-1"
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
                        class="h-100 p-2 border rounded-sm bg-white text-reset font-weight-bold text-decoration-none d-flex-center"
                        :class="{
                          active: templateForm.name === item.product_cate_name
                        }"
                      >
                        {{ item.product_cate_name }}
                      </a>
                    </li>
                  </ul>
                </div>

                <div
                  class="tag container-fluid"
                  v-for="item in templateTagList"
                  :key="item.id"
                >
                  <h3 class="px-3 py-2">{{ item.category_name }}</h3>
                  <ul class="row no-gutters text-center">
                    <li
                      class="col-6 p-1"
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
                        class="p-2 border rounded-sm d-block bg-white text-reset font-weight-bold text-decoration-none"
                        :class="{
                          active:
                            !templateForm.tagId[item.id] ||
                            templateForm.tagId[item.id].id === 0
                        }"
                      >
                        All
                      </a>
                    </li>
                    <li
                      class="col-6 p-1"
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
                        class="p-2 border rounded-sm d-block bg-white text-reset font-weight-bold text-decoration-none"
                        :class="{
                          active:
                            templateForm.tagId[item.id] &&
                            templateForm.tagId[item.id].id == tagItem.id
                        }"
                      >
                        {{ tagItem.name }}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </transition>
          </div>
        </div>
        <div
          class="tab-item tab-symbol container-fluid"
          key="symbol"
          v-show="tabIndex === 1"
        >
          <div class="h-100">
            <div
              class="top d-flex justify-content-between align-items-center py-2"
            >
              <div
                class="d-flex flex-column align-items-center filter"
                @click="showSymbolTagList = !showSymbolTagList"
              >
                <Al-icon icon="ego-menu"></Al-icon>
                <span>Filter</span>
              </div>
              <div>
                <el-input
                  type="text"
                  v-model="symbolForm.keyword"
                  @input="debounceGetSymbolList"
                  class="border-20"
                  placeholder="Keyword search"
                  suffix-icon="el-icon-search"
                ></el-input>
              </div>
              <div class="text-right closeIcon" @click="tabIndex = -1">
                <i class="el-icon-close"></i>
              </div>
            </div>
            <div class="content" ref="symbolWrap">
              <ul
                class="row no-gutters overflow-auto"
                v-infinite-scroll="loadSymbolList"
                infinite-scroll-disabled="disabledLoadSymbol"
              >
                <li class="col-4 p-1">
                  <el-upload
                    class="uploader"
                    ref="uploadBox4"
                    :limit="1"
                    action="#"
                    :show-file-list="false"
                    :before-upload="beforeUpload"
                    :on-change="uploadOnChange"
                    :http-request="file => file"
                  >
                    <div
                      class="border rounded-sm bg-white position-relative h-100 squareDiv"
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
                  class="col-4 p-1"
                  v-for="item in symbolList"
                  :key="item.id"
                  @click="addEleImg(item, 'public')"
                >
                  <div
                    class="border rounded-sm bg-transparent position-relative h-100 squareDiv"
                  >
                    <img v-lazy="item.url" :alt="item.element_name" />
                  </div>
                </li>
              </ul>
              <p v-if="loadingSymbol" class="text-center load">loading...</p>
              <!--              <p v-if="noMoreSymbol" class="text-center p-2 m-0">-->
              <!--                No more(Total:{{ symbolForm.total }})-->
              <!--              </p>-->
            </div>
            <div
              class="zhezhao1"
              v-show="showSymbolTagList"
              @click="showSymbolTagList = !showSymbolTagList"
            ></div>
            <div
              class="zhezhao2"
              v-show="showSymbolTagList"
              @click="showSymbolTagList = !showSymbolTagList"
            ></div>
            <transition
              enter-active-class="animated slideInLeft faster"
              leave-active-class="animated slideOutLeft faster"
            >
              <div class="tagList overflow-auto" v-show="showSymbolTagList">
                <div class="category container-fluid">
                  <h3 class="px-3 py-2">Field</h3>
                  <ul class="row no-gutters text-center">
                    <li
                      class="col-6 p-1"
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
                        class="h-100 p-2 border rounded-sm bg-white text-reset font-weight-bold text-decoration-none d-flex-center"
                        :class="{ active: !symbolForm.elementCategoryId }"
                      >
                        All
                      </a>
                    </li>
                    <li
                      class="col-6 p-1"
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
                        class="h-100 p-2 border rounded-sm bg-white text-reset font-weight-bold text-decoration-none d-flex-center"
                        :class="{
                          active: symbolForm.elementCategoryId === item.id
                        }"
                      >
                        {{ item.category_name }}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </transition>
          </div>
        </div>
        <div
          class="tab-item tab-design container-fluid"
          key="design"
          v-show="tabIndex === 2"
        >
          <div class="h-100">
            <div
              class="top border-bottom row align-items-center position-relative"
            >
              <div
                class="col-6 text-center h-100 d-flex-center"
                @click="changeTabDesign(0)"
              >
                <b
                  class="h-100 d-flex-center top-text"
                  :class="{ active: tabDesignIndex === 0 }"
                >
                  My Template
                </b>
              </div>
              <div
                class="col-6 text-center h-100 d-flex-center"
                @click="changeTabDesign(1)"
              >
                <b
                  class="h-100 d-flex-center top-text"
                  :class="{ active: tabDesignIndex === 1 }"
                >
                  My Symbol
                </b>
              </div>
              <div
                class="position-absolute text-right closeIcon"
                style="top:5px;right:5px;color:#333"
                @click="tabIndex = -1"
              >
                <i class="el-icon-close"></i>
              </div>
            </div>

            <div class="tab-userTemplates" v-show="tabDesignIndex === 0">
              <div class="search-input">
                <el-input
                  type="text"
                  v-model="userTemplateForm.keyword"
                  clearable
                  class="border-20"
                  @input="debounceGetUserSampleList"
                  placeholder="Keyword search"
                  suffix-icon="el-icon-search"
                ></el-input>
              </div>
              <div class="content" ref="userTemplateWrap">
                <ul
                  class="row no-gutters"
                  v-infinite-scroll="loadUserTemplateList"
                  infinite-scroll-disabled="disabledLoadUserTemplate"
                >
                  <li class="col-4 p-1 userItem">
                    <el-upload
                      class="uploader"
                      ref="uploadBox5"
                      :limit="1"
                      action="#"
                      :show-file-list="false"
                      :before-upload="beforeUpload"
                      :on-change="uploadOnChange"
                      :http-request="file => file"
                    >
                      <div
                        class="border rounded-sm bg-white position-relative h-100 squareDiv"
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
                    class="col-4 p-1 userItem"
                    v-for="item in userTemplateList"
                    :key="item.id"
                    @click="
                      selectTemplate({
                        id: item.id,
                        type: 'private'
                      })
                    "
                  >
                    <div
                      class="border rounded-sm bg-white position-relative h-100 squareDiv"
                    >
                      <img
                        v-lazy="item.pic_path"
                        :alt="item.sample_name"
                        :title="item.sample_name"
                      />
                      <div
                        class="delete"
                        @click.stop="deleteUserTemplate(item.id)"
                      >
                        <img
                          src="~/assets/images/delete.png"
                          class="deleteIcon"
                          alt="close"
                          title="close"
                        />
                      </div>
                    </div>
                  </li>
                </ul>
                <p v-if="loadingUserTemplate" class="text-center load">
                  loading...
                </p>
                <!--                  <p v-if="noMoreUserTemplate" class="text-center p-2 m-0">-->
                <!--                    No more(Total:{{ userTemplateForm.total }})-->
                <!--                  </p>-->
              </div>
            </div>
            <div class="tab-userSymbol" v-show="tabDesignIndex === 1">
              <div class="dropdown py-2 d-none">
                <el-select
                  v-model="userSymbolCategory"
                  placeholder="Please select"
                >
                  <el-option label="All" :value="0"></el-option>
                </el-select>
              </div>
              <div class="content overflow-auto" ref="userSymbolWrap">
                <ul
                  class="row no-gutters"
                  v-infinite-scroll="loadUserSymbolList"
                  infinite-scroll-disabled="disabledLoadUserSymbol"
                >
                  <li class="col-4 p-1">
                    <el-upload
                      class="uploader"
                      ref="uploadUserSymbolBox2"
                      :limit="1"
                      action="#"
                      :show-file-list="false"
                      :before-upload="beforeUpload"
                      :on-change="uploadUserSymbolOnChange"
                      :http-request="file => file"
                    >
                      <div
                        class="border rounded-sm bg-white position-relative h-100 squareDiv"
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
                    class="col-4 p-1"
                    v-for="item in userSymbolList"
                    :key="item.id"
                  >
                    <div
                      class="border rounded-sm bg-transparent position-relative h-100 squareDiv"
                      @click="addEleImg(item, 'private')"
                    >
                      <img v-lazy="item.url" :alt="item.element_name" />
                      <div
                        class="delete"
                        @click.stop="deleteUserSymbol(item.id)"
                      >
                        <img
                          src="~/assets/images/delete.png"
                          class="deleteIcon"
                          alt="close"
                          title="close"
                        />
                      </div>
                    </div>
                  </li>
                </ul>
                <p v-if="loadingUserSymbol" class="text-center load">
                  loading...
                </p>
                <!--                  <p v-if="noMoreUserSymbol" class="text-center p-2 m-0">-->
                <!--                    No more(Total:{{ userSymbolForm.total }})-->
                <!--                  </p>-->
              </div>
            </div>
          </div>
        </div>

        <div class="tab-item tab-text" key="test" v-show="tabIndex === 3">
          <div class="border-bottom p-2 top">
            <div class="d-flex-center">
              <el-input
                type="textarea"
                v-model="textValue"
                :rows="2"
                placeholder="Enter Your Text"
              ></el-input>
            </div>
            <div class="row no-gutters justify-content-between my-3">
              <el-button
                type="primary"
                round
                class="col"
                @click="addText(textValue, 'curvedText')"
              >
                Add Curved Text
              </el-button>
              <el-button
                type="primary"
                round
                class="col"
                @click="addText(textValue, 'text')"
              >
                Add Text
              </el-button>
            </div>
          </div>
          <div class="p-2 layerList" v-show="canvasTextList.length">
            <div class="swiper" v-swiper:swiperText="textSwiperOptions">
              <div class="swiper-wrapper">
                <div
                  class="swiper-slide"
                  v-for="(item, index) in canvasTextList"
                  :key="index"
                >
                  <div
                    class="d-flex flex-column border rounded-sm bg-transparent text-dark text-left layer-item"
                    @click="activeItem(item)"
                  >
                    <div class="d-flex align-items-center">
                      <span
                        class="d-inline-block text-truncate"
                        style="max-width:100%"
                      >
                        {{ item.text }}
                      </span>
                      <img
                        src="~/assets/images/write.png"
                        class="p-2 writeText"
                        alt="write"
                        title="write"
                        @click="editText(item.text)"
                      />
                    </div>

                    <div
                      class="d-flex justify-content-between align-items-end layer-options"
                      style="font-size:0;"
                    >
                      <div class="layerLock" @click.stop="lockItem(item)">
                        <img
                          src="~/assets/images/locking.png"
                          class="lock"
                          alt="lock"
                          title="lock"
                          v-show="!item.selectable"
                        />
                        <img
                          src="~/assets/images/open.png"
                          class="lock-open"
                          alt="open"
                          title="open"
                          v-show="item.selectable"
                        />
                      </div>

                      <div @click.stop="deleteItemBefore(item, 'text')">
                        <img
                          src="~/assets/images/delete.png"
                          class="deleteIcon"
                          alt="close"
                          title="close"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="tab-item tab-image" key="image" v-show="tabIndex === 4">
          <div class="p-2 top">
            <el-upload
              class="uploader w-100"
              ref="uploadBox1"
              :limit="1"
              action="#"
              :show-file-list="false"
              :before-upload="beforeUpload"
              :on-change="uploadOnChange"
              :http-request="file => file"
            >
              <el-button type="primary" round class="col"
                >Upload Your Logo</el-button
              >
            </el-upload>
          </div>
          <div class="p-3 layerList border-top" v-show="canvasImgList.length">
            <div class="text-muted mb-2">
              <i class="el-icon-warning-outline"></i>
              Please click the below symbol and replace it.
            </div>
            <div class="swiper" v-swiper:swiperImage="imageSwiperOptions">
              <div class="swiper-wrapper">
                <div
                  class="swiper-slide"
                  v-for="(item, index) in canvasImgList"
                  :key="index"
                >
                  <div
                    class="d-flex flex-column border rounded-sm bg-transparent text-dark text-left layer-item"
                    @click="activeItem(item)"
                  >
                    <div class="d-flex-center px-2 flex-1 h-100">
                      <img :src="item.getSrc()" alt="img" />
                    </div>
                    <div
                      class="d-flex justify-content-between align-items-end layer-options"
                      style="font-size:0;"
                    >
                      <div class="layerLock" @click.stop="lockItem(item)">
                        <img
                          src="~/assets/images/locking.png"
                          class="lock"
                          alt="lock"
                          title="lock"
                          v-show="!item.selectable"
                        />
                        <img
                          src="~/assets/images/open.png"
                          class="lock-open"
                          alt="open"
                          title="open"
                          v-show="item.selectable"
                        />
                      </div>

                      <div
                        class="close-1"
                        @click.stop="deleteItemBefore(item, 'image')"
                      >
                        <img
                          src="~/assets/images/delete.png"
                          class="deleteIcon"
                          alt="close"
                          title="close"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
    <div class="toolBar text-muted">
      <ul class="row no-gutters text-center bg-white w-100 h-100">
        <li
          class="col pt-2 d-flex flex-column justify-content-center align-items-center"
          :class="{ active: tabIndex === index }"
          v-for="(item, index) in toolBarList"
          :key="item.name"
          @click="tabClick(index)"
        >
          <div>
            <img
              :src="item.icon"
              alt="item.name"
              width="43"
              v-show="tabIndex !== index"
            />
            <img
              :src="item.iconActive"
              alt="item.name"
              width="35"
              v-show="tabIndex === index"
            />
          </div>
          <span class="text-nowrap mt-1">{{ item.name }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import cropImg from "@/components/dzxt/cropImg";
import paramsSelect from "@/components/dzxt/paramsSelect";
import initCurvedText from "@/assets/js/fabricCurveText";
import utils from "@/utils/utils";
import analyze from "rgbaster";
import Clipboard from "clipboard";
import {
  initAligningGuidelines,
  initCenteringGuidelines
} from "@/assets/js/guideLines.js";
import { fb, initControlIcon } from "@/assets/js/fb";
import { getColorData, getSameLevelProduct, ossUpload } from "@/api/public";
import "swiper/dist/css/swiper.css";

if (process.client) {
  let VueAwesomeSwiper = require("vue-awesome-swiper/dist/ssr");
  Vue.use(VueAwesomeSwiper);
}

import {
  getTag,
  getSample,
  getElementCategory,
  getElement,
  getSampleInfo
} from "@/api/sample";

import {
  getUserSample,
  getUserSampleInfo,
  editUserSample,
  shareUserSample,
  deleteUserSample,
  getUserElement,
  editUserElement,
  deleteUserElement
} from "@/api/account";

import {
  dieCut,
  ellipseTeXiao,
  rectTeXiao,
  roundedRectTeXiao
} from "@/assets/js/texiao";

export default {
  data() {
    return {
      showParamDialog: false,
      debounceGetSampleList: null,
      debounceGetSymbolList: null,
      debounceGetUserSampleList: null,
      debounceGetUserSymbolList: null,
      categoryList: [],
      sizeW: 1,
      sizeH: 1,
      saveTemplateBefore: false,
      showShareTemplate: false, // 打开分享弹窗
      shareImg: "",
      shareUrl: "",
      styleType: "",
      canvasInfo: {
        shadeScale: 0.9, //画中画占画布比例
        shadeSize: 1, //用户选择的尺寸
        pcWidth: 600,
        pcHeight: 600,
        mbWidth: 300,
        mbHeight: 300
      },
      specification: "",
      designBodyInfo: {
        width: 600,
        height: 600
      },
      toolBarList: [
        {
          icon: require("~/assets/images/templates.png"),
          iconActive: require("~/assets/images/templates-1.png"),
          name: "Templates"
        },
        {
          icon: require("~/assets/images/add-symbol.png"),
          iconActive: require("~/assets/images/add-symbol-1.png"),
          name: "Symbol"
        },
        {
          icon: require("~/assets/images/my-design.png"),
          iconActive: require("~/assets/images/my-design-1.png"),
          name: "My Design"
        },
        {
          icon: require("~/assets/images/add-text.png"),
          iconActive: require("~/assets/images/add-text-1.png"),
          name: "Add Text"
        },
        {
          icon: require("~/assets/images/upload.png"),
          iconActive: require("~/assets/images/upload-1.png"),
          name: "Upload"
        }
      ],
      tabIndex: 0,
      textSwiperOptions: {
        slidesPerView: 3,
        spaceBetween: 10,
        pagination: {
          el: ".swiper-pagination",
          dynamicBullets: true
        }
      },
      imageSwiperOptions: {
        slidesPerView: 3,
        spaceBetween: 10,
        pagination: {
          el: ".swiper-pagination",
          dynamicBullets: true
        }
      },
      colorSwiperOptions: {
        slidesPerView: 8,
        slidesPerColumn: 3,
        spaceBetween: 10,
        pagination: {
          el: ".swiper-pagination",
          dynamicBullets: true
        }
      },
      showTemplateTagList: false,
      showSymbolTagList: false,
      tabDesignIndex: 0,
      userSymbolCategory: 0,
      textValue: "", //添加的文本
      showCropArea: false,
      cropUrl: "", //裁剪图片路径
      templateCategoryList: [],
      templateTagList: [],
      keywordTemplate: "",
      keywordUserTemplate: "",
      symbolCategoryList: [],
      templateForm: {
        sampleCategoryId: "",
        tagId: {},
        keyword: "",
        page: 1,
        pageCount: 16,
        total: 0,
        totalPages: 1
      },
      loadingTemplate: false,
      loadingSymbol: false,
      loadingUserTemplate: false,
      loadingUserSymbol: false,
      symbolForm: {
        elementCategoryId: "",
        keyword: "",
        page: 1,
        pageCount: 16,
        total: 0,
        totalPages: 1
      },
      templateList: [],
      symbolList: [],
      textProperty: {
        radian: 1000
      },
      imageProperty: {},
      userSymbolCategoryList: [],
      userTemplateCategoryList: [],
      userTemplateList: [], //用户模板
      userSymbolList: [], //用户元素
      userTemplateForm: {
        productCategoryId: "",
        userSampleCategoryId: "",
        keyword: "",
        page: 1,
        pageCount: 16,
        total: 0,
        totalPages: 1
      },
      userSymbolForm: {
        elementCategoryId: "",
        keyword: "",
        page: 1,
        pageCount: 16,
        total: 0,
        totalPages: 1
      },
      showColorList: false,
      showColorListTime: 0,
      colorStatus: 0, // 1 代表修改文字颜色，2代表修改图片颜色
      selectedImgColor: {}, //选中的图片颜色信息
      showImgReplace: false,
      replaceTabActive: 1,
      replaceImgList: [], //元素替换列表
      replaceUserSymbolList: [],
      visibleRadianBtn: false,
      loadTemp: false,
      fabricStage: "", //画布对象
      config: {
        canvasState: [],
        currentStateIndex: -1,
        undoStatus: false,
        redoStatus: false,
        undoFinishedStatus: 1,
        redoFinishedStatus: 1,
        undoButton: false, //false表示禁用
        redoButton: false //false表示禁用
      },
      allowToHistory: true,
      selectedEle: "",
      colorData: [],
      uploadFileList: [],
      stateMask: ""
    };
  },
  watch: {
    showColorList() {
      this.showColorListTime++;
    }
  },
  computed: {
    cartTemp() {
      return this.$store.state.cartTemp;
    },
    noMoreSymbol() {
      //当起始页数大于总页数时停止加载
      return this.symbolForm.page >= this.symbolForm.totalPages;
    },
    disabledLoadSymbol() {
      return this.loadingSymbol || this.noMoreSymbol;
    },
    noMoreTemplate() {
      //当起始页数大于总页数时停止加载
      return this.templateForm.page >= this.templateForm.totalPages;
    },
    disabledLoadTemplate() {
      return this.loadingTemplate || this.noMoreTemplate;
    },

    noMoreUserTemplate() {
      //当起始页数大于总页数时停止加载
      return this.userTemplateForm.page >= this.userTemplateForm.totalPages;
    },
    disabledLoadUserTemplate() {
      return this.loadingUserTemplate || this.noMoreUserTemplate;
    },

    noMoreUserSymbol() {
      //当起始页数大于总页数时停止加载
      return this.userSymbolForm.page >= this.userSymbolForm.totalPages;
    },
    disabledLoadUserSymbol() {
      return this.loadingUserSymbol || this.noMoreUserSymbol;
    },

    canvasTextList() {
      if (!this.fabricStage) {
        return [];
      }
      let arr = this.fabricStage.getObjects(),
        newArr = [];
      arr.forEach(item => {
        if (item.type === "text" || item.type === "curved-text") {
          newArr.push(item);
        }
      });
      return newArr;
    },
    canvasImgList() {
      if (!this.fabricStage) {
        return [];
      }
      let arr = this.fabricStage.getObjects("image") || [];
      return arr;
    },
    cateName() {
      return this.$utils.decodeName(this.$route.params.categoryName);
    },
    familyList() {
      let arr = [
        "Arial",
        "Century Gothic",
        "Comic Sans MS",
        "Times New Roman",
        "Courier New",
        "Georgia",
        "Impact",
        "Hanalei Fill",
        "Oswald",
        "MedievalSharp",
        "Ruslan Display",
        "Ranga",
        "Lobster Two",
        "Pacifico",
        "Dancing Script",
        "Permanent Marker",
        "Great Vibes",
        "Roboto",
        "Timmana",
        "Anton",
        "Fjalla One",
        "Acme",
        "Francois One",
        "Palanquin Dark",
        "Righteous",
        "Concert One",
        "Courgette",
        "Kaushan Script",
        "Fredoka One",
        "Passion One",
        "Oleo Script",
        "Boogaloo",
        "Amaranth",
        "Sigmar One",
        "Chewy",
        "Fugaz One",
        "Viga"
      ];
      arr.sort((a, b) => a.localeCompare(b));
      return arr;
    }
  },
  components: {
    cropImg,
    paramsSelect
  },
  methods: {
    clearCanvas() {
      this.$confirm("Delete current design?", "Tips", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning"
      })
        .then(() => {
          let fabricStage = this.fabricStage;
          fabricStage.clear();
          this.updateCanvasShade(fabricStage);
        })
        .catch(() => {});
    },

    //完成设计
    finishedDesign() {
      let newParams = this.$refs.paramsSelect.getNewParams();
      if (!this.fabricStage.getObjects().filter(o => !o.isShade).length) {
        this.$message.warning("Your design is empty");
        return false;
      }
      let fabricStage = this.fabricStage,
        canvasInfo = this.canvasInfo,
        w = fabricStage.getWidth();
      fabricStage.clone(async canvasClone => {
        let zoom = canvasInfo.pcWidth / w;
        this.zoomIt(canvasClone, zoom);
        this.updateCanvasShade(canvasClone, "rgba(255,255,255,1)");
        let templateJson = JSON.stringify(canvasClone);
        let templateUrl = await this.upOssImg(canvasClone.toDataURL());
        let cartTempData = Object.assign({}, newParams, {
          pic_path: templateUrl,
          templateJson,
          specification: this.specification
        });
        this.$store.commit("updateCartTemp", cartTempData);
        this.$router.push({
          name: "options-params"
        });
      });
    },

    tabClick(index) {
      if (this.tabIndex === index) {
        return false;
      }
      switch (index) {
        case 2:
          if (!this.$store.state.authInfo) {
            this.$store.commit("SET_LOGINDIALOG", true);
          } else {
            this.tabIndex = index;
          }
          break;
        default:
          this.tabIndex = index;
      }
    },

    showMySymbol() {
      if (!this.$store.state.authInfo) {
        this.$store.commit("SET_LOGINDIALOG", true);
      } else {
        this.replaceTabActive = 2;
      }
    },

    changeTabDesign(index) {
      this.tabDesignIndex = index;
    },

    getSampleList({ key, name, id, type } = { type: "search" }) {
      this.showTemplateTagList = false;
      if (type === "category") {
        //重置页码,模板列表父级滚动到顶部去
        this.templateForm.page = 1;
        this.templateForm.tagId = {};
        this.templateForm.name = name;
        this.$refs.templateWrap.scrollTop = 0;
        if (name) {
          getTag({
            name: name
          }).then(res => {
            this.templateTagList = res.data;
          });
        }
      } else if (type === "search") {
        this.templateForm.page = 1;
        this.$refs.templateWrap.scrollTop = 0;
      } else if (type === "scroll") {
        //不做处理
      } else if (type === "tag") {
        this.templateForm.page = 1;
        this.$refs.templateWrap.scrollTop = 0;
        let tagId = this.templateForm.tagId;
        tagId[key] = tagId[key] ? tagId[key] : this.$set(tagId, key, "");
        if (id === 0) {
          this.$delete(tagId, key);
        } else {
          tagId[key] = {
            id,
            name
          };
        }
      }
      let tagIdArr = [];
      Object.values(this.templateForm.tagId).forEach(item => {
        tagIdArr.push(item.id);
      });
      let postData = Object.assign({}, this.templateForm, {
        tagId: tagIdArr
      });
      getSample(postData).then(res => {
        this.templateForm.total = res.data.total_number;
        this.templateForm.totalPages = res.data.total_pages;
        if (type === "scroll") {
          this.templateList = this.templateList.concat(res.data.data);
          this.loadingTemplate = false;
        } else {
          this.templateList = res.data.data;
        }
      });
    },

    getSymbolList({ id, name, type } = { type: "search" }) {
      this.showSymbolTagList = false;
      if (type === "search") {
        this.symbolForm.page = 1;
        this.$refs.symbolWrap.scrollTop = 0;
      } else if (type === "scroll") {
        //不做处理
      } else if (type === "category") {
        this.symbolForm.page = 1;
        this.$refs.symbolWrap.scrollTop = 0;
        this.symbolForm.elementCategoryId = id;
        this.symbolForm.elementCategoryName = name;
      }
      getElement({
        ...this.symbolForm
      }).then(res => {
        this.symbolForm.total = res.data.total_number;
        this.symbolForm.totalPages = res.data.total_pages;
        if (type === "scroll") {
          this.symbolList = this.symbolList.concat(res.data.data);
          this.loadingSymbol = false;
        } else {
          this.symbolList = res.data.data;
        }
      });
    },

    getUserSampleList({ type } = { type: "search" }) {
      if (type === "search") {
        this.userTemplateForm.page = 1;
        this.$refs.userTemplateWrap.scrollTop = 0;
      }
      this.userTemplateForm.product_category_name = this.cateName;
      let postData = this.userTemplateForm;
      getUserSample(postData).then(res => {
        this.userTemplateForm.total = res.data.total_number;
        this.userTemplateForm.totalPages = res.data.total_pages;
        if (type === "scroll") {
          this.userTemplateList = this.userTemplateList.concat(res.data.data);
          this.loadingUserTemplate = false;
        } else {
          this.userTemplateList = res.data.data;
        }
      });
    },

    getUserSymbolList({ type } = { type: "search" }) {
      if (type === "search") {
        this.userSymbolForm.page = 1;
        this.$refs.userSymbolWrap.scrollTop = 0;
      }
      let postData = this.userSymbolForm;
      getUserElement(postData).then(res => {
        this.userSymbolForm.total = res.data.total_number;
        this.userSymbolForm.totalPages = res.data.total_pages;
        console.log(res, type);
        if (type === "scroll") {
          console.log(1);
          this.userSymbolList = this.userSymbolList.concat(res.data.data);
          this.loadingUserSymbol = false;
        } else {
          this.userSymbolList = res.data.data;
        }
      });
    },

    loadSampleList() {
      this.loadingTemplate = true;
      this.templateForm.page++;
      this.debounceGetSampleList({
        type: "scroll"
      });
    },

    loadSymbolList() {
      this.loadingSymbol = true;
      this.symbolForm.page++;
      this.debounceGetSymbolList({
        type: "scroll"
      });
    },

    loadUserTemplateList() {
      this.loadingUserTemplate = true;
      this.userTemplateForm.page++;
      this.debounceGetUserSampleList({
        type: "scroll"
      });
    },

    loadUserSymbolList() {
      this.loadingUserSymbol = true;
      this.userSymbolForm.page++;
      this.debounceGetUserSymbolList({
        type: "scroll"
      });
    },

    deleteUserTemplate(id) {
      this.$confirm("Are you sure you want to delete it?", "Hint", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning"
      })
        .then(() => {
          deleteUserSample({
            sampleIdList: id
          }).then(res => {
            this.$message.success(res.msg);
            this.debounceGetUserSampleList();
          });
        })
        .catch(() => {});
    },

    deleteUserSymbol(id) {
      this.$confirm("Are you sure you want to delete it?", "Hint", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning"
      })
        .then(() => {
          deleteUserElement({
            elementIdList: id
          }).then(res => {
            this.$message.success(res.msg);
            this.debounceGetUserSymbolList();
          });
        })
        .catch(() => {});
    },

    changeImgColor(url, oldColor, newColor) {
      if (!oldColor) {
        this.$message.warning("Please select the color you want to replace");
        return false;
      }
      this.$utils.removeImgColor(url, newColor, dataUrl => {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
          customClass: "cus-loading"
        });
        const file = this.$utils.dataURLtoFile(dataUrl, new Date().getTime());
        let formData = new FormData();
        formData.append("photo[]", file);
        formData.append("isRandom", 1);
        formData.append("isTemp", 0);
        ossUpload(formData)
          .then(res => {
            let url = Object.values(res.data)[0];
            this.selectedEle.setSrc(
              url,
              () => {
                this.fabricStage.requestRenderAll();
                this.saveStateToHistory();
                this.analyzeImgColor(url);
              },
              {
                crossOrigin: "Anonymous"
              }
            );
          })
          .finally(() => {
            loading.close();
          });
      });
    },

    changeColor(item) {
      let colorStatus = this.colorStatus;
      if (colorStatus === 1) {
        this.changeNodeProperty("color", {
          Code: item.code,
          Pantone: item.pantone
        });
      } else if (colorStatus === 2) {
        this.changeImgColor(
          this.selectedEle.get("_element").src,
          this.selectedImgColor.color,
          item.code
        );
      }
    },

    getReplaceImgList() {
      let getUserElements = () => {
        let postData = {
          elementCategoryId: "",
          keyword: "",
          page: 1,
          pageCount: 10000,
          total: 0,
          totalPages: 1
        };
        getUserElement(postData).then(res => {
          this.replaceUserSymbolList = res.data.data;
        });
      };
      let getReplaceElement = () => {
        let postData = {
          elementCategoryId: this.selectedEle.get("element_cate_id"),
          keyword: "",
          page: 1,
          pageCount: 10000,
          total: 0,
          totalPages: 1
        };
        getElement(postData).then(res => {
          this.replaceImgList = res.data.data;
        });
      };
      getReplaceElement();
      if (this.$store.state.authInfo) {
        getUserElements();
      }
      setTimeout(() => {
        this.replaceTabActive = 1;
        this.showImgReplace = true;
        this.$nextTick(() => {
          this.$refs.userSymbolReplaceWrap.scrollTop = 0;
          this.$refs.replaceWrap.scrollTop = 0;
        });
      }, 500);
    },

    logined() {
      this.debounceGetUserSampleList();
      this.debounceGetUserSymbolList();
      if (this.saveTemplateBefore) {
        this.saveTemplate();
      }
    },

    getTextProperty(ele) {
      let obj = {};
      obj.text = ele.get("text");
      obj.angle = Math.round(ele.get("angle"));
      obj.scale = Number(Number(ele.get("scaleX")).toFixed(2));
      obj.strokeWidth = ele.get("strokeWidth");
      obj.charSpacing = ele.get("charSpacing");
      obj.lineHeight = ele.get("lineHeight");
      obj.fill = ele.get("fill");
      if (ele.type === "curved-text") {
        obj.flipped = ele.get("flipped");
        obj.radian = ele.get("radian");
      }
      obj.stroke = ele.get("stroke");
      obj.fontSize = ele.get("fontSize");
      obj.fontWeight = ele.get("fontWeight");
      obj.fontStyle = ele.get("fontStyle");
      obj.underline = ele.get("underline");
      obj.fontFamily = ele.get("fontFamily");
      this.textProperty = Object.assign({}, this.textProperty, obj);
    },

    getImageProperty(ele) {
      let obj = {};
      this.imageProperty = obj;
    },

    locationToolBar(obj, refToolOption, refDesignBody) {
      let tool = this.$refs[refToolOption],
        designBody = this.$refs[refDesignBody],
        box1 = tool.getBoundingClientRect(),
        box2 = designBody.getBoundingClientRect();

      let absCoords = this.fabricStage.getAbsoluteCoords(obj);
      let left = absCoords.left - box1.width / 2;
      let top =
        absCoords.top - box1.height - obj.getBoundingRect().height / 2 - 20;

      if (left < box2.left) {
        left = box2.left;
      } else {
        if (left > box2.width + box2.left - box1.width) {
          left = box2.width + box2.left - box1.width;
        }
      }

      if (top < box2.top) {
        top = absCoords.top + obj.getBoundingRect().height / 2 + 20;
      }

      tool.style.left = left + "px";
      tool.style.top = top + "px";
    },

    /**
     * fabricStage 画布实例
     * scale 长宽比 也就是尺寸
     *
     */
    updateCanvasShade(fabricStage, bgColor = "#d8d8d8", notShowSize = true) {
      let w = fabricStage.getWidth(),
        canvasScale = this.canvasInfo.shadeScale,
        scale = this.canvasInfo.shadeSize;
      fabricStage.controlsAboveOverlay = true;
      fabricStage.setBackgroundColor(
        "#fff",
        fabricStage.renderAll.bind(fabricStage)
      );
      //获取遮罩和裁剪信息
      let shade;
      let sizeInfo = {
        sizeW: this.sizeW,
        sizeH: this.sizeH,
        notShowSize
      };
      switch (this.styleType) {
        case "Die Cut":
          shade = dieCut(w, canvasScale, scale, bgColor, sizeInfo);
          break;
        case "Rectangle":
          shade = rectTeXiao(w, canvasScale, scale, bgColor, sizeInfo);
          break;
        case "Square":
          shade = rectTeXiao(w, canvasScale, scale, bgColor, sizeInfo);
          break;
        case "Circle":
          shade = ellipseTeXiao(w, canvasScale, scale, bgColor, sizeInfo);
          break;
        case "Oval":
          shade = ellipseTeXiao(w, canvasScale, scale, bgColor, sizeInfo);
          break;
        case "Round Corner":
          shade = roundedRectTeXiao(w, canvasScale, scale, bgColor, sizeInfo);
          break;
        default:
          shade = dieCut(w, canvasScale, scale, bgColor, sizeInfo);
      }
      this.allowToHistory = false;
      let clipPath = shade.group;
      if (fabricStage.getObjects().find(o => o.isShade)) {
        this.deleteItem(fabricStage.getObjects().find(o => o.isShade));
      }
      this.stateMask = "";
      fabricStage.add(clipPath);
      this.stateMask = clipPath;
      fabricStage.requestRenderAll();
      this.allowToHistory = true;
    },

    //初始化画布
    initFabricStage() {
      let HideControls = {
        tl: false,
        tr: false,
        bl: false,
        br: false,
        ml: false,
        mt: false,
        mr: false,
        mb: false,
        mtr: false
      };
      fabric.Object.prototype.set({
        borderColor: "#0db3e3",
        borderDashArray: [5, 5],
        borderOpacityWhenMoving: 0.5,
        cornerSize: 25,
        padding: 5,
        objectCaching: false,
        statefullCache: false,
        centeredScaling: true,
        originX: "center",
        originY: "center"
      });
      fabric.Object.prototype.setControlsVisibility(HideControls);
      fabric.Group.prototype.toObject = (function(toObject) {
        return function() {
          return fabric.util.object.extend(toObject.call(this), {
            isShade: this.isShade
          });
        };
      })(fabric.Group.prototype.toObject);
      fabric.Image.prototype.toObject = (function(toObject) {
        return function() {
          return fabric.util.object.extend(toObject.call(this), {
            element_cate_id: this.element_cate_id,
            isUserUpload: this.isUserUpload, //判断是否是用户上传的图片
            perPixelTargetFind: true
          });
        };
      })(fabric.Image.prototype.toObject);
      fabric.Canvas.prototype.getAbsoluteCoords = function(object) {
        return {
          left: object.left + this._offset.left,
          top: object.top + this._offset.top
        };
      };
      let fabricStage;

      fabricStage = this.fabricStage = new fabric.Canvas("fabricCanvas", {
        width: this.canvasInfo.mbWidth,
        height: this.canvasInfo.mbHeight,
        preserveObjectStacking: true
      });

      fabricStage.requestRenderAll();
      //初始化控制图标
      initControlIcon(fabricStage);
      //添加元素辅助线 会出现无法导出图片的bug 可以创建一个副本再导出图片
      initAligningGuidelines(fabricStage);
      initCenteringGuidelines(fabricStage);
      //初始化弯曲文本类
      initCurvedText(fabric);
      fabricStage.on("object:added", e => {
        console.log("添加");
        //当点击加载模板获取撤消重做的时候 不执行下面的方法
        if (!this.allowToHistory) {
          return false;
        }
        this.stateMask.bringToFront();
        this.selectedEle = e.target;
        fabricStage.setActiveObject(e.target);
      });
      fabricStage.on("object:removed", e => {
        console.log("删除");
        this.saveStateToHistory();
      });
      fabricStage.on("object:modified", e => {
        console.log("更改");
        this.selectedEle = e.target;
        this.saveStateToHistory();
      });
      fabricStage.on("selection:created", e => {
        console.log("创建");
        this.selectedEle = e.target;
      });
      fabricStage.on("selection:updated", e => {
        console.log("更新");
        this.selectedEle = e.target;
      });
      fabricStage.on("selection:cleared", e => {
        console.log("清除");
        this.selectedEle = "";
      });
      fabricStage.on("mouse:down", e => {
        if (e.target) {
          this.tabIndex = -1;
          this.showColorList = false;
          this.visibleRadianBtn = false;
          this.activeItem(e.target);
        } else {
          this.blurFabric();
        }
      });
    },

    analyzeImgColor: utils.debounce(function(url) {
      analyze(url, {
        scale: 0.3,
        ignore: []
      }).then(res => {
        let isOne = true; //是否是单色图
        if (res[1] && res[1].count > 100) {
          isOne = false;
        }
        this.selectedImgColor = Object.assign({}, res[0], {
          isOne
        });
      });
    }, 300),

    blurFabric(e) {
      this.tabIndex = -1;
      this.showColorList = false;
      this.visibleRadianBtn = false;
      this.fabricStage.discardActiveObject();
      this.fabricStage.requestRenderAll();
    },

    undo() {
      let _config = this.config;
      let _canvasObject = this.fabricStage;
      let stateData = _config.canvasState[_config.currentStateIndex - 1];
      if (_config.undoFinishedStatus) {
        if (_config.currentStateIndex == -1) {
          _config.undoStatus = false;
        } else {
          if (_config.canvasState.length >= 1) {
            _config.undoFinishedStatus = 0;
            if (_config.currentStateIndex != 0) {
              _config.undoStatus = true;
              this.allowToHistory = false;
              _canvasObject.loadFromJSON(stateData, () => {
                _canvasObject.requestRenderAll();
                _config.undoStatus = false;
                _config.currentStateIndex -= 1;
                _config.undoButton = true;
                if (
                  _config.currentStateIndex !==
                  _config.canvasState.length - 1
                ) {
                  _config.redoButton = true;
                }
                _config.undoFinishedStatus = 1;
                this.allowToHistory = true;
                this.stateMask.bringToFront();
              });
            } else if (_config.currentStateIndex == 0) {
              // _canvasObject.clear();
              _config.undoFinishedStatus = 1;
              _config.undoButton = false;
              _config.redoButton = true;
              // _config.currentStateIndex -= 1;
            }
          }
        }
      }
    },

    redo() {
      let _config = this.config;
      let _canvasObject = this.fabricStage;
      let stateData = _config.canvasState[_config.currentStateIndex + 1];
      if (_config.redoFinishedStatus) {
        if (
          _config.currentStateIndex == _config.canvasState.length - 1 &&
          _config.currentStateIndex != -1
        ) {
          _config.redoButton = false;
        } else {
          if (
            _config.canvasState.length > _config.currentStateIndex &&
            _config.canvasState.length != 0
          ) {
            _config.redoFinishedStatus = 0;
            _config.redoStatus = true;
            this.allowToHistory = false;
            _canvasObject.loadFromJSON(stateData, () => {
              this.allowToHistory = true;
              _canvasObject.requestRenderAll();
              _config.redoStatus = false;
              _config.currentStateIndex += 1;
              if (_config.currentStateIndex != -1) {
                _config.undoButton = true;
              }
              _config.redoFinishedStatus = 1;
              if (
                _config.currentStateIndex == _config.canvasState.length - 1 &&
                _config.currentStateIndex != -1
              ) {
                _config.redoButton = false;
              }
              this.stateMask.bringToFront();
            });
          }
        }
      }
    },

    saveStateToHistory: utils.debounce(function() {
      console.log("触发保存");
      let _config = this.config;
      let _canvasObject = this.fabricStage;
      if (_config.undoStatus == false && _config.redoStatus == false) {
        let state = _canvasObject.toObject();
        if (_config.currentStateIndex < _config.canvasState.length - 1) {
          let indexToBeInserted = _config.currentStateIndex + 1;
          _config.canvasState[indexToBeInserted] = state;
          let numberOfElementsToRetain = indexToBeInserted + 1;
          _config.canvasState = _config.canvasState.splice(
            0,
            numberOfElementsToRetain
          );
        } else {
          _config.canvasState.push(state);
        }
        _config.currentStateIndex = _config.canvasState.length - 1;
        _config.undoButton = true;
        if (
          _config.currentStateIndex == _config.canvasState.length - 1 &&
          _config.currentStateIndex != -1
        ) {
          _config.redoButton = false;
        }
      }
      if (_config.canvasState.length > 20) {
        _config.canvasState.splice(0, 1);
        _config.currentStateIndex = _config.canvasState.length - 1;
      }
    }, 500),

    editText(text) {
      this.$prompt("", "Edit Text", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        inputValue: text
      })
        .then(({ value }) => {
          this.changeNodeProperty("text", value);
        })
        .catch(() => {});
    },

    changeNodeProperty(propertyName, value = 0) {
      let fabricStage = this.fabricStage,
        node = this.selectedEle;
      if (!node) {
        return false;
      }
      switch (propertyName) {
        case "text":
          if (!value) return false;
          node.set({
            statefullCache: true
          });
          node.set("text", value);
          setTimeout(() => {
            node.set({
              statefullCache: false
            });
          });
          break;
        case "angle":
          node.rotate(value).setCoords();
          break;
        case "strokeWidth":
          node.set("strokeWidth", value);
          break;
        case "scale":
          node
            .set({
              scaleX: value,
              scaleY: value
            })
            .setCoords();
          break;
        case "lineHeight":
          node.set({
            lineHeight: value
          });
          break;
        case "radian":
          node
            .set({
              radian: value
            })
            .setCoords();
          break;
        case "charSpacing":
          node.set("charSpacing", value);
          break;
        case "flipped":
          node.set("flipped", value);
          break;
        case "color":
          node.set("fill", value.Code);
          break;
        case "stroke":
          if (value.Code) {
            this.addToHistory("stroke", value, this.strokeHistory);
          }
          node.set("stroke", value.Code);
          break;
        case "fontFamily":
          node.set("fontFamily", value);
          break;
        case "fontSize":
          node.set("fontSize", value);
          break;
        case "fontWeight":
          node.get("fontWeight") === "normal"
            ? node.set("fontWeight", "bold")
            : node.set("fontWeight", "normal");
          break;
        case "fontStyle":
          node.get("fontStyle") === "italic"
            ? node.set("fontStyle", "normal")
            : node.set("fontStyle", "italic");
          break;
        case "underline":
          node.set("underline", !node.get("underline"));
          break;
        case "textAlign":
          node.set("textAlign", value);
          break;
        case "up":
          node.bringForward();
          break;
        case "down":
          node.sendBackwards();
          break;
        case "flipX":
          node.get("flipX")
            ? node.set("flipX", false)
            : node.set("flipX", true);
          break;
        case "flipY":
          node.get("flipY")
            ? node.set("flipY", false)
            : node.set("flipY", true);
          break;
        case "shadow":
          let offsetX = value.shadowOffsetX,
            offsetY = value.shadowOffsetY,
            blur = value.shadowBlur,
            transparency = value.shadowTransparency / 100;
          node.setShadow(
            `${offsetX}px ${offsetY}px ${blur}px rgba(0,0,0,${transparency})`
          );
          break;
      }
      this.fabricStage.requestRenderAll();
      this.getTextProperty(node);
    },

    //添加文字
    addText(val, type) {
      let textValue = val || "CustomText",
        w = this.fabricStage.getWidth(),
        h = this.fabricStage.getHeight();
      this.textValue = "";
      switch (type) {
        case "text":
          let Text = new fabric.Text(textValue, {
            fontSize: 60, // 字体大小
            fill: "#000000" // 字体颜色
          });
          this.fabricStage.add(Text);
          this.fabricStage.requestRenderAll();
          this.$nextTick(() => {
            Text.set("left", w / 2).setCoords();
            Text.set("top", h / 2).setCoords();
            this.getTextProperty(Text);
            Text.on("moved", () => {
              this.locationToolBar(Text, "textOption", "designBody");
            });
            Text.on("scaled", () => {
              this.locationToolBar(Text, "textOption", "designBody");
            });
            Text.on("rotated", () => {
              this.locationToolBar(Text, "textOption", "designBody");
            });
            this.locationToolBar(Text, "textOption", "designBody");
          });
          break;
        case "curvedText":
          let CurvedText = new fabric.CurvedText(textValue, {
            radian: 1000,
            fontSize: 120, // 字体大小
            fill: "#000000", // 字体颜色
            flipped: false
          });
          CurvedText.scale(0.4).setCoords();
          this.fabricStage.add(CurvedText);
          this.fabricStage.requestRenderAll();
          this.$nextTick(() => {
            CurvedText.set("left", w / 2).setCoords();
            CurvedText.set("top", h / 2).setCoords();
            this.getTextProperty(CurvedText);
            CurvedText.on("moved", () => {
              this.locationToolBar(CurvedText, "textOption", "designBody");
            });
            CurvedText.on("scaled", () => {
              this.locationToolBar(CurvedText, "textOption", "designBody");
            });
            CurvedText.on("rotated", () => {
              this.locationToolBar(CurvedText, "textOption", "designBody");
            });
            this.locationToolBar(CurvedText, "textOption", "designBody");
          });
          break;
      }
      this.tabIndex = -1;
      this.saveStateToHistory();
    },

    upOssImg(file) {
      return new Promise(resolve => {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
          customClass: "cus-loading"
        });
        let formData = new FormData();
        if (typeof file === "string") {
          file = this.$utils.dataURLtoFile(file, new Date().getTime());
        }
        formData.append("photo[]", file);
        formData.append("isRandom", 1);
        formData.append("isTemp", 0);
        ossUpload(formData)
          .then(res => {
            let picArr = Object.values(res.data);
            resolve(picArr[0]);
          })
          .finally(() => {
            loading.close();
          });
      });
    },

    beforeUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10;
      const isUploadType = /\.(gif|jpg|jpeg|png|svg|psd|pdf|bmp|ai|)$/.test(
        file.name.toLowerCase()
      );
      if (!isLt10M) {
        this.$message.error(
          "The size of the uploaded profile picture should not exceed 10MB!"
        );
        return isLt10M;
      }
      if (!isUploadType) {
        this.$message.error("Error uploading file type");
        return isUploadType;
      }
    },

    uploadOnChange(file, fileList) {
      this.$nextTick(() => {
        if (fileList.length) {
          let reader = new FileReader();
          reader.readAsDataURL(fileList[0].raw);
          reader.onload = async e => {
            let src;
            if (/\.(gif|jpg|jpeg|png|svg|bmp)$/.test(file.name.toLowerCase())) {
              src = e.target.result;
            } else if (/\.(pdf|ai)$/.test(file.name.toLowerCase())) {
              src = await this.$utils.pdfToImg(e.target.result);
            } else if (/\.(psd)/.test(file.name.toLowerCase())) {
              let PSD = require("psd.js");
              let psd = await PSD.fromURL(e.target.result);
              src = psd.image.toBase64();
            }
            this.showCropArea = true;
            this.cropUrl = src;
            this.$refs.uploadBox1.clearFiles();
            this.$refs.uploadBox2.clearFiles();
            this.$refs.uploadBox3.clearFiles();
            this.$refs.uploadBox4.clearFiles();
            this.$refs.uploadBox5.clearFiles();
          };
        }
      });
    },

    //uploadUserSymbolBox
    uploadUserSymbolOnChange(file, fileList) {
      this.$nextTick(async () => {
        if (fileList.length) {
          let url = await this.upOssImg(fileList[0].raw);
          editUserElement({
            element_name: fileList[0].raw.name,
            url
          }).then(res => {
            this.$message.success(res.msg);
            this.debounceGetUserSymbolList();
          });
          this.$refs.uploadUserSymbolBox1.clearFiles();
          this.$refs.uploadUserSymbolBox2.clearFiles();
        }
      });
    },

    //添加裁剪图片
    addCropImg(url) {
      let data = {
        src: url,
        isUserUpload: true
      };
      let selectedEle = this.fabricStage.getActiveObject();
      if (!selectedEle || selectedEle.get("type") !== "image") {
        this.addImg(data);
      } else {
        this.replaceImg(data);
      }
      this.showImgReplace = false;
    },

    //添加元素图片
    addEleImg(item, type) {
      let data = {
        src: item.url,
        element_cate_id: item.element_cate_id,
        isUserUpload: type === "public" ? false : true
      };
      let selectedEle = this.fabricStage.getActiveObject();
      if (!selectedEle || selectedEle.get("type") !== "image") {
        this.addImg(data);
      } else {
        this.replaceImg(data);
      }
    },

    //替换元素图片
    replaceEleImg(item, type) {
      if (type === "public") {
        this.replaceImg({
          src: item.url,
          isUserUpload: false,
          element_cate_id: item.element_cate_id
        });
      } else if (type === "private") {
        this.replaceImg({
          src: item.url,
          isUserUpload: true,
          element_cate_id: 0
        });
      }
      this.showImgReplace = false;
    },

    replaceImg({ element_cate_id = 0, src, isUserUpload = false } = {}) {
      src = this.$utils.urlAddVersion(src);
      let fabricStage = this.fabricStage,
        selectedEle = this.selectedEle,
        sw = selectedEle.width * selectedEle.scaleX,
        sh = selectedEle.height * selectedEle.scaleY;
      let img = new Image(),
        ow,
        oh,
        scale,
        top,
        left;
      img.src = src;
      img.onload = () => {
        ow = img.width;
        oh = img.height;
        scale = Math.sqrt((sw * sw + sh * sh) / (ow * ow + oh * oh));
        top = sh - oh * scale;
        left = sw - ow * scale;
        src = this.$utils.urlAddVersion(src);
        selectedEle.setSrc(
          src,
          () => {
            selectedEle
              .set({
                scaleX: scale,
                scaleY: scale,
                top: selectedEle.top,
                left: selectedEle.left,
                isUserUpload,
                element_cate_id
              })
              .setCoords();
            fabricStage.requestRenderAll();
            this.locationToolBar(selectedEle, "imgOption", "designBody");
            //如果不是用户上传的图 识别图片颜色
            if (!isUserUpload) {
              this.analyzeImgColor(src);
            }
            this.saveStateToHistory();
            this.tabIndex = -1;
          },
          {
            crossOrigin: "Anonymous"
          }
        );
      };
    },

    //添加图片
    addImg({ element_cate_id = 0, src, isUserUpload = false } = {}) {
      src = this.$utils.urlAddVersion(src);
      let w = this.fabricStage.getWidth(),
        h = this.fabricStage.getHeight();
      fabric.Image.fromURL(
        src,
        img => {
          img.set({
            perPixelTargetFind: true,
            isUserUpload,
            element_cate_id
          });
          let scale =
            img.width >= img.height
              ? (w * 0.5) / img.width
              : (h * 0.5) / img.height;
          img.scale(scale).setCoords();
          this.fabricStage.add(img);
          this.$nextTick(() => {
            img.set("left", w / 2).setCoords();
            img.set("top", h / 2).setCoords();
            this.getImageProperty(img);
            img.on("moved", () => {
              this.locationToolBar(img, "imgOption", "designBody");
            });
            img.on("scaled", () => {
              this.locationToolBar(img, "imgOption", "designBody");
            });
            img.on("rotated", () => {
              this.locationToolBar(img, "imgOption", "designBody");
            });
            this.locationToolBar(img, "imgOption", "designBody");
            this.analyzeImgColor(src);
          });
          this.fabricStage.requestRenderAll();
          this.saveStateToHistory();
          this.tabIndex = -1;
        },
        {
          crossOrigin: "Anonymous"
        }
      );
    },

    lockItem(item) {
      item.selectable = !item.selectable;
      item.evented = !item.evented;

      if (!item.selectable) {
        this.fabricStage.discardActiveObject(item);
      } else {
        this.fabricStage.setActiveObject(item);
      }
      this.fabricStage.requestRenderAll();
      this.$forceUpdate();
    },

    activeItem(item) {
      let fabricStage = this.fabricStage;
      fabricStage.setActiveObject(item);
      fabricStage.requestRenderAll();
      if (item.type === "text" || item.type === "curved-text") {
        this.getTextProperty(item);
        setTimeout(() => {
          this.locationToolBar(item, "textOption", "designBody");
        }, 250);
      } else if (item.type === "image") {
        this.getImageProperty(item);
        setTimeout(() => {
          this.locationToolBar(item, "imgOption", "designBody");
        }, 250);
        this.analyzeImgColor(item.get("_element").src);
      }
    },

    deleteItemBefore(item, type) {
      let tipMsg =
        type === "text" ? "Delete current text?" : "Delete current symbol?";
      this.$confirm(tipMsg, "Hint", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning"
      })
        .then(() => {
          this.deleteItem(item);
        })
        .catch(() => {});
    },

    loadTemplate(json) {
      let fabricStage = this.fabricStage;
      this.allowToHistory = false;
      this.loadTemp = true;
      fabricStage.loadFromJSON(json, () => {
        fabricStage.requestRenderAll();
        fabricStage.setWidth(this.canvasInfo.pcWidth);
        fabricStage.setHeight(this.canvasInfo.pcWidth);
        let zoom = this.canvasInfo.mbWidth / this.canvasInfo.pcWidth;
        this.zoomIt(fabricStage, zoom);
        this.updateCanvasShade(fabricStage);
        this.saveStateToHistory();
        this.loadTemp = false;
        this.allowToHistory = true;
      });
    },

    zoomIt(canvas, factor) {
      // factor： 比例
      let cWidth = canvas.width;
      canvas.setWidth(cWidth * factor);
      canvas.setHeight(cWidth * factor);
      if (canvas.backgroundImage) {
        let bi = canvas.backgroundImage;
        bi.width = bi.width * factor;
        bi.height = bi.height * factor;
      }
      let objects = canvas.getObjects();
      for (let i in objects) {
        var scaleX = objects[i].scaleX;
        var scaleY = objects[i].scaleY;
        var left = objects[i].left;
        var top = objects[i].top;

        var tempScaleX = scaleX * factor;
        var tempScaleY = scaleY * factor;
        var tempLeft = left * factor;
        var tempTop = top * factor;

        objects[i].scaleX = tempScaleX;
        objects[i].scaleY = tempScaleY;
        objects[i].left = tempLeft;
        objects[i].top = tempTop;

        objects[i].setCoords();
      }
      canvas.renderAll();
      canvas.calcOffset();
    },

    saveTemplate() {
      if (!this.fabricStage.getObjects().filter(o => !o.isShade).length) {
        this.$message.warning("Your design is empty");
        return false;
      }
      //尺寸和形状校验
      let specification = this.$refs.paramsSelect.getSpecification();
      console.log(specification);
      if (!specification) {
        this.$message.warning("wrong size");
        return false;
      }
      if (this.$store.state.authInfo) {
        this.saveTemplateBefore = false;
        this.$prompt("Please enter a name of your design.", "Tips", {
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
          inputPattern: /\S/,
          inputErrorMessage: "The name cannot be empty"
        })
          .then(({ value }) => {
            let fabricStage = this.fabricStage,
              canvasInfo = this.canvasInfo,
              w = fabricStage.getWidth(),
              h = fabricStage.getHeight();
            fabricStage.clone(async canvasClone => {
              let zoom = canvasInfo.pcWidth / w;
              this.zoomIt(canvasClone, zoom);
              this.updateCanvasShade(canvasClone, "rgba(255,255,255,1)");
              let templateJson = JSON.stringify(canvasClone);
              let templateUrl = await this.upOssImg(canvasClone.toDataURL());
              editUserSample({
                sample_id: "",
                product_category_name: this.cateName,
                user_sample_category_id: "",
                sample_data: templateJson,
                pic_path: templateUrl,
                sample_name: value,
                specification: JSON.stringify(specification)
              }).then(res => {
                this.$message.success(res.msg);
                this.debounceGetUserSampleList();
              });
            });
          })
          .catch(() => {
            console.log("取消保存");
          });
      } else {
        this.saveTemplateBefore = true;
        this.$store.commit("SET_LOGINDIALOG", true);
      }
    },

    //用户分享模板
    shareTemplate() {
      if (!this.fabricStage.getObjects().filter(o => !o.isShade).length) {
        this.$message.warning("Your design is empty");
        return false;
      }
      //尺寸和形状校验
      let specification = this.$refs.paramsSelect.getSpecification();
      if (!specification) {
        this.$message.warning("wrong size");
        return false;
      }
      let fabricStage = this.fabricStage;
      fabricStage.clone(async canvasClone => {
        let zoom = this.canvasInfo.pcWidth / fabricStage.getWidth();
        this.zoomIt(canvasClone, zoom);
        this.updateCanvasShade(canvasClone, "rgba(255,255,255,1)");
        let newParams = this.$refs.paramsSelect.getNewParams();
        let templateJson = JSON.stringify(canvasClone);
        let templateUrl = await this.upOssImg(canvasClone.toDataURL());
        let cartTempData = Object.assign({}, newParams, {
          pic_path: templateUrl,
          templateJson,
          specification: this.specification
        });
        this.shareImg = templateUrl;
        console.log(cartTempData);

        console.log(this.$route.params);

        shareUserSample({
          product_category_id: sessionStorage.getItem("product_category_id"),
          pic_path: templateUrl,
          sample_data: templateJson,
          param: JSON.stringify(cartTempData)
        }).then(res => {
          this.showShareTemplate = true;
          this.shareUrl = `https://www.customsticker.com/create-your-own-stickers/${this.$route.params.categoryName}?shareName=${res.data}`;
        });
      });
    },

    // 点击复制分享链接
    copyShareUrl() {
      let clipboard = new Clipboard(".share-copy", {
        text: () => this.shareUrl
      });
      clipboard.on("success", e => {
        this.$message.success("Copy succeeded");
        clipboard.destroy(); // 释放内存
      });
      clipboard.on("error", e => {
        this.$message.warning("The browser does not support automatic copying");
        clipboard.destroy();
      });
    },

    //加载模板
    selectTemplate({ id, type }) {
      let beforeFn = () => {
        if (this.cateName !== this.templateForm.name) {
          this.$confirm(
            "The template's category is different from the one you selected, are you sure to change the customization options and replace your current design with this template?",
            "Hint",
            {
              confirmButtonText: "Confirm",
              cancelButtonText: "Cancel",
              type: "warning"
            }
          )
            .then(() => {
              loadFn();
            })
            .catch(() => {});
        } else {
          if (this.fabricStage.getObjects().filter(o => !o.isShade).length) {
            this.$confirm(
              "Are you sure you want to replace your design with our template?",
              "Hint",
              {
                confirmButtonText: "Confirm",
                cancelButtonText: "Cancel",
                type: "warning"
              }
            )
              .then(() => {
                loadFn();
              })
              .catch(() => {});
          } else {
            loadFn();
          }
        }
      };
      let loadFn = () => {
        this.tabIndex = -1;
        let optionsFn = res => {
          let specification = (this.specification = JSON.parse(
            res.data.specification
          ));
          if (!specification.shape) {
            specification.shape = this.styleType;
          }
          let fabricStage = this.fabricStage;
          this.sizeW = specification.width;
          this.sizeH = specification.height;
          this.styleType = specification.shape;
          this.$refs.paramsSelect.setShapeAndSize(
            Object.assign({}, specification, {
              id: res.data.product_category_id,
              tempId: id,
              type
            })
          );
          this.canvasInfo.shadeSize =
            specification.width / specification.height;
          this.updateCanvasShade(fabricStage);
          try {
            this.loadTemplate(JSON.parse(res.data.sample_data));
          } catch {
            console.log("模板数据错误");
          }
        };
        this.loadTemp = true;
        let load = id => {
          if (type === "public") {
            return getSampleInfo({
              id
            });
          } else {
            return getUserSampleInfo({
              id
            });
          }
        };
        //获取模板信息
        load(id)
          .then(res => {
            optionsFn(res);
          })
          .finally(() => {
            this.loadTemp = false;
          });
      };
      beforeFn();
    },

    hideChat() {
      let d = document.createElement("style");
      d.setAttribute("type", "text/css");
      d.innerHTML = "#comm100-container { display: none }";
      document.getElementsByTagName("head")[0].appendChild(d);
    },

    deleteItem(selectedEle) {
      let fabricStage = this.fabricStage;
      if (selectedEle.type === "activeSelection") {
        let findItem = selectedEle._objects.find(item => {
          return item.get("IsMain") == 1;
        });
        if (findItem) {
          this.$message.warning(
            "The template cannot be removed, please replace it with a new one."
          );
          return false;
        } else {
          selectedEle.fabricStage = fabricStage;
          selectedEle.forEachObject(function(obj) {
            fabricStage.remove(obj);
          });
          selectedEle.setCoords();
        }
      } else {
        fabricStage.remove(selectedEle);
      }
    },

    copyItem() {
      fb.copy(this.fabricStage);
    },

    changeSize({ sizeW, sizeH }) {
      this.canvasInfo.shadeSize = sizeW / sizeH;
      this.sizeW = sizeW;
      this.sizeH = sizeH;
      this.updateCanvasShade(this.fabricStage);
    },

    changeShape(val) {
      this.styleType = val;
      this.updateCanvasShade(this.fabricStage);
    },

    initDesignSystem() {
      let designBody = this.$refs.designBody;
      this.canvasInfo.mbWidth = this.canvasInfo.mbHeight =
        designBody.offsetWidth > designBody.offsetHeight
          ? designBody.offsetHeight
          : designBody.offsetWidth;
      this.initFabricStage();
    }
  },
  created() {
    getColorData().then(res => {
      this.colorData = res.data;
    });
    getSameLevelProduct({
      product_category_name: this.cateName
    }).then(res => {
      this.categoryList = res.data;
    });
  },

  mounted() {
    if (sessionStorage.getItem("changeCategory") || this.$route.query.shareName) {
      this.tabIndex = -1;
      sessionStorage.removeItem("changeCategory");
    }
    this.$Bus.$on("logined", e => {
      this.logined();
    });
    this.hideChat(); //设计系统隐藏聊天框
    this.initDesignSystem(); //初始化设计系统
    getTag({
      name: this.cateName
    }).then(res => {
      this.templateTagList = res.data;
    });
    getElementCategory().then(res => {
      this.symbolCategoryList = res.data;
    });
    this.templateForm.name = this.cateName;
    this.debounceGetSampleList = this.$utils.debounce(this.getSampleList, 300);
    this.debounceGetSampleList();
    this.debounceGetSymbolList = this.$utils.debounce(this.getSymbolList, 300);
    this.debounceGetSymbolList();
    this.debounceGetUserSampleList = this.$utils.debounce(
      this.getUserSampleList,
      300
    );
    this.debounceGetUserSymbolList = this.$utils.debounce(
      this.getUserSymbolList,
      300
    );

    if (this.$store.state.authInfo) {
      this.debounceGetUserSampleList();
      this.debounceGetUserSymbolList();
    }
  },
  beforeDestroy() {
    this.$Bus.$off("logined");
    sessionStorage.removeItem("beforeRouteName");
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/animate.css";

.designSystemWrap {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - (118rem / 75));
  background: #fff;
  font-size: 16px;

  .paramDialog .dialog-model-con {
    height: 85vh;
  }

  .deleteIcon {
    @include px2rem(width, 36px);
    @include px2rem(height, 32px);
  }

  .border-20 {
    border-radius: 20px;

    /deep/ .el-input__inner {
      border-radius: 20px;
    }
  }

  .bg-transparent {
    background: url("../../static/images/transparentBg.png");
  }

  #text-option {
    position: fixed;
    left: 0;
    top: 100px;
    @include px2rem(width, 722px);
    @include px2rem(height, 208px);
    @include px2rem(padding, 20px);
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid #b5b5b5;
    border-radius: 2px;
    z-index: 1;
    user-select: none;
    @include px2rem(font-size, 36px);

    .top {
      @include px2rem(margin-bottom, 15px);
    }

    .fontSelect {
      flex-shrink: 0;
      @include px2rem(width, 378px);
      @include px2rem(height, 79px);

      /deep/ {
        .el-input,
        .el-input__inner {
          width: 100%;
          height: 100%;
          @include px2rem(font-size, 36px);
          @include px2rem(line-height, 79px);
          background-color: #3797d9;
          color: #fff;
          border: none;
          border-radius: 2px;
        }

        .el-input__inner {
          @include px2rem(padding-right, 45px);
        }

        .el-select__caret {
          @include px2rem(width, 40px);
          @include px2rem(font-size, 36px);
          @include px2rem(line-height, 79px);
          color: #fff;
        }
      }
    }

    .fontSizeSelect {
      flex-shrink: 0;
      @include px2rem(width, 167px);
      @include px2rem(height, 79px);

      /deep/ {
        .el-input,
        .el-input__inner {
          width: 100%;
          height: 100%;
          @include px2rem(font-size, 36px);
          @include px2rem(line-height, 79px);
          border-radius: 2px;
          background-color: #fff;
          color: #333;
          border: none;
        }

        .el-input__inner {
          @include px2rem(padding-right, 45px);
        }

        .el-select__caret {
          @include px2rem(width, 40px);
          @include px2rem(font-size, 36px);
          @include px2rem(line-height, 79px);
          color: #333;
        }
      }
    }

    .fontCurvedSelect {
      flex-shrink: 0;
      @include px2rem(width, 167px);
      @include px2rem(height, 79px);
      background-color: #fff;
      @include px2rem(font-size, 32px);
      padding: 0;
      text-align: center;
      color: #333;
    }

    .color-text {
      flex-shrink: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      border: 2px solid $primary;
      @include px2rem(width, 79px);
      @include px2rem(height, 79px);
      color: $primary;
      border-radius: 2px;
      @include px2rem(font-size, 24px);

      .thumb {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 10px;
        height: 10px;
        background: #000;

        &::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 0;
          height: 0;
          border-top: 3px solid #fff;
          border-right: 3px solid transparent;
          border-left: 3px solid transparent;
        }
      }
    }

    .editText {
      flex-shrink: 0;
      @include px2rem(width, 262px);
      @include px2rem(height, 79px);
      background-color: #3797d9;
      @include px2rem(font-size, 36px);
    }

    .btnText {
      display: flex;
      align-items: center;
      justify-content: center;
      @include px2rem(width, 79px);
      @include px2rem(height, 79px);
      border-radius: 2px;
      background-color: #3797d9;
      @include px2rem(font-size, 36px);
      color: #fff;
    }

    .btnText.active {
      background-color: #fff;
      color: $primary;
    }

    .btnCopy {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      @include px2rem(font-size, 24px);

      img {
        @include px2rem(width, 44px);
      }
    }
  }

  #img-option {
    position: fixed;
    left: 0;
    top: 100px;
    @include px2rem(width, 521px);
    @include px2rem(height, 110px);
    @include px2rem(padding, 20px);
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid #b5b5b5;
    border-radius: 2px;
    z-index: 1;
    user-select: none;

    .top {
      height: 100%;
    }

    .replaceBtn {
      flex-shrink: 0;
      @include px2rem(width, 262px);
      @include px2rem(height, 79px);
      background-color: #3797d9;
      @include px2rem(font-size, 36px);

      img {
        @include px2rem(width, 44px);
      }
    }

    .color-text {
      flex-shrink: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      border: 2px solid $primary;
      @include px2rem(width, 79px);
      @include px2rem(height, 79px);
      color: $primary;
      border-radius: 2px;
      @include px2rem(font-size, 24px);

      .thumb {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 10px;
        height: 10px;
        background: #000;

        &::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 0;
          height: 0;
          border-top: 3px solid #fff;
          border-right: 3px solid transparent;
          border-left: 3px solid transparent;
        }
      }
    }

    .btnText {
      display: flex;
      align-items: center;
      justify-content: center;
      @include px2rem(width, 79px);
      @include px2rem(height, 79px);
      border-radius: 2px;
      background-color: #3797d9;
      @include px2rem(font-size, 36px);
      color: #fff;
    }

    .btnText.active {
      background-color: #fff;
      color: $primary;
    }

    .btnCopy {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      @include px2rem(font-size, 24px);

      img {
        @include px2rem(width, 44px);
      }
    }
  }

  #img-option.hiddenColor {
    @include px2rem(width, 400px);
  }

  .colorWrap {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border-top: 2px solid #ccc;
    z-index: 1001;
    user-select: none;

    .color-item {
      position: relative;
      width: 100%;
      padding-bottom: 100%;
    }

    .tips {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      color: #fff;
      z-index: 1;
    }
  }

  .imgReplaceWrap {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    z-index: 1001;

    .delete {
      position: absolute;
      bottom: 0;
      right: 0;
    }

    .top {
      @include px2rem(height, 80px);
      line-height: 1;
      border-bottom: 1px solid #ccc;

      span {
        z-index: 1;
      }

      .top-text {
        position: relative;
        bottom: -2px;
        border-bottom: 3px solid transparent;
        z-index: 1;
        @include px2rem(font-size, 32px);
      }

      .top-text.active {
        color: $dark;
        border-color: #333;
      }
    }

    .el-button {
      @include px2rem(width, 368px);
      @include px2rem(height, 92px);
      @include px2rem(border-radius, 5px);
      @include px2rem(font-size, 32px);
    }

    .tips {
      @include px2rem(font-size, 24px);
    }
  }

  .designBody {
    background: #d8d8d8;

    .fabric-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      background: #d8d8d8;
    }
  }

  .undoAndRedo {
    img {
      @include px2rem(width, 50px);
      @include px2rem(height, 50px);
    }

    img.clear {
      @include px2rem(width, 60px);
      @include px2rem(height, 60px);
    }

    .disabled {
      color: #ccc;
      cursor: not-allowed;
      opacity: 0.5;

      &::before {
        content: "";
        position: absolute;
        top: -5px;
        right: -5px;
        left: -5px;
        bottom: -5px;
      }
    }
  }

  .uploader /deep/ .el-upload {
    display: block;
    width: 100%;
    height: 100%;
  }

  .designContent {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;

    .title {
      @include px2rem(height, 100px);

      .btn {
        @include px2rem(width, 160px);
        @include px2rem(height, 52px);
        @include px2rem(line-height, 52px);
        @include px2rem(font-size, 28px);
        padding: 0;
      }
    }

    .content {
      flex: 1;
    }
  }

  .toolBar {
    width: 100%;
    @include px2rem(font-size, 24px);
    @include px2rem(height, 120px);
    border: 1px solid #aeaeae;
    z-index: 1000;

    img {
      @include px2rem(width, 43px);
      @include px2rem(height, 43px);
    }
  }

  .toolBar li.active {
    background-color: $primary;
    color: #fff;
  }

  .shareTemplateWrap {
    padding: 20px 11px;
    border-radius: 17px;
    @include px2rem(width, 710px);

    .share-img {
      @include px2rem(width, 453px);
      @include px2rem(height, 453px);
    }

    .share-title {
      margin-top: 20px;
      font-weight: bold;
      @include px2rem(font-size, 36px);
    }

    .share-sub-title {
      margin: 20px 0;
      font-weight: 400;
      @include px2rem(font-size, 32px);
    }

    .share-link-box {
      align-items: center;
      justify-content: space-between;

      .share-link {
        padding: 0 12px;
        border-radius: 5px;
        background: #e2e9ff;
        @include px2rem(width, 440px);
        @include px2rem(font-size, 32px);
        @include px2rem(line-height, 77px);
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      .share-copy {
        padding: 0;
        color: white;
        font-weight: bold;
        border-radius: 5px;
        background: #01a0de;
        @include px2rem(width, 216px);
        @include px2rem(height, 77px);
        @include px2rem(font-size, 32px);
      }
    }

    .share-other-line {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 20px 10px;
      &::before,
      &::after {
        content: "";
        @include px2rem(width, 280px);
        border-bottom: 1px solid #dadada;
      }
    }

    .share-other-box {
      margin: 0 10px;
      justify-content: space-between;
      a {
        border-radius: 8px;
        border: 1px solid #c9d5e1;
        @include px2rem(width, 200px);
        @include px2rem(height, 70px);
        @include px2rem(font-size, 36px);
        @include px2rem(line-height, 70px);
        &:hover {
          color: white;
        }
      }

      .share-btn-facebook {
        color: #43609b;
        &:hover {
          background: #43609b;
        }
      }

      .share-btn-twitter {
        color: #56acec;
        &:hover {
          background: #56acec;
        }
      }

      .share-btn-pinterest {
        color: #d53831;
        &:hover {
          background: #d53831;
        }
      }
    }

    .close-dialog {
      border-radius: 50%;
      background-color: #333333;
      @include px2rem(width, 42px);
      @include px2rem(height, 42px);
      box-shadow: -1px 3px 3px 0px rgba(0, 0, 0, 0.4);
      position: absolute;
      top: -10px;
      right: 0;

      i {
        color: white;
        @include px2rem(font-size, 48px);
        transform: translate(-2px, -1px);
      }
    }
  }

  .tab-content.con0,
  .tab-content.con1,
  .tab-content.con2 {
    top: 0;
  }

  .tab-content {
    position: absolute;
    bottom: px2rem(120px);
    left: 0;
    right: 0;
    z-index: 999;

    .tab-item {
      position: absolute;
      bottom: 0;
      right: 0;
      left: 0;
      background: #ebebeb;
    }

    .tab-templates,
    .tab-symbol {
      top: 0;
      box-shadow: 0 -6px 4px -4px rgba(0, 0, 0, 0.15) inset;

      .top {
        @include px2rem(height, 113px);

        .filter {
          svg {
            @include px2rem(font-size, 36px);
          }

          span {
            @include px2rem(font-size, 24px);
          }
        }

        .el-input {
          @include px2rem(width, 511px);
          @include px2rem(height, 66px);
          @include px2rem(font-size, 24px);

          /deep/ .el-input__inner {
            height: 100%;
            @include px2rem(padding-right, 40px);
            @include px2rem(border-radius, 33px);
          }

          /deep/ .el-input__suffix-inner {
            .el-input__icon {
              @include px2rem(width, 40px);
            }

            i {
              @include px2rem(font-size, 30px);
              @include px2rem(line-height, 66px);
              color: $primary;
            }
          }
        }

        .closeIcon i {
          @include px2rem(font-size, 36px);
          font-weight: 700;
        }
      }

      .content {
        position: relative;
        height: calc(100% - (113rem / 75));

        .load {
          display: block !important;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: rgba(255, 255, 255, 0.25);
          @include px2rem(height, 40px);
          @include px2rem(line-height, 40px);
        }

        ul {
          overflow: auto;
          max-height: 100%;
        }
      }

      .zhezhao1 {
        position: absolute;
        left: 16.666667%;
        right: 0;
        top: 0;
        @include px2rem(height, 113px);
        background: rgba(0, 0, 0, 0.45);
      }

      .zhezhao2 {
        position: absolute;
        left: 0;
        bottom: 0;
        @include px2rem(top, 113px);
        right: 0;
        background: rgba(0, 0, 0, 0.45);
      }

      .tagList {
        position: absolute;
        left: 0;
        bottom: 0;
        @include px2rem(top, 113px);
        @include px2rem(width, 604px);
        background: #ebebeb;
        box-shadow: 0 -6px 4px -4px rgba(0, 0, 0, 0.15) inset;

        li {
          @include px2rem(height, 73px);
          @include px2rem(font-size, 24px);
        }

        .category li a.active,
        .tag li a.active {
          background-color: $primary !important;
          color: #fff !important;
        }
      }
    }

    .tab-design {
      top: 0;

      .closeIcon i {
        @include px2rem(font-size, 36px);
        font-weight: 700;
      }

      .top {
        @include px2rem(height, 100px);
        border-bottom: 1px solid #ccc;
        color: $secondary;
        @include px2rem(font-size, 32px);

        span {
          z-index: 1;
        }

        .top-text {
          position: relative;
          bottom: -2px;
          border-bottom: 3px solid transparent;
          z-index: 1;
        }

        .top-text.active {
          color: $dark;
          border-color: #333;
        }
      }

      .tab-userTemplates {
        height: calc(100% - (100rem / 75));

        .search-input {
          display: flex;
          align-items: center;
          justify-content: center;
          @include px2rem(height, 80px);
        }

        .content {
          position: relative;
          height: calc(100% - (80rem / 75));
        }

        .el-input {
          @include px2rem(width, 700px);
          @include px2rem(height, 66px);
          @include px2rem(font-size, 24px);

          /deep/ .el-input__inner {
            height: 100%;
            @include px2rem(padding-right, 40px);
            @include px2rem(border-radius, 33px);
          }

          /deep/ .el-input__suffix-inner {
            .el-input__icon {
              @include px2rem(width, 40px);
            }

            i {
              @include px2rem(font-size, 30px);
              @include px2rem(line-height, 66px);
              color: $primary;
            }
          }
        }
      }

      .tab-userSymbol {
        height: calc(100% - (100rem / 75));

        .content {
          position: relative;
          height: 100%;
        }
      }

      .content {
        .delete {
          position: absolute;
          bottom: 0;
          right: 0;
        }

        .load {
          display: block !important;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: rgba(255, 255, 255, 0.25);
          @include px2rem(height, 40px);
          @include px2rem(line-height, 40px);
        }

        ul {
          overflow: auto;
          max-height: 100%;
        }
      }

      .dropdown {
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }
    }

    .tab-symbol .delete {
      position: absolute;
      bottom: 0;
      right: 0;
    }

    .tab-text,
    .tab-image {
      border-top: 2px solid #bcbaba;

      .top {
        text-align: center;
      }

      .layer-item {
        position: relative;
        @include px2rem(font-size, 24px);
        @include px2rem(width, 230px);
        @include px2rem(height, 141px);

        .layer-options {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
        }

        .writeText {
          @include px2rem(width, 26px);
          @include px2rem(height, 29px);
        }

        .lock {
          @include px2rem(width, 31px);
          @include px2rem(height, 39px);
        }

        .lock-open {
          @include px2rem(width, 45px);
          @include px2rem(height, 39px);
        }
      }

      .layerList {
        position: relative;

        .tips {
          position: absolute;
          top: 50%;
          right: 0;
          transform: translateY(-60%);
          color: #fff;
          z-index: 1;

          svg {
            position: relative;
            right: -5px;
          }

          &::after {
            content: "";
            position: absolute;
            top: 50%;
            left: 0;
            width: 100px;
            height: 80px;
            transform: translateY(-50%);
            background: rgba(0, 0, 0, 0.25);
            border-radius: 100% 0 0 100%;
            z-index: -1;
          }
        }
      }
    }

    .tab-text {
      .el-button {
        @include px2rem(width, 326px);
        @include px2rem(height, 67px);
        @include px2rem(line-height, 67px);
        @include px2rem(border-radius, 34px);
        @include px2rem(font-size, 32px);
        padding: 0;
      }

      /deep/ .el-textarea {
        width: auto;
      }

      /deep/ .el-textarea__inner {
        @include px2rem(width, 700px);
        @include px2rem(height, 80px);
        @include px2rem(font-size, 32px);
      }
    }

    .tab-image {
      @include px2rem(font-size, 24px);

      .el-button {
        @include px2rem(width, 700px);
        @include px2rem(height, 80px);
        @include px2rem(line-height, 80px);
        @include px2rem(border-radius, 40px);
        @include px2rem(font-size, 32px);
        padding: 0;
      }
    }

    .tab-image .uploader /deep/ .el-upload {
      width: 100%;
    }
  }

  .userItem > div {
    position: relative;

    .sizeInfo {
      position: absolute;
      top: 5px;
      left: 5px;

      .el-tag {
        background: rgba(255, 255, 255, 0.8);
      }
    }
  }
}

.content-wrap {
  overflow: hidden;
  @include px2rem(width, 720px);
  @include px2rem(height, 1000px);
  border-radius: 10px;

  .close-dialog {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    @include px2rem(top, 10px);
    @include px2rem(right, 10px);
    width: 17px;
    height: 17px;
    cursor: pointer;

    img {
      width: 100%;
      height: 100%;
    }
  }
}

@media screen and (min-width: 751px) {
  .content-wrap {
    width: 720px;
    height: 800px;

    .close-dialog {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 17px;
      height: 17px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>

<template>
  <div class="designSystemWrap pcDzxt position-relative">
    <!--上传图片裁剪区域-->
    <crop-img
      v-show="showCropArea"
      :cropUrl="cropUrl"
      @closeCropArea="showCropArea = false"
      @addCropImg="addCropImg"
    ></crop-img>

    <div
      id="text-option"
      ref="textOption"
      v-show="
        selectedEle &&
          (selectedEle.type === 'text' || selectedEle.type === 'curved-text')
      "
    >
      <div class="row no-gutters align-items-center">
        <div class="col-4 p-1">
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
        </div>
        <div class="col-3 p-1">
          <template v-if="selectedEle.type === 'text'">
            <el-select
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
          </template>
          <template v-if="selectedEle.type === 'curved-text'">
            <div>
              <el-popover
                placement="bottom"
                width="200"
                trigger="manual"
                v-model="visibleRadianBtn"
              >
                <el-button
                  type="primary"
                  slot="reference"
                  size="small"
                  @click="visibleRadianBtn = !visibleRadianBtn"
                >
                  Text curve
                  <i class="el-icon-arrow-down"></i>
                </el-button>
                <div>
                  <div class="d-flex align-items-center">
                    <label class="pr-2">Flip</label>
                    <el-switch
                      v-model="textProperty.flipped"
                      @change="
                        changeNodeProperty('flipped', textProperty.flipped)
                      "
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
                      @input="changeNodeProperty('radian', textProperty.radian)"
                    ></el-slider>
                  </div>
                </div>
              </el-popover>
            </div>
          </template>
        </div>
        <div class="col-2 p-1 d-flex-center">
          <color-picker
            :colorCodeList="colorData"
            :drawColor="textProperty.fill"
            @selectColor="changeNodeProperty('color', $event)"
          ></color-picker>
        </div>
        <div class="col-3 p-1 d-flex-center">
          <div
            class="btn"
            :class="{ active: textProperty.fontWeight !== 'normal' }"
            @click="changeNodeProperty('fontWeight')"
          >
            <span class="font-weight-bold">B</span>
          </div>
          <div
            class="btn"
            :class="{ active: textProperty.fontStyle !== 'normal' }"
            @click="changeNodeProperty('fontStyle')"
          >
            <span class="font-weight-bold"><i>I</i></span>
          </div>
          <div
            class="btn"
            :class="{ active: textProperty.underline }"
            @click="changeNodeProperty('underline')"
          >
            <span class="font-weight-bold"><u>U</u></span>
          </div>
        </div>
      </div>
      <div class="row no-gutters">
        <div class="col-12 p-1">
          <el-input
            type="textarea"
            v-model="textProperty.text"
            :rows="2"
            @input="changeNodeProperty('text', textProperty.text)"
            placeholder="Enter Your Text"
          ></el-input>
        </div>
      </div>
    </div>

    <div
      id="img-option"
      ref="imgOption"
      v-show="selectedEle && selectedEle.type === 'image'"
    >
      <div class="row no-gutters align-items-center">
        <div
          class="col-3 p-1 border-right"
          :class="{ 'col-4': !selectedImgColor.isOne }"
        >
          <div
            class="d-flex flex-column align-items-center justify-content-center pointer"
            @click="getReplaceImgList"
          >
            <Al-icon icon="iconfonticontihuan"></Al-icon>
            <span>Replace</span>
          </div>
        </div>
        <div
          class="col-3 p-1 d-flex-center border-right"
          :class="{ 'col-4': !selectedImgColor.isOne }"
        >
          <div
            class="d-flex flex-column align-items-center justify-content-center pointer"
            @click="mirrorItem"
          >
            <Al-icon icon="jingxiang" fontSize="14px"></Al-icon>
            <span>Mirror</span>
          </div>
        </div>
        <div
          class="col-3 p-1 d-flex-center border-right"
          :class="{ 'col-4 border-right-0': !selectedImgColor.isOne }"
        >
          <div
            class="d-flex flex-column align-items-center justify-content-center pointer"
            @click="copyItem"
          >
            <Al-icon icon="copy" fontSize="14px"></Al-icon>
            <span>Copy</span>
          </div>
        </div>
        <div class="col-3 p-1 d-flex-center" v-if="selectedImgColor.isOne">
          <div
            class="d-flex flex-column align-items-center justify-content-center pointer"
          >
            <color-picker
              :colorCodeList="colorData"
              :drawColor="selectedImgColor.color"
              @selectColor="changeImgColorBefore"
            ></color-picker>
            <span>Color</span>
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

    <!-- 图片替换弹窗-->
    <base-dialog :visible.sync="showImgReplace">
      <template v-slot:content>
        <div class="imgReplaceWrap">
          <div class="p-2 h-100 bg-white d-flex flex-column">
            <div
              class="top border-bottom row no-gutters align-items-center position-relative"
            >
              <div
                class="col-6 text-center h-100 d-flex-center pointer"
                @click="replaceTabActive = 1"
              >
                <b
                  class="h-100 d-flex-center top-text"
                  :class="{ active: replaceTabActive === 1 }"
                >
                  Symbol Gallery
                </b>
              </div>
              <div
                class="col-6 text-center h-100 d-flex-center pointer"
                @click="replaceTabActive = 2"
              >
                <b
                  class="h-100 d-flex-center top-text"
                  :class="{ active: replaceTabActive === 2 }"
                >
                  My Symbol
                </b>
              </div>
            </div>
            <div class="flex-1 d-flex flex-column overflow-hidden mt-3">
              <div
                class="content overflow-auto flex-1"
                v-show="replaceTabActive === 1"
                ref="replaceWrap"
              >
                <ul class="row no-gutters">
                  <li class="col-3 p-1">
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
                    class="col-3 p-1 pointer"
                    v-for="item in replaceImgList"
                    :key="item.id"
                  >
                    <div
                      class="border rounded bg-transparent position-relative h-100 squareDiv"
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
                    class="col-3 p-1 pointer"
                    v-for="item in replaceUserSymbolList"
                    :key="item.id"
                  >
                    <div
                      class="border rounded bg-transparent position-relative h-100 squareDiv"
                      @click="replaceEleImg(item, 'private')"
                    >
                      <img v-lazy="item.url" :alt="item.element_name" />
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="close-dialog" @click="showImgReplace = false">
            <i class="el-icon-circle-close"></i>
          </div>
        </div>
      </template>
    </base-dialog>

    <div class="w-100 h-100 border-bottom border-top">
      <div class="w-100 h-100 position-relative">
        <templateDialog
          v-show="tabIndex === 0"
          :categoryList="categoryList"
          @closeTemplateDialog="tabIndex = 4"
          @uploadImg="uploadImg"
          @selectTemplate="selectTemplate"
        ></templateDialog>
        <symbolDialog
          v-show="tabIndex === 1"
          @addEleImg="addEleImg"
          @uploadImg="uploadImg"
          @closeSymbolDialog="tabIndex = 4"
        ></symbolDialog>
        <templateDialog_user
          ref="userTemp"
          v-show="tabIndex === 2"
          @closeTemplateDialog="tabIndex = 4"
          @uploadImg="uploadImg"
          @selectTemplate="selectTemplate"
        ></templateDialog_user>
        <symbolDialog_user
          ref="userSymbol"
          v-show="tabIndex === 3"
          @addEleImg="addEleImg"
          @closeSymbolDialog="tabIndex = 4"
        ></symbolDialog_user>
        <div class="row no-gutters h-100">
          <div class="tab d-flex">
            <div class="leftNav h-100">
              <ul class="d-flex flex-column no-gutters text-center">
                <li
                  class="p-2"
                  :class="{ active: tabIndex === index }"
                  v-for="(item, index) in toolBarList"
                  :key="item.name"
                  @click="tabClick(index)"
                >
                  <div>
                    <img
                      :src="tabIndex === index ? item.iconActive : item.icon"
                      alt="item.name"
                    />
                  </div>
                  <span class="text-nowrap">{{ item.name }}</span>
                </li>
              </ul>
            </div>
            <div class="tab-content">
              <div class="tab-item tab-text h-100" v-show="tabIndex == 4">
                <div class="d-flex flex-column h-100">
                  <div class="p-2 bg-white">
                    <div class="tab-item-title mb-2"><b>Add Text</b></div>
                    <div>
                      <el-input
                        type="textarea"
                        v-model="textValue"
                        :rows="2"
                        placeholder="Enter Your Text"
                      ></el-input>
                    </div>
                    <div class="row no-gutters py-2 justify-content-end">
                      <button
                        class="btn-lg btn btn-outline-primary"
                        type="button"
                        style="width: 140px"
                        @click="addText(textValue, 'curvedText')"
                      >
                        Add Curved Text
                      </button>
                      <button
                        class="btn btn-outline-primary btn-lg ml-3"
                        type="button"
                        style="width: 140px"
                        @click="addText(textValue, 'text')"
                      >
                        Add Text
                      </button>
                    </div>
                  </div>
                  <div
                    class="p-2 layerList mt-2 bg-white flex-1 d-flex flex-column"
                  >
                    <div class="tab-item-title mb-2"><b>Layers</b></div>
                    <div class="overflow-auto flex-1 position-relative">
                      <div
                        class="layers-list"
                        :class="{
                          disabled: selectedEle.type === 'activeSelection'
                        }"
                        ref="layersList"
                      >
                        <draggable
                          class="list-group"
                          tag="ul"
                          v-model="layersArr"
                          v-bind="dragOptions"
                          @start="drag = true"
                          @end="drag = false"
                          @change="changeLayer"
                        >
                          <transition-group
                            type="transition"
                            :name="!drag ? 'flip-list' : null"
                          >
                            <template v-for="(item, index) in layersArr">
                              <li
                                :class="{ layerActive: item === selectedEle }"
                                @click="activeItem(item)"
                                :key="index"
                              >
                                <i
                                  :class="
                                    item.fixed
                                      ? 'fa fa-anchor'
                                      : 'glyphicon glyphicon-pushpin'
                                  "
                                  @click="item.fixed = !item.fixed"
                                  aria-hidden="true"
                                ></i>
                                <div class="layer-item-wrap">
                                  <div class="layer-item-left">
                                    <template
                                      v-if="
                                        item.type === 'text' ||
                                          item.type === 'curved-text'
                                      "
                                    >
                                      <i class="iconfont iconwenzi"></i>
                                      #{{ item.text }}
                                    </template>
                                    <template v-if="item.type === 'image'">
                                      <img :src="item.getSrc()" />
                                    </template>
                                  </div>
                                  <div class="layer-item-right">
                                    <div
                                      class="layerHide"
                                      @click.stop="hideItem(item)"
                                    >
                                      <Al-icon
                                        :icon="
                                          item.visible ? 'ViewFilled' : 'biyan'
                                        "
                                      ></Al-icon>
                                    </div>
                                    <div
                                      class="layerLock"
                                      @click.stop="lockItem(item)"
                                    >
                                      <i
                                        :class="[
                                          item.selectable
                                            ? 'el-icon-unlock'
                                            : 'el-icon-lock'
                                        ]"
                                      ></i>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            </template>
                          </transition-group>
                        </draggable>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tab-item tab-image h-100" v-show="tabIndex == 5">
                <div class="d-flex flex-column h-100">
                  <div class="p-2 bg-white">
                    <div class="tab-item-title mb-2"><b>Upload</b></div>
                    <div class="d-flex-center">
                      <el-upload
                        class="uploader"
                        ref="uploadBox"
                        drag
                        :limit="1"
                        list-type="picture"
                        :show-file-list="false"
                        action="#"
                        :before-upload="beforeUpload"
                        :on-change="uploadOnChange"
                        :http-request="file => file"
                      >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                          Drag the file here, or
                          <em>click upload</em>
                        </div>
                        <div slot="tip" class="el-upload__tip">
                          <div class="attention">
                            <p>
                              Accepted File Types
                              <i style="color: #ff0000"
                                >(The file size cannot exceed 2M)</i
                              >
                            </p>
                            <ul>
                              <li>.JPG</li>
                              <li>.JPEG</li>
                              <li>.PNG</li>
                              <li>.SVG</li>
                              <li>.GIF</li>
                              <li>.BMP</li>
                              <li>.PDF</li>
                              <li>.PSD</li>
                              <li>.AI</li>
                            </ul>
                          </div>
                        </div>
                      </el-upload>
                    </div>
                  </div>
                  <div
                    class="p-2 layerList mt-2 bg-white flex-1 d-flex flex-column"
                  >
                    <div class="tab-item-title mb-2"><b>Layers</b></div>
                    <div class="overflow-auto flex-1 position-relative">
                      <div
                        class="layers-list flex-1"
                        :class="{
                          disabled: selectedEle.type === 'activeSelection'
                        }"
                        ref="layersList"
                      >
                        <draggable
                          class="list-group"
                          tag="ul"
                          v-model="layersArr"
                          v-bind="dragOptions"
                          @start="drag = true"
                          @end="drag = false"
                          @change="changeLayer"
                        >
                          <transition-group
                            type="transition"
                            :name="!drag ? 'flip-list' : null"
                          >
                            <template v-for="(item, index) in layersArr">
                              <li
                                :class="{ layerActive: item === selectedEle }"
                                @click="activeItem(item)"
                                :key="index"
                              >
                                <i
                                  :class="
                                    item.fixed
                                      ? 'fa fa-anchor'
                                      : 'glyphicon glyphicon-pushpin'
                                  "
                                  @click="item.fixed = !item.fixed"
                                  aria-hidden="true"
                                ></i>
                                <div class="layer-item-wrap">
                                  <div class="layer-item-left">
                                    <template
                                      v-if="
                                        item.type === 'text' ||
                                          item.type === 'curved-text'
                                      "
                                    >
                                      <i class="iconfont iconwenzi"></i>
                                      #{{ item.text }}
                                    </template>
                                    <template v-if="item.type === 'image'">
                                      <img :src="item.getSrc()" />
                                    </template>
                                  </div>
                                  <div class="layer-item-right">
                                    <div
                                      class="layerHide"
                                      @click.stop="hideItem(item)"
                                    >
                                      <Al-icon
                                        :icon="
                                          item.visible ? 'ViewFilled' : 'biyan'
                                        "
                                      ></Al-icon>
                                    </div>
                                    <div
                                      class="layerLock"
                                      @click.stop="lockItem(item)"
                                    >
                                      <i
                                        :class="[
                                          item.selectable
                                            ? 'el-icon-unlock'
                                            : 'el-icon-lock'
                                        ]"
                                      ></i>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            </template>
                          </transition-group>
                        </draggable>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!--              编辑文字-->
              <div class="tab-item tab-text h-100" v-show="tabIndex == 6">
                <div class="d-flex flex-column h-100">
                  <div class="p-2 bg-white">
                    <div class="tab-item-title mb-2"><b>Edit Text</b></div>
                    <div class="text-input">
                      <el-input
                        type="textarea"
                        :rows="3"
                        placeholder="Write your text"
                        v-model="textProperty.text"
                        @input="changeNodeProperty('text', textProperty.text)"
                      ></el-input>
                    </div>
                    <div class="row no-gutters mt-2">
                      <div class="col-7">
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
                      </div>
                      <div class="col-5">
                        <el-select
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
                      </div>
                    </div>
                    <div class="row no-gutters mt-2">
                      <div class="col-3 d-flex align-items-center">
                        <label class="mr-1">Color</label>
                        <color-picker
                          :colorCodeList="colorData"
                          :drawColor="textProperty.fill"
                          @selectColor="changeNodeProperty('color', $event)"
                        ></color-picker>
                      </div>
                      <div class="col-4 d-flex align-items-center">
                        <el-button-group>
                          <el-button
                            :type="
                              textProperty.fontWeight !== 'normal'
                                ? 'primary'
                                : 'info'
                            "
                            size="mini"
                            @click="changeNodeProperty('fontWeight')"
                          >
                            <b>B</b>
                          </el-button>
                          <el-button
                            :type="
                              textProperty.fontStyle !== 'normal'
                                ? 'primary'
                                : 'info'
                            "
                            size="mini"
                            @click="changeNodeProperty('fontStyle')"
                          >
                            <b><i>I</i></b>
                          </el-button>
                          <el-button
                            :type="textProperty.underline ? 'primary' : 'info'"
                            size="mini"
                            @click="changeNodeProperty('underline')"
                          >
                            <b><u>U</u></b>
                          </el-button>
                        </el-button-group>
                      </div>
                      <div class="col-5 d-flex align-items-center">
                        <el-button-group>
                          <el-button
                            :type="
                              textProperty.textAlign === 'left'
                                ? 'primary'
                                : 'info'
                            "
                            size="mini"
                            @click="changeNodeProperty('textAlign', 'left')"
                          >
                            <Al-icon icon="alignleft"></Al-icon>
                          </el-button>
                          <el-button
                            :type="
                              textProperty.textAlign === 'center'
                                ? 'primary'
                                : 'info'
                            "
                            size="mini"
                            @click="changeNodeProperty('textAlign', 'center')"
                          >
                            <Al-icon icon="ALIGNMIDDLE"></Al-icon>
                          </el-button>
                          <el-button
                            :type="
                              textProperty.textAlign === 'right'
                                ? 'primary'
                                : 'info'
                            "
                            size="mini"
                            @click="changeNodeProperty('textAlign', 'right')"
                          >
                            <Al-icon icon="alignright"></Al-icon>
                          </el-button>
                        </el-button-group>
                      </div>
                    </div>
                    <div class="row no-gutters align-items-center">
                      <span class="col-2 mr-2">Rotation</span>
                      <div class="col">
                        <el-slider
                          :show-tooltip="false"
                          :min="-360"
                          :max="360"
                          v-model="textProperty.angle"
                          input-size="mini"
                          show-input
                          @input="
                            changeNodeProperty('angle', textProperty.angle)
                          "
                        ></el-slider>
                      </div>
                    </div>
                    <div class="row no-gutters align-items-center">
                      <span class="col-2 mr-2">Spacing</span>
                      <div class="col">
                        <el-slider
                          :show-tooltip="false"
                          :min="0"
                          :max="1000"
                          show-input
                          :step="10"
                          v-model="textProperty.charSpacing"
                          @input="
                            changeNodeProperty(
                              'charSpacing',
                              textProperty.charSpacing
                            )
                          "
                        ></el-slider>
                      </div>
                    </div>
                  </div>

                  <div
                    class="p-2 layerList mt-2 bg-white flex-1 d-flex flex-column"
                  >
                    <div class="tab-item-title mb-2"><b>Layers</b></div>
                    <div class="overflow-auto flex-1 position-relative">
                      <div
                        class="layers-list"
                        :class="{
                          disabled: selectedEle.type === 'activeSelection'
                        }"
                        ref="layersList"
                      >
                        <draggable
                          class="list-group"
                          tag="ul"
                          v-model="layersArr"
                          v-bind="dragOptions"
                          @start="drag = true"
                          @end="drag = false"
                          @change="changeLayer"
                        >
                          <transition-group
                            type="transition"
                            :name="!drag ? 'flip-list' : null"
                          >
                            <template v-for="(item, index) in layersArr">
                              <li
                                :class="{ layerActive: item === selectedEle }"
                                @click="activeItem(item)"
                                :key="index"
                              >
                                <i
                                  :class="
                                    item.fixed
                                      ? 'fa fa-anchor'
                                      : 'glyphicon glyphicon-pushpin'
                                  "
                                  @click="item.fixed = !item.fixed"
                                  aria-hidden="true"
                                ></i>
                                <div class="layer-item-wrap">
                                  <div class="layer-item-left">
                                    <template
                                      v-if="
                                        item.type === 'text' ||
                                          item.type === 'curved-text'
                                      "
                                    >
                                      <i class="iconfont iconwenzi"></i>
                                      #{{ item.text }}
                                    </template>
                                    <template v-if="item.type === 'image'">
                                      <img :src="item.getSrc()" />
                                    </template>
                                  </div>
                                  <div class="layer-item-right">
                                    <div
                                      class="layerHide"
                                      @click.stop="hideItem(item)"
                                    >
                                      <Al-icon
                                        :icon="
                                          item.visible ? 'ViewFilled' : 'biyan'
                                        "
                                      ></Al-icon>
                                    </div>
                                    <div
                                      class="layerLock"
                                      @click.stop="lockItem(item)"
                                    >
                                      <i
                                        :class="[
                                          item.selectable
                                            ? 'el-icon-unlock'
                                            : 'el-icon-lock'
                                        ]"
                                      ></i>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            </template>
                          </transition-group>
                        </draggable>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!--              编辑图片-->
              <div class="tab-item tab-text h-100" v-show="tabIndex == 7">
                <div class="d-flex flex-column h-100">
                  <div class="p-2 bg-white">
                    <div class="tab-item-title mb-2"><b>Edit Image</b></div>
                    <div class="row no-gutters py-2">
                      <div class="col-4">
                        <div class="border rounded bg-transparent">
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
                      <div class="col-8 pl-2 d-flex flex-column">
                        <p><b>Current Symbol</b></p>
                        <p class="text-muted">Click to customize further</p>
                        <el-button
                          type="primary"
                          icon="el-icon-upload2"
                          @click="getReplaceImgList"
                        >
                          Replace
                        </el-button>
                      </div>
                    </div>

                    <div class="row no-gutters align-items-center">
                      <span class="col-2 mr-2">Rotation</span>
                      <div class="col">
                        <el-slider
                          :show-tooltip="false"
                          :min="-360"
                          :max="360"
                          v-model="imageProperty.angle"
                          input-size="mini"
                          show-input
                          @input="
                            changeNodeProperty('angle', imageProperty.angle)
                          "
                        ></el-slider>
                      </div>
                    </div>
                    <div class="row no-gutters align-items-center">
                      <span class="col-2 mr-2">Size</span>
                      <div class="col">
                        <el-slider
                          :show-tooltip="false"
                          :min="0.01"
                          :max="5"
                          show-input
                          input-size="mini"
                          :step="0.01"
                          v-model="imageProperty.scale"
                          @input="
                            changeNodeProperty('scale', imageProperty.scale)
                          "
                        ></el-slider>
                      </div>
                    </div>
                  </div>

                  <div
                    class="p-2 layerList mt-2 bg-white flex-1 d-flex flex-column"
                  >
                    <div class="tab-item-title mb-2"><b>Layers</b></div>
                    <div class="overflow-auto flex-1 position-relative">
                      <div
                        class="layers-list"
                        :class="{
                          disabled: selectedEle.type === 'activeSelection'
                        }"
                        ref="layersList"
                      >
                        <draggable
                          class="list-group"
                          tag="ul"
                          v-model="layersArr"
                          v-bind="dragOptions"
                          @start="drag = true"
                          @end="drag = false"
                          @change="changeLayer"
                        >
                          <transition-group
                            type="transition"
                            :name="!drag ? 'flip-list' : null"
                          >
                            <template v-for="(item, index) in layersArr">
                              <li
                                :class="{ layerActive: item === selectedEle }"
                                @click="activeItem(item)"
                                :key="index"
                              >
                                <i
                                  :class="
                                    item.fixed
                                      ? 'fa fa-anchor'
                                      : 'glyphicon glyphicon-pushpin'
                                  "
                                  @click="item.fixed = !item.fixed"
                                  aria-hidden="true"
                                ></i>
                                <div class="layer-item-wrap">
                                  <div class="layer-item-left">
                                    <template
                                      v-if="
                                        item.type === 'text' ||
                                          item.type === 'curved-text'
                                      "
                                    >
                                      <i class="iconfont iconwenzi"></i>
                                      #{{ item.text }}
                                    </template>
                                    <template v-if="item.type === 'image'">
                                      <img :src="item.getSrc()" />
                                    </template>
                                  </div>
                                  <div class="layer-item-right">
                                    <div
                                      class="layerHide"
                                      @click.stop="hideItem(item)"
                                    >
                                      <Al-icon
                                        :icon="
                                          item.visible ? 'ViewFilled' : 'biyan'
                                        "
                                      ></Al-icon>
                                    </div>
                                    <div
                                      class="layerLock"
                                      @click.stop="lockItem(item)"
                                    >
                                      <i
                                        :class="[
                                          item.selectable
                                            ? 'el-icon-unlock'
                                            : 'el-icon-lock'
                                        ]"
                                      ></i>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            </template>
                          </transition-group>
                        </draggable>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col p-0">
            <div class="d-flex w-100 h-100">
              <div
                class="designBody flex-1 d-flex justify-content-center align-items-center"
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
              <div class="d-flex flex-column tool" @click.self="blurFabric">
                <div
                  class="p-2 pointer d-flex flex-column justify-content-center align-items-center"
                  @click="undo"
                >
                  <Al-icon icon="weibiaoti545" fontSize="30px"></Al-icon>
                  <span>Undo</span>
                </div>
                <div
                  class="p-2 pointer d-flex flex-column  justify-content-center align-items-center"
                  @click="redo"
                >
                  <Al-icon
                    class="flipx"
                    icon="weibiaoti545"
                    fontSize="30px"
                  ></Al-icon>
                  <span>Redo</span>
                </div>
                <div
                  class="p-2 pointer d-flex flex-column  justify-content-center align-items-center"
                  @click="copyItem"
                >
                  <Al-icon icon="copy" fontSize="30px"></Al-icon>
                  <span>Copy</span>
                </div>
                <div
                  class="p-2 pointer d-flex flex-column  justify-content-center align-items-center"
                  @click="deleteItem(selectedEle)"
                >
                  <Al-icon icon="delete" fontSize="30px"></Al-icon>
                  <span>Delete</span>
                </div>
                <div
                  class="p-2 pointer d-flex flex-column  justify-content-center align-items-center"
                  @click="clearCanvas"
                >
                  <Al-icon icon="clear" fontSize="30px"></Al-icon>
                  <span>Clear</span>
                </div>
              </div>
            </div>
          </div>
          <div class="params bg-white">
            <!-- 右侧 -->
            <paramsSelect
              ref="paramsSelect"
              :categoryList="categoryList"
              @changeShape="changeShape"
              @changeSize="changeSize"
              @finishedDesign="finishedDesign"
              @selectTemplate="selectTemplate"
              @loadTemplate="loadTemplate"
              v-if="!hasC"
            ></paramsSelect>
            <params
              ref="params"
              :categoryList="cList"
              @initShade="initShade"
              @pFinishedDesign="pFinishedDesign"
              @selectTemplate="selectTemplate"
              v-if="hasC"
            ></params>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import paramsSelect from "@/components/dzxt/paramsSelect";
import params from "@/components/dzxt/params";
import cropImg from "@/components/dzxt/cropImg";
import templateDialog from "@/components/dzxt/templateDialog";
import symbolDialog from "@/components/dzxt/symbolDialog";
import templateDialog_user from "@/components/dzxt/templateDialog_user";
import symbolDialog_user from "@/components/dzxt/symbolDialog_user";
import colorPicker from "@/components/dzxt/colorPicker";
import initCurvedText from "@/assets/js/fabricCurveText";
import utils from "@/utils/utils";
import analyze from "rgbaster";
import draggable from "vuedraggable";
import Clipboard from "clipboard";
import {
  initAligningGuidelines,
  initCenteringGuidelines
} from "@/assets/js/guideLines.js";
import { fb, initControlIcon } from "@/assets/js/fb";

import { getColorData, ossUpload, getSameLevelProduct } from "@/api/public";

import { getElement, getSampleInfo } from "@/api/sample";

import {
  getUserSampleInfo,
  editUserSample,
  shareUserSample,
  getUserElement,
  editUserElement
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
      cList: [],
      hasC: false, //是否从活动页面进来(彭)
      categoryList: [],
      sizeW: 1,
      sizeH: 1,
      saveTemplateBefore: false,
      showShareTemplate: false, // 打开分享弹窗
      shareImg: "",
      shareUrl: "",
      styleType: 1, //1 代表模切 2：矩形 3：圆形 4：圆角矩形
      canvasInfo: {
        shadeScale: 0.9, //画中画占画布比例
        shadeSize: 1, //用户选择的尺寸
        pcWidth: 600,
        pcHeight: 600,
        mbWidth: 300,
        mbHeight: 300
      },
      specification: "",
      toolBarList: [
        {
          iconActive: require("~/assets/images/sel_Templates.png"),
          icon: require("~/assets/images/nol_Templates.png"),
          name: "Templates",
          url: require("~/assets/images/sel_Templates.png")
        },
        {
          iconActive: require("~/assets/images/sel_Symbol.png"),
          icon: require("~/assets/images/nol_Symbol.png"),
          name: "Symbol",
          url: require("~/assets/images/nol_Symbol.png")
        },
        {
          iconActive: require("~/assets/images/sel_My Template.png"),
          icon: require("~/assets/images/nol_My Template.png"),
          name: "My Template",
          url: require("~/assets/images/nol_My Template.png")
        },
        {
          iconActive: require("~/assets/images/sel_My Symbol.png"),
          icon: require("~/assets/images/nol_My Symbol.png"),
          name: "My Symbol",
          url: require("~/assets/images/nol_My Symbol.png")
        },

        {
          iconActive: require("~/assets/images/sel_Add Text.png"),
          icon: require("~/assets/images/nol_Add Text.png"),
          name: "Add Text",
          url: require("~/assets/images/nol_Add Text.png")
        },
        {
          iconActive: require("~/assets/images/sel_Upload.png"),
          icon: require("~/assets/images/nol_Upload.png"),
          name: "Upload",
          url: require("~/assets/images/nol_Upload.png")
        }
      ],
      tabIndex: 0,
      tabDesignIndex: 0,
      textValue: "", //添加的文本
      showCropArea: false,
      cropUrl: "", //裁剪图片路径
      textProperty: {
        radian: 1000
      },
      imageProperty: {},
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
      stateMask: "",
      controlNavArea: "textTab",
      drag: false
    };
  },
  computed: {
    cartTempQuantity: {
      get() {
        return Number(this.$store.state.cartTemp.quantity);
      },
      set(value) {}
    },
    cartTemp() {
      return this.$store.state.cartTemp;
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
    },

    layersArr: {
      get() {
        return this.fabricStage
          ? this.fabricStage.getObjects().filter(o => {
              console.log(o.type);
              return o.type !== "group" && o.type !== "activeSelection";
            })
          : [];
      },
      set(val) {}
    },
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }
  },
  components: {
    cropImg,
    colorPicker,
    draggable,
    paramsSelect,
    params,
    templateDialog,
    symbolDialog,
    templateDialog_user,
    symbolDialog_user
  },
  methods: {
    initShade({ sizeW, sizeH, activeShape }) {
      this.canvasInfo.shadeSize = sizeW / sizeH;
      this.sizeW = sizeW;
      this.sizeH = sizeH;
      this.styleType = activeShape;
      this.updateCanvasShade(this.fabricStage);
    },

    loadTemplate(json) {
      let fabricStage = this.fabricStage;
      // console.log(fabricStage, json);
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
        let scaleX = objects[i].scaleX;
        let scaleY = objects[i].scaleY;
        let left = objects[i].left;
        let top = objects[i].top;

        let tempScaleX = scaleX * factor;
        let tempScaleY = scaleY * factor;
        let tempLeft = left * factor;
        let tempTop = top * factor;

        objects[i].scaleX = tempScaleX;
        objects[i].scaleY = tempScaleY;
        objects[i].left = tempLeft;
        objects[i].top = tempTop;

        objects[i].setCoords();
      }
      canvas.renderAll();
      canvas.calcOffset();
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

    //用户保存模板
    saveTemplate() {
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
                this.$refs.userTemp.debounceGetUserSampleList();
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
      this.tabIndex = 4;
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
        if (this.hasC) {
          this.$refs.params.setShapeAndSize(
            Object.assign({}, specification, {
              id: res.data.product_category_id,
              tempId: id,
              type
            })
          );
        } else {
          this.$refs.paramsSelect.setShapeAndSize(
            Object.assign({}, specification, {
              id: res.data.product_category_id,
              tempId: id,
              type
            })
          );
        }
        sessionStorage.setItem(
          "product_category_id",
          res.data.product_category_id
        );

        this.canvasInfo.shadeSize = specification.width / specification.height;
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
    //活动组件提交设计
    pFinishedDesign() {
      let newParams = this.$refs.params.getNewParams();
      console.log("newParams", newParams);
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

        console.log(cartTempData);
        this.$store.commit("updateCartTemp", cartTempData);
        this.$router.push({
          name: "discount-products-checkout"
        });
      });
    },

    initDesignSystem() {
      let designBody = this.$refs.designBody;
      this.canvasInfo.mbWidth = this.canvasInfo.mbHeight =
        designBody.offsetWidth > designBody.offsetHeight
          ? designBody.offsetHeight
          : designBody.offsetWidth;
      this.initFabricStage();
      if (
        (sessionStorage.getItem("beforeRouteName") === "options-params" ||
          this.$route.query.shareName) &&
        this.$store.state.cartTemp
      ) {
        this.tabIndex = 4;
        // this.loadTemplate(JSON.parse(this.cartTemp.templateJson))
      }
      if (sessionStorage.getItem("tempIdInfo")) {
        this.tabIndex = 4;
      }
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
        if (!this.allowToHistory) {
          return false;
        }
        let tabIndex = this.tabIndex;
        if (tabIndex === 6) {
          this.tabIndex = 4;
        }
        if (tabIndex === 7) {
          this.tabIndex = 5;
        }
        this.saveStateToHistory();
      });
      fabricStage.on("object:modified", e => {
        console.log("更改");
        if (!this.allowToHistory) {
          return false;
        }
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
          this.visibleRadianBtn = false;
          this.activeItem(e.target);
        } else {
          this.blurFabric();
        }
      });
    },

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
          this.tabIndex = 4;
        })
        .catch(() => {});
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
        case 3:
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

    changeImgColorBefore(item) {
      this.colorStatus = 2;
      this.changeColor(item);
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

    getTextProperty(ele) {
      let obj = {};
      obj.text = ele.get("text");
      obj.textAlign = ele.get("textAlign");
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
      obj.angle = ele.get("angle");
      obj.scale = ele.get("scaleX");
      if (ele.shadow) {
        obj.shadowOffsetX = ele.shadow.offsetX;
        obj.shadowOffsetY = ele.shadow.offsetY;
        obj.shadowBlur = ele.shadow.blur;
        obj.shadowTransparency = this.$utils.getAlpha(ele.shadow.color) * 100;
      } else {
        obj.shadowOffsetX = 0;
        obj.shadowOffsetY = 0;
        obj.shadowBlur = 1;
        obj.shadowTransparency = 0;
      }
      this.imageProperty = obj;
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

    blurFabric() {
      this.tabIndex = 4;
      this.visibleRadianBtn = false;
      this.fabricStage.discardActiveObject();
      this.fabricStage.requestRenderAll();
    },

    undo() {
      this.tabIndex = 4;
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
      this.tabIndex = 4;
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
      let node = this.selectedEle;
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
          node.set("fill", value.code);
          break;
        case "stroke":
          if (value.code) {
            this.addToHistory("stroke", value, this.strokeHistory);
          }
          node.set("stroke", value.code);
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
      this.saveStateToHistory();
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
      this.tabIndex = 6;
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
            //清空上传input
            this.$refs.uploadBox.clearFiles();
            this.$refs.uploadBox4.clearFiles();
          };
        }
      });
    },

    uploadUserSymbolOnChange(file, fileList) {
      this.$nextTick(async () => {
        if (fileList.length) {
          let url = await this.upOssImg(fileList[0].raw);
          editUserElement({
            element_name: fileList[0].raw.name,
            url
          }).then(res => {
            this.$message.success(res.msg);
            this.$refs.userSymbol.debounceGetUserSymbolList();
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
          });
          //清空上传input
          this.$refs.uploadUserSymbolBox.clearFiles();
        }
      });
    },

    uploadImg(src) {
      this.showCropArea = true;
      this.cropUrl = src;
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
    addEleImg({ item, type }) {
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
            this.analyzeImgColor(src);
            this.tabIndex = 7;
            this.saveStateToHistory();
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
          this.fabricStage.requestRenderAll();
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
          this.tabIndex = 7;
          this.saveStateToHistory();
        },
        {
          crossOrigin: "Anonymous"
        }
      );
    },

    hideItem(item) {
      item.visible = !item.visible;
      if (!item.visible) {
        this.tabIndex = 4;
        this.fabricStage.discardActiveObject();
      } else {
        if (item.type === "text" || item.type === "curved-text") {
          this.tabIndex = 6;
          setTimeout(() => {
            this.locationToolBar(item, "textOption", "designBody");
          }, 250);
        } else if (item.type === "image") {
          this.tabIndex = 7;
          setTimeout(() => {
            this.locationToolBar(item, "imgOption", "designBody");
          }, 250);
        }
        this.fabricStage.setActiveObject(item);
      }
      this.fabricStage.requestRenderAll();
    },

    lockItem(item) {
      item.selectable = !item.selectable;
      item.evented = !item.evented;

      if (!item.selectable) {
        this.tabIndex = 4;
        this.fabricStage.discardActiveObject(item);
      } else {
        if (item.type === "text" || item.type === "curved-text") {
          this.tabIndex = 6;
          setTimeout(() => {
            this.locationToolBar(item, "textOption", "designBody");
          }, 250);
        } else if (item.type === "image") {
          this.tabIndex = 7;
          setTimeout(() => {
            this.locationToolBar(item, "imgOption", "designBody");
          }, 250);
        }
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
        this.tabIndex = 6;
        this.getTextProperty(item);
        setTimeout(() => {
          this.locationToolBar(item, "textOption", "designBody");
        }, 250);
      } else if (item.type === "image") {
        this.tabIndex = 7;
        this.getImageProperty(item);
        setTimeout(() => {
          this.locationToolBar(item, "imgOption", "designBody");
        }, 250);
        this.analyzeImgColor(item.get("_element").src);
      }
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

    mirrorItem() {
      let selectedEle = this.fabricStage.getActiveObject();
      selectedEle.set({
        flipX: !selectedEle.get("flipX")
      });
      this.fabricStage.renderAll();
    },

    changeLayer(e) {
      let oldIndex = e.moved.oldIndex;
      let newIndex = e.moved.newIndex;
      let num = Math.abs(newIndex - oldIndex);
      if (newIndex > oldIndex) {
        for (let i = 0; i < num; i++) {
          e.moved.element.bringForward();
        }
      } else {
        for (let i = 0; i < num; i++) {
          e.moved.element.sendBackwards();
        }
      }
      this.fabricStage.requestRenderAll();
    },

    hideChat() {
      let d = document.createElement("style");
      d.setAttribute("type", "text/css");
      d.innerHTML = "#comm100-container { display: none }";
      document.getElementsByTagName("head")[0].appendChild(d);
    },

    //按键事件绑定
    keyDownEvents(event) {
      let e = event,
        key = e.key,
        ctrlKey = e.ctrlKey,
        canvas = this.fabricStage,
        selectedEle = this.selectedEle;
      if (key === "Delete") {
        e.preventDefault();
        fb.deleteActiveEle(canvas);
      }
      if (
        document.activeElement.nodeName.toLowerCase() !== "input" &&
        document.activeElement.nodeName.toLowerCase() !== "textarea"
      ) {
        if (key === "c" && e.ctrlKey === true) {
          fb.copyEle(canvas);
        }
        if (key === "v" && e.ctrlKey === true) {
          fb.pasteEle(canvas);
        }
        if (key === "x" && e.ctrlKey === true) {
          e.preventDefault();
          fb.cutEle(canvas);
        }
        if (key === "z" && e.ctrlKey === true) {
          e.preventDefault();
          this.undoStatus();
        }
        if (key === "y" && e.ctrlKey === true) {
          e.preventDefault();
          this.redoStatus();
        }
        /*键盘控制移动*/
        if (key === "ArrowRight") {
          e.preventDefault();
          fb.move(canvas, "right");
        }
        if (key === "ArrowLeft") {
          e.preventDefault();
          fb.move(canvas, "left");
        }
        if (key === "ArrowUp") {
          e.preventDefault();
          fb.move(canvas, "up");
        }
        if (key === "ArrowDown") {
          e.preventDefault();
          fb.move(canvas, "down");
        }
      }
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
    if (this.$route.params.hasC) {
      this.hasC = true;
      let arry = JSON.parse(JSON.stringify(this.categoryList));
      this.cList = arry;
    }
    if (sessionStorage.getItem("changeCategory")) {
      this.tabIndex = 4;
      sessionStorage.removeItem("changeCategory");
    }
    this.$Bus.$on("logined", e => {
      if (this.saveTemplateBefore) this.saveTemplate();
      this.$refs.userTemp.debounceGetUserSampleList();
      this.$refs.userSymbol.debounceGetUserSymbolList();
    });
    this.$Bus.$on("saveTemplate", e => this.saveTemplate());
    this.$Bus.$on("shareTemplate", e => this.shareTemplate());

    this.hideChat(); //设计系统隐藏聊天框
    this.initDesignSystem(); //初始化设计系统数据
    document.addEventListener("keydown", this.keyDownEvents);
  },
  beforeDestroy() {
    this.$Bus.$off("logined");
    this.$Bus.$off("saveTemplate");
    this.$Bus.$off("shareTemplate");
    document.removeEventListener("keydown", this.keyDownEvents);
    sessionStorage.removeItem("beforeRouteName");
  }
};
</script>

<style lang="scss" scoped>
.designSystemWrap {
  width: 100%;
  height: calc(100vh - 104px);
  min-height: 700px;
  background: #d8d8d8;
  font-size: 16px;

  .attention ul {
    display: flex;

    li {
      margin-right: 5px;
    }
  }

  .leftNav {
    width: 100px;
    height: 100%;
    padding: 20px 0;
    background: $dark;
    color: #fff;
    user-select: none;

    ul {
      padding-left: 2px;
    }

    li {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100px;
      cursor: pointer;
    }

    li.active {
      background: #d8d8d8;
      color: #333;

      svg {
        color: $primary;
      }
    }
  }

  .tab-content {
    width: 430px;
  }

  .params {
    width: 430px;
  }
}

.tool {
  flex-shrink: 0;
  padding: 10px;
  user-select: none;

  span {
    font-size: 14px;
  }

  & > div {
    width: 66px;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
      border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }

  & > div:hover {
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    color: $primary;
  }
}

.layers-list {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: auto;

  .list-group {
    li {
      height: 50px;
      padding: 0 10px;
      color: rgba(48, 49, 19, 0.55) !important;
      background: #ddd;
      border-radius: 2px;
      border-bottom: 1px solid #fff;

      .layerHide,
      .layerLock {
        cursor: pointer;

        i,
        svg {
          font-size: 30px;
        }
      }
    }

    li.layerActive {
      background: $primary;
      color: #ffffff !important;
    }

    li {
      img {
        max-width: 40px;
        max-height: 40px;
        vertical-align: middle;
      }
    }

    .layer-item-wrap {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .layer-item-left {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      width: 200px;
    }

    .layer-item-right {
      display: flex;

      div {
        padding: 0 5px;
      }
    }
  }
}

.layers-list.disabled {
  overflow-y: hidden;

  &::after {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: rgba(255, 255, 255, 0.45);
    cursor: not-allowed;
  }
}

.bg-transparent {
  background: url("../../static/images/transparentBg.png");
}

#text-option {
  position: fixed;
  left: 0px;
  top: 100px;
  width: 400px;
  background: #fff;
  font-size: 14px;
  z-index: 1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  border: 1px solid #ccc;
  border-radius: 4px;
  user-select: none;
  padding: 5px;

  .color-text {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    border: 2px solid $primary;
    width: 40px;
    height: 40px;
    color: $primary;

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

  .btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    margin-left: 2px;
    padding: 0;
    background: #fff;
    color: $dark;
    cursor: pointer;
  }

  .btn.active {
    background: #ccc;
    color: #fff;
  }
}

#img-option {
  position: fixed;
  left: 0px;
  top: 100px;
  width: 240px;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  z-index: 1;
  user-select: none;

  i,
  svg {
    font-size: 30px;
  }
}

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

.shareTemplateWrap {
  width: 500px;
  height: 690px;
  padding: 32px 28px;
  border-radius: 17px;

  .share-img {
    width: 317px;
    height: 317px;
  }

  .share-title {
    font-size: 28px;
    text-align: left;
    font-weight: bold;
    margin-top: 20px;
  }

  .share-sub-title {
    font-size: 18px;
    text-align: left;
    font-weight: 400;
    margin: 20px 0;
  }

  .share-link-box {
    align-items: center;
    justify-content: space-between;

    .share-link {
      width: 308px;
      padding: 0 12px;
      font-size: 18px;
      line-height: 54px;
      border-radius: 5px;
      background: #e2e9ff;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    .share-copy {
      width: 122px;
      height: 54px;
      padding: 0;
      color: white;
      font-size: 18px;
      font-weight: bold;
      border-radius: 5px;
      background: #01a0de;
    }
  }

  .share-other-line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 25px 0;
    &::before,
    &::after {
      content: "";
      width: 185px;
      border-bottom: 1px solid #dadada;
    }
  }

  .share-other-box {
    justify-content: space-between;
    a {
      height: 48px;
      width: 126px;
      font-size: 26px;
      line-height: 44px;
      border-radius: 8px;
      border: 1px solid #c9d5e1;
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
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background-color: #333333;
    box-shadow: -1px 3px 3px 0px rgba(0, 0, 0, 0.4);
    position: absolute;
    right: -15px;
    top: -15px;

    i {
      color: white;
      font-size: 30px;
      transform: translateX(-2px);
    }
  }
}

.imgReplaceWrap {
  width: 800px;
  height: 600px;
  .top {
    height: 55px;
    line-height: 1;
    border-bottom: 1px solid #ccc;
    color: $secondary;

    span {
      z-index: 1;
    }
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

  .close-dialog {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    position: absolute;
    right: -30px;
    top: 0;
    left: auto;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border-radius: 50%;
    cursor: pointer;

    i {
      font-size: 30px;
    }
  }
}

.uploader /deep/ .el-upload {
  display: block;
  width: 100%;
  height: 100%;
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
</style>

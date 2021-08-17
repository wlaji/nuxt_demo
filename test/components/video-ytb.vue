<template>
  <base-dialog :visible.sync="showDialog" :lockScroll="lockScroll">
    <template v-slot:content>
      <div class="content-box">
        <div :style="{ '--aspect-ratio': width / height }" id="popupVid">
          <!-- enablejsapi = 1 允许通过js控制视频的播放与暂停 -->
          <iframe
            :src="videoUrl + '?enablejsapi=1'"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
        <div class="close-dialog" @click="closeDialog">
          <i class="el-icon-circle-close"></i>
        </div>
      </div>
    </template>
  </base-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    lockScroll: {
      type: Boolean,
      default: false
    },
    videoUrl:String,
    width:[Number,String],
    height:[Number,String]
  },
  computed: {
    showDialog: {
      get() {
        return this.visible;
      },
      set() {
        this.closeDialog();
      }
    }
  },
  watch: {
    visible(newValue) {
      if (newValue) {
        this.toggleVideo()
      } else {
        this.toggleVideo('hide')
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit("update:visible", false);
    },
    toggleVideo(state) {
      this.$nextTick(()=>{
        let div = document.getElementById('popupVid')
        let iframe = div.getElementsByTagName('iframe')[0].contentWindow
        let func = state == 'hide' ? 'pauseVideo' : 'playVideo'
        console.log(func)
        iframe.postMessage(
          '{"event":"command","func":"' + func + '","args":""}',
          '*'
        )
      })
    },
  }
};
</script>

<style lang="scss" scoped>
.content-box {
  position: relative;
  @include px2rem(width, 600px);
  background-color: #fff;
  border-radius: 10px;
  border:5px solid #fff;
  text-align: left;

  .close-dialog {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    position: absolute;
    left: 50%;
    bottom: -40px;
    transform: translateX(-50%);
    background-color: #fff;
    border-radius: 50%;
    cursor: pointer;

    i {
      font-size: 30px;
    }
  }
}

@media screen and (min-width: $breakpoint-xl-min) {
  .content-box {
    width: 1000px;

    .dialog_header {
      padding: 20px 20px 10px;
    }

    .close-dialog {
      right: -30px;
      top: 0;
      left: auto;
      transform: translate(-50%, -50%);
    }
  }
  i {
    @include px2rem(font-size, 30px);
  }
}
</style>
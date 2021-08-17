<template>
  <div class="fullPagePreloader">
    <div class="designsBg"></div>
    <span></span>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {},
  mounted() {

  }
}
</script>

<style scoped lang="scss">
.fullPagePreloader {
  background-color: #0f0f0f;
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 2147483644;

  .designsBg {
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    background: #0f1b27;
    background: radial-gradient(
        circle farthest-corner at 18.5% 28.5%,
        #203a43 0,
        #0f1b27 91%
    );
    z-index: 40;
  }

  span {
    display: block;
    position: absolute;
    width: 50px;
    height: 50px;
    background: #fff;
    animation: sk-rotateplane 1.2s infinite ease-in-out;
    top: 50%;
    left: 50%;
    margin: -25px 0 0 -25px;
    border-radius: 25px;
    z-index: 60;
  }

  @keyframes sk-rotateplane {
    0% {
      transform: perspective(120px) rotateX(0) rotateY(0);
    }

    50% {
      transform: perspective(120px) rotateX(-180.1deg) rotateY(0);
    }
    100% {
      transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
    }
  }
}
</style>

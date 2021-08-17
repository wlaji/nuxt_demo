<template>
  <div class="thirdPartLoginWrap">
    <div id="googleBtn" class="thirdBtn">
      <span class="icon"></span>
      <span class="buttonText">Sign in with Google</span>
    </div>
    <div id="facebookBtn" class="thirdBtn" @click="fbLogin">
      <span class="icon"></span>
      <span class="buttonText">Sign in with Facebook</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "thirdPartLogin",
  data() {
    return {
      google_client_id:
        "419219145785-htlnjghsrdg22r572k1kv4t2nnj74ptb.apps.googleusercontent.com",
      // google_client_id:'363378923852-950m83fuv1s7ivl3p2ims2tn0fikgqrd.apps.googleusercontent.com',
      facebook_id: "860199481374907"
    };
  },
  methods: {
    thirdLogin(tempLoginInfo){
      const loading = this.$loading({
        lock: true,
        text: 'Please wait...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
        customClass: 'cus-loading'
      })
      this.$store.dispatch("thirdLogin", tempLoginInfo).then(data => {
        this.$emit("thirdPartyLoginAfter");
      }).finally(()=>{
        loading.close();
      });
    },

    //fb登录逻辑
    fbLogin() {
      let that = this;
      FB.login(
        function(response) {
          let tempLoginInfo = {
            method: "facebook",
            token: response.authResponse.accessToken
          };
          that.thirdLogin(tempLoginInfo)
        },
        { scope: "public_profile,email" }
      );
    },
    appendTag(tagName, property) {
      let tag = document.createElement(tagName);
      for (let i in property) {
        tag[i] = property[i];
      }
      document.getElementsByTagName("head")[0].appendChild(tag)
    }
  },

  mounted() {
    this.appendTag("script", {
      type: "text/javascript",
      async:true,
      defer:true,
      src: "https://apis.google.com/js/platform.js?onload=onLoadGoogleCallback"
    });
    this.appendTag("script", {
      async:true,
      defer:true,
      type: "text/javascript",
      src: " https://accounts.google.com/gsi/client"
    });
    this.appendTag("script", {
      async:true,
      defer:true,
      type: "text/javascript",
      src: "https://connect.facebook.net/en_US/sdk.js"
    });

    let that = this;
    window.fbAsyncInit = function() {
      console.log(window)
      FB.init({
        appId: that.facebook_id,
        autoLogAppEvents: true,
        cookie: true, // Enable cookies to allow the server to access the session.
        xfbml: true, // Parse social plugins on this webpage.
        version: "v10.0" // Use this Graph API version for this call.
      });
    };

    window.onLoadGoogleCallback = function(){
      gapi.load("auth2", function() {
        let auth2 = gapi.auth2.init({
          client_id: that.google_client_id,
          cookiepolicy: "single_host_origin",
          scope: "profile" //可以请求除了默认的'profile' and 'email'之外的数据
        });
        auth2.attachClickHandler(
          document.getElementById("googleBtn"),
          {},
          function(googleUser) {
            console.log(googleUser.getAuthResponse(),googleUser,googleUser.getAuthResponse().id_token)
            let tempLoginInfo = {
              method: "google",
              token: googleUser.getAuthResponse().id_token
            };
            that.thirdLogin(tempLoginInfo)
          },
          function(error) {}
        );
      });
    }

    window.onload = function() {
      if(that.$store.state.authInfo){
        return
      }
      let handleCredentialResponse = (res) => {
        let tempLoginInfo = {
          method: "google",
          token: res.credential
        };
        that.thirdLogin(tempLoginInfo)
      };
      google.accounts.id.initialize({
        client_id: that.google_client_id,
        prompt_parent_id:'loginWrap',
        callback: handleCredentialResponse
      });
      google.accounts.id.prompt();
    };
  }
};
</script>

<style lang="scss" scoped>
.thirdPartLoginWrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.thirdBtn {
  display: flex;
  justify-content: start;
  align-items: center;
  @include px2rem(width, 400px);
  @include px2rem(height, 70px);
  @include px2rem(margin, 10px);
  @include px2rem(padding-left, 10px);
  @include px2rem(padding-right, 10px);
  background: white;
  color: #444;
  border-radius: 5px;
  border: thin solid #dcdfe6;
  white-space: nowrap;
  transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;

  span.label {
    font-family: serif;
    font-weight: normal;
  }

  span.icon {
    display: inline-block;
    vertical-align: middle;
    @include px2rem(width, 60px);
    @include px2rem(height, 60px);
    background-size: contain;
  }

  span.buttonText {
    display: inline-block;
    vertical-align: middle;
    @include px2rem(font-size, 24px);
    @include px2rem(margin-left, 10px);
  }

  &:hover {
    border-color: #409eff;
    background-color: #e3f1ff;
    cursor: pointer;
  }
}

#googleBtn {
  span.icon {
    background: url("../assets/images/@2x/google.png") transparent
      center/contain no-repeat;
  }
}

#facebookBtn {
  span.icon {
    background: url("../assets/images/@2x/facebook.png") transparent
      center/contain no-repeat;
  }
}

@media screen and (min-width: 751px) {
  .thirdPartLoginWrap {
    flex-direction: row;
    align-items: center;
  }

  .thirdBtn {
    width: 250px;
    height: 50px;
    margin: 5px;

    span.icon {
      width: 30px;
      height: 30px;
    }

    span.buttonText {
      font-size: 18px;
      margin-left: 10px;
    }
  }
}
</style>

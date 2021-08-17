import utils from "@/utils/utils";
import { login, emailToLogin, loginOut, fetchUserInfo } from "@/api/account";
import { getHeadInfo } from "@/api/public";
import { cartMerge } from "@/api/cart";
import { thirdPartLogin } from "@/api/account";

export const state = () => ({
  temp: "",
  headInfo: "", //网站头尾信息
  authInfo: "",
  otherConfig: "",
  cartTemp: "",
  cart: [],
  inquiry: [],
  checkoutCart: [],
  freeCart: [],
  device: [], //用来判断设备的
  showLoginDialog: false,
  acceptCookiesBanner: false,
  tempSizeAndQty: {
    sizeW: 1,
    sizeH: 1,
    qty: 1
  },
  showCouponDialog: false,
  freeOrders: ""
});
export const mutations = {
  Toggle_CouponDialog(state, data) {
    state.showCouponDialog = data;
  },
  SET_AcceptCookiesBanner(state, data) {
    state.acceptCookiesBanner = data;
  },
  SET_LOGINDIALOG(state, data) {
    state.showLoginDialog = data;
  },
  ADD_INQUIRY(state, data) {
    state.inquiry = [data];
  },
  CLEAR_INQUIRY(state) {
    state.inquiry = [];
  },
  SET_USER(state, data) {
    state.authInfo = data;
  },
  SET_CART(state, data) {
    state.cart = data;
  },
  ADD_CART(state, data) {
    state.cart.unshift(data);
  },
  ADD_CART_TEMP(state, data) {
    state.cartTemp = data;
  },
  ADD_FREEORDERS_TEMP(state, data) {
    state.freeOrders = data;
  },
  UPDATE_FREEORDERS_TEMP_REMARK(state, data) {
    state.freeOrders.remark = data;
  },
  updateCartTemp(state, data) {
    state.cartTemp = Object.assign({}, state.cartTemp, data);
  },
  UPDATE_CART(state, data) {
    let __VALUE__ = JSON.parse(JSON.stringify(state.cart));
    let findIndex = __VALUE__.findIndex(item => {
      return item.id === data.id;
    });
    if (findIndex > -1) {
      __VALUE__[findIndex] = Object.assign({}, __VALUE__[findIndex], data.data);
    }
    state.cart = __VALUE__;
  },
  REMOVE_CARTLIST(state, delIdList) {
    let fn = (cartList, delId) => {
      for (let i = cartList.length - 1; i >= 0; i--) {
        if (delId.includes(cartList[i].id)) {
          cartList.splice(i, 1);
        }
      }
    };
    let cartList = JSON.parse(JSON.stringify(state.cart));
    fn(cartList, delIdList);
    state.cart = cartList;
  },
  SET_HEADINFO(state, data) {
    state.headInfo = data;
  },
  SetDeviceType(state, data) {
    state.device = data;
  },
  SET_TEMP_SIZE(state, data) {
    state.tempSizeAndQty = data;
  },
  set_checkoutCart(state, data) {
    state.checkoutCart = data;
  },
  update_checkoutCart(state, data) {
    let __VALUE__ = JSON.parse(JSON.stringify(state.checkoutCart));
    let findIndex = __VALUE__.findIndex(item => {
      return item.id === data.id;
    });
    if (findIndex > -1) {
      __VALUE__[findIndex] = Object.assign({}, __VALUE__[findIndex], data.data);
    }
    state.checkoutCart = __VALUE__;
  }
};
export const getters = {
  cartNum: state => {
    if (state.authInfo) {
      return state.authInfo.cart;
    } else {
      return state.cart.length;
    }
  }
};
export const actions = {
  async nuxtServerInit({ dispatch, commit }, { req }) {
    let cookies = utils.getcookiesInServer(req);
    let token = cookies.token;
    if (token) {
      await dispatch("getUserInfo");
    }
    await dispatch("publicInfo");
  },

  publicInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getHeadInfo()
        .then(res => {
          commit("SET_HEADINFO", res.data);
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  getUserInfo({ state, commit }) {
    return new Promise(async (resolve, reject) => {
      fetchUserInfo()
        .then(res => {
          console.log(res)
          if (res.data.ret === 401) {
            commit("SET_USER", "");
            resolve();
          } else {
            commit("SET_USER", res.data);
            resolve();
          }
        })
        .catch(err => {
          console.log(err)
          reject(err);
        });
    });
  },

  syncShoppingCart({ commit, dispatch, state }, postData) {
    return new Promise(resolve => {
      let cartList = state.cart;
      let cartListCopy = JSON.parse(JSON.stringify(state.cart));
      let checkoutCart = state.checkoutCart;
      if (checkoutCart.length) {
        console.log(checkoutCart);
        let productList = [];
        checkoutCart.forEach(item => {
          let temp = {
            product_category_id: item.product_category_id,
            pic_path: item.pic_path,
            quantity: item.quantity,
            param_id_list: item.param_id_list,
            height: item.height,
            width: item.width,
            select_params: item.select_params,
            accessory: item.accessory,
            remark: item.remark
          };
          productList.push(temp);
          let delItem = cartList.find(cartObj => {
            return cartObj.id == item.id;
          });
          if (delItem) {
            commit("REMOVE_CARTLIST", [delItem.id]);
          }
        });
        cartMerge({
          productList: JSON.stringify(productList)
        })
          .then(res => {
            commit("set_checkoutCart", res.data);
            dispatch("getUserInfo").then(() => {
              resolve();
            });
          })
          .catch(err => {
            commit("SET_CART", cartListCopy);
          });
      } else {
        if (!cartList.length) {
          console.log("没有本地购物车");
          dispatch("getUserInfo").then(() => {
            resolve();
          });
        } else {
          console.log("有本地购物车");
          let productList = [];
          cartList.forEach(item => {
            let temp = {
              product_category_id: item.product_category_id,
              pic_path: item.pic_path,
              quantity: item.quantity,
              param_id_list: item.param_id_list,
              height: item.height,
              width: item.width,
              select_params: item.select_params,
              accessory: item.accessory,
              remark: item.remark
            };
            productList.push(temp);
          });
          cartMerge({
            productList: JSON.stringify(productList)
          }).finally(res => {
            commit("SET_CART", []);
            dispatch("getUserInfo").then(() => {
              resolve();
            });
          });
        }
      }
    });
  },

  logined({ commit, dispatch }, postData) {
    console.log("log", postData);
    return new Promise((resolve, reject) => {
      login(postData)
        .then(res => {
          let { data } = res;
          utils.setCookie("token", data.token);
          dispatch("syncShoppingCart").then(() => {
            resolve(data);
          });
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  thirdLogin({ commit, dispatch }, postData) {
    return new Promise((resolve, reject) => {
      thirdPartLogin(postData)
        .then(res => {
          let { data } = res;
          utils.setCookie("token", data.token);
          dispatch("syncShoppingCart").then(() => {
            resolve(data);
          });
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  emailLogin({ commit, dispatch }, postData) {
    return new Promise((resolve, reject) => {
      emailToLogin(postData)
        .then(res => {
          let { data } = res;
          utils.setCookie("token", data.token, 1);
          dispatch("syncShoppingCart").then(() => {
            resolve(data);
          });
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  logOut({ commit }) {
    return new Promise((resolve, reject) => {
      try {
        //facebook退出登录
        FB.logout();
        console.log("fb退出成功");
      } catch {
        console.log("fb退出失败");
      }
      try {
        // google退出登录
        let auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function() {
          console.log("google退出成功");
        });
      } catch {
        console.log("google退出失败");
      }
      loginOut()
        .then(res => {
          utils.removeCookie("token");
          commit("SET_USER", "");
          // commit('SET_CART', [])
          commit("set_checkoutCart", []);
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  }
};

export const state = () => ({
  device: null, //用来判断设备的
  language:[]
});
export const mutations = {
  SetDeviceType(state, data) {
    state.device = data;
  },
  LOCALE(state,data){
    state.language = data
  }
};
export const getters = {};
export const actions = {
  // 项目初始化执行的函数只在服务端执行一次
  async nuxtServerInit({commit,dispatch}, {req}) {

  },
};

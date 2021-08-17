import Vue from 'vue';
const globalBus = new Vue();
Vue.prototype.$Bus = globalBus;
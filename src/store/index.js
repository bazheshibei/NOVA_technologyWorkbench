// 组装模块并导出 store

import Vue from 'vue'
import Vuex from 'vuex'
/* 模块 */
// import UserInfo from './modules/userInfo' //     用户信息
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    // UserInfo
  },
  state: {},
  mutations: {
    /**
     * [设置初始化属性]
     */
    // setting(state,) {}
  }
})

export default store

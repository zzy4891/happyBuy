import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import localStore from '../assets/js/storage.js'
export default new Vuex.Store({


  state: {
    //数据默认设置为localStorage中的数据
    storeLs: localStore.get('list') || ''
  },

 
  mutations: {
    add(state, obj) {
      //此处是为了解决重复添加问题，可无视
      let arrLs = state.storeLs.find(v => v == obj)
      if (arrLs) {
        arrLs += obj
      } else {
        //接收到的数据添到storeLs中
        state.storeLs.push(obj)
      }
      //将数据存入本地
      localStore.set('list', state.storeLs)
    },
    
  }, 


  getters: {

  },
  actions: {

  },
  modules: {
    
  }
})

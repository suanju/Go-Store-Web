import Vue from 'vue'
import Vuex from 'vuex';
import createPersistence from "vuex-persistedstate"
import userStore from '@/store/user/user'
Vue.use(Vuex); //vue的插件机制

//Vuex.Store 构造器选项
export default new Vuex.Store({
	namespaced: true,
	modules: {
		userStore
	},
	 plugins: [
	    createPersistence({
	      key: 'userStore', // 存数据的key名   自定义的  要有语义化
	      paths: ['userStore'] // 要把那些模块加入缓存
	    })
	  ]
})

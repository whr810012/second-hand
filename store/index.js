import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)


const indexStore = new Vuex.Store({
	state: {
		admin:'',
		list: [{
				"pagePath": "/pages/home/home",
				"text": "主页",
				"iconPath": "/static/tabbar/no-index.svg",
				"selectedIconPath": "/static/tabbar/index.svg"
			},
			{
				pagePath:'/pages/addgoods/addgoods',
				iconPath: "/static/tabbar/fabu.png",
				selectedIconPath: "/static/tabbar/fabu.png",
				text: '',
				midButton: true,
			},
			{
				"pagePath": "/pages/myinfor/myinfor",
				"text": "我的",
				"iconPath": "/static/tabbar/no-my.svg",
				"selectedIconPath": "/static/tabbar/mymy.svg"
			}
		],
	},
	actions: {
	},
	mutations: {
	  changadmin(state, payload) {
	    state.admin = payload;
	  }
	},
})

export default indexStore;
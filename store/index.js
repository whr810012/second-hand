import Vue from 'vue'
import Vuex from 'vuex'

import {
	getPois,
	getUserPassStatus,
	getAllUserPass,
	createPass,
	postGetProducts,
	getQRCode,
	createOrderPay,
	getAllBus
} from '../utils/api'

Vue.use(Vuex)


const indexStore = new Vuex.Store({
	state: {
		pois: [],
		inPois: [],
		outPois: [],
		userPassStatus: '',
		allUserPass: [],
		allGoods: [],
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
		userLat: 0,
		userLong: 0,
		shop: {},
		bus: []
	},
	actions: {
		async getPois(context, data) {
			console.log('获取pois参数', data)
			const res = await getPois(data)
			context.state.pois = res.poi_list ? res.poi_list.map(i => {
				return {
					...i,
					index: i.id,
					item: i
				}
			}) : [],
			context.state.inPois = res.poi_in_region ? res.poi_in_region.map(i => {
				return {
					...i,
					index: i.id,
					item: i
				}
			}) : [],
			context.state.outPois = res.poi_outside_region ? res.poi_outside_region : []
			// return context.state.pois
			return res
		},
		async getShop(context, data) {
			console.log('参数', data);
			const res = await getPois(data)
			console.log(res);
			context.state.shop = res.products ? res.products : []
		},
		async getUserPassStatus(context, data) {
			const res = await getUserPassStatus(data)
			context.state.userPassStatus = res
			console.log(112233, res);
			console.log(223344, context.state.userPassStatus)
			return res
		},
		async getQRCode(context, data) {
			const res = await getQRCode(data)
			return res
		},
		async postGetProducts(context, data) {
			const res = await postGetProducts(data)
			context.state.allGoods = res.products
			return res.products
		},
		async getAllUserPass(context) {
			context.state.allUserPass = await getAllUserPass({ product_id: 1 })
			return context.state.allUserPass
		},
		createPass() {
			const res = createPass({
				pass_type: 1
			})
			console.log(res)
			return res
		},
		createOrderPay(context, data) {
			const res = createOrderPay(data)
			return res
		},
		getAllBus(context) {
			if (context.state.bus.length > 0) {
				return context.state.bus
			}
			const res = getAllBus()
			if (res.bus && res.bus.length > 0) {
				context.state.bus = res
			}
			return res
		}
	},
	mutations: {},
})

export default indexStore;
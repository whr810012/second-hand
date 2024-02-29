/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	getStorage,
	setStorage
} from '../utils/localstorage'
import {
	request
} from '../utils/request'


export const login = () => {
	return new Promise(resolve => {
		getStorage('token').then(token => {
			if (!token) {
				uni.login({
					success: async (res) => {
						console.log('uni.login', res)
						const loginResp = await request('/api/aomen/auth/wechat_login', {
							code: res.code
						}, 'POST')
						console.log('macao.login', loginResp)
						setStorage('token', loginResp.token)
						setStorage('user_name', loginResp.user_name)
						resolve(loginResp)
					}
				})
			}
		})
	})
}

// 不传入任何参数，获取所有poi（景点加商铺）如果选择了分类，调用时加入category字段
export const getPois = (data) => {
	return request('/client/api/aomen/poi/get_pois', data, 'POST')
}

// 获取当前用户最新的澳淘卡的情况，无需传入参数，只要token验证，用于判断用户是否有在有效期内的澳淘卡（或者没有购买澳淘卡）
export const getUserPassStatus = (data) => {
	return request('/client/api/aomen/pass/get_user_pass_status', data)
}

// 获取用户所有购买过的澳淘卡的历史记录，不用传参数，只用传token进行验证即可
export const getAllUserPass = (data) => {
	return request('/client/api/aomen/pass/get_all_user_pass', data)
}

// 获取二维码接口，如果用户澳淘卡有效，会返回二维码（string格式）。无需传入参数，只需要token进行验证
export const getQRCode = (data) => {
	return request('/client/api/aomen/qrcode/get_qr_code', data)
}
// 获取商品的信息统一接口，支持批量获取商品，根据分类筛选获取商品，分页获取，排序（价格升降序，评分升降序），以及搜索商品名称获取匹配商品
export const postGetProducts = (data) => {
	return request('/client/api/aomen/product/get_products', data, 'POST')
}

// 在用户支付后，用于创建澳淘卡记录
export const createPass = (data) => {
	return request('/client/api/aomen/pass/create_pass', data, 'POST')
}

// 支付接口
export const createOrderPay = (data) => {
	return request('/client/api/aomen/order/create_order', data, 'POST')
}
// 发财车
export const getAllBus = () => {
	return request('/client/api/aomen/bus/get_all_bus', {})
}
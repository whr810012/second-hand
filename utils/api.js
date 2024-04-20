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
export const getgoodslist = (data) => {
	return request('/client/api/aomen/poi/get_pois', data, 'POST')
}

// 获取当前用户最新的澳淘卡的情况，无需传入参数，只要token验证，用于判断用户是否有在有效期内的澳淘卡（或者没有购买澳淘卡）
export const getoverlist = (data) => {
	return request('/client/api/aomen/pass/get_user_pass_status', data)
}

export const addgoods = (data) => {
	return request('/client/api/aomen/pass/get_user_pass_status', data)
}

export const dele = (data) => {
	return request('/client/api/aomen/pass/get_user_pass_status', data)
}

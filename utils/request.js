// import string from '@tuniao/tnui-vue3-uniapp/libs/async-validator/validator/string'
import { login } from '../utils/api'
import { removeStorage } from './localstorage'

// const BASE_URL = 'http://43.192.135.13:8888/api'
// const BASE_URL = 'https://aomen.tutu-ai.cn'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const request = (url, data, method = 'GET') => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: BASE_URL + url,
			data,
			header: {
				authorization: uni.getStorageSync('token')
			},
			timeout: 100000,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			method: method,
			success: (res) => {
				if (res.statusCode !== 200) {
					reject(res)
				}
				if (res.data.code === 401) {
					removeStorage('token')
					login().then(() => {
						request(url, data, method).then((res) => {
							resolve(res)
						})
					})
				} else {
					resolve(res.data)
				}
			},
			fail: (err) => {
				reject(err)
			},
			complete: () => {
			}
		})
	})
}

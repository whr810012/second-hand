/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	getStorage,
	setStorage
} from '../utils/localstorage'
import {
	request
} from '../utils/request'


export const login = (data) => {
	return request('/login', data, 'POST')
}

export const getAllGoods = () => {
    return request('/getgoods')
}

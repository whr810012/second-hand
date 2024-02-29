<script>
	import indexStore from '../store/index'
import { login } from '../utils/api.js'
	export default {
		onLaunch: async function() {
			console.log('App Launch')
			// await login()
			// await indexStore.dispatch('getUserPassStatus', {})
			// // console.log('indexStore.state.userPassStatus.msg', indexStore.state.userPassStatus)
			// if (indexStore.state.userPassStatus.msg === 'User has no pass') {
			// 	console.log('还没买过')
			// } else {
			// 	uni.switchTab({
			// 		url: '/pages/map/map'
			// 	})
			// }
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";
</style>

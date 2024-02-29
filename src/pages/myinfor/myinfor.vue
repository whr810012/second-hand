<template>
	<view>
		<u-tabbar class="tabbar" :list="tablist" :mid-button="true" bg-color="rgba(255, 255, 255, 1)"
			inactive-color="rgba(41, 44, 53, 0.30)" mid-button-size="150rpx" icon-size="48rpx" @change="clicktabbar">
		</u-tabbar>
	</view>
</template>

<script>
	import indexStore from '../../../store/index.js'
	export default {
		data() {
			return {
				tablist: ''
			}
		},
		methods: {
			onLoad() {
			
				this.tablist = indexStore.state.list
			},
		}
	}
</script>

<style>

</style>

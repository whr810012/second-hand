<template>
	<view class="qd_code_box">
		<view style="width: 80rpx; height: 80rpx;">
		</view>
		<view class="qd_code" @click="clickqd">
			<image src="@/static/tabbar/tab-center.png" mode=""></image>
		</view>
		<view class="back" @click="goback">
			<image src="@/static/tabbar/tab-back.svg" mode=""></image>
		</view>
	</view>
</template>

<script>
	export default {
		name: "qd-code",
		data() {
			return {

			}
		},
		methods:{
			clickqd() {
				this.$emit('update:popup', true)
			},
			goback() {
				console.log('子组件')
				this.$emit("goback")
			}
		}
	}
</script>

<style scoped lang="scss">
	.qd_code_box {
		width: 750rpx;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		.qd_code{
			image{
				width: 180rpx;
				height: 180rpx;
			}
		}
		.back{
			width: 80rpx;
			height: 80rpx;
			border-radius: 64rpx;
			opacity: 0.9;
			background: #FFF;
			display: flex;
			justify-content: center;
			align-items: center;
			box-shadow:0px 0px 5px 4rpx rgba(0, 0, 0, 0.05);
			image{
				width: 40rpx;
				height: 40rpx;
			}
		}
	}
</style>
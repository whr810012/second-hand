<template>
	<view class="myorder">
		<view class="myru">
			<view class="rutext">
				我买到的商品
			</view>
			<view class="rugoods" v-for="item in 3">
				<view class="ruimg">
					<img src="../../static/btn.png" alt="">
				</view>
				<view class="runame">
					名称111111111111111111
				</view>
				<view class="ruprice">
					价格
				</view>
				<view class="ruaddress">
					位置
				</view>
				<view class="rutime">
					时间
				</view>
			</view>
		</view>
		<view class="myru">
			<view class="rutext">
				我卖出的商品
			</view>
			<view class="rugoods" v-for="item in 3">
				<view class="ruimg">
					<img src="../../static/btn.png" alt="">
				</view>
				<view class="runame">
					名称111111111111111111
				</view>
				<view class="ruprice">
					价格
				</view>
				<view class="ruaddress">
					位置
				</view>
				<view class="rutime">
					时间
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {

		}
	},
	methods: {

	}
}
</script>

<style lang="scss" scoped>
.myorder {
	.myru {
		.rutext {
			text-align: center;
			font-size: 18px;
			font-weight: 600;
			background-color: #f5f5f5;
			padding: 10rpx;
		}

		.rugoods {
			display: flex;
			justify-content: space-around;
			align-items: center;
			background-color: rgb(158, 182, 203);
			margin-top: 10rpx;
			margin-bottom: 10rpx;

			.ruimg {
				width: 100rpx;
				height: 100rpx;
				margin-right: 20rpx;
				img {
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
				}

			}
			.runame{
				font-size: 16px;
				font-weight: 600;
				width: 90rpx;
				// 超出不显示
				overflow: hidden;
				// 只允许一行
				white-space: nowrap;
				margin-right: 10rpx;
			}
			.runame{
				font-size: 16px;
				font-weight: 600;
				width: 90rpx;
				// 超出不显示
				overflow: hidden;
				// 只允许一行
				white-space: nowrap;
				margin-right: 10rpx;
			}
			.ruprice{
				font-size: 16px;
				font-weight: 600;
				width: 90rpx;
				// 超出不显示
				overflow: hidden;
				// 只允许一行
				white-space: nowrap;
				margin-right: 10rpx;
			}
			.ruaddress{
				font-size: 16px;
				font-weight: 600;
				width: 90rpx;
				// 超出不显示
				overflow: hidden;
				// 只允许一行
				white-space: nowrap;
				margin-right: 10rpx;
			}
			.rutime{
				font-size: 16px;
				font-weight: 600;
				width: 90rpx;
				// 超出不显示
				overflow: hidden;
				// 只允许一行
				white-space: nowrap;
				margin-right: 10rpx;
			}
		}
	}
}
</style>

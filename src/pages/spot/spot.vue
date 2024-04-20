<template>
	<view>
		<view class="spot">
			<u-swiper :list="imageList" mode="number" indicator-pos="topRight" duration="3000" :circular="true"
				height="942"></u-swiper>
		</view>
		<view class="spot-text">
			<view class="detail-name-left">
				<view class="shopping-name">{{spotdetail.name}}</view>
				<view class="shopping-detail" v-if="spotdetail.desc">
					{{spotdetail.desc}}
				</view>
			</view>
			<u-gap height="8" bg-color="#F5F5F5"></u-gap>
			<view style="background-color:#FFFFFF;">
				<view class="information-time">
					<image src="@/static/time.svg" />
					<view class="time-text">营业时间：{{spotdetail.open_hours||"10:00--19:00"}}</view>
				</view>
			</view>
			<view class="line"></view>
			<view class="information-address">
				<view class="information-address-left">
					<view class="address-icon">
						<image src="@/static/address.svg" />
					</view>
					<view class="address-box">
						<!-- <view class="detail-address">{{spotdetail.address}}</view> -->
						<view class="distance">距离你当前地点{{ distance || "..." }}千米</view>
					</view>
				</view>
				<!-- 分割线 -->
				<view style="background-color: rgba(41, 44, 53, 0.15); width:1rpx;height:46rpx;"></view>
				<view class="information-address-right" @click="nav(spotdetail)">
					<view class="address_image">
						<image src="@/static/go.svg" />
					</view>
					<view>导航</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	
	import indexStore from '../../../store/index.js'
	import {
		space
	} from '../../../utils/utils.js'
	export default {
		components: {
			
		},
		data() {
			return {
				imageList: [],
				textState: 0,
				spotdetail: '',
				distance: 0
			};
		},
		async onLoad(option) {
			console.log(option.item);
			console.log("goods拿过来的", JSON.parse(decodeURIComponent(option.item)));
			this.spotdetail = JSON.parse(decodeURIComponent(option.item))
			this.distance = JSON.parse(decodeURIComponent(option.item)).dis
			this.imageList = JSON.parse(decodeURIComponent(option.item)).imageList
			
			// 获取景点数据
			// const spotlist = await indexStore.dispatch('getPois', {
			// 	id:JSON.parse(decodeURIComponent(option.item)).id
			// });
			// console.log(spotlist);
			// this.spotdetail = spotlist.poi_list[0]
			// this.imageList = this.spotdetail.img_url
			// console.log('this.imglist',this.imageList);
			// console.log("this.spotdeatil:", this.spotdetail);
			// 获取当前经纬度
			// uni.getLocation({
			// 	success: (res) => {
			// 		console.log('当前位置的经度：' + res.longitude);
			// 		console.log('当前位置的纬度：' + res.latitude);
			// 		this.distance = space(res.latitude, res.longitude, this.spotdetail.position.lat, this
			// 			.spotdetail.position.long).toFixed(1)
			// 		console.log("相差距离", this.distance);
			// 	}
			// })
		},

		methods: {
			goback() {
				console.log('父组件')
				uni.navigateBack()
			},
			nav(item) {
				console.log('nav=', item);
				uni.openLocation({
				    longitude: +item.longitude,
				    latitude: +item.latitude,
				    // destination: item.name,
				    // address: item.address,
				    success: function (res) {
				        console.log('打开系统位置地图成功')
				    },
				    fail: function (error) {
				        console.log(error)
				    }
				})
			}
		}
	};
</script>

<style lang="scss" scoped>
	// 店名+簡介
	.spot-text {
		position: fixed;
		bottom: 0;
		height: 800rpx;
		background-color: white;
		border-radius: 40rpx 40rpx 0rpx 0rpx;
		width: 100%;

		.shopping-name {
			margin-top: 28rpx;
			margin-left: 40rpx;
			height: 50rpx;
			color: #292c35;
			text-align: left;
			font-family: PingFang SC;
			font-size: 36rpx;
			font-style: normal;
			font-weight: 500;
			line-height: normal;
		}

		.shopping-detail {
			margin-top: 8rpx;
			margin-bottom: 16rpx;
			margin-left: 40rpx;
			width: 90%;
			color: rgba(41, 44, 53, 0.6);
			font-family: PingFang SC;
			font-size: 24rpx;
			font-style: normal;
			font-weight: 400;
			line-height: normal;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 5;
			/* 控制显示行数 */
			-webkit-box-orient: vertical;

		}
	}

	//營業時間 
	.information-time {
		margin-left: 40rpx;
		height: 100rpx;
		background-color: #fff;
		display: flex;
		align-items: center;

		image {
			width: 24rpx;
			height: 24rpx
		}

		.time-text {
			padding-left: 12rpx;
		}
	}

	// 分割線
	.line {
		margin-left: 24rpx;
		width: 700rpx;
		height: 1rpx;
		background-color: rgba(41, 44, 53, 0.1);
	}

	// 位置信息
	.information-address {
		height: 180rpx;
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: space-between;

		// left
		.information-address-left {
			margin-left: 40rpx;
			display: flex;
			justify-content: center;

			.address-icon {
				image {
					width: 24rpx;
					height: 24rpx;
				}
			}

			.address-box {
				padding-left: 12rpx;

				// 地址
				.detail-address {
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					/* 控制显示行数 */
					-webkit-box-orient: vertical;
					width: 422rpx;
					max-height: 68rpx;
					min-height: 34rpx;
					font-size: 24rpx;
					color: #292c35;
					font-family: PingFang SC;
					font-style: normal;
					font-weight: 400;
					line-height: normal;
					letter-spacing: 0.311px;
				}

				// 距离
				.distance {
					padding-top: 16rpx;
					color: rgba(41, 44, 53, 0.6);
					font-family: PingFang SC;
					font-size: 12px;
					font-style: normal;
					font-weight: 400;
					line-height: 12px;
					/* 100% */
					letter-spacing: 0.311px;
				}
			}

		}

		// right
		.information-address-right {
			vertical-align: middle;
			margin-right: 36rpx;

			.address_image {
				display: flex;
				justify-content: center;
				align-items: center;
				padding-bottom: 2rpx;

				image {
					width: 36rpx;
					height: 36rpx
				}
			}
		}
	}

	// 二维码组件定位
	.qd-code {
		position: fixed;
		bottom: 62rpx;
		left: 0rpx;
	}

	// 組件背景顏色
	.popup {
		::v-deep .u-mode-center-box {
			background-color: transparent !important;
		}
	}
</style>
<template>
	<view>
		<u-popup v-model="show" mode="bottom" :mask="false" :custom-style="cStyle">
			<view class="popup_box">
				<view class="popup" :class="clickclass == 'shop' ? 'popup_spot' : 'popup_eat'">
					<view class="popup_top">{{ item.name }}</view>
					<view class="popup-center">
						<view>{{ item.desc }}</view>
					</view>
					<view class="popup_bottom">
						<view class="popup_bottom_distance">
							<view class="distance_text">相距 {{ dis }} 千米</view>
							<image src="@/static/goaddress.svg" mode=""></image>
							<view class="goaddress_text" @click="nav(item)">导航</view>
						</view>
						<view class="popup_bottom_shop" @click="toShop(item)">查&nbsp;&nbsp;看</view>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import indexStore from '../../../store/index.js'
	export default {
		name: "map-popup",
		data() {
			return {
				show: false,
				cStyle: {
					backgroundColor: 'rgba(0, 0, 0, 0)'
				}
			};
		},
		props: {
			clickclass: {
				type: String,
				default: 'eat'
			},
			item: {
				type: Object,
				default: () => {}
			},
			dis: {
				type: Number,
				default: 0
			}
		},
		methods: {
			async change(id) {
				console.log(id);

				this.show = true
				console.log('子组件', this.item);
				console.log('子组件距离', this.dis);
			},
			nav(item) {
				this.$emit('nav', item)
			},
			toShop(item) {
				console.log('类型', item.type);
				console.log(item);
				
				item.shop_id = item.id
				console.log('跳转spot');
				uni.navigateTo({
					url: `/pages/spot/spot?item=${encodeURIComponent(JSON.stringify(item))}`
				});

			}
		},
		computed: {
			// checkpopupshow() {
			// 	this.show = this.popupshow
			// }
		}
	}
</script>

<style lang="scss" scoped>
	.popup_box {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;

		.popup_eat {
			border: 4rpx solid #075B8A;
		}

		.popup_spot {
			border: 4rpx solid #B24949;
		}

		.popup {
			width: 640rpx;
			margin-bottom: 248rpx;
			border-radius: 10px;
			background: #FFF;
			box-shadow: 0px 10px 18px 0px rgba(0, 0, 0, 0.16);
			display: grid;
			justify-content: center;

			.popup_top {
				margin-top: 28rpx;
				color: var(#292C35);
				text-align: left;
				font-family: PingFang SC;
				font-size: 14px;
				font-style: normal;
				font-weight: 500;
				line-height: normal;
				letter-spacing: 0.237px;
			}

			.popup-center {
				margin-top: 8rpx;
				margin-bottom: 30rpx;
				width: 284px;
				color: rgba(41, 44, 53, 0.60);
				font-family: PingFang SC;
				font-size: 12px;
				font-style: normal;
				font-weight: 400;
				line-height: normal;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				/* 控制显示行数 */
				-webkit-box-orient: vertical;
			}

			.popup_bottom {
				margin-bottom: 24rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.popup_bottom_distance {
					display: flex;
					align-items: center;

					image {
						width: 40rpx;
						height: 40rpx;
						margin-left: 12rpx;
						margin-right: 4rpx;
					}

					.distance_text {
						color: rgba(41, 44, 53, 0.60);
						text-align: center;
						font-family: PingFang SC;
						font-size: 14px;
						font-style: normal;
						font-weight: 400;
						line-height: normal;
						letter-spacing: 0.237px;
					}

					.goaddress_text {
						color: var(#292C35);
						text-align: center;
						font-family: PingFang SC;
						font-size: 24rpx;
						font-style: normal;
						font-weight: 400;
						line-height: normal;
						letter-spacing: 0.311px;
					}
				}

				.popup_bottom_shop {
					width: 140rpx;
					height: 56rpx;
					border-radius: 60rpx;
					background: #B24949;
					color: #FFF;
					text-align: center;
					font-family: PingFang SC;
					font-size: 12px;
					font-style: normal;
					font-weight: 500;
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}
		}
	}
</style>
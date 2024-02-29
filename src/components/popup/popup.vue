<template>
	<view>
		<u-popup v-model="isPopup" mode="center" :mask-close-able="false">
			<view class="popup-box">
				<view class="uni-margin-wrap">
					<swiper class="swiper" @change="changeShow" @transition="changeShow"
						indicator-color="rgba(255, 255, 255, .3)" circular :indicator-dots="indicatorDots"
						:autoplay="autoplay" :interval="interval" :duration="duration" :current="current">
						<swiper-item class="swiper-item" v-for="item in popupList" :key="item.id">
							<image class="swiper-item-img" :src='item.imgUrl' />
							<view class="qr-box" v-if="isqr">
								<image :src="'data:image/png;base64,'+qrcode" mode=""></image>
								<view class="timeout">
									{{time}} 秒后进行刷新
									<view style="position: absolute;right: 0; bottom: -40rpx;" @click="toHistory">
										支付记录
										<u-icon name="arrow-right" color="rgba(89, 40, 20, 0.60)" size="20"></u-icon>
									</view>
								</view>
							</view>
						</swiper-item>
					</swiper>
				</view>
				<view class="popup-bottom" v-if="isButton">
					<view style="height:100rpx; width:400rpx" @click="bugCar">
						{{textList[textState]}}
					</view>
				</view>
				<view class="popup-close" :class="isButton ? 'popup-close-havebottom' : 'popup-close-nobottom'"
					@click="closePopup" v-if="isClose&&isShow">
					<!-- <image src="@/static/close.svg"></image> -->
					<u-icon name="close-circle" color="#FFF" size="72"></u-icon>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import indexStore from '../../../store/index.js'
	import {
		getQRCode
	} from '../../../utils/api.js'
	export default {
		name: 'openPopup',
		data() {
			return {
				// 轮播图使用的
				//显示点
				indicatorDots: true,
				// 滚动
				autoplay: true,
				interval: 2000,
				duration: 500,
				// 按钮消失
				isShow: false,
				// 当前轮播页码
				current: 0,
				// 文字显示
				textList: ['畅玩澳门', '9.9元 续购'],
				// 二维码
				qrcode: '',
				// 二维码是否显示
				isqr: false,
				// 倒计时
				time: 30,
				timer: null
			}
		},
		props: {
			// 控制整体显示
			isPopup: {
				type: Boolean,
				default: false
			},
			// 控制关闭icon显示
			isClose: {
				type: Boolean,
				default: false,
			},
			// 控制按钮显示
			isButton: {
				type: Boolean,
				default: false
			},
			// 轮播图数据
			popupList: {
				type: Array,
				default: () => []
			},
			// 按钮使用哪个文字
			textState: {
				type: Number,
				default: 0
			}

		},
		methods: {
			closePopup() {
				this.$emit('update:popup', false)
				this.isqr = false
				this.time = 30
				clearInterval(this.timer)
				console.log(this.timer);
			},
			bugCar() {
				// this.closePopup()
				// console.log('购买');
				this.$emit('popBtn')
			},
			// 轮播到最后一页，关闭icon显示
			changeShow(e) {
				if (this.isClose === true && e.detail.current + 1 == this.popupList.length) {
					this.isShow = true
				}
			},
			// 获取二维码
			async getQRCode() {
				const res = await indexStore.dispatch('getQRCode', {})
				this.qrcode = res.qrcode
				console.log(res);
				console.log(this.qrcode);
			},
			// 倒计时30
			setTime() {
				this.timer = setInterval(() => {
					if (this.time === 1) {
						this.getQRCode()
						this.time = 31
					}
					this.time--
				}, 1000)
			},
			toHistory() {
				console.log('记录');
				uni.navigateTo({
					url: '/pages/pay-history/pay-history'
				})
			}
		},
		computed: {
			// 轮播只有一页的时候，立即显示关闭icon
			checkPopupTrue() {
				if (this.isPopup === true && this.current === this.popupList.length - 1) {
					return this.isShow = true
				}
			},
			// 轮播只有一页，不显示轮播点
			checkCurrent() {
				if (this.popupList.length === 1) {
					return this.indicatorDots = false
				}
			},
			// 检测是否是二维码页面
			checkIcon() {
				if (this.isClose && this.isPopup && !this.isButton) {
					this.getQRCode()
					this.isqr = true
					this.setTime()
				}
			}

		}
	}
</script>

<style scoped lang="scss">
	// 最外层
	.popup-box {
		position: relative;
		bottom: 80rpx;
		height: 1270rpx;
		width: 724rpx;
	}

	// 轮播图
	.uni-margin-wrap {
		// position: absolute;
		// top: 0rpx;
		width: 724rpx;
		height: 1270rpx;

		.swiper {
			height: 100%;

			.swiper-item {
				.swiper-item-img {
					width: 724rpx;
					height: 1270rpx;
					border-radius: 60rpx;
				}

				//二维码
				.qr-box {
					position: absolute;
					bottom: 356rpx;
					left: 186rpx;

					image {
						width: 320rpx;
						height: 320rpx;
						border-radius: 20rpx;
					}

					.timeout {
						width: 320rpx;
						text-align: right;
						color: rgba(89, 40, 20, 0.60);
						font-family: PingFang SC;
						font-size: 20rpx;
						font-style: normal;
						margin-top: 30rpx;
					}
				}
			}
		}
	}


	//按钮 
	.popup-bottom {
		// margin-top: 36rpx;
		position: absolute;
		left: calc(50% - 200rpx);
		bottom: -10rpx;
		display: flex;
		justify-content: center;

		view {
			border-radius: 120rpx;
			background-color: #B24949;
			text-align: center;
			color: #FFFFFF;
			font-family: FZCuHuoYi-M25S;
			font-size: 40rpx;
			font-weight: 400;
			line-height: 18rpx;
			// 文字垂直居中
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	// 关闭键
	.popup-close {
		position: absolute;
		left: calc(50% - 36rpx);
		
		image {
			width: 72rpx;
			height: 72rpx;
		}
	}

	.popup-close-havebottom {
		bottom: 0rpx;
	}

	.popup-close-nobottom {
		bottom: 120rpx;
	}
</style>
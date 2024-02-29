<template>
	<view class="detail">
		<view class="detail-image" v-if="shopdetail.img_url">

			<scroll-view class="scroll-view_H" scroll-x="true" scroll-left="0" enable-flex="true">
				<view class="scroll-view-item_H" v-for="item in shopdetail.img_url" :key="item" @touchend="changeRight"
					@click="seeImg">
					<image class="scroll-img"
						:src="item||'http://pic.sc.chinaz.com/Files/pic/pic9/202002/zzpic23327_s.jpg'" mode />
				</view>
				<view :class="isRight ? 'activeSeeAll' : 'seeAll'" v-if="shopdetail.img_url.length > 2">
					<view class="seeAll-box" @click="seeImg">
						<text class="seeAll-text">{{seeALLtext}}</text>
						<image class="seeAll-icon" src="@/static/left.svg"></image>
					</view>
				</view>
			</scroll-view>
		</view>


		<!-- 店名+介绍+图片 -->
		<view class="detail-name">
			<view class="detail-name-left">
				<view class="shopping-name">{{shopdetail.name}}</view>
				<scroll-view scroll-y  class="shopping-detail">{{shopdetail.desc}}</scroll-view>
			</view>
			<view class="detail-name-right">
				<view class="shopping-image">
					<image :src="shopdetail.img_url[0] || shopimg"  />
				</view>
	<!-- 			<view class="shopping-discount">
					<image src="@/static/discount.svg" />
				</view> -->
			</view>
		</view>
		<!-- 营业时间+位置 -->
		<view class="detail-information">
			<!-- 营业时间 -->
			<view class="information-time-box">
				<view class="information-time">
					<image src="@/static/time.svg" />
					<view class="time-right">营业时间：{{shopdetail.open_hours||"9:00-11:00"}}</view>
				</view>
			</view>
			<!-- 分割线 -->
			<view class="line"></view>
			<!-- 店铺位置 -->
			<view class="information-address">
				<view class="information-address-left">
					<view class="address-icon">
						<image src="@/static/address.svg" />
					</view>
					<view class="address-box">
						<view class="detail-address">{{shopdetail.address}}</view>
						<view class="distance" v-if="distance">距离你当前地点 {{ distance }} 千米</view>
						<view class="distance" v-else>距离你当前地点 ... 千米</view>
					</view>
				</view>
				<!-- 分割线 -->
				<view style="background-color: rgba(41, 44, 53, 0.15); width:1rpx;height:46rpx;"></view>
				<view class="information-address-right" @click="nav(shopdetail)">
					<view class="address_image">
						<image src="@/static/go.svg" />
					</view>
					<view>导航</view>
				</view>
			</view>
		</view>
		<!-- 畅销top4 -->
		<view class="detail-four" v-if="goodslist && goodslist.length">
			<!-- 文字 -->
			<view class="detail-four-text">畅销Top4商品</view>
			<!-- 循环4 -->
			<view v-for="(item,index) in goodslist" :key="item.id" class="goods_detail"
				:class="index+1 === goodslist.length ? 'border_none' : ''">
				<!-- 有问题显示 -->
				<view class="goods_detail_box" v-if="item.discount == -1||item.discount == 1">
					<view class="goods_detail_image">
						<image :src="item.img_url[0]" />
					</view>
					<view class="goods_detail_text">
						<view class="goods-name">{{item.name}}</view>
						<!-- 三种判断 -->
						<view v-if="item.discount == -1&&item.discounted_price == 0">
							<view class="goods_detail_text_price" style="display: block;">
								<view>
									<span class="price_number_change">￥{{item.special_discount}}</span>
								</view>
								<view class="price_max_change" >市价{{item.price}}元</view>
							</view>
						</view>
						<view v-if="item.discount == -1&&item.discounted_price != 0">
							<view class="goods_discount_change">
								<!-- <image src="@/static/discounttwo.svg" /> -->
								<u-icon name="tags-fill" color="#B24949" size="20"></u-icon>
								{{item.special_discount}}
							</view>
							<view class="goods_detail_text_price">
								<view>
									<span class="price_icon">￥</span>
									<span class="price_number">{{item.discounted_price}}</span>
								</view>
								<view class="price_max">市价{{item.price}}元</view>
							</view>
						</view>
						<view v-if="item.discount == 1">
							<view class="goods_detail_text_price">
								<view>
									<span class="price_icon">￥</span>
									<span class="price_number">{{item.discounted_price}}</span>
								</view>
							</view>
						</view>

					</view>
				</view>
				<!-- 正常 -->
				<view class="goods_detail_box" v-else>
					<view class="goods_detail_image">
						<image :src="item.img_url[0]" />
					</view>
					<view class="goods_detail_text">
						<view class="goods-name">{{item.name}}</view>
						<view class="goods_discount">
							<!-- <image src="@/static/discounttwo.svg" /> -->
							<u-icon name="tags-fill" color="#B24949" size="20"></u-icon>
							{{item.discount*10}}折
						</view>
						<view class="goods_detail_text_price">
							<view>
								<span class="price_icon">￥</span>
								<span class="price_number">{{item.discounted_price}}</span>
							</view>
							<view class="price_max">市价{{item.price}}元</view>
						</view>
					</view>
				</view>

			</view>
			<!-- 提示 -->
			<view class="hint">🔥更多特色商品请到店铺选购</view>
		</view>
		<popup class="popup" :popupList="popupList" :isPopup="isPopup" :isClose="isClose" :isButton="isButton"
			:textState="textState" :popup.sync="isPopup">
		</popup>
		<qd-code class="qd-code" :popup.sync="isPopup" @goback="goback"></qd-code>
	</view>
</template>

<script>
	import indexStore from '../../../store/index.js'
	import {
		space
	} from '../../../utils/utils.js'
	import popup from '@/components/popup/popup.vue'
	export default {
		components: {
			popup
		},
		data() {
			return {
				shopimg:'',
				seeALLtext: '查看更多',
				// seeall class切换
				isRight: false,
				// 到没到最底部
				toRight: false,
				shopdetail: '',
				goodslist: [],
				// 距离
				distance: '',
				// 轮播图数据
				popupList: [{
					id: 0,
					imgUrl: 'https://tutu-aomen.s3.cn-northwest-1.amazonaws.com.cn/landing/%E4%BA%8C%E7%BB%B4%E7%A0%81%E5%BC%B9%E7%AA%97.png'
				}, ],
				// 控制弹窗
				isPopup: false,
				// 是否有按钮
				isButton: false,
				// 是否有关闭icon
				isClose: true,
				// textState：文字状态
				// 0为：畅玩澳门，1：9.9元 续购
				textState: 0,
				userLat: '',
				userLong: ''
			}
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: '澳淘卡',
				path: '/pages/index/index',
				imageUrl: 'https://tutu-aomen.s3.cn-northwest-1.amazonaws.com.cn/poi_icons/澳淘卡.png'
			}
		},
		methods: {
			// 滑动结束事件
			changeRight() {
				console.log(123, this.toRight, this.isRight);
				const observer = uni.createIntersectionObserver(this);
				// 检测是否滑动到底部
				observer.relativeTo('.scroll-view_H', {
					right: -40
				}).observe('.seeAll', (res) => {
					this.seeALLtext = "释放查看"
					this.toRight = true
				})
				if (this.toRight) {
					// 跳转+让查看所有消失
					this.isRight = true
					uni.navigateTo({
						url: `/pages/storeImage/storeImage?imglist=${encodeURIComponent(JSON.stringify(this.shopdetail.img_url))}&videolist=${encodeURIComponent(JSON.stringify(this.shopdetail.video_url))}`,
						success: () => {

							this.isRight = false
							this.toRight = false
							this.seeALLtext = '查看所有'
							console.log('跳转前isright', this.isRight);
							console.log('跳转前toright', this.toRight);
							console.log('跳转前seealltext', this.seeALLtext);
						}
					})
				}
			},
			seeImg() {
				uni.navigateTo({
					url: `/pages/storeImage/storeImage?imglist=${encodeURIComponent(JSON.stringify(this.shopdetail.img_url))}&videolist=${encodeURIComponent(JSON.stringify(this.shopdetail.video_url))}`
				})
			},
			goback() {
				console.log('父组件')
				uni.navigateBack()
			},
			nav(item) {
				console.log('nav=', item);
				uni.openLocation({
					longitude: +item.position.nav_lon,
					latitude: +item.position.nav_lat,
					destination: item.name,
					address: item.address,
					success: function(res) {
						console.log('打开系统位置地图成功')
					},
					fail: function(error) {
						console.log(error)
					}
				})
			},
			getUserLocation() {
				return new Promise((resove, rel) => {
					uni.getLocation({
						success: (res) => {
							console.log('当前位置的经度：' + res.longitude);
							console.log('当前位置的纬度：' + res.latitude);
							this.userLat = res.latitude
							this.userLong = res.longitude
							resove(true)
						},
						fail: err => {
							console.log('未授权')
							rel(err)
						}
					})
				})
			}
		},
		async onLoad(option) {
			// 拿店铺数据
			// console.log(option.item);
			console.log("goods拿过来的", JSON.parse(decodeURIComponent(option.item)));
			
			console.log((JSON.parse(decodeURIComponent(option.item))).img_url[0]);
			this.shopimg = (JSON.parse(decodeURIComponent(option.item))).img_url[0]
			console.log(this.shopimg);
			// 获取当前经纬度
			await this.getUserLocation()
			// uni.getLocation({
			// 	success: (res) => {
			// 		console.log('当前位置的经度：' + res.longitude);
			// 		console.log('当前位置的纬度：' + res.latitude);
			// 		this.userLat = res.latitude
			// 		this.userLong = res.longitude
			// 		this.distance = space(res.latitude, res.longitude, this.shopdetail.position.lat, this
			// 			.shopdetail.position.long).toFixed(1)
			// 		console.log("相差距离", this.distance);
			// 	}
			// })
			console.log('.shop_id', option.item.shop_id);
			// console.log('.chain_store_id',JSON.parse(decodeURIComponent(option.item)).chain_store_id);

			const shop_id = JSON.parse(decodeURIComponent(option.item)).shop_id

			const chain_store_id = JSON.parse(decodeURIComponent(option.item)).chain_store_id
			const shoplist = await indexStore.dispatch('getPois', {
				id: shop_id,
				user_loc: {
					long: this.userLong,
					lat: this.userLat
				},
				chain_store_id: chain_store_id
			})
			console.log("总的店铺数据", shoplist);
			this.shopdetail = shoplist.poi_list[0]
			this.goodslist = shoplist.products || []
			console.log('商铺信息', this.shopdetail)
			console.log('商品信息', this.goodslist)
			this.distance = space(this.userLat, this.userLong, this.shopdetail.position.lat, this
				.shopdetail.position.long).toFixed(1)
			console.log("相差距离", this.distance);
		},
		onReady() {
			console.log('ready');


		}
	}
</script>

<style scoped lang="scss">
	// 总
	.detail {
		background: #f5f5f5;
	}

	/* 1.横向滑动图片 */
	.detail-image {
		height: 262rpx;
		width: 100%;

		// 开始滑动
		.scroll-view_H {
			margin: 0rpx auto;
			width: 100%;
			height: 100%;
			white-space: nowrap;
			overflow: hidden;

			// 活动区
			.scroll-view-item_H {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				border-radius: 10px;
				margin: 20rpx 10rpx;
				width: 40%;
				height: 222rpx;

				.scroll-img {
					border-radius: 10px;
					height: 100%;
					width: 100%;
				}
			}

			// 查看所有
			.seeAll {
				// margin: 20rpx 10rpx;
				display: inline-flex;
				justify-content: center;
				align-items: center;
				width: 10%;
				height: 220rpx;

				.seeAll-box {
					position: relative;
					height: 100%;
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: center;

					text {
						color: rgba(41, 44, 53, 0.40);
						text-align: center;
						font-family: PingFang SC;
						font-size: 24rpx;
						font-style: normal;
						font-weight: 400;
						writing-mode: vertical-rl;
						text-orientation: upright;
						position: absolute;
						top: 50%;
						right: 30%;
						transform: translate(-50%, -50%);
						margin-bottom: 10px;
					}

					image {
						width: 40rpx;
						height: 40rpx;
						position: absolute;
						top: 50%;
						right: -23%;
						transform: translate(-50%, -50%);
					}
				}
			}

			.activeSeeAll {
				animation: hide 0.8s linear;

			}

			@keyframes hide {
				0% {
					width: 10%;
				}

				100% {
					width: 1%;
				}
			}
		}
	}


	/* 2.店名+简介 */
	.detail-name {
		width: 100%;
		height: 126px;
		flex-shrink: 0;
		display: flex;
		background-color: #ffffff;

		// 店名
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

		// 简介
		.shopping-detail {
			margin-top: 8rpx;
			margin-left: 40rpx;
			width: 510rpx;
			color: rgba(41, 44, 53, 0.6);
			font-family: PingFang SC;
			font-size: 24rpx;
			font-style: normal;
			font-weight: 400;
			line-height: normal;
			overflow: hidden;
			height:115rpx;
		}

		// 店铺照片
		.shopping-image {
			margin-left: 38rpx;
			margin-top: 46rpx;
			width: 120rpx;
			height: 120rpx;
			border-radius: 10px;
			background: #f6f4f1;
			display: flex;
			justify-content: center;
			align-items: center;

			image {
				width: 100%;
				height: 100%;
				border-radius: 10px;
			}
		}

		// 折扣照片
		.shopping-discount {
			margin-top: -10rpx;
			margin-left: 28rpx;

			image {
				width: 140rpx;
				height: 60rpx;
			}
		}
	}

	/* 营业时间+地址 */
	.detail-information {
		height: 280rpx;
		margin-top: 12rpx;

		// 营业时间
		.information-time-box {
			background-color: #FFFFFF;

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

				.time-right {
					padding-left: 12rpx;
				}
			}

		}

		// 间隔线
		.line {
			margin-left: 24rpx;
			width: 700rpx;
			height: 1rpx;
			background-color: rgba(41, 44, 53, 0.1);
		}

		// 详细地址
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
					padding-bottom: 2rpx;
					display: flex;
					justify-content: center;
					align-items: center;

					image {
						width: 36rpx;
						height: 36rpx
					}
				}
			}
		}
	}

	// top4
	.detail-four {
		margin-top: 12rpx;
		width: 100%;
		background-color: #ffffff;
		padding-bottom: calc(var(--window-bottom) + 40rpx);

		// 文字
		.detail-four-text {
			width: 100%;
			height: 80rpx;
			padding-left: 40rpx;
			padding-top: 40rpx;
			color: #000;
			font-family: PingFang SC;
			font-size: 16px;
			font-style: normal;
			font-weight: 500;
			line-height: normal;
			/* 最后一个取消边线 */
		}

		// 循环4

		.goods_detail {
			margin-left: 40rpx;
			border-bottom: 1px solid #e6e6e6;
			width: 692rpx;
			height: 240rpx;
			display: flex;
			align-items: center;

			.goods_detail_box {
				width: 692rpx;
				height: 240rpx;
				display: flex;
				align-items: center;



				.goods_detail_image {
					border-radius: 20rpx;
					width: 160rpx;
					height: 160rpx;

					image {
						border-radius: 20rpx;
						width: 100%;
						height: 100%;
					}
				}

				.goods_detail_text {
					padding-left: 32rpx;
					height: 160rpx;
					/* 垂直布局 */
					display: flex;
					flex-direction: column;
					justify-content: space-between;

					.goods-name {
						color: #292c35;
						font-family: PingFang SC;
						font-size: 28rpx;
						font-style: normal;
						font-weight: 500;
						line-height: normal;
						width: 500rpx
					}

					.goods_discount {
						width: 92rpx;
						height: 32rpx;
						flex-shrink: 0;
						border-radius: 44rpx;
						border: 1rpx solid #b24949;
						background: #fff;
						color: #b24949;
						font-family: PingFang SC;
						font-size: 20rpx;
						font-style: normal;
						font-weight: 400;
						line-height: normal;
						display: flex;
						justify-content: space-evenly;
						align-items: center;

						// image {
						// 	width: 20rpx;
						// 	height: 24rpx
						// }
					}

					.goods_discount_change {
						width: 132rpx;
						height: 32rpx;
						flex-shrink: 0;
						border-radius: 44rpx;
						border: 1rpx solid #b24949;
						background: #fff;
						color: #b24949;
						font-family: PingFang SC;
						font-size: 20rpx;
						font-style: normal;
						font-weight: 400;
						line-height: normal;
						display: flex;
						justify-content: space-evenly;
						align-items: center;
					}

					.goods_detail_text_price {
						// width: 200rpx;
						display: flex;
						// justify-content: center;
						align-items: center;

						.price_icon {
							color: #b24949;
							font-family: PingFang SC;
							font-size: 28rpx;
							font-style: normal;
							font-weight: 500;
							line-height: normal;
						}

						.price_number {
							color: #b24949;
							text-align: center;
							font-family: PingFang SC;
							font-size: 44rpx;
							font-style: normal;
							font-weight: 500;
							line-height: normal;
						}
						.price_number_change{
							color: #b24949;
							text-align: center;
							font-family: PingFang SC;
							font-size: 33rpx;
							font-style: normal;
							font-weight: 500;
							line-height: normal;
						}

						.price_max {
							padding-left: 18rpx;
							text-decoration: line-through;
							color: #7e8085;
							text-align: center;
							font-family: PingFang SC;
							font-size: 12px;
							font-style: normal;
							font-weight: 400;
							line-height: normal;
						}
						.price_max_change{
							padding-left: 18rpx;
							text-decoration: line-through;
							color: #7e8085;
							font-family: PingFang SC;
							font-size: 12px;
							font-style: normal;
							font-weight: 400;
							line-height: normal;
						}
					}
				}
			}
		}

		.border_none {
			border-bottom: none;
		}


		// 提示
		.hint {
			width: 100%;
			text-align: center;
			padding-top: 20rpx;
			padding-bottom: 20rpx;
			color: #b24949;
			font-family: PingFang SC;
			font-size: 28rpx;
			font-style: normal;
			font-weight: 400;
			line-height: normal;
			background-color: #fff;
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
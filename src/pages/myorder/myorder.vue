<template>
	<view class="myorder">
		<view class="myru">
			<view class="rutext">
				我买到的商品
			</view>
			<view class="rugoods">
				<view class="ruimg">
					图片
				</view>
				<view class="runame" style="margin-left: 50rpx;">
					名称
				</view>
				<view class="ruprice">
					价格
				</view>
				<view class="ruaddress">
					交易地点
				</view>
				<view class="rutime">
					交易时间
				</view>
			</view>
			<view class="rugoods" v-for="(item, index) in buy" :key="index" @click="look(item,'buy')">
				<view class="ruimg">
					<img :src="item.img[0]" alt="">
				</view>
				<view class="runame">
					{{ item.goodsname }}
				</view>
				<view class="ruprice">
					{{ item.shopprice }}
				</view>
				<view class="ruaddress">
					{{ item.address }}
				</view>
				<view class="rutime">
					{{ item.time }}
				</view>
			</view>
		</view>
		<view class="myru">
			<view class="rutext">
				我卖出的商品
			</view>
			<view class="rugoods">
				<view class="ruimg">
					图片
				</view>
				<view class="runame" style="margin-left: 50rpx;">
					名称
				</view>
				<view class="ruprice">
					价格
				</view>
				<view class="ruaddress">
					交易地点
				</view>
				<view class="rutime">
					交易时间
				</view>
			</view>
			<view class="rugoods" v-for="(item, index) in maichu" :key="index" @click="look(item,'maichu')">
				<view class="ruimg">
					<img :src="item.img[0]" alt="">
				</view>
				<view class="runame">
					{{ item.goodsname }}
				</view>
				<view class="ruprice">
					{{ item.shopprice }}
				</view>
				<view class="ruaddress">
					{{ item.address }}
				</view>
				<view class="rutime">
					{{ item.time }}
				</view>
			</view>
		</view>
		<u-popup v-model="show" mode='center' closeable="true" width='700' border-radius="30">
			<view style="font-size: 16px; padding: 20rpx;">{{title}}</view>
			<view class="main" style="padding: 20rpx;">
				<view style="display: flex;width: 100%;">
					<img style="width: 20%;height: 100rpx;" v-for="imgitem in showdata.img" :src=imgitem alt="" />
				</view>
				<view style="margin-top: 20rpx;">商品名称：{{showdata.goodsname}}</view>
				<view style="margin-top: 20rpx;">商品价格：{{showdata.shopprice}}</view>
				<view style="margin-top: 20rpx;">商品分类：{{showdata.class}}</view>
				<view style="margin-top: 20rpx;">商品描述：{{showdata.title}}</view>
				<view style="margin-top: 20rpx;">交易时间：{{showdata.time}}</view>
				<view style="margin-top: 20rpx;">交易地点：{{showdata.address}}</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import {getMyorder} from '../../../utils/api.js'
	export default {
		data() {
			return {
				maichu: [],
				buy: [],
				show: false,
				title: '购买商品详情',
				showdata: {}
			}
		},
		methods: {
			look(item, type) {
				this.show = true
				this.showdata = item
				this.title = type === 'buy' ? '购买商品详情' : '售卖商品详情'
			},
			getgoods() {
				const userid = uni.getStorageSync('userid');
				getMyorder({userid: userid}).then(res => {
					console.log(123456789,res);
						this.maichu = res.maingoods
						this.buy = res.buygoods
						this.maichu = this.maichu.map((item) => {
							const date = new Date(item.overtime);
							const year = date.getFullYear();
							const month = (date.getMonth() + 1).toString().padStart(2, '0');
							const day = date.getDate().toString().padStart(2, '0');
							const hours = date.getHours().toString().padStart(2, '0');
							const minutes = date.getMinutes().toString().padStart(2, '0');

							console.log(year, month, day, hours, minutes);

							return {
								...item,
								time: `${year}.${month}.${day}-${hours}:${minutes}`
							};
						})
						this.buy = this.buy.map((item) => {
							const date = new Date(item.overtime);
							const year = date.getFullYear();
							const month = (date.getMonth() + 1).toString().padStart(2, '0');
							const day = date.getDate().toString().padStart(2, '0');
							const hours = date.getHours().toString().padStart(2, '0');
							const minutes = date.getMinutes().toString().padStart(2, '0');

							console.log(year, month, day, hours, minutes);

							return {
								...item,
								time: `${year}.${month}.${day}-${hours}:${minutes}`
							};
						})
						console.log(this.maichu);
				})
				// uni.request({
				// 	url: 'http://localhost:3000/getover',
				// 	method: 'POST',
				// 	data: {
				// 		userid: userid
				// 	},
				// 	success: (res) => {
				// 		console.log(res.data);
				// 		this.maichu = res.data.maingoods
				// 		this.buy = res.data.buygoods
				// 		this.maichu = this.maichu.map((item) => {
				// 			const date = new Date(item.overtime);
				// 			const year = date.getFullYear();
				// 			const month = (date.getMonth() + 1).toString().padStart(2, '0');
				// 			const day = date.getDate().toString().padStart(2, '0');
				// 			const hours = date.getHours().toString().padStart(2, '0');
				// 			const minutes = date.getMinutes().toString().padStart(2, '0');

				// 			console.log(year, month, day, hours, minutes);

				// 			return {
				// 				...item,
				// 				time: `${year}.${month}.${day}-${hours}:${minutes}`
				// 			};
				// 		})
				// 		this.buy = this.buy.map((item) => {
				// 			const date = new Date(item.overtime);
				// 			const year = date.getFullYear();
				// 			const month = (date.getMonth() + 1).toString().padStart(2, '0');
				// 			const day = date.getDate().toString().padStart(2, '0');
				// 			const hours = date.getHours().toString().padStart(2, '0');
				// 			const minutes = date.getMinutes().toString().padStart(2, '0');

				// 			console.log(year, month, day, hours, minutes);

				// 			return {
				// 				...item,
				// 				time: `${year}.${month}.${day}-${hours}:${minutes}`
				// 			};
				// 		})
				// 		console.log(this.maichu);
				// 	}
				// })
			}
		},
		// 每次进入该页面都执行
		onPullDownRefresh() {
			this.getgoods()
		},
		onLoad() {
			this.getgoods()
			console.log(this.showdata);

		}
	}
</script>

<style lang="scss" scoped>
	.myorder {
		.myru {
			.rutext {
				text-align: center;
				font-size: 18px;
				// 
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
					min-height: 100rpx;
					margin-right: 20rpx;
					display: flex;
					align-items: center;
					justify-content: center;


					img {
						width: 100rpx;
						height: 100rpx;
						border-radius: 50%;
					}

				}

				.runame {
					// 
					// 
					width: 90rpx;
					// 超出不显示
					overflow: hidden;

					// 只允许一行
					white-space: nowrap;
					// margin-right: 40rpx;
					text-align: center;
				}

				.runame {
					width: 190rpx;
					margin-right: 10rpx;

				}

				.ruprice {


					width: 90rpx;
					// 超出不显示
					overflow: hidden;
					// 只允许一行
					white-space: nowrap;
					margin-right: 10rpx;
					text-align: center;
				}

				.ruaddress {


					width: 490rpx;
					// 超出不显示
					// overflow: hidden;
					// 只允许一行
					// white-space: nowrap;
					margin-right: 10rpx;
					text-align: center;
				}

				.rutime {


					width: 250rpx;
					// 超出不显示
					// overflow: hidden;
					// 只允许一行
					// white-space: nowrap;
					margin-right: 10rpx;
					margin-left: 20rpx;
					text-align: center;
				}
			}
		}
	}
</style>
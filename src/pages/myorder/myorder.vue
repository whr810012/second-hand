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
				<view class="runame">
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
			<view class="rugoods" v-for="(item, index) in buy" :key="index">
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
				<view class="runame">
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
			<view class="rugoods" v-for="(item, index) in maichu" :key="index">
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
	</view>
</template>

<script>
export default {
	data() {
		return {
			maichu: [],
			buy: [],
		}
	},
	methods: {
		getgoods() {
			const userid = uni.getStorageSync('userid');
			uni.request({
				url: 'http://localhost:3000/getover',
				method: 'POST',
				data: {
					userid: userid
				},
				success: (res) => {
					console.log(res.data);
					this.maichu = res.data.maingoods
					this.buy = res.data.buygoods
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
				}
			})
		}
	},
	// 每次进入该页面都执行
	onPullDownRefresh() {
		this.getgoods()
	},
	onLoad() {
		this.getgoods()
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
				min-height: 100rpx;
				margin-right: 20rpx;
				font-size: 16px;
				font-weight: 600;
				display: flex;
				align-items: center;



				img {
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
				}

			}

			.runame {
				font-size: 16px;
				font-weight: 600;
				width: 90rpx;
				// 超出不显示
				overflow: hidden;
				// 只允许一行
				white-space: nowrap;
				// margin-right: 40rpx;
				text-align: center;
			}

			.runame {
				font-size: 16px;
				font-weight: 600;
				width: 90rpx;
				// 超出不显示
				overflow: hidden;
				// 只允许一行
				white-space: nowrap;
				margin-right: 10rpx;
				text-align: center;
			}

			.ruprice {
				font-size: 16px;
				font-weight: 600;
				width: 90rpx;
				// 超出不显示
				overflow: hidden;
				// 只允许一行
				white-space: nowrap;
				margin-right: 10rpx;
				text-align: center;
			}

			.ruaddress {
				font-size: 16px;
				font-weight: 600;
				width: 490rpx;
				// 超出不显示
				// overflow: hidden;
				// 只允许一行
				// white-space: nowrap;
				margin-right: 10rpx;
				text-align: center;
			}

			.rutime {
				font-size: 16px;
				font-weight: 600;
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

<template>
	<view class="pubu">
		<u-subsection :list="list" @change="changecurrent"></u-subsection>
		<u-waterfall v-model="goodslist" ref="uWaterfall">
			<template v-slot:left="{ leftList }">
				<view class="demo-warter" v-for="(item, index) in leftList" :key="item.shopid">
					<!-- 警告：微信小程序中需要hx2.8.11版本才支持在template中结合其他组件，比如下方的lazy-load组件 -->
					<u-lazy-load threshold="-450" border-radius="10" :image="item.img[0]" :index="index"></u-lazy-load>
					<view class="demo-title">
						{{ item.goodsname }}
					</view>
					<view class="demo-price"> {{ item.shopprice }}元 </view>
					<view class="demo-tag">
						<view class="demo-tag-owner"> 自营 </view>
						<view class="demo-tag-text"> 放心购 </view>
					</view>
					<!-- <view class="demo-shop">
									{{ item.shop }}
								</view> -->
					<u-icon name="close-circle-fill" color="#fa3534" size="34" class="u-close"
						@click="remove(item.shopid)"></u-icon>
				</view>
			</template>

			<template v-slot:right="{ rightList }">
				<view class="demo-warter" v-for="(item, index) in rightList" :key="index">
					<u-lazy-load threshold="-450" border-radius="10" :image="item.img[0]" :index="index"></u-lazy-load>
					<view class="demo-title">
						{{ item.goodsname }}
					</view>
					<view class="demo-price"> {{ item.shopprice }}元 </view>
					<view class="demo-tag">
						<view class="demo-tag-owner"> 自营 </view>
						<view class="demo-tag-text"> 放心购 </view>
					</view>
					<!-- <view class="demo-shop">
									{{ item.shop }}
								</view> -->
					<u-icon name="close-circle-fill" color="#fa3534" size="34" class="u-close"
						@click="remove(item.shopid)"></u-icon>
				</view>
			</template>
		</u-waterfall>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
						name: '已上架'
					},
					{
						name: '正在交易'
					},
				],
				current: 1,
				goodslist: [],
				overgoodslist: []
			}
		},
		methods: {
			changecurrent(index) {
				this.current = index
				this.addRandomData()
			},
			getgoods() {
				uni.request({
					url: 'http://localhost:3000/getgoods',
					method: 'GET',
					success: (res) => {
						console.log(res.data.data);
						this.goodslist = res.data.data
					}
				})
			},
			getovergoods() {
				uni.request({
					url: 'http://localhost:3000/getovergoods',
					method: 'GET',
					success: (res) => {
						console.log(res.data.data);
						this.goodslist = res.data.data
					}
				})
			},
			remove(shopid) {
				if (this.current === 0) {
					uni.request({
						url: 'http://localhost:3000/deletegoods',
						method: 'POST',
						data: {
							shopid: shopid
						},
						success: (res) => {
							this.addRandomData()
						}
					})
				}else{
					uni.request({
						url: 'http://localhost:3000/deleteovergoods',
						method: 'POST',
						data: {
							shopid: shopid
						},
						success: (res) => {
							this.addRandomData()
						}
					})
				}
			},
			addRandomData() {
				this.$refs.uWaterfall.clear();
				if (this.current === 0) {
					this.$nextTick(() => {
						this.getgoods()
					})
				} else {
					this.$nextTick(() => {
						this.getovergoods()
					})
				}

			},
		},
		onLoad() {
			this.addRandomData()
		},
	}
</script>

<style lang="scss" scoped>
	.pubu {
		.demo-warter {
			border-radius: 8px;
			margin: 5px;
			background-color: #ffffff;
			padding: 8px;
			position: relative;
		}

		.u-close {
			position: absolute;
			top: 32rpx;
			right: 32rpx;
		}

		.demo-image {
			width: 100%;
			border-radius: 4px;
		}

		.demo-title {
			font-size: 30rpx;
			margin-top: 5px;
			color: $u-main-color;
		}

		.demo-tag {
			display: flex;
			margin-top: 5px;
		}

		.demo-tag-owner {
			background-color: $u-type-error;
			color: #ffffff;
			display: flex;
			align-items: center;
			padding: 4rpx 14rpx;
			border-radius: 50rpx;
			font-size: 20rpx;
			line-height: 1;
		}

		.demo-tag-text {
			border: 1px solid $u-type-primary;
			color: $u-type-primary;
			margin-left: 10px;
			border-radius: 50rpx;
			line-height: 1;
			padding: 4rpx 14rpx;
			display: flex;
			align-items: center;
			border-radius: 50rpx;
			font-size: 20rpx;
		}

		.demo-price {
			font-size: 30rpx;
			color: $u-type-error;
			margin-top: 5px;
		}

		.demo-shop {
			font-size: 22rpx;
			color: $u-tips-color;
			margin-top: 5px;
		}
	}
</style>
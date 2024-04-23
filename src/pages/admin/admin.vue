<template>
	<view class="pubu">
		<u-subsection :list="list" @change="changecurrent"></u-subsection>
		<view style="width: 100%;height:500rpx;display: flex;justify-content: center;align-items: center;"
			v-if="goodslist.length === 0">
			暂无商品
		</view>
		<view style="width: 100%;min-height: 100vh;background-color: #fff;">
			<u-waterfall v-model="goodslist" ref="uWaterfall1" style="background-color: #fff;">
				<template v-slot:left="{ leftList }">
					<view class="demo-warter" v-for="(item, index) in leftList" :key="item.shopid" @click="look(item)">
						<!-- 警告：微信小程序中需要hx2.8.11版本才支持在template中结合其他组件，比如下方的lazy-load组件 -->
						<u-lazy-load threshold="-450" border-radius="10" :image="item.img[0]"
							:index="index"></u-lazy-load>
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
						<!-- <u-icon name="close-circle-fill" color="#fa3534" size="34" class="u-close"
						@click="remove(item.shopid,  $event)"></u-icon> -->
					</view>
				</template>

				<template v-slot:right="{ rightList }">
					<view class="demo-warter" v-for="(item, index) in rightList" :key="index" @click="look(item)">
						<u-lazy-load threshold="-450" border-radius="10" :image="item.img[0]"
							:index="index"></u-lazy-load>
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
						<!-- <u-icon name="close-circle-fill" color="#fa3534" size="34" class="u-close"
						@click="remove(item.shopid, $event)"></u-icon> -->
					</view>
				</template>
			</u-waterfall>
		</view>

		<u-popup v-model="show" mode='center' closeable="true" width='700' border-radius="30">
			<view style="font-size: 16px; padding: 20rpx;">{{ title }}</view>
			<view class="main" style="padding: 20rpx;">
				<view style="display: flex;width: 100%;">
					<img style="width: 20%;height: 100rpx;" v-for="(imgitem, index) in showdata.img" :key="index"
						:src=imgitem alt="" />
				</view>
				<view style="margin-top: 20rpx;">商品名称：{{ showdata.goodsname }}</view>
				<view style="margin-top: 20rpx;">商品价格：{{ showdata.shopprice }}</view>
				<view style="margin-top: 20rpx;">商品分类：{{ showdata.class }}</view>
				<view style="margin-top: 20rpx;">商品描述：{{ showdata.title }}</view>
				<view style="margin-top: 20rpx;" v-if="showdata.time">交易时间：{{ showdata.overtime }}</view>
				<view style="margin-top: 20rpx;">交易地点：{{ showdata.address }}</view>
				<!-- 背景色淡一点 -->

				<button style="width: 350rpx;background-color: #b24949;color: aliceblue;"
					@click="remove(showdata.shopid)">删除商品</button>
			</view>
		</u-popup>
	</view>
</template>

<script>
import { getAllGoods, getAllOverGoods } from '../../../utils/api.js'
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
			current: 0,
			goodslist: [],
			overgoodslist: [],
			show: false,
			showdata: {},
			title: ''
		}
	},
	methods: {
		look(item) {
			console.log('fuyuansu ');
			this.showdata = item
			this.show = true,
				this.title = this.current == 0 ? '上架商品详情' : '交易商品详情'
		},
		changecurrent(index) {
			this.current = index
			this.addRandomData()
		},
		async getgoods() {
			const res = await getAllGoods()
			this.goodslist = res.data
			// uni.request({
			// 	url: 'http://localhost:3000/getgoods',
			// 	method: 'GET',
			// 	success: (res) => {
			// 		console.log(res.data.data);
			// 		this.goodslist = res.data.data
			// 	}
			// })
		},
		async getovergoods() {
			const res = await getAllOverGoods()
			this.goodslist = res.data
			// uni.request({
			// 	url: 'http://localhost:3000/getovergoods',
			// 	method: 'GET',
			// 	success: (res) => {
			// 		console.log(res.data.data);
			// 		this.goodslist = res.data.data
			// 	}
			// })
		},
		remove(shopid) {
			// console.log('点击子元素', event);
			// 组织冒泡到父元素
			// event.stopPropagation();
			if (this.current === 0) {
				uni.request({
					url: 'http://localhost:3000/deletegoods',
					method: 'POST',
					data: {
						shopid: shopid
					},
					success: (res) => {
						this.addRandomData()
						this.show = false
					}
				})
			} else {
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
			this.$refs.uWaterfall1.clear();
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
	async onLoad() {
		this.$refs.uWaterfall1.clear();
		this.getgoods()
		// uni.request({
		// 	url: 'http://localhost:3000/getgoods',
		// 	method: 'GET',
		// 	success: (res) => {
		// 		console.log(res.data.data);
		// 		this.goodslist = res.data.data
		// 	}
		// })
		console.log(123123, this.goodslist);
	},
}
</script>

<style lang="scss" scoped>
.pubu {
	z-index: 9999999;
	width: 100%;
	height: 100vh;
	background-color: #ffffff;

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
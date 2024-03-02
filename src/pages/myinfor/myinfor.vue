<template>
	<view class="infor">
		<view class="myinfor">
			<u-avatar :src="src" mode="circle" :size="180"></u-avatar>
			<view class="nihceng_phone">
				<view class="nicheng">昵称：{{ nicheng }}</view>
				<view class="nicheng">电话：{{ phone }}</view>
			</view>

		</view>
		<view class="overgoods">
			正在进行中的订单 >
		</view>
		<view class="mygoods">
			<view class="pubu">
				<!-- <u-button @click="clear">清空列表</u-button> -->
				<u-waterfall v-model="flowList" ref="uWaterfall">
					<template v-slot:left="{ leftList }">
						<view class="demo-warter" v-for="(item, index) in leftList" :key="index">
							<!-- 警告：微信小程序中需要hx2.8.11版本才支持在template中结合其他组件，比如下方的lazy-load组件 -->
							<u-lazy-load threshold="-450" border-radius="10" :image="item.image"
								:index="index"></u-lazy-load>
							<view class="demo-title">
								{{ item.title }}
							</view>
							<view class="demo-price">
								{{ item.price }}元
							</view>
							<view class="demo-tag">
								<view class="demo-tag-owner">
									自营
								</view>
								<view class="demo-tag-text">
									放心购
								</view>
							</view>
							<!-- <view class="demo-shop">
								{{ item.shop }}
							</view> -->
							<u-icon name="close-circle-fill" color="#fa3534" size="34" class="u-close"
								@click="remove(item.id)"></u-icon>
						</view>
					</template>

					<template v-slot:right="{ rightList }">
						<view class="demo-warter" v-for="(item, index) in rightList" :key="index">
							<u-lazy-load threshold="-450" border-radius="10" :image="item.image"
								:index="index"></u-lazy-load>
							<view class="demo-title">
								{{ item.title }}
							</view>
							<view class="demo-price">
								{{ item.price }}元
							</view>
							<view class="demo-tag">
								<view class="demo-tag-owner">
									自营
								</view>
								<view class="demo-tag-text">
									放心购
								</view>
							</view>
							<!-- <view class="demo-shop">
								{{ item.shop }}
							</view> -->
							<u-icon name="close-circle-fill" color="#fa3534" size="34" class="u-close"
								@click="remove(item.id)"></u-icon>
						</view>
					</template>
				</u-waterfall>
				<u-loadmore bg-color="rgb(240, 240, 240)" :status="loadStatus" @loadmore="addRandomData"></u-loadmore>
			</view>
		</view>
		<u-tabbar class="tabbar" :list="tablist" :mid-button="true" bg-color="rgba(255, 255, 255, 1)"
			inactive-color="rgba(41, 44, 53, 0.30)" mid-button-size="150rpx" icon-size="48rpx" @change="clicktabbar">
		</u-tabbar>
	</view>
</template>

<script>
import indexStore from '../../../store/index.js'
export default {
	data() {
		return {
			tablist: '',
			src: "https://th.bing.com/th/id/R.fd81516a06ce33c15b194494272fa6e9?rik=XAfnJ6A9NFvAyA&riu=http%3a%2f%2fimg.touxiangwu.com%2fuploads%2fallimg%2f2022053117%2fivhiashhpu1.jpg&ehk=Yi2aDhWvd0rnBKl1xloJy8F1RfGd8%2bcC75k4ff8dVXk%3d&risl=&pid=ImgRaw&r=0",
			nicheng: '蛋蛋',
			phone: 19861427087,
			// 瀑布
			loadStatus: 'loadmore',
			flowList: [],
			list: [{
				price: 35,
				title: '北国风光，千里冰封，万里雪飘',
				shop: '李白杜甫白居易旗舰店',
				image: 'http://pic.sc.chinaz.com/Files/pic/pic9/202002/zzpic23327_s.jpg',
			},
			{
				price: 75,
				title: '望长城内外，惟余莽莽',
				shop: '李白杜甫白居易旗舰店',
				image: 'http://pic.sc.chinaz.com/Files/pic/pic9/202002/zzpic23325_s.jpg',
			},
			{
				price: 385,
				title: '大河上下，顿失滔滔',
				shop: '李白杜甫白居易旗舰店',
				image: 'http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2119_s.jpg',
			},
			{
				price: 784,
				title: '欲与天公试比高',
				shop: '李白杜甫白居易旗舰店',
				image: 'http://pic2.sc.chinaz.com/Files/pic/pic9/202002/zzpic23369_s.jpg',
			},
			{
				price: 7891,
				title: '须晴日，看红装素裹，分外妖娆',
				shop: '李白杜甫白居易旗舰店',
				image: 'http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2130_s.jpg',
			},
			{
				price: 2341,
				shop: '李白杜甫白居易旗舰店',
				title: '江山如此多娇，引无数英雄竞折腰',
				image: 'http://pic1.sc.chinaz.com/Files/pic/pic9/202002/zzpic23346_s.jpg',
			},
			{
				price: 661,
				shop: '李白杜甫白居易旗舰店',
				title: '惜秦皇汉武，略输文采',
				image: 'http://pic1.sc.chinaz.com/Files/pic/pic9/202002/zzpic23344_s.jpg',
			},
			{
				price: 1654,
				title: '唐宗宋祖，稍逊风骚',
				shop: '李白杜甫白居易旗舰店',
				image: 'http://pic1.sc.chinaz.com/Files/pic/pic9/202002/zzpic23343_s.jpg',
			},
			{
				price: 1678,
				title: '一代天骄，成吉思汗',
				shop: '李白杜甫白居易旗舰店',
				image: 'http://pic1.sc.chinaz.com/Files/pic/pic9/202002/zzpic23343_s.jpg',
			},
			{
				price: 924,
				title: '只识弯弓射大雕',
				shop: '李白杜甫白居易旗舰店',
				image: 'http://pic1.sc.chinaz.com/Files/pic/pic9/202002/zzpic23343_s.jpg',
			},
			{
				price: 8243,
				title: '俱往矣，数风流人物，还看今朝',
				shop: '李白杜甫白居易旗舰店',
				image: 'http://pic1.sc.chinaz.com/Files/pic/pic9/202002/zzpic23343_s.jpg',
			},
			],

		}
	},
	methods: {
		onLoad() {

			this.tablist = indexStore.state.list
			this.addRandomData()
		},
		addRandomData() {
			for (let i = 0; i < 10; i++) {
				let index = this.$u.random(0, this.list.length - 1);
				// 先转成字符串再转成对象，避免数组对象引用导致数据混乱
				let item = JSON.parse(JSON.stringify(this.list[index]))
				item.id = this.$u.guid();
				this.flowList.push(item);
			}
		},
		remove(id) {
			this.$refs.uWaterfall.remove(id);
		},
	}
}
</script>

<style lang="scss" scoped>
.infor {
	height: 500px;

	// background-color: #000;
	.myinfor {
		height: 250rpx;
		background-image: url('https://th.bing.com/th/id/OIP.dxZwOGDCwxKKkXmQVfejmQHaEK?rs=1&pid=ImgDetMain');
		padding-left: 30rpx;
		padding-top: 45rpx;
		display: flex;

		.nihceng_phone {
			.nicheng {
				margin-left: 50rpx;
				padding-top: 20rpx;
				font-size: 20px;
				font-weight: 600;
			}
		}

	}

	.overgoods {
		height: 100rpx;
		text-align: center;
		line-height: 100rpx;
		background-color: beige;
	}

	.mygoods {
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
				color: #FFFFFF;
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
	}
}
</style>

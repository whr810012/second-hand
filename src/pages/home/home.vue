<template>
	<div class="home_box">
		<!-- 轮播图 -->
		<view class="wrap">
			<u-swiper :list="waraplist" :effect3d="true"></u-swiper>
		</view>
		<view @click="goadmin" v-if="admin" class="newadd" style="margin-bottom: 20rpx;">
			管理中心
		</view>
		<view class="newadd">
			趣味功能
		</view>
		<!-- 创新点 -->
		<div class="home_top_box">
			<div class="home_topleft_box" @click="goai">
			</div>
			<div class="home_topright_box" @click="gomap"></div>
		</div>
		<!-- 搜索框 -->
		<div class="input_box">
			<div class="search_input_box">
				<input placeholder="    请输入搜索信息" class="search_input" type="text" v-model="inputdata" />
			</div>
			<div class="button_input" style="width: 20%;" @click='startfulter'>搜索</div>
		</div>
		<!-- 筛选 -->
		<view class="shaixuan">
			<u-dropdown>
				<u-dropdown-item @change="startfulter" v-model="value1" title="排序" :options="options1"></u-dropdown-item>
				<u-dropdown-item @change="startfulter" height="450rpx" v-model="value2" title="分类"
					:options="options2"></u-dropdown-item>
				<u-dropdown-item @change="startfulter" v-model="value3" title="交易地点"
					:options="options3"></u-dropdown-item>
			</u-dropdown>
		</view>
		<!-- 瀑布流 -->
		<view class="pubu" v-if="wf_show">
			<!-- <u-button @click="clear">清空列表</u-button> -->
			<u-waterfall  class="wrap-box" v-model="flowList" ref="uWaterfall">
				<template v-slot:left="{ leftList }">
					<view class="demo-warter" v-for="(item, index) in leftList" :key="item.shopid" @click="gobuy(item)">
						<!-- 警告：微信小程序中需要hx2.8.11版本才支持在template中结合其他组件，比如下方的lazy-load组件 -->
						<u-lazy-load threshold="-450" border-radius="10" :image="item.img[0]"
							:index="index"></u-lazy-load>
						<view class="demo-title">
							{{ item.goodsname }}
						</view>
						<view class="demo-price">
							{{ item.shopprice }}元
						</view>
						<view class="demo-tag">
							<view class="demo-tag-owner">
								自营
							</view>
							<view class="demo-tag-text">
								放心购
							</view>
						</view>
						<view class="demo-shop">
							{{ item.username }}
						</view>
						<!-- <u-icon name="close-circle-fill" color="#fa3534" size="34" class="u-close"
							@click="remove(item.id)"></u-icon> -->
					</view>
				</template>
				<template v-slot:right="{ rightList }">
					<view class="demo-warter" v-for="(item, index) in rightList" :key="item.shopid"
						@click="gobuy(item)">
						<u-lazy-load threshold="-450" border-radius="10" :image="item.img[0]"
							:index="index"></u-lazy-load>
						<view class="demo-title">
							{{ item.goodsname }}
						</view>
						<view class="demo-price">
							{{ item.shopprice }}元
						</view>
						<view class="demo-tag">
							<view class="demo-tag-owner">
								自营
							</view>
							<view class="demo-tag-text">
								放心购
							</view>
						</view>
						<view class="demo-shop">
							{{ item.username }}
						</view>
						<!-- <u-icon name="close-circle-fill" color="#fa3534" size="34" class="u-close"
							@click="remove(item.id)"></u-icon> -->
					</view>
				</template>
			</u-waterfall>
			<view v-if="flowList.length === 0" style="margin-top: 100rpx;width: 100%;text-align: center;">暂无商品售卖</view>
			<!-- <u-loadmore bg-color="rgb(240, 240, 240)" :status="loadStatus" @loadmore="addRandomData"></u-loadmore> -->
			
		</view>
		<u-tabbar class="tabbar" :list="tablist" :mid-button="true" bg-color="rgba(255, 255, 255, 1)"
			inactive-color="rgba(41, 44, 53, 0.30)" mid-button-size="150rpx" icon-size="50rpx">
		</u-tabbar>
	</div>

</template>

<script>
import indexStore from '../../../store/index.js'
import {getAllGoods} from '../../../utils/api.js'
export default {
	data() {
		return {
			admin: false,
			// 搜索内容
			// inputdata: '',
			// 轮播图数据
			waraplist: [{
				image: 'https://cdn.uviewui.com/uview/swiper/1.jpg',
				title: '昨夜星辰昨夜风，画楼西畔桂堂东'
			},
			{
				image: 'https://cdn.uviewui.com/uview/swiper/2.jpg',
				title: '身无彩凤双飞翼，心有灵犀一点通'
			},
			{
				image: 'https://cdn.uviewui.com/uview/swiper/3.jpg',
				title: '谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳'
			},

			],
			//
			wf_show: true,
			// 搜索框
			inputdata: '',
			// 下拉菜单
			value1: 1,
			value2: 1,
			value3: 1,
			options1: [{
				label: '默认排序',
				value: 1,
			},
			{
				label: '价格升序',
				value: 2,
			},
			{
				label: '价格降序',
				value: 3,
			}
			],
			options2: [{
				label: '默认',
				value: 1
			},
			{
				label: '书籍类',
				value: 2,
			},
			{
				label: '电子产品',
				value: 3
			},
			{
				label: '衣物类',
				value: 4
			},
			{
				label: '食品类',
				value: 5

			}
			],
			options3: [{
				label: '全部',
				value: 1
			},
			{
				label: '交易存放点',
				value: 2,
			},
			{
				label: '自定义交易',
				value: 3
			},

			],
			// 瀑布
			loadStatus: 'loadmore',
			flowList: [],
			goodslist: [{
				shopid: 1,
				shopprice: 35,
				title: '北国风光，千里冰封，万里雪飘',
				username: '李白杜甫白居易旗舰店',
				img: ['https://th.bing.com/th/id/OIP.3hBgFtrc4-d0daxwmH7cnwHaE8?w=3000&h=2000&rs=1&pid=ImgDetMain',
					'https://th.bing.com/th/id/OIP.3hBgFtrc4-d0daxwmH7cnwHaE8?w=3000&h=2000&rs=1&pid=ImgDetMain'
				],
				address: '山东政法学院',
				// weidu
				longitude: 113,
				latitude: 67,
				class: '电子产品'
			},

			],
			tablist: indexStore.state.list
		}
	},
	onLoad() {
		this.tablist = indexStore.state.list
		this.getgoods()
		// this.addRandomData();
		if (uni.getStorageSync('admin')) {
			this.admin = uni.getStorageSync('admin');
		}
		console.log(this.admin);
	},
	onShow() {
		// this.addRandomData();
		this.getgoods();
		if (uni.getStorageSync('admin')) {
		this.admin = uni.getStorageSync('admin');
		}
	},
	// 计算属性

	// 每次进入该页面都执行
	onPullDownRefresh() {
		// console.log('123'); // 打印 "123"
		this.getgoods()

		// 这里可以添加其他刷新逻辑

		// 调用uni.stopPullDownRefresh()方法停止下拉刷新的状态
		uni.stopPullDownRefresh();
	},
	// 下拉刷新的时候执行
	// 计算属性
	computed: {
		// 计算属性

	},


	methods: {
		async getgoods() {
			const res = await getAllGoods()
			this.goodslist = res.data
			console.log('this.goodslist', this.goodslist);
			this.addRandomData()
			// uni.request({
			// 	url: 'http://localhost:3000/getgoods',
			// 	method: 'GET',
			// 	success: (res) => {
			// 		console.log(res.data.data);
			// 		this.goodslist = res.data.data
			// 		this.addRandomData()
			// 		// console.log(this.list);
			// 		console.log(this.goodslist);
			// 		console.log(this.flowList);
			// 	}
			// })
		},
		gomap() {
			uni.navigateTo({
				url: "/pages/homemap/homemap",
				fail: e => {
					console.log(e);
				}
			});
		},
		goai() {
			uni.navigateTo({
				url: "/pages/ai/ai",
				fail: e => {
					console.log(e);
				}
			});
		},
		startfulter () {
			let filteredArray = this.goodslist
			if(this.inputdata){
				filteredArray = filteredArray.filter(obj => obj.title.includes(this.inputdata) || obj.goodsname.includes(this.inputdata));
			}
			if(this.value2 !== 1){
				const classs = this.options2.filter(item => item.value === this.value2)[0].label
				filteredArray = filteredArray.filter(item => item.class == classs)
			}
			if(this.value3 != 1){
				if(this.value3 == 2){
					filteredArray = filteredArray.filter(item => item.address === '交易存放点')
				}else{
					filteredArray = filteredArray.filter(item => item.address !== '交易存放点')
				}
			}
			if(this.value1 != 1){
				if(this.value1 == 2){
					filteredArray = filteredArray.sort((a, b) => a.shopprice - b.shopprice)
				}else{
					filteredArray = filteredArray.sort((a, b) => b.shopprice - a.shopprice)
				}
			}
			this.$refs.uWaterfall.clear();
			this.$nextTick(() => {
					this.flowList = filteredArray; // 重新赋值来触发更新
				})
			// this.flowList = filteredArray

		},
		startsearch() {
			if (this.value1 === 1 && this.value2 === 1 && this.value3 === 1) {
				console.log('beforeee====', this.flowList);
				// console.log('开始搜索', this.inputdata);
				let filteredArray = this.goodslist.filter(obj => obj.title.includes(this.inputdata) || obj.goodsname.includes(this.inputdata));
				// console.log('新的',filteredArray);
				console.log('befor====', this.flowList);
				this.$refs.uWaterfall.clear();
				this.$nextTick(() => {
					this.flowList = filteredArray; // 重新赋值来触发更新
				})


				console.log('over====', this.flowList);
				return;
			}
			if (this.value1 !== 1 || this.value2 !== 1 || this.value3 !== 1) {
				console.log('开始搜索', this.inputdata,this.flowList);
				let filteredArray = this.flowList.filter(obj => obj.title.includes(this.inputdata) || obj.goodsname.includes(this.inputdata));
				console.log('新的', filteredArray);
				this.$refs.uWaterfall.clear();
				this.$nextTick(() => {
					this.flowList = filteredArray; // 重新赋值来触发更新
				})
				console.log(this.flowList);
			}
			if(this.inputdata === ''){
				this.getgoods()
			}
		},
		startsort() {
			console.log(this.value1);
			if (this.value1 === 1) {
				this.$refs.uWaterfall.clear();
				this.$nextTick(() => {
					this.flowList = this.goodslist; // 重新赋值来触发更新
				})

			}
			if (this.value1 === 2) {
				const arr = this.flowList
				console.log('beforeee====', this.flowList);
				console.log('befor====', this.flowList);
				let filteredArray = arr.sort((a, b) => a.shopprice - b.shopprice) // 重新赋值来触发更新
				this.$refs.uWaterfall.clear();
				this.$nextTick(() => {
					this.flowList = filteredArray; // 重新赋值来触发更新
				})
				console.log('over====', this.flowList);
				return
			}
			if (this.value1 === 3) {
				const arr = this.flowList
				console.log('beforeee====', this.flowList);
				this.$refs.uWaterfall.clear();
				console.log('befor====', this.flowList);
				let filteredArray = arr.sort((a, b) => b.shopprice - a.shopprice) // 重新赋值来触发更新
				this.$nextTick(() => {
					this.flowList = filteredArray; // 重新赋值来触发更新
				})
				console.log('over====', this.flowList);
				return

			}

		},
		async startclass() {
			console.log(this.value2);
			const classs = this.options2.filter(item => item.value === this.value2)[0].label
			console.log(classs);
			if (this.value2 === 1) {
				if (this.flowList == this.goodslist) {
					return
				} else {
					this.startsearch();
					this.startsort();
					return
				}

			}
			if (this.value1 === 1 && this.inputdata == '') {
				let filteredArray = this.goodslist.filter(item => item.class == classs)
				this.$refs.uWaterfall.clear();
				this.$nextTick(() => {
					this.flowList = filteredArray; // 重新赋值来触发更新
				})

			} else {
				await this.startsearch()
				await this.startsort()
				// const arr = 
				console.log(classs);
				console.log('222222222222',this.flowList);
				let filteredArray = this.flowList.filter(item => item.class == classs)
				console.log(11111111111111111,filteredArray);
				this.$refs.uWaterfall.clear();
				this.$nextTick(() => {
					this.flowList = filteredArray; // 重新赋值来触发更新
				})
			}

		},
		changeaddress() {
			this.inputdata = ''
			this.value1 = 1
			this.value2 = 1
			if (this.value3 === 1) {
				this.$refs.uWaterfall.clear();
				this.$nextTick(() => {
					this.flowList = this.goodslist
				})
				return
			}
			if (this.value3 === 2) {
				this.$refs.uWaterfall.clear();
				const arr = this.goodslist.filter(item => item.address === '交易存放点')
				this.$nextTick(() => {
					this.flowList = arr
				})
				return
			}
			if (this.value3 === 3) {
				this.$refs.uWaterfall.clear();
				const arr = this.goodslist.filter(item => item.address != '交易存放点')
				this.$nextTick(() => {
					this.flowList = arr
				})
				return
			}
		},
		// 瀑布
		addRandomData() {
			this.$refs.uWaterfall.clear();
			this.$nextTick(() => {
				this.flowList = this.goodslist
			})
		},
		remove(id) {
			this.$refs.uWaterfall.remove(id);
		},
		gobuy(item) {
			console.log(item);
			uni.navigateTo({
				url: `/pages/detail/detail?item=${encodeURIComponent(JSON.stringify(item))}`
			});
		},
		clicktabbar() {
			console.log('开始发布');
		},
		goadmin() {
			uni.redirectTo({
				url: `/pages/admin/admin`
			});
		}
	},

}
</script>

<style lang="scss" scoped>
.home_box {
	width: 100%;
	height: 100vh;
	background-color: #f5f5f5;
	overflow-y: scroll;

	.newadd {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 70rpx;
		background: rgba(164, 169, 255, 0.5);

		// background-color: 
		color: rgba(255, 255, 255, 0.5);
		text-shadow: 0px 1px 0px #B24949;
		font-family: FZChaoCuHei-M10S;
		font-size: 20px;
		font-style: normal;
		font-weight: 600;
		line-height: normal;
		letter-spacing: 0.311px;
		text-align: center;
		-webkit-text-stroke: 1px rgba(255, 255, 255, 0.90);
		/*文字描边*/
		-webkit-text-fill-color: transparent;
	}

	.wrap {
		padding: 40rpx;
	}

	.home_top_box {
		margin-top: 40rpx;
		// width: 100%;
		height: 200rpx;
		// background-color: antiquewhite;
		display: flex;
		justify-content: space-around;
		border: 2px solid #B24949;
		margin-left: 10rpx;
		margin-right: 10rpx;
		border-radius: 20rpx;
		background-color: aliceblue;

		.home_topleft_box {
			margin-top: 10rpx;
			margin-bottom: 10rpx;
			padding: 1px;
			width: 45%;
			// height: 100%;
			background-color: aqua;
			border-radius: 30rpx;
			background-image: url('https://ceshiai-1317989680.cos.ap-nanjing.myqcloud.com/aibg.jpg');
			background-size: 100% 100%;
			// background-size: cover;
			background-repeat: no-repeat;
			border: 1px solid #000;
		}

		.home_topright_box {
			margin-top: 10rpx;
			margin-bottom: 10rpx;
			padding: 1px;
			width: 45%;
			// height: 100%;
			background-color: aqua;
			border-radius: 30rpx;
			background-image: url('https://ceshiai-1317989680.cos.ap-nanjing.myqcloud.com/map.png');
			background-size: 100% 100%;
			// background-size: cover;
			background-repeat: no-repeat;
			border: 1px solid #000;
		}
	}

	.input_box {
		margin-top: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 60rpx;

		.search_input_box {
			width: 80%;
			height: 100%;
			margin-left: 20rpx;
			border-radius: 30rpx;
			border: 1px solid #000;

			.search_input {
				margin-left: 20rpx;
				line-height: 100%;
				height: 100%;
			}
		}

		.button_input {
			height: 100%;
			// height: 12.5px;
			width: 20%;
			margin-left: 20rpx;
			margin-right: 20rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			// border: 1px solid #000;
			border-radius: 20rpx;
			background: #B24949;
			color: #FFFEFE;
			// line-height: 60rpx;
		}
	}

	.shaixuan {}

	.pubu {
		.wrap-box {
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
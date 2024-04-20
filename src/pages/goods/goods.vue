<template>
	<view class="goods">
		<!-- search -->
		<view class="search">
			<!-- 搜索框 -->
			<view class="search-box">
				<u-input class="search-inp" v-model='searchName' :type="'text'" :border="false" placeholder="搜索商品" />
				<view class="search-btn" @click="search">搜索</view>
			</view>
			<!-- 筛选 -->
			<view class="input-right">
				<u-dropdown active-color="#606266" :close-on-click-mask="true" duration="0">
					<u-dropdown-item v-model="sortindex" title="排序" :options="sortList"
						@change="sort"></u-dropdown-item>
					<u-dropdown-item v-model="screenindex" title="筛选" :options="screenList"
						@change="goodsSelect"></u-dropdown-item>
				</u-dropdown>
			</view>
		</view>
		<!-- goodslist -->
		<view class="wrap">
			<!-- 绑定flowList -->
			<u-waterfall class="wrap-box" v-model="flowList" ref="uWaterfall">
				<template v-slot:left="{ leftList }">
					<view class="demo-warter" v-for="(item, index) in leftList" :key="item.id" @click="goDetail(item)">
						<!-- 有问题显示 -->
						<view v-if="item.discount == -1 || item.discount == 1">

							<view class="demo-img-wrap">
								<image class="demo-image"
									:src="item.img_url[0] || 'https://ts1.cn.mm.bing.net/th/id/R-C.abc6e8f67c274cfa84fca01319f88ae4?rik=M3boJj%2bB2wvYQA&riu=http%3a%2f%2fimg1.mydrivers.com%2fimg%2f20171008%2fbca20121473540a88af2bdd2db8f6526.jpg&ehk=CF3mJt4%2fPPTvjWquThqghZZBmmHGP%2fuPo8fSdKLZxMI%3d&risl=1&pid=ImgRaw&r=0'"
									mode="widthFix" />
							</view>
							<view class="demo-title">{{ item.name }}</view>
							<!-- 内部判断开始：三种结果 -->
							<view v-if="item.discount == -1 && item.discounted_price == 0">
								<view class="demo-price">
									<text class="demo-newPrice-change">￥{{ item.special_discount }}</text>
									<text class="demo-oldPrice">￥{{ item.price }}</text>
								</view>

							</view>
							<view v-if="item.discount == -1 && item.discounted_price != 0">
								<view class="demo-price">
									<text class="demo-newPrice-change">￥{{ item.discounted_price }}</text>
									<text class="demo-oldPrice">￥{{ item.price }}</text>
								</view>
								<view class="demo-discount-chang">
									<text>{{ item.special_discount }}</text>
								</view>
							</view>
							<view v-if="item.discount == 1">
								<view class="demo-price">
									<text class="demo-newPrice">￥{{ item.discounted_price }}</text>
								</view>

							</view>

							<view class="demo-shop">{{ item.shop_name }}></view>
						</view>
						<!-- 正常 -->
						<view v-else>
							<view class="demo-img-wrap">
								<image class="demo-image"
									:src="item.img_url[0] || 'https://tse2-mm.cn.bing.net/th/id/OIP-C.mH9YLFEL5YdVxJM82mjVJQAAAA?rs=1&pid=ImgDetMain'"
									mode="widthFix" />
							</view>
							<view class="demo-title">{{ item.name }}</view>
							<view class="demo-price">
								<text class="demo-newPrice">￥{{ item.discounted_price }}</text>
								<text class="demo-oldPrice">￥{{ item.price }}</text>
							</view>
							<view class="demo-discount">
								<text>{{ item.discount * 10 }}折</text>
							</view>
							<view class="demo-shop">{{ item.shop_name }}></view>
						</view>

					</view>
				</template>
				<template v-slot:right="{ rightList }">
					<view class="demo-warter" v-for="(item, index) in rightList" :key="item.id" @click="goDetail(item)">
						<!-- 有问题显示 -->
						<view v-if="item.discount == -1 || item.discount == 1">
							<view class="demo-img-wrap">
								<image class="demo-image"
									:src="item.img_url[0] || 'https://ts1.cn.mm.bing.net/th/id/R-C.abc6e8f67c274cfa84fca01319f88ae4?rik=M3boJj%2bB2wvYQA&riu=http%3a%2f%2fimg1.mydrivers.com%2fimg%2f20171008%2fbca20121473540a88af2bdd2db8f6526.jpg&ehk=CF3mJt4%2fPPTvjWquThqghZZBmmHGP%2fuPo8fSdKLZxMI%3d&risl=1&pid=ImgRaw&r=0'"
									mode="widthFix" />
							</view>
							<view class="demo-title">{{ item.name }}</view>
							<!-- 内部判断开始：三种结果 -->
							<view v-if="item.discount == -1 && item.discounted_price == 0">
								<view class="demo-price">
									<text class="demo-newPrice-change">￥{{ item.special_discount }}</text>
									<text class="demo-oldPrice">￥{{ item.price }}</text>
								</view>

							</view>
							<view v-if="item.discount == -1 && item.discounted_price != 0">
								<view class="demo-price">
									<text class="demo-newPrice-change">￥{{ item.discounted_price }}</text>
									<text class="demo-oldPrice">￥{{ item.price }}</text>
								</view>
								<view class="demo-discount-chang">
									<text>{{ item.special_discount }}</text>
								</view>
							</view>
							<view v-if="item.discount == 1">
								<view class="demo-price">
									<text class="demo-newPrice">￥{{ item.discounted_price }}</text>
								</view>

							</view>

							<view class="demo-shop">{{ item.shop_name }}></view>
						</view>
						<!-- 正常 -->
						<view v-else>
							<view class="demo-img-wrap">
								<image class="demo-image"
									:src="item.img_url[0] || 'https://tse2-mm.cn.bing.net/th/id/OIP-C.mH9YLFEL5YdVxJM82mjVJQAAAA?rs=1&pid=ImgDetMain'"
									mode="widthFix" />
							</view>
							<view class="demo-title">{{ item.name }}</view>
							<view class="demo-price">
								<text class="demo-newPrice">￥{{ item.discounted_price }}</text>
								<text class="demo-oldPrice">￥{{ item.price }}</text>
							</view>
							<view class="demo-discount">
								<text>{{ item.discount * 10 }}折</text>
							</view>
							<view class="demo-shop">{{ item.shop_name }}></view>
						</view>

					</view>
				</template>
			</u-waterfall>
			<!-- 加载更多 -->
			<u-loadmore bg-color="rgb(240, 240, 240)" :status="loadStatus" @loadmore="addRandomData"></u-loadmore>
		</view>
		<popup class="popup" :popupList="popupList" :isPopup="isPopup" :isClose="isClose" :isButton="isButton"
			:textState="textState" :popup.sync="isPopup">
		</popup>

		<view class="toUp" v-if="isTop" @click="toTop">
			<u-icon name="arrow-upward" color="#434343" size="28"></u-icon>
		</view>

		<u-tabbar class="tabbar" :list="tablist" :mid-button="true" bg-color="rgba(255, 255, 255, 1)"
			inactive-color="rgba(41, 44, 53, 0.30)" mid-button-size="180rpx" icon-size="48rpx" @change="clicktabbar">
		</u-tabbar>
	</view>
</template>

<script>
import indexStore from '../../../store/index.js'

import * as _ from 'lodash'
export default {
	components: {
		
	},
	data() {
		return {
			// 最底部是否展示
			searchName: "",
			loadStatus: "loadmore",
			flowList: [],
			// 下拉菜单，选中的value
			sortindex: 0,
			screenindex: 0,
			// 两个下拉列表：1：综合2：筛选
			sortList: [{
				label: "默认",
				value: 0,
				sorting: ''
			},
			{
				label: "价格升序",
				value: 1,
				sorting: 'price_asc'
			},
			{
				label: "价格降序",
				value: 2,
				sorting: 'price_desc'
			}
			],
			screenList: [{
				label: "默认",
				value: 0,
				category: ''
			},
			{
				label: "服装",
				value: 1,
				category: "服装"
			},
			{
				label: "美食",
				value: 2,
				category: "美食"
			},
			{
				label: "饮品",
				value: 3,
				category: "饮品"
			},
			{
				label: "美容美发",
				value: 4,
				category: "美容美发"
			},
			{
				label: "保健/药品",
				value: 5,
				category: "保健/药品"
			},
			{
				label: "摆件/饰品",
				value: 6,
				category: "摆件/饰品"
			}
			],
			tablist: '',
			// 轮播图数据
			popupList: [{
				id: 0,
				imgUrl: 'https://tutu-aomen.s3.cn-northwest-1.amazonaws.com.cn/landing/%E4%BA%8C%E7%BB%B4%E7%A0%81%E5%BC%B9%E7%AA%97.png'
			},],
			// 控制弹窗
			isPopup: false,
			// 是否有按钮
			isButton: true,
			// 是否有关闭icon
			isClose: true,
			// textState：文字状态
			// 0为：畅玩澳门，1：9.9元 续购
			textState: 0,
			page: 1,

			page_size: 10,
			isTop: false,
			pageHideType: '',
		}
	},
	async onLoad() {
		// 空白搜一下
		this.search()
		// tab数据
		this.tablist = indexStore.state.list
	},
	onShow() {
		this.pageHideType = ''
	},
	onHide() {
		console.log('hide');
		if (this.pageHideType === 'goDetail') return
		this.toTop()
	},
	onUnload() {
		console.log('onUnload');
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
	async onReachBottom() {
		console.log('--------', this.flowList);
		const data = this.sortindex != 0 || this.screenindex != 0 ? {
			name: this.searchName,
			sorting: this.sortList[this.sortindex].sorting,
			page: ++this.page,
			page_size: this.page_size,
			category: this.screenList[this.screenindex].category
		} : {
			name: this.searchName,
			sorting: this.sortList[this.sortindex].sorting,
			page: ++this.page,
			page_size: this.page_size
		}
		const res = await indexStore.dispatch('postGetProducts', data)
		if (res.length === 0) {
			uni.showToast({
				icon: 'none',
				title: '已显示全部商品'
			})
		}
		this.flowList = _.uniqBy(this.flowList.concat(res), 'id')
	},
	onPageScroll(e) {
		// 监听页面滚动
		if (e.scrollTop > 200) {
			this.isTop = true;
		} else {
			this.isTop = false;
		}
	},
	methods: {
		// 再来一页
		addRandomData() {
			console.log("再来一页")
		},
		// 搜索框搜索
		async search() {
			this.screenindex = 0
			this.page = 1
			// 清空瀑布流
			this.$refs.uWaterfall.clear();
			this.flowList = await indexStore.dispatch('postGetProducts', {
				name: this.searchName,
				sorting: this.sortList[this.sortindex].sorting,
				category: this.screenList[this.screenindex].category,
				page: this.page,
				page_size: this.page_size

			})

		},
		// 综合排序
		// 1:默认，2：价格升序，3.价格降序 4.评论升序 5.评论降序
		async sort() {
			// 清空瀑布流
			this.$refs.uWaterfall.clear();
			this.page = 1
			if (this.searchName) {
				console.log("搜索+排序")
				this.flowList = await indexStore.dispatch('postGetProducts', {
					name: this.searchName,
					sorting: this.sortList[this.sortindex].sorting,
					category: this.screenList[this.screenindex].category,
					page: this.page,
					page_size: this.page_size
				})
			} else {
				console.log("筛选+排序")
				this.flowList = await indexStore.dispatch('postGetProducts', {
					name: this.searchName,
					category: this.screenList[this.screenindex].category,
					sorting: this.sortList[this.sortindex].sorting,
					page: this.page,
					page_size: this.page_size
				})
			}
		},
		// 类品筛选
		async goodsSelect() {
			this.searchName = ''
			this.page = 1
			// 清空瀑布流
			this.$refs.uWaterfall.clear();
			console.log(this.screenList[this.screenindex].category)
			this.flowList = await indexStore.dispatch('postGetProducts', {
				name: this.searchName,
				category: this.screenList[this.screenindex].category,
				sorting: this.sortList[this.sortindex].sorting,
				page: this.page,
				page_size: this.page_size
			})
		},
		// 跳转店铺
		async goDetail(item) {
			this.pageHideType = 'goDetail'
			// 跳转到detail页
			uni.navigateTo({
				url: `/pages/detail/detail?item=${encodeURIComponent(JSON.stringify(item))}`
			});
		},
		clicktabbar(index) {
			if (index === 1) {
				this.isPopup = true;
				this.isButton = false;
				this.isClose = true;
				this.popupList = [{
					id: 0,
					imgUrl: "https://tutu-aomen.s3.cn-northwest-1.amazonaws.com.cn/landing/%E4%BA%8C%E7%BB%B4%E7%A0%81%E5%BC%B9%E7%AA%97.png"
				}]
			}
		},
		toTop() {
			uni.pageScrollTo({
				scrollTop: 0, //滚动到页面的目标位置
				duration: 300
			});
		}
	},
	watch: {
		// 监听searchname的状态，空了就清空排序，根据筛选搜索
		searchName(newValue) {
			if (newValue == '') {
				this.sortindex = 0
				this.page = 1
				this.goodsSelect()
			}
		}
	}

};
</script>

<style>
/* page不能写带scope的style标签中，否则无效 */
page {
	background-color: rgb(240, 240, 240);
}
</style>

<style lang="scss" scoped>
// 总
.goods {
	width: 750rpx;
}

// 搜索块
.search {
	position: relative;
	height: 140rpx;
	background: #f5f5f5;
	display: flex;
	justify-content: center;
	align-items: center;

	// 搜索框+按钮
	.search-box {
		position: relative;
		width: 458rpx;
		height: 60rpx;
		flex-shrink: 0;
		border-radius: 60rpx;
		border: 1rpx solid #50544d;
		background: rgba(255, 255, 255, 0.7);
		margin: 20rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;

		.search-inp {
			width: 364rpx;
			margin-left: 20rpx;
		}

		// 搜索按钮
		.search-btn {
			margin-right: 2rpx;
			width: 90rpx;
			height: 52rpx;
			flex-shrink: 0;
			border-radius: 58rpx;
			background: #b24949;
			color: #fffefe;
			text-align: center;
			font-family: PingFang SC;
			font-size: 24rpx;
			font-style: normal;
			font-weight: 400;
			line-height: 52rpx;
		}
	}

	// 筛选
	.input-right {
		margin: 10rpx;
		width: 228rpx;
		height: 42rpx;
		display: flex;
		justify-content: center;
		align-items: center;

		::v-deep .u-dropdown__content {
			position: fixed;
			top: auto !important;
			z-index: 8;
			width: 100%;
			left: 0px;
			bottom: 0;
			overflow: hidden;
			height: 1320rpx !important;
		}

		text {
			color: #292c35;
			text-align: center;
			font-size: 28rpx;
			line-height: 42rpx;
			margin: 4rpx auto;
		}
	}
}

// 瀑布流
.wrap {
	width: 100%;
	padding-bottom: calc(var(--window-bottom) + 40rpx);

	// 瀑布流大块
	.wrap-box {
		display: flex;
		margin-left: 5rpx;

		// justify-content: center;
		// 循环块
		.demo-warter {
			width: 344rpx;
			border-radius: 16rpx;
			background: #fcfcfc;
			padding: 16rpx;
			position: relative;
			margin: 11rpx;
		}
	}

	//左右块共同属性
	// 照片
	.demo-image {
		width: 100%;
		border-radius: 8rpx;
		max-height: 300rpx;
	}

	// 标题
	.demo-title {
		font-size: 30rpx;
		margin-top: 8rpx;
		color: $u-main-color;
		font-weight: 400;
	}

	// 价格
	.demo-price {
		margin-top: 8rpx;

		.demo-newPrice {
			color: #b24949;
			font-size: 40rpx;
			line-height: 40rpx;
		}

		.demo-newPrice-change {
			color: #b24949;
			font-size: 30rpx;
			line-height: 30rpx;
		}

		.demo-oldPrice {
			margin: 4rpx;
			text-decoration: line-through;
			color: #292c35;
			font-size: 28rpx;
			line-height: 40rpx;
			color: #a9abae;
		}
	}

	// 折扣
	.demo-discount {
		margin-top: 8rpx;
		width: 90rpx;
		height: 38rpx;
		border-radius: 28rpx;
		border: 3rpx solid #b24949;
		display: flex;
		justify-content: center;
		align-items: center;

		text {
			color: #b24949;
			text-align: center;
			font-size: 24rpx;
			line-height: normal;
		}
	}

	.demo-discount-chang {
		margin-top: 8rpx;
		width: 100rpx;
		height: 38rpx;
		border-radius: 28rpx;

		display: flex;
		justify-content: center;
		align-items: center;

		text {
			color: #b24949;
			text-align: center;
			font-size: 24rpx;
			line-height: normal;
		}
	}

	// 店铺
	.demo-shop {
		font-size: 22rpx;
		color: rgba(41, 44, 53, 0.6);
		margin-top: 16rpx;
	}

}

// 組件背景顏色
.popup {
	::v-deep .u-mode-center-box {
		background-color: transparent !important;
	}
}

.tabbar {
	::v-deep .u-tabbar__content__item__text {
		bottom: 0 !important;
	}
}

.toUp {
	width: 70rpx;
	height: 70rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 100%;
	border: 3rpx solid #d0d0d0;
	margin-bottom: 20rpx;
	background-color: rgba(255, 255, 255, 0.6);
	position: fixed;
	bottom: 200rpx;
	right: 50rpx;
}
</style>
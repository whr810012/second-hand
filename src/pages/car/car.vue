<template>
	<view class="car">
		<u-navbar back-text="返回" :title="ActiveCarList[0].origin + '时刻表'" title-size:32></u-navbar>
		<!-- 搜索框 -->
		<view class="search">
			<!-- <u-dropdown active-color="#606266" :close-on-click-mask="true" duration="0" style="font-size: 24rpx;">
				<u-dropdown-item v-model="value1" :title="activeLabel[0].label" :options="addressList"
					@change="changeLabel"></u-dropdown-item>
			</u-dropdown> -->
			<span style="padding: 0 16rpx 0 0;">关闸口岸</span>
			<view class="search-box">
				<input ref="searchInp" class="search-inp" type="text" v-model="searchName" @input="changeSearchName"
					placeholder="输入目的地查询班车信息" />
				<view class="search-icon" @click="clearSearch">
					<u-icon name="close-circle" size="30" v-show="searchName"></u-icon>
				</view>

				<view class="search-btn" @click="goSearch">搜索</view>
			</view>
		</view>
		<!-- 目的地框，根据搜索框判断 -->
		<view class="destination-box">
			<!-- loading -->
			<view class="destination-loading" v-if="searchName && isSearch&&ischeckItem&&loadingshow">
				<view>
					<image src="@/static/loading.svg" />
				</view>
			</view>
			<!-- 正常显示 -->
			<view class="destination" v-if="searchName && searchCarList.length > 0 && isSearch&&ischeckItem&&destinationshow">
				<view class="destination-top">
					<view class="destination-top-left">起点</view>
					<view class="destination-top-right">
						关闸口岸
					</view>
				</view>
				<view class="destination-top">
					<view class="destination-top-left">目的地</view>
					<view class="destination-top-right">{{ searchName }}</view>
				</view>
				<view class="destination-top">
					<view class="destination-top-left">选择发财车</view>
					<view class="destination-top-right">{{ searchCarList[0].carName }}</view>
				</view>
				<view class="destination-bottom">
					<view class="destination-bottom-top">
						<image src="@/static/spot.svg"
							style="width: 12rpx; height:12rpx; algin-items:center; margin-right:16rpx" />搭乘发财车至
						<text>{{ searchCarList[0].carName }}</text>
					</view>
					<view class="destination-bottom-bottom">
						<image src="@/static/spot.svg"
							style="width: 12rpx; height:12rpx; algin-items:center; margin-right:16rpx" />
						步行前往目的地{{ searchName }}
					</view>
				</view>
			</view>
			<!-- 没找到 -->
			<view class="destination-noFound" v-else-if="searchName && searchCarList.length === 0 && isSearch&&!show">
				<view class="noFound-text">未搜索到合理的方案</view>
				<view class="noFound-text">可去导航软件查询适合路线</view>
			</view>
		</view>

		<!-- 班次表 -->
		<view class="carlist-box">
			<view class="carlist">
				<view class="carlist-top">
					<view>{{ ActiveCarList[0].origin || '' }}发财车班次表</view>
					<image src="@/static/car.svg" />
				</view>
				<view class="carlist-center">
					<view class="carlist-center-left">酒店发财车</view>
					<view class="carlist-center-center">间隔时间</view>
					<view class="carlist-center-right">运营时间</view>
				</view>
				<view class="carlist-bottom">
					<view class="carlist-bottom-box" v-for="(item, index) in ActiveCarList" :key="item.id">
						<view class="carlist-bottom-left">
							<view class="carlist-bottom-left-left">{{ item.destination }}</view>
							<view class="carlist-bottom-left-right">
								<image src="@/static/goaddress.svg" @click="nav(item)" />
							</view>
						</view>
						<view class="carlist-bottom-center">{{ item.frequency }} 分钟</view>
						<view class="carlist-bottom-right">{{ item.operation_time }}</view>
					</view>
				</view>
			</view>
		</view>

		<u-popup v-model="show" class="content" mode="bottom" border-radius="14" height="50%" safe-area-inset-bottom
			closeable>
			<view class="content">
				<view class="destination-loading" v-if="searchResult.length === 0">
					<view>
						<image src="@/static/loading.svg" />
					</view>
				</view>
				<scroll-view v-else scroll-y="true" style="height: 50vh" @scrolltolower="scrolltolower" lower-threshold="100">
					<view class="content_item" v-for="(item, index) in searchResult" :key="index"
						@click="checkItem(item)">
						<view class="item_title">{{ item.title }}</view>
						<view class="item_category">{{ item.category }}</view>
						<view class="item_address">{{ item.address }}</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import indexStore from '../../../store';
	import {
		space
	} from '../../../utils/utils.js'
	import * as _ from 'lodash'
	import QQMapWX from '../../../sdk/qqmap-wx-jssdk.min.js'
	const qqmapsdk = new QQMapWX({
		key: 'NFUBZ-PZZ6B-3COUY-N344G-3JSIO-LKBZE'
	})

	export default {
		data() {
			return {
				// 目的地框显示
				isSearch: false,
				// 定时器
				timer: null,
				// 搜索内容
				searchName: "",
				//下拉菜单选中的序号
				value1: 0,
				// tab列表
				addressList: [{
						id: 0,
						label: "拱北口岸",
						value: 0
					},
					{
						id: 1,
						label: "横琴口岸",
						value: 1
					},
					{
						id: 2,
						label: "外港码头",
						value: 2
					},
					{
						id: 3,
						label: "氹仔码头",
						value: 3
					}
				],
				// 目的地列表
				searchCarList: [],
				// 所有发财车班次列表
				goCarlist: [],
				// 选中的发财车列表
				ActiveCarList: [],
				// 下拉菜单选中的口岸
				activeLabel: [],
				show: false,
				page_index: 1,
				searchResult: [],
				// 点击了选择地点
				ischeckItem:false,
				// 正常显示
				destinationshow:false,
				// loding显示
				loadingshow:true
			};
		},
		watch: {
			show(n) {
				console.log('弹窗监听', n);
				if (!n) {
					this.searchResult = []
				}
			}
		},
		async onLoad() {
			try {
				const {
					longitude,
					latitude
				} = await this.getLocation();
				console.log('当前位置的经度：', longitude);
				console.log('当前位置的纬度：', latitude);
				indexStore.state.userLat = latitude;
				indexStore.state.userLong = longitude;

				const res = await indexStore.dispatch('getAllBus');

				this.ActiveCarList = res.bus.map(i => ({
					...i,
					dis: space(i.latitude, i.longitude, indexStore.state.userLat, indexStore.state
						.userLong).toFixed(2)
				}));
				console.log(this.ActiveCarList);

				// this.changeLabel();
			} catch (error) {
				console.error('加载数据失败', error);
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
			// 切换搜索显示
			changeLoaingDestination(){
				setTimeout(()=>{
					this.loadingshow = false
					this.destinationshow = true
				},500)
			},
			// 打开第一个
			clickOne() {
				this.isPopup = !this.isPopup;
				this.isButton = false;
				this.isClose = true;
			},
			// 点击第二个
			clickTwo() {
				this.isPopup = !this.isPopup;
				this.isButton = true;
				this.isClose = false;
				this.textState = 0;
			},
			// 点击第三个
			clickThree() {
				this.isPopup = !this.isPopup;
				this.isButton = true;
				this.isClose = true;
				this.textState = 1;
			},
			// 搜索框
			changeSearchName(e) {
				// if (!this.timer) {
				// 	this.timer = setTimeout(() => {
				// 		this.searchName = e.detail.value;
				// 	}, 500);
				// } else {
				// 	clearTimeout(this.timer);
				// 	this.timer = null;
				// 	this.timer = setTimeout(() => {
				// 		this.searchName = e.detail.value;
				// 	}, 500);
				// }
				// // 等待500ms后改变isSearch，关闭loading
				// if (e.detail.value) {
				// 	this.isSearch = true;
				// 	setTimeout(() => {
				// 		this.isSearch = false;
				// 	}, 1000);
				// }
			},
			goSearch() {
				console.log('点击搜索')
				this.isSearch = true
				this.show = true
				qqmapsdk.search({
					keyword: this.searchName, //搜索关键词
					page_size: 20,
					page_index: this.page_index,
					region: "澳门特别行政区",
					// location: '39.980014,116.313972', //设置周边搜索中心点
					success: (res) => { //搜索成功后的回调
						console.log('搜搜结果', res);
						console.log('当前res', this.page_index, res.data);
						if (res.data.length > 0) {
							this.searchResult = _.uniqBy(this.searchResult.concat(res.data), 'id')
						} else {
							uni.showToast({
								icon: 'none',
								title: '已全部显示'
							})
						}

					},
					fail: (res) => {
						console.log(res);
					},
				});
			},
			scrolltolower(e) {
				console.log('触底', e);
				this.page_index += 1
				this.goSearch()
			},
			// 下拉菜单改变选中后的逻辑
			changeLabel() {
				// 获取选中口岸的车次
				this.ActiveCarList = this.goCarlist.filter(
					item => item.addressId === this.value1
				)
				// 获取被选中的口岸
				this.activeLabel = this.addressList.filter(item => {
					return item.value === this.value1
				})
			},
			// 清空
			clearSearch() {
				this.searchName = ""
				this.destinationshow = false
				this.loadingshow = false
			},
			nav(item) {
				console.log('item=', item);
				uni.openLocation({
					longitude: +item.longitude,
					latitude: +item.latitude,
					// destination: item.destination,
					// address: item.destination,
					success: function(res) {
						console.log('打开系统位置地图成功')
					},
					fail: function(error) {
						console.log(error)
					}
				})
			},
			getLocation() {
				return new Promise((resolve, reject) => {
					uni.getLocation({
						type: 'gcj02',
						success: res => resolve(res),
						fail: reject
					});
				});
			},
			checkItem(item) {
				console.log('选择', item);
				this.ischeckItem = true
				this.show = false
				this.loadingshow= true
				this.destinationshow = false
				this.changeLoaingDestination()
				const dis = space(item.location.lat, item.location.lng, indexStore.state.userLat, indexStore.state
						.userLong).toFixed(2)
				const map = this.ActiveCarList.map(i => i.dis)
				console.log('map=', map);
				const closestNumber = this.findClosestNumber(dis, map);
				console.log(closestNumber); // 输出 6
				
				const index = map.findIndex(i => +i === +closestNumber)
				console.log('下标是==', index);
				this.searchName = item.title
				this.searchCarList =  [{
					addressName: item.title,
					carName: this.ActiveCarList[index].destination,
					// arrivalTime: "15~20分钟",
					// intervalTime: "30分钟",
					// serviceTime: "10:00~20:45"
				}]
			},
			findClosestNumber(target, arr) {
				let closestNumber = null;
				let minDifference = Infinity;
				for (let i = 0; i < arr.length; i++) {
					const difference = Math.abs(target - arr[i]);
					if (difference < minDifference) {
						minDifference = difference;
						closestNumber = arr[i];
					}
				}
				return closestNumber;
			}
		},
	};
</script>

<style scoped lang="scss">
	.search {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 16rpx;

		// 下拉菜单
		::v-deep .u-dropdown__content {
			position: fixed !important;
			top: auto !important;
		}

		// 下拉菜单颜色
		::v-deep .u-dropdown__menu__item__text {
			font-size: 24rpx !important;
		}

		.search-box {
			margin-right: 24rpx;
			width: 540rpx;
			height: 60rpx;
			flex-shrink: 0;
			border-radius: 60rpx;
			border: 1rpx solid #50544d;
			background: rgba(255, 255, 255, 0.7);
			display: flex;
			justify-content: center;
			align-items: center;

			/* //输入框  */
			.search-inp {
				width: 610rpx;
				margin-left: 20rpx;
			}

			.search-icon {
				height: 60rpx;
				width: 60rpx;
				display: flex;
				algin-item: center;
				justify-content: center;
			}

			/* // 搜索按钮 */
			.search-btn {
				margin: 2rpx;
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
	}

	.destination-box {
		margin-top: 24rpx;
		margin-bottom: 24rpx;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.destination {
		width: 696rpx;
		height: 440rpx;
		flex-shrink: 0;
		border-radius: 10px;
		border: 2px solid #b24949;
		background: #fff;
		box-shadow: 0px 0px 18px 0px rgba(0, 0, 0, 0.06);
	}

	.destination-top {
		display: flex;
		height: 90rpx;
		width: 100%;
		justify-content: space-between;
		border-bottom: 1rpx solid rgba(41, 44, 53, 0.1);

		.destination-top-left {
			padding-left: 32rpx;
			padding-top: 24rpx;
			color: rgba(41, 44, 53, 0.6);
			text-align: center;
			font-family: PingFang SC;
			font-size: 24rpx;
			font-style: normal;
			font-weight: 400;
		}

		.destination-top-right {
			display: flex;
			padding-right: 32rpx;
			color: var(#292c35);
			align-items: center;
			font-family: PingFang SC;
			font-size: 28rpx;
			font-style: normal;
			font-weight: 500;

			image {
				width: 36rpx;
				height: 36rpx;
				margin-left: 12rpx;
			}
		}
	}

	.destination-bottom {
		height: 164rpx;
		margin-left: 34rpx;

		.destination-bottom-top {
			color: var(#292c35);
			font-family: PingFang SC;
			font-size: 12px;
			font-style: normal;
			font-weight: 400;
			line-height: 20.722px;
			/* 172.68% */
			letter-spacing: 0.311px;
			padding-top: 40rpx;

			text {
				color: #292c35;
				text-align: center;
				font-family: PingFang SC;
				font-size: 28rpx;
				font-style: normal;
				font-weight: 500;
			}
		}

		.destination-bottom-bottom {
			color: var(#292c35);
			font-family: PingFang SC;
			font-size: 24rpx;
			font-style: normal;
			font-weight: 400;
			padding-top: 20rpx;

			text {
				color: #292c35;
				text-align: center;
				font-family: PingFang SC;
				font-size: 28rpx;
				font-style: normal;
				font-weight: 500;
			}
		}
	}

	.destination-noFound {
		width: 696rpx;
		height: 368rpx;
		flex-shrink: 0;
		border-radius: 10px;
		border: 2px solid #b24949;
		background: #fff;
		box-shadow: 0px 0px 18px 0px rgba(0, 0, 0, 0.06);
		display: grid;
		align-content: center;

		.noFound-text {
			color: var(#292c35);
			text-align: center;
			font-family: PingFang SC;
			font-size: 28rpx;
			font-style: normal;
			font-weight: 400;
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}

	.destination-loading {
		width: 696rpx;
		height: 368rpx;
		flex-shrink: 0;
		border-radius: 10px;
		border: 2px solid #b24949;
		background: #fff;
		box-shadow: 0px 0px 18px 0px rgba(0, 0, 0, 0.06);
		display: grid;
		align-content: center;

		view {
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: center;

			image {
				width: 40rpx;
				height: 40rpx
			}
		}
	}

	.carlist-box {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		padding-bottom: calc(var(--window-bottom) + 40rpx);

		.carlist {
			border-radius: 24rpx;
			border: 1rpx solid #b24949;
			background: #fff;
		}

	}

	.carlist-top {
		border-radius: 24rpx 24rpx 0 0;
		background-color: #075b8a;
		height: 88rpx;
		width: 100%;
		color: #fff;
		text-align: center;
		font-family: PingFang SC;
		font-size: 32rpx;
		font-style: normal;
		font-weight: 500;
		display: flex;
		justify-content: center;
		align-items: center;

		image {
			position: absolute;
			right: 54rpx;
			width: 80rpx;
			height: 40rpx
		}
	}

	.carlist-center {
		margin-top: 2rpx;
		width: 692rpx;
		height: 80rpx;
		background: #b24949;
		display: flex;
		justify-content: center;
		align-items: center;

		.carlist-center-left {
			width: 338rpx;
			border-right: 1rpx solid #fff;
		}

		.carlist-center-center {
			width: 178rpx;
			border-right: 1rpx solid #fff;
		}

		.carlist-center-right {
			width: 177rpx;
		}

		.carlist-center-left,
		.carlist-center-center,
		.carlist-center-right {
			height: 100%;
			// 文字垂直居中
			display: flex;
			justify-content: center;
			align-items: center;
			color: #fff;
			text-align: center;
			font-family: PingFang SC;
			font-size: 12px;
			font-style: normal;
			font-weight: 400;
			line-height: 20.722px;
			/* 172.68% */
			letter-spacing: 0.311px;
			margin: 0;
		}
	}

	.carlist-bottom {
		width: 100%;
	}

	//奇数行
	.carlist-bottom-box:nth-child(odd) {
		width: 692rpx;
		height: 72rpx;
		display: flex;
		align-items: center;
		background-color: #f5f5f5;
	}

	.carlist-bottom-box:nth-child(even) {
		width: 692rpx;
		height: 72rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	// 给最后一个carlist-bottom-box添加边角
	.carlist-bottom-box:last-child {
		border-radius: 0 0 24rpx 24rpx;
	}

	.carlist-bottom-box {
		.carlist-bottom-left {
			position: relative;
			width: 338rpx;
			border-right: 1rpx solid #b24949;
			height: 100%;
			display: flex;
			align-items: center;
			color: #292c35;
			text-align: center;
			font-family: PingFang SC;
			font-size: 12px;
			font-style: normal;
			font-weight: 500;

			// 第一个view
			.carlist-bottom-left-left {
				margin-left: 28rpx;
			}

			// 第二个view
			.carlist-bottom-left-right {
				position: absolute;
				right: 22rpx;

				image {
					width: 32rpx;
					height: 32rpx
				}
			}
		}

		.carlist-bottom-center {
			width: 178rpx;
			border-right: 1rpx solid #b24949;
		}

		.carlist-bottom-right {
			width: 177rpx;
		}

		.carlist-bottom-center,
		.carlist-bottom-right {
			height: 100%;
			// 文字垂直居中
			display: flex;
			justify-content: center;
			align-items: center;
			color: #292c35;
			text-align: center;
			font-family: PingFang SC;
			font-size: 12px;
			font-style: normal;
			font-weight: 500;
		}
	}

	.carlist-bottom-center {
		width: 178rpx;
		border-right: 1rpx solid #b24949;
	}

	.carlist-bottom-right {
		width: 177rpx;
	}

	.carlist-bottom-center,
	.carlist-bottom-right {
		height: 100%;
		// 文字垂直居中
		display: flex;
		justify-content: center;
		align-items: center;
		color: #292c35;
		text-align: center;
		font-family: PingFang SC;
		font-size: 12px;
		font-style: normal;
		font-weight: 500;
	}

	// }

	// 組件背景顏色
	.popup {
		::v-deep .u-mode-center-box {
			background-color: transparent !important;
		}
	}

	.content {
		padding: 24rpx;
		text-align: left;
		.destination-loading {
			border: none;
		}

		.content_item {
			padding: 12rpx 0;
			border-bottom: 1px solid #eee;

			.item_title {
				color: #3E3E3E;
				font-size: 28rpx;
			}

			.item_category {
				color: #3E3E3E99;
				font-size: 22rpx;
				padding: 4rpx 0;
			}

			.item_address {
				color: #3E3E3E99;
				font-size: 22rpx;
			}
		}
	}
</style>
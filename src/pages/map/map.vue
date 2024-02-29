<template>
	<view>
		<scroll-view class="scroll" scroll-x="true" scroll-with-animation enable-flex :scroll-into-view="scrollToView">
			<view :id="`scroll${current}`" class="scroll_classfiy"
				:style="{ color: index === current ? '#292C35' : '' }" v-for="(item, index) in classfiy" :key="index"
				@click="tag(item, index)">
				{{ item }}
			</view>
		</scroll-view>

		<map id="mapId" ref="mapRef" class="map" key="MPDBZ-HC2KL-J5ZPP-MZIQD-5C22S-MBFB5" :show-location="true"
			:latitude="latitude" :longitude="longitude" :min-scale="13" :include-points="includePoints" :scale="myScale"
			:markers="markers" :polygons="polygons" @markertap="tapmarker" @regionchange="regionchange"></map>
		<!-- 地点弹窗 -->
		<mapPopup class="map-pop" ref="mapPop" :clickclass="clickclass" :item="detail" @nav="nav"></mapPopup>
		<!-- 二维码弹窗 -->
		<popup class="popup" :popupList="popupList" :isPopup="isPopup" :isClose="isClose" :isButton="isButton"
			:textState="textState" :popup.sync="isPopup" @popBtn="popBtn">
		</popup>

		<u-tabbar class="tabbar" :list="tablist" :mid-button="true" style="z-index: 1;"
			bg-color="rgba(255, 255, 255, 0.92)" inactive-color="rgba(41, 44, 53, 0.30)" mid-button-size="180rpx"
			icon-size="48rpx" @change="clicktabbar"></u-tabbar>
	</view>
</template>
<script>
	import mapPopup from '@/components/map-popup/map-popup.vue'
	import indexStore from '../../../store/index.js'
	import popup from '@/components/popup/popup.vue'
	import {
		space
	} from '../../../utils/utils.js'
	import * as _ from 'lodash'
	import p_list from '../../../utils/polygon.js'
	import {
		CarOfWealth
	} from '../../../utils/utils.js'

	export default {
		components: {
			mapPopup,
			popup
		},
		data() {
			return {
				latitude: 22.1585693487633,
				longitude: 113.567812056305,
				myScale: 13,
				mapScale: 14.6,
				markers: [],
				polygons: [],
				mapCtx: null,
				includePoints: [],
				current: 0,
				scrollToView: '',
				classfiy: [
					'全部',
					'庙宇/教堂',
					'人文景点',
					'自然景点',
					'小吃/饮品',
					'购物',
					'餐饮',
					'交通',
					'药房',
					'健康/美容',
					'娱乐',
					'公厕'
				],
				// clickclass
				clickclass: 'eat',
				detail: {},
				tablist: '',
				// 轮播图数据
				popupList: [{
					id: 0,
					imgUrl: 'https://tutu-aomen.s3.cn-northwest-1.amazonaws.com.cn/landing/%E5%B7%B2%E8%8E%B7%E5%BE%97%E5%BC%B9%E7%AA%97.png'
				}],
				// 控制弹窗
				isPopup: false,
				// 是否有按钮
				isButton: true,
				// 是否有关闭icon
				isClose: true,
				passCode: '',
				// textState：文字状态
				// 0为：畅玩澳门，1：9.9元 续购
				textState: 0,
				region: [],
				changeType: '',
				allMarkers: [],
				minMarkers: [{
						"longitude": 113.543944,
						"latitude": 22.208348,
						"name": "新填海居民區-吃喝",
						"width": 78,
						"height": 23,
						'icon': 'https://tutu-aomen.s3.cn-northwest-1.amazonaws.com.cn/areas/78_23_0.png'
					},
					{
						"longitude": 113.560337,
						"latitude": 22.206123,
						"name": "關口生活區-吃喝",
						"width": 65,
						"height": 23,
						'icon': 'https://tutu-aomen.s3.cn-northwest-1.amazonaws.com.cn/areas/65_23_1.png'
					},
					{
						"longitude": 113.54639,
						"latitude": 22.199408,
						"name": "十月初五街老澳門情懷",
						"width": 65,
						"height": 34,
						'icon': 'https://tutu-aomen.s3.cn-northwest-1.amazonaws.com.cn/areas/65_34_2.png'
					},
					{
						"longitude": 113.555977,
						"latitude": 22.197456,
						"name": "水塘步行區-大賽車主要幹道",
						"width": 65,
						"height": 23,
						'icon': 'https://tutu-aomen.s3.cn-northwest-1.amazonaws.com.cn/areas/65_23_3.png'
					},
					{
						"longitude": 113.538497,
						"latitude": 22.179886,
						"name": "下環街特色自由行",
						"width": 65,
						"height": 34,
						'icon': 'https://tutu-aomen.s3.cn-northwest-1.amazonaws.com.cn/areas/65_34_4.png'
					},
					{
						"longitude": 113.541982,
						"latitude": 22.176874,
						"name": "福隆新街、大三巴旅游區",
						"width": 65,
						"height": 34,
						'icon': 'https://tutu-aomen.s3.cn-northwest-1.amazonaws.com.cn/areas/65_34_5.png'
					},
					{
						"longitude": 113.556685,
						"latitude": 22.185555,
						"name": "澳門商業區",
						"width": 65,
						"height": 23,
						'icon': 'https://tutu-aomen.s3.cn-northwest-1.amazonaws.com.cn/areas/65_23_6.png'
					},
					{
						"longitude": 113.562388,
						"latitude": 22.156449,
						"name": "氹仔居民生活區",
						"width": 97,
						"height": 50,
						'icon': 'https://tutu-aomen.s3.cn-northwest-1.amazonaws.com.cn/areas/97_50_7.png'
					},
					{
						"longitude": 113.570628,
						"latitude": 22.137004,
						"name": "金光大道娛樂場集中區",
						"width": 107,
						"height": 65,
						'icon': 'https://tutu-aomen.s3.cn-northwest-1.amazonaws.com.cn/areas/107_65_8.png'
					},
					{
						"longitude": 113.565071,
						"latitude": 22.111468,
						"name": "路環居民生活區",
						"width": 97,
						"height": 50,
						'icon': 'https://tutu-aomen.s3.cn-northwest-1.amazonaws.com.cn/areas/97_50_9.png'
					},
					// 下面是icon
					{
						"longitude": 113.545883,
						"latitude": 22.194627,
						"width": 119,
						"height": 56,
						'icon': 'https://tutu-aomen.s3.cn-northwest-1.amazonaws.com.cn/areas/357_168_42.png'
					},
					{
						"longitude": 113.53623,
						"latitude": 22.184212,
						"width": 91,
						"height": 61,
						'icon': 'https://tutu-aomen.s3.cn-northwest-1.amazonaws.com.cn/areas/273_183_08.png'
					},
					{
						"longitude": 113.585275,
						"latitude": 22.129779,
						"width": 77,
						"height": 69,
						'icon': 'https://tutu-aomen.s3.cn-northwest-1.amazonaws.com.cn/areas/231_207_16.png'
					},
					{
						"longitude": 113.568317,
						"latitude": 22.11971,
						"width": 135,
						"height": 66,
						'icon': 'https://tutu-aomen.s3.cn-northwest-1.amazonaws.com.cn/areas/405_198_25.png'
					},
					{
						"longitude": 113.566661,
						"latitude": 22.145351,
						"width": 106,
						"height": 68,
						'icon': 'https://tutu-aomen.s3.cn-northwest-1.amazonaws.com.cn/areas/318_204_27.png'
					},
					{
						"longitude": 113.558608,
						"latitude": 22.191407,
						"width": 105,
						"height": 70,
						'icon': 'https://tutu-aomen.s3.cn-northwest-1.amazonaws.com.cn/areas/315_210_29.png'
					},
					{
						"longitude": 113.545661,
						"latitude": 22.191954,
						"width": 116,
						"height": 59,
						'icon': 'https://tutu-aomen.s3.cn-northwest-1.amazonaws.com.cn/areas/348_177_07.png'
					},
					{
						"longitude": 113.54848,
						"latitude": 22.187869,
						"width": 120,
						"height": 67,
						'icon': 'https://tutu-aomen.s3.cn-northwest-1.amazonaws.com.cn/areas/360_201_33.png'
					},
					{
						"longitude": 113.561512,
						"latitude": 22.189432,
						"width": 101,
						"height": 66,
						'icon': 'https://tutu-aomen.s3.cn-northwest-1.amazonaws.com.cn/areas/303_198_36.png'
					},
					{
						'latitude': 22.212343,
						'longitude': 113.554778,
						'icon': 'https://tutu-aomen.s3.cn-northwest-1.amazonaws.com.cn/poi_icons/9999_402_186.png',
						'width': 134,
						'height': 62,
					}
				]
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
		async onLoad(options) {
			await indexStore.dispatch('getUserPassStatus', {})
			if (indexStore.state.userPassStatus.msg === 'User has no pass') {
				console.log('还没买过')
				uni.reLaunch({
					url: '/pages/index/index'
				})
				return
			}

			// this.passCode = await indexStore.dispatch('createPass')
			this.passCode = indexStore.state.userPassStatus
			console.log('passCode', this.passCode)
			if (this.passCode.msg === 'Valid') {
				console.log('未过期')
				this.isPopup = true;
				this.isButton = true;
				this.isClose = false;
				this.textState = 0
				this.popupList = [{
					id: 0,
					imgUrl: 'https://tutu-aomen.s3.cn-northwest-1.amazonaws.com.cn/landing/%E5%B7%B2%E8%8E%B7%E5%BE%97%E5%BC%B9%E7%AA%97.png'
				}]
			}
			if (this.passCode.msg === 'Expired') {
				console.log('已过期')
				this.isPopup = true;
				this.isButton = true;
				this.isClose = false;
				this.textState = 1
				this.popupList = [{
					id: 0,
					imgUrl: 'https://tutu-aomen.s3.cn-northwest-1.amazonaws.com.cn/landing/%E8%99%9A%E6%9E%84%E5%BC%B9%E7%AA%97.png'
				}]
			}
			// this.getPois()
			this.tablist = indexStore.state.list
			this.getLocation()
		},
		async onShow() {
			console.log('show=====', indexStore.state.pois);
			if (this.current === 0) {
				await indexStore.dispatch('getPois', {
					// region:
				})
			} else {
				await indexStore.dispatch('getPois', {
					category: this.classfiy[index],
					// region:
				})
			}
		},
		onReady() {
			console.log('onReady')
			this.mapCtx = uni.createMapContext('mapId', this)

			this.mapCtx.getRegion({
				success: res => {
					console.log('当前视野范围ready', res)
					this.includePoints.push(res.northeast)
					this.includePoints.push(res.southwest)
					console.log(this.includePoints);
					this.setMinScaleMarkers()
				},
				fail: err => {
					console.log('当前视野范围err', err)
				}
			})


		},
		watch: {
			// myScale(n, o) {
			// 	if (this.changeType === 'max') return
			// 	console.log('watch--------------', n, this.myScale);
			// 	if (n < this.mapScale) {
			// 		this.setMinScaleMarkers()
			// 	} else if (n > this.myScale) {
			// 		this.setMaxScaleMarkers()
			// 	}
			// }
		},
		methods: {
			popBtn() {
				console.log('---', this.textState);
				if (this.textState === 0) {
					this.isPopup = false
				}
				if (this.textState === 1) {
					console.log('---', this.textState);
					this.toBuy()
				}
			},
			async toBuy() {
				console.log("买买买");
				const res = await indexStore.dispatch('createOrderPay', {
					product_id: 123
				})
				console.log('res===', res);
				this.pay(res)
			},
			pay(res) {
				// 仅作为示例，非真实参数信息。
				uni.requestPayment({
					provider: 'wxpay',
					timeStamp: res.timeStamp,
					nonceStr: res.nonceStr,
					package: res.package,
					signType: res.signType,
					paySign: res.paySign,
					prepay_id: res.prepay_id,
					success: async (res) => {
						console.log('支付success:' + JSON.stringify(res));
						await indexStore.dispatch('createPass')
						this.isPopup = false
						this.getPois()
						uni.showToast({
							icon: 'success',
							title: '您已成功续费'
						})
					},
					fail: (err) => {
						console.log('支付fail:' + JSON.stringify(err));
						uni.showToast({
							icon: 'none',
							title: '已放弃支付'
						})
					}
				});
			},
			// 渲染map中的pois
			async getPois() {
				await indexStore.dispatch('getPois')
				console.log('pois', indexStore.state.pois)
			},
			// 点击marker
			async tapmarker(e) {
				console.log('点击marker事件', e)
				// console.log(indexStore.state.pois);
				// console.log(this.markers);
				// console.log('this.changeType', this.changeType);
				// console.log(this.markers[e.target.markerId]);
				if (this.markers[e.target.markerId].iconPath.includes('9999_402_186')) {
					uni.navigateTo({
						url: `/pages/car/car`
					});
					return
				}

				if (this.changeType === 'min') {
					console.log('=============', this.markers[e.target.markerId]);
					this.myScale = this.myScale == 16 ? 16.000001 : 16
					const that = this
					uni.getSystemInfo({
						success: (o) => {
							console.log(JSON.stringify(o));
							console.log(o.osName);
							if (o.osName === 'android') {
								console.log(this.markers[e.target.markerId].latitude);
								console.log(this.markers[e.target.markerId].longitude);
								this.mapCtx.moveToLocation({
									latitude: this.markers[e.target.markerId].latitude,
									longitude: this.markers[e.target.markerId].longitude,

									success: s => {
										console.log('移动', s);
										setTimeout(() => {
											// this.myScale = this.myScale == 16 ? 16.000001 : 1;6
											this.setMaxScaleMarkers()

										}, 600)
									},
									fail: err => {
										console.log('没有移动', err);
									}
								})
							}
							if (o.osName === 'ios') {
								console.log(this.markers[e.target.markerId].latitude);
								console.log(this.markers[e.target.markerId].longitude);
								// 卡死

								this.$nextTick(() => {

									that.mapCtx.moveToLocation({
										longitude: this.markers[e.target.markerId]
											.longitude,
										latitude: this.markers[e.target.markerId].latitude,
										success: res => {
											console.log(
												'------------------------------------------------------------------'
											);
											console.log('移动', res);
											console.log(
												'------------------------------------------------------------------'
											);
											setTimeout(() => {
												// this.myScale = this.myScale == 16 ? 16.000001 : 16
												console.log(
													'----------------------显示-----------------------'
												);
												this.setMaxScaleMarkers()

											}, 1000)
										},
										fail: err => {
											console.log('没有移动', err);
										}
									})

								})
							}
						},
						fail: e => {
							console.log('---', e);
						}
					});
					return
				}

				this.detail = this.markers[e.target.markerId].item
				console.log(this.markers[e.target.markerId]);
				console.log(this.detail)
				await this.getLocation()
				this.detail['dis'] = space(this.detail.position.lat, this.detail.position.long, indexStore.state
					.userLat,
					indexStore.state
					.userLong).toFixed(2)
				console.log(this.detail['dis'])
				this.$refs.mapPop.change(this.detail.id)
				this.clickclass = this.detail.type
			},
			getLocation() {
				uni.getLocation({
					type: 'gcj02',
					complete: (res) => {
						console.log('getLocaltion', res)
						// getLocaltion()
						indexStore.state.userLat = res.latitude
						indexStore.state.userLong = res.longitude
					}
				})
			},
			nav(item) {
				console.log('nav=', item);
				this.mapCtx.openMapApp({
					longitude: +item.position.nav_lon,
					latitude: +item.position.nav_lat,
					destination: item.name,
					success: res => {
						console.log('打开', res)
					}, // function		否	接口调用成功的回调函数
					fail: err => {
						console.log('打不开', err)
					}
				})
			},

			// 视野变化
			regionchange(e) {

				console.log('视野变化', this.myScale, e)
				if (e.type === 'end') {
					this.mapCtx.getScale({
						success: res => {
							console.log('当前scale：', res, this.myScale, res.scale)
	
								console.log('比较前',this.myScale, res.scale);
								
								if (res.scale < this.mapScale) {
									console.log('变变变，大范围');
									this.setMinScaleMarkers()
								} 
								else if (res.scale > this.myScale) {
									console.log('变变变111，小范围');
									this.setMaxScaleMarkers()
								}
								 else if(res.scale < this.myScale&&this.myScale == 13){
									console.log('变变变222，return');
									return 
								 }else{
									 console.log('变变变333，小范围');
									this.setMaxScaleMarkers() 
								 }
								// if(res.scale < this.mapScale){
								// 	this.setMinScaleMarkers()
								// }else if(res.scale > this.mapScale){
								// 	this.setMaxScaleMarkers()
								// }else{
								// 	return
								// }



						},
						fail: err => {
							console.log('当前scale-err：', err)
						}
					})
					this.mapCtx.getCenterLocation({
						success: (res) => {
							const latitude = res.latitude
							const longitude = res.longitude
							console.log(this.checkInBounds(latitude, longitude))
							if (!this.checkInBounds(latitude, longitude)) {
								console.log(123);
								// 用戸操作超出地圏辺界， 逐原到辺界内
								this.mapCtx.moveToLocation({
									latitude: this.latitude,
									longitude: this.longitude,
								})
							}
						}
					})
					this.getMapRegion()
				}


			},
			checkInBounds(latitude, longitude) {
				const bounds = this.includePoints
				const minLat = Math.min(bounds[0].latitude - 0.25, bounds[1].latitude + 0.25)
				const maxLat = Math.max(bounds[0].latitude - 0.25, bounds[1].latitude + 0.25)
				const minLng = Math.min(bounds[0].longitude + 0.5, bounds[1].longitude - 0.5)
				const maxLng = Math.max(bounds[0].longitude + 0.5, bounds[1].longitude - 0.5)
				return (latitude >= minLat && latitude <= maxLat && longitude >= minLng && longitude <= maxLng)
			},
			// 获取地图范围
			getMapRegion() {
				console.log('---------')
				this.region = []
				this.mapCtx.getRegion({
					success: async res => {
						console.log('当前视野范围', res)
						this.region.push({
							lat: res.southwest.latitude,
							long: res.southwest.longitude
						})
						this.region.push({
							lat: res.northeast.latitude,
							long: res.northeast.longitude
						})
						console.log('map===', this.region);
						if (this.current === 0) {
							await indexStore.dispatch('getPois', {
								region: this.region
							})
						} else {
							await indexStore.dispatch('getPois', {
								category: this.classfiy[this.current],
								region: this.region
							})
						}
					},
					fail: err => {
						console.log('当前视野范围err', err)
					}
				})
			},
			// 顶部分类
			async tag(item, index) {
				console.log(item, index)
				this.current = index
				this.scrollToView = `scroll${index}`
				console.log(this.myScale < this.mapScale);
				console.log(this.myScale, this.mapScale);
				// if (this.myScale < this.mapScale) return

				if (item === '全部') {
					this.markers = []
				}


				if (this.changeType === 'min') return
				if (index === 0) {
					await indexStore.dispatch('getPois')
					this.changeType = ''
				} else {
					await indexStore.dispatch('getPois', {
						category: this.classfiy[index],
						// region:
					})
					this.changeType = 'tag'
				}
				this.setMaxScaleMarkers()
			},
			clicktabbar(index) {
				if (index === 1) {
					this.isPopup = true;
					this.isButton = false;
					this.isClose = true;
					this.popupList = [{
						id: 0,
						imgUrl: 'https://tutu-aomen.s3.cn-northwest-1.amazonaws.com.cn/landing/%E4%BA%8C%E7%BB%B4%E7%A0%81%E5%BC%B9%E7%AA%97.png'
					}]
				}
			},
			// 视野放大后的markers
			async setMaxScaleMarkers() {
				console.log('---------atart---------', this.changeType);
				await this.mapCtx.getRegion({
					success: async res => {
						console.log('当前视野范围', res, this.myScale)
						this.region = []
						this.region.push({
							lat: res.southwest.latitude,
							long: res.southwest.longitude
						})
						this.region.push({
							lat: res.northeast.latitude,
							long: res.northeast.longitude
						})
						console.log('set===', this.region);
						if (this.current === 0) {
							await indexStore.dispatch('getPois', {
								region: this.region
							})
						} else {
							await indexStore.dispatch('getPois', {
								category: this.classfiy[this.current],
								region: this.region
							})
						}
						let poiList = indexStore.state.pois.concat([CarOfWealth])
						if (this.changeType === 'min') {
							this.markers = []
							poiList = indexStore.state.inPois.concat([CarOfWealth])
						}
						if (this.changeType === 'tag') {
							this.markers = []
							poiList = indexStore.state.pois.concat([CarOfWealth])
						}
						if (this.changeType === 'max') {
							poiList = indexStore.state.inPois
						}
						this.changeType = 'max'
						this.polygons = []
						// console.log(poiList);
						// console.log(this.markers);
						// console.log('this.markers.length === indexStore.state.pois.length', this.markers.length === poiList.length);
						// const diff = _.differenceWith(poiList, this.markers, (a, b) => a.item.id === b.item.id);
						const diff = poiList.filter(itemA => !this.markers.some(itemB => itemB.index ===
							itemA.index));
						// console.log(diff);
						if (this.markers.length === poiList.length) return
						if (diff && diff.length === 0) return

						const markers = diff.map((i, j) => {
							// this.markers = []
							// const list = poiList // indexStore.state.inPois.length > 0 ? indexStore.state.inPois : indexStore.state.pois
							// const markers = list.map((i, j) => {
							const a = i.icon_file.split('_')[2]
							return {
								id: j + this.markers.length,
								// id: j,
								index: i.id,
								latitude: i.position.lat,
								longitude: i.position.long,
								nav_lat: i.position.nav_lat,
								nav_long: i.position.nav_long,
								iconPath: i.icon_file,
								width: i.width || +a / 3,
								height: i.height || 58,
								joinCluster: false,
								alpha: 1,
								position: i.position,
								icon_file: i.icon_file,
								item: i,
								customCallout: {
									anchorY: 10,
									anchorX: 0,
									display: 'ALWAYS'
								},
							}
						})
						this.markers = _.uniqBy(this.markers.concat(this.markers, markers), 'index')
						// console.log(this.markers);
						// this.$forceUpdate()
						console.log('---------end---------');
					},
					fail: err => {
						console.log('当前视野范围err', err)
					}
				})

			},
			// 收藏进入或者scale最小的时候赋值markers
			setMinScaleMarkers() {
				console.log('--------------------------------------------------');
				this.changeType = 'min'
				this.polygons = Object.keys(p_list).map((item, index) => {
					return {
						points: p_list[item],
						strokeWidth: 2,
						strokeColor: '#075B8A',
						fillColor: index % 2 === 0 ? '#B2494924' : '#075B8A24'
					}
				})
				this.markers = [

				]
				this.markers = this.minMarkers.map((i, j) => {
					return {
						id: j,
						latitude: i.latitude,
						longitude: i.longitude,
						iconPath: i.icon,
						width: i.width,
						height: i.height,
						joinCluster: false,
						alpha: 1,
						zIndex: 10,
						customCallout: {
							anchorY: 10,
							anchorX: 0,
							display: 'ALWAYS'
						},
					}
				})
				this.markers.push(
					// 	{
					// 		id: 999999999,
					// 		index: 999999999,
					// 		latitude: 22.212343,
					// 		longitude: 113.554778,
					// 		iconPath: 'https://tutu-aomen.s3.cn-northwest-1.amazonaws.com.cn/products/Macau_bus.png',
					// 		width: 134,
					// 		height: 64,
					// 		joinCluster: false,
					// 		alpha: 1,
					// 		zIndex: 10,
					// 		customCallout: {
					// 			anchorY: 10,
					// 			anchorX: 0,
					// 			display: 'ALWAYS'
					// 		},
					// 	}
				)
				this.$forceUpdate()
			}
		}
	}
</script>
<style lang="scss" scoped>
	.scroll {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0);
		z-index: 1;
		white-space: nowrap;
		overflow: hidden;

		.scroll_classfiy {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			padding: 10px;
			border-radius: 40rpx;
			background: #FFF;
			width: 148rpx;
			height: 60rpx;
			color: rgba(41, 44, 53, 0.60);
			font-family: 'PingFang SC', sans-serif;
			font-size: 24rpx;
			font-weight: 600;
			line-height: normal;
			letter-spacing: 0.311px;
			margin: 24rpx 12rpx;
		}
	}

	.map {
		width: 100vw;
		height: 100vh;
	}

	.map-pop {

		// map-popup组件背景色取消
		&::v-deep .u-drawer-bottom {
			background: none !important;
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
</style>
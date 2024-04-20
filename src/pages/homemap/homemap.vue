<template>
	<view>
		<map id="mapId" ref="mapRef" class="map" key="MPDBZ-HC2KL-J5ZPP-MZIQD-5C22S-MBFB5" :show-location="true"
			:latitude="latitude" :longitude="longitude" :min-scale="15" :polygons="polygons" :scale="myScale"
			:markers="markers" @regionchange="regionchange" @markertap="markertap"></map>
		<mapPopup class="map-pop" ref="mapPop" :clickclass="clickclass" :item="detail" @nav="nav" :dis="detail.dis">
		</mapPopup>
	</view>
</template>

<script>
import mapPopup from '@/components/map-popup/map-popup.vue'
import {
	space
} from '../../../utils/utils.js'
export default {
	components: {
		mapPopup,
		// popup
	},
	data() {
		return {
			mapCtx: null,
			includePoints: [],
			detail: {},
			latitude: 36.66490086882746,
			longitude: 117.08660055611418,
			myScale: 16,
			polygons: [{
				id: 1,
				points: [{
					latitude: 36.664209,
					longitude: 117.085757
				},
				{
					latitude: 36.664201,
					longitude: 117.087617
				},
				{
					latitude: 36.666,
					longitude: 117.087726
				},
				{
					latitude: 36.666088,
					longitude: 117.09195
				},
				{
					latitude: 36.668264,
					longitude: 117.09357
				},
				{
					latitude: 36.66846,
					longitude: 117.089314
				},
				{
					latitude: 36.668082,
					longitude: 117.089281
				},
				{
					latitude: 36.66774,
					longitude: 117.089106
				},
				{
					latitude: 36.667468,
					longitude: 117.088887
				},
				{
					latitude: 36.667128,
					longitude: 117.088587
				},
				{
					latitude: 36.666859,
					longitude: 117.088113
				},
				{
					latitude: 36.666574,
					longitude: 117.087453
				},
				{
					latitude: 36.666693,
					longitude: 117.086831
				},
				{
					latitude: 36.667086,
					longitude: 117.086091
				},
				{
					latitude: 36.667485,
					longitude: 117.085783
				},
				{
					latitude: 36.66831,
					longitude: 117.0855
				},
				{
					latitude: 36.668834,
					longitude: 117.084969
				},
				{
					latitude: 36.669103,
					longitude: 117.083927
				},
				{
					latitude: 36.669338,
					longitude: 117.083333
				},
				{
					latitude: 36.668973,
					longitude: 117.083397
				},
				{
					latitude: 36.668556,
					longitude: 117.083457
				},
				{
					latitude: 36.667944,
					longitude: 117.083564
				},
				{
					latitude: 36.666639,
					longitude: 117.083517
				},
				{
					latitude: 36.666158,
					longitude: 117.084694
				},
				{
					latitude: 36.665858,
					longitude: 117.084809
				},
				{
					latitude: 36.665629,
					longitude: 117.085816
				},
				{
					latitude: 36.664348,
					longitude: 117.085714
				}
				],
				fillColor: 'rgba(255, 0, 0, 0.15)',
				strokeColor: 'rgba(255, 0, 0, 1)',
				strokeWidth: 1
			}],
			markers: [{
				latitude: 36.6660,
				longitude: 117.086839,
				width: 0, // 设置标记点的宽度
				height: 0, // 设置标记点的高度
				id: 0,
				callout: {
					color: '#ffffff',
					content: '山东政法学院',
					fontSize: 13,
					borderRadius: 5,
					bgColor: 'rgba(255, 0, 0, 0.4)',
					padding: 8,
					textAlign: 'center',
					display: "ALWAYS"
				}

			}],
			maxMarkers: [{
				latitude: 36.6660,
				longitude: 117.086839,
				width: 0, // 设置标记点的宽度
				height: 0, // 设置标记点的高度
				id: 9999999999999,
				callout: {
					color: '#ffffff',
					content: '山东政法学院',
					fontSize: 13,
					borderRadius: 5,
					bgColor: 'rgba(255, 0, 0, 0.4)',
					padding: 8,
					textAlign: 'center',
					display: "ALWAYS"
				}

			}],
			minMarkers: [{
				id: 0,
				// 36.668076,117.084016
				latitude: 36.668076,
				longitude: 117.084016,
				width: 30, // 设置标记点的宽度
				height: 50, // 设置标记点的高度
				iconPath: '../../static/markers/play.svg',
				label: {
					content: '运动场',
					fontSize: 17,
					padding: 8,
					textAlign: 'center',
					borderWidth: 1,
					borderColor: '#000',
					bgColor: 'rgba(255,255,255,0.6)',
					borderRadius: 20,
				},
				item: {
					name: '运动场',
					latitude: 36.668076,
					longitude: 117.084016,
					id: 0,
					imageList: [
						'https://www.sdupsl.edu.cn/__local/D/D5/B9/9148CC5A7D45FEC58C15CDB1AD1_8376215F_104EF.jpg'
					]
				}
			},
			{
				id: 1,
				latitude: 36.66794,
				longitude: 117.08479,
				width: 30, // 设置标记点的宽度
				height: 50, // 设置标记点的高度
				iconPath: '../../static/markers/play.svg',
				label: {
					content: '西操场',
					fontSize: 17,
					padding: 8,
					textAlign: 'center',
					borderWidth: 1,
					borderColor: '#000',
					bgColor: 'rgba(255,255,255,0.6)',
					borderRadius: 20,
				},
				item: {
					name: '西操场',
					latitude: 36.66794,
					longitude: 117.08479,
					id: 1,
					imageList: [
						'https://tw.sdupsl.edu.cn/__local/9/17/0F/8B5852EEED0B1ED12F64B242EAE_4CA5E90D_9C256.png'
					]
				}
			},
			{
				id: 2,
				latitude: 36.666706,
				longitude: 117.090898,
				width: 30, // 设置标记点的宽度
				height: 50, // 设置标记点的高度
				iconPath: '../../static/markers/play.svg',
				label: {
					content: '东操场',
					fontSize: 17,
					padding: 8,
					textAlign: 'center',
					borderWidth: 1,
					borderColor: '#000',
					bgColor: 'rgba(255,255,255,0.6)',
					borderRadius: 20,
				},
				item: {
					name: '东操场',
					latitude: 36.666706,
					longitude: 117.090898,
					id: 2,
					imageList: [
						'https://pica.zhimg.com/v2-744407cb481989869026507d23d0b140_r.jpg?source=1940ef5c'
					]
				}
			},
			{
				id: 3,
				latitude: 36.666637,
				longitude: 117.088775,
				width: 30, // 设置标记点的宽度
				height: 50, // 设置标记点的高度
				iconPath: '../../static/markers/tushu.svg',
				label: {
					content: '图书馆',
					fontSize: 17,
					padding: 8,
					textAlign: 'center',
					borderWidth: 1,
					borderColor: '#000',
					bgColor: 'rgba(255,255,255,0.6)',
					borderRadius: 20,
				},
				item: {
					name: '图书馆',
					latitude: 36.666637,
					longitude: 117.088775,
					id: 3,
					imageList: [
						'https://www.sdupsl.edu.cn/__local/4/F1/6B/8DAD053BDBDDB7B30ADBD9F776D_96053356_34801.jpg'
					]
				}
			},
			{
				id: 4,
				latitude: 36.664394,
				longitude: 117.085992,
				width: 30, // 设置标记点的宽度
				height: 50, // 设置标记点的高度
				iconPath: '../../static/markers/eat.svg',
				label: {
					content: '第一餐厅',
					fontSize: 17,
					padding: 8,
					textAlign: 'center',
					borderWidth: 1,
					borderColor: '#000',
					bgColor: 'rgba(255,255,255,0.6)',
					borderRadius: 20,
				},
				item: {
					name: '第一餐厅',
					latitude: 36.664394,
					longitude: 117.085992,
					id: 4,
					imageList: [
						'https://mmbiz.qpic.cn/mmbiz_jpg/KLyJuiaRBicaCZ3muIfXP6bABy0kKicX9UdiahMvFPyILkXbyCx1I5D3VCn5iapEUN7E7lWFzUpq5JVSDw3Ax3A7uKQ/640?wx_fmt=jpeg'
					]
				}
			},

			{
				id: 5,
				latitude: 36.664962,
				longitude: 117.086066,
				width: 30, // 设置标记点的宽度
				height: 50, // 设置标记点的高度
				iconPath: '../../static/markers/eat.svg',
				label: {
					content: '第二餐厅',
					fontSize: 17,
					padding: 8,
					textAlign: 'center',
					borderWidth: 1,
					borderColor: '#000',
					bgColor: 'rgba(255,255,255,0.6)',
					borderRadius: 20,
				},
				item: {
					name: '第二餐厅',
					latitude: 36.664962,
					longitude: 117.086066,
					id: 5,
					imageList: [
						'https://mmbiz.qpic.cn/mmbiz_png/KLyJuiaRBicaDzDv6cwblH2jyoNADeich9283XeliboXIeNSkgAybaiawJQqkichVm9FODdq4e6mqCnx93Y8Chib9ia62A/640?wx_fmt=png'
					]
				}
			},

			{
				id: 6,
				latitude: 36.667075,
				longitude: 117.09176,
				width: 30, // 设置标记点的宽度
				height: 50, // 设置标记点的高度
				iconPath: '../../static/markers/eat.svg',
				label: {
					content: '第三餐厅',
					fontSize: 17,
					padding: 8,
					textAlign: 'center',
					borderWidth: 1,
					borderColor: '#000',
					bgColor: 'rgba(255,255,255,0.6)',
					borderRadius: 20,
				},
				item: {
					name: '第三餐厅',
					latitude: 36.667075,
					longitude: 117.09176,
					id: 6,
					imageList: [
						'https://www.sdupsl.edu.cn/__local/A/7B/70/15BFEB516D1AAED3F2B806300A6_3BE525B8_B85B.png',
						"https://so5.360tres.com/t0117dbc540a84e177d.jpg"
					]
				}
			},
			{
				id: 7,
				latitude: 36.667156,
				longitude: 117.092274,
				width: 30, // 设置标记点的宽度
				height: 50, // 设置标记点的高度
				iconPath: '../../static/markers/eat.svg',
				label: {
					content: '第四餐厅',
					fontSize: 17,
					padding: 8,
					textAlign: 'center',
					borderWidth: 1,
					borderColor: '#000',
					bgColor: 'rgba(255,255,255,0.6)',
					borderRadius: 20,
				},
				item: {
					name: '第四餐厅',
					latitude: 36.667156,
					longitude: 117.092274,
					id: 7,
					imageList: [
						'https://imgsa.baidu.com/forum/w%3D580/sign=1e7f61e44d10b912bfc1f6f6f3fcfcb5/52e4d4c8a786c917ac507466c33d70cf3ac757c8.jpg',

					]
				}
			},

			{
				id: 8,
				latitude: 36.666992,
				longitude: 117.093412,
				width: 30, // 设置标记点的宽度
				height: 50, // 设置标记点的高度
				iconPath: '../../static/markers/eat.svg',
				label: {
					content: '第五餐厅',
					fontSize: 17,
					padding: 8,
					textAlign: 'center',
					borderWidth: 1,
					borderColor: '#000',
					bgColor: 'rgba(255,255,255,0.6)',
					borderRadius: 20,
				},
				item: {
					name: '第五餐厅',
					latitude: 36.666992,
					longitude: 117.093412,
					id: 8,
					imageList: [
						'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F0ec5aabf-d402-4c73-92f2-139d752b6190%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1710940828&t=443dd770ca0400bba9b25fe3b496c5b1',

					]
				}
			},
			{
				id: 9,
				latitude: 36.66575,
				longitude: 117.089547,

				width: 30, // 设置标记点的宽度
				height: 50, // 设置标记点的高度
				iconPath: '../../static/markers/yushi.svg',
				label: {
					content: '浴室',
					fontSize: 17,
					padding: 8,
					textAlign: 'center',
					borderWidth: 1,
					borderColor: '#000',
					bgColor: 'rgba(255,255,255,0.6)',
					borderRadius: 20,
				},
				item: {
					name: '浴室',
					latitude: 36.665208,
					longitude: 117.08953,
					id: 9,
					imageList: [
						'https://picx.zhimg.com/80/v2-b304877f307b4874a4554e914e460045_720w.webp?source=1def8aca',

					]
				}
			},
			{
				id: 10,
				latitude: 36.665208,
				longitude: 117.08953,
				width: 30, // 设置标记点的宽度
				height: 50, // 设置标记点的高度
				iconPath: '../../static/markers/yiwu.svg',
				label: {
					content: '校医院',
					fontSize: 17,
					padding: 8,
					textAlign: 'center',
					borderWidth: 1,
					borderColor: '#000',
					bgColor: 'rgba(255,255,255,0.6)',
					borderRadius: 20,
				},
				item: {
					name: '校医院',
					latitude: 36.665208,
					longitude: 117.08953,
					id: 10,
					imageList: [
						'https://picx.zhimg.com/80/v2-cff94902bd569f9d1250ddae4c513529_720w.webp?source=1def8aca',

					]
				}
			},
			{
				id: 11,
				latitude: 36.668076,
				longitude: 117.092812,
				width: 30, // 设置标记点的宽度
				height: 50, // 设置标记点的高度
				iconPath: '../../static/markers/cai.svg',
				label: {
					content: '东-菜鸟',
					fontSize: 17,
					padding: 8,
					textAlign: 'center',
					borderWidth: 1,
					borderColor: '#000',
					bgColor: 'rgba(255,255,255,0.6)',
					borderRadius: 20,
				},
				item: {
					name: '东-菜鸟',
					latitude: 36.668076,
					longitude: 117.092812,
					id: 11,
					imageList: [
						'https://ts1.cn.mm.bing.net/th/id/R-C.7c7c54688ff10ae20f80adb2a48084b2?rik=irX9m2ISZUiENg&riu=http%3a%2f%2fcampus.51job.com%2fyida2020%2fimg%2ftu31.png&ehk=asc9ixxc9uiFPLXB4QnMk1tqsyJ1k42f18SpIONF%2fsM%3d&risl=&pid=ImgRaw&r=0',

					]
				}
			},
			// 36.664806,117.087062
			{
				id: 12,
				latitude: 36.664806,
				longitude: 117.087062,
				width: 30, // 设置标记点的宽度
				height: 50, // 设置标记点的高度
				iconPath: '../../static/markers/cai.svg',
				label: {
					content: '南-菜鸟',
					fontSize: 17,
					padding: 8,
					textAlign: 'center',
					borderWidth: 1,
					borderColor: '#000',
					bgColor: 'rgba(255,255,255,0.6)',
					borderRadius: 20,
				},
				item: {
					name: '南-菜鸟',
					latitude: 36.664806,
					longitude: 117.087062,
					id: 12,
					imageList: [
						'https://ts1.cn.mm.bing.net/th/id/R-C.7c7c54688ff10ae20f80adb2a48084b2?rik=irX9m2ISZUiENg&riu=http%3a%2f%2fcampus.51job.com%2fyida2020%2fimg%2ftu31.png&ehk=asc9ixxc9uiFPLXB4QnMk1tqsyJ1k42f18SpIONF%2fsM%3d&risl=&pid=ImgRaw&r=0',

					]
				}
			},
			{
				id: 13,
				latitude: 36.664666,
				longitude: 117.086583,
				width: 30, // 设置标记点的宽度
				height: 50, // 设置标记点的高度
				iconPath: '../../static/markers/cai.svg',
				label: {
					content: '存放地',
					fontSize: 17,
					padding: 8,
					textAlign: 'center',
					borderWidth: 1,
					borderColor: '#000',
					bgColor: 'rgba(255,255,255,0.6)',
					borderRadius: 20,
				},
				item: {
					name: '存放地',
					latitude: 36.664806,
					longitude: 117.087062,
					id: 13,
					imageList: [
						'https://ts1.cn.mm.bing.net/th/id/R-C.7c7c54688ff10ae20f80adb2a48084b2?rik=irX9m2ISZUiENg&riu=http%3a%2f%2fcampus.51job.com%2fyida2020%2fimg%2ftu31.png&ehk=asc9ixxc9uiFPLXB4QnMk1tqsyJ1k42f18SpIONF%2fsM%3d&risl=&pid=ImgRaw&r=0',

					]
				}
			},
			]
		}
	},
	methods: {
		// 视野移动
		regionchange(e) {
			if (e.type === 'end') {
				console.log('13212313', this.myScale);
				console.log(e.detail.scale);
				if (e.detail.scale >= 17 || !e.detail.scale) {
					this.polygons = []
					this.markers = this.minMarkers
				} else {
					this.markers = this.maxMarkers
					this.polygons = [{
						id: 1,
						points: [{
							latitude: 36.664209,
							longitude: 117.085757
						},
						{
							latitude: 36.664201,
							longitude: 117.087617
						},
						{
							latitude: 36.666,
							longitude: 117.087726
						},
						{
							latitude: 36.666088,
							longitude: 117.09195
						},
						{
							latitude: 36.668264,
							longitude: 117.09357
						},
						{
							latitude: 36.66846,
							longitude: 117.089314
						},
						{
							latitude: 36.668082,
							longitude: 117.089281
						},
						{
							latitude: 36.66774,
							longitude: 117.089106
						},
						{
							latitude: 36.667468,
							longitude: 117.088887
						},
						{
							latitude: 36.667128,
							longitude: 117.088587
						},
						{
							latitude: 36.666859,
							longitude: 117.088113
						},
						{
							latitude: 36.666574,
							longitude: 117.087453
						},
						{
							latitude: 36.666693,
							longitude: 117.086831
						},
						{
							latitude: 36.667086,
							longitude: 117.086091
						},
						{
							latitude: 36.667485,
							longitude: 117.085783
						},
						{
							latitude: 36.66831,
							longitude: 117.0855
						},
						{
							latitude: 36.668834,
							longitude: 117.084969
						},
						{
							latitude: 36.669103,
							longitude: 117.083927
						},
						{
							latitude: 36.669338,
							longitude: 117.083333
						},
						{
							latitude: 36.668973,
							longitude: 117.083397
						},
						{
							latitude: 36.668556,
							longitude: 117.083457
						},
						{
							latitude: 36.667944,
							longitude: 117.083564
						},
						{
							latitude: 36.666639,
							longitude: 117.083517
						},
						{
							latitude: 36.666158,
							longitude: 117.084694
						},
						{
							latitude: 36.665858,
							longitude: 117.084809
						},
						{
							latitude: 36.665629,
							longitude: 117.085816
						},
						{
							latitude: 36.664348,
							longitude: 117.085714
						}
						],
						fillColor: 'rgba(255, 0, 0, 0.15)',
						strokeColor: 'rgba(255, 0, 0, 1)',
						strokeWidth: 1
					}]
				}
			}

		},
		async markertap(e) {
			console.log('点击事件', this.markers[e.target.markerId]);
			this.detail = {
				...this.markers[e.target.markerId].item,
				dis: null
			};
			console.log('this=======', this.detail);

			const res = await new Promise((resolve, reject) => {
				uni.getLocation({
					type: 'wgs84',
					success: resolve,
					fail: reject
				});
			});

			console.log('当前位置的经度：' + res.longitude);
			console.log('当前位置的纬度：' + res.latitude);
			this.detail.dis = space(res.latitude, res.longitude, this.detail.latitude, this.detail.longitude);
			console.log('父组件222222222222222', this.detail);
			if (this.detail.dis) {
				this.$refs.mapPop.change(this.detail.id);
			}
		},
		nav(item) {
			console.log('nav=', item);
			this.mapCtx.openMapApp({
				longitude: +item.longitude,
				latitude: +item.latitude,
				destination: item.name,
				success: res => {
					console.log('打开', res)
				}, // function		否	接口调用成功的回调函数
				fail: err => {
					console.log('打不开', err)
				}
			})
		},


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

			},
			fail: err => {
				console.log('当前视野范围err', err)
			}
		})


	},
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

.map-pop {

	// map-popup组件背景色取消
	&::v-deep .u-drawer-bottom {
		background: none !important;
	}
}
</style>
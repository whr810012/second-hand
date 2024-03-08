<template>
	<view class="store-image-video">
		<view class="tab">
			<u-navbar :is-back="false" :background="background" :border-bottom="borderBottom" title-color="#FFFFFF"
				:title-size="32">
				<view class="slot-wrap">
					<view class="wrap-back" @click="toBack">
						<image src="@/static/back.svg" />
					</view>
					<view class="wrap-center">{{ title }}</view>
					<view style="width:40rpx;height:40rpx;flex:1"></view>
				</view>
			</u-navbar>

			<view>
				<view class="change-title">
					<view @click="isImage=false" v-if="checkvideo" :class="isImage ? 'no-active' : ''">视频</view>
					<view @click="isImage=true" :class="isImage ? '' : 'no-active'">照片</view>
				</view>
				<view class="show">
					<!-- 图片 -->
					<view v-if="isImage" class="show-image">
						<view v-for="(item, index) in imageList" :key="item" class="show-image-dom"
							@click="checkImage(imageList, index)">
							<image :src="item" />
						</view>
					</view>
					<!-- 视频 -->
					<view class="show-video" v-if="!isImage && videoData">
						<y-video-slide  video-height="calc(100vh - 200rpx)" :data="videoData"
							:videoIndex.sync="videoIndex"></y-video-slide>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// 引入y-video-slide
	import yVideoSlide from "@/components/y-video-slide/y-video-slide.vue";
	export default {
		// 注册组件
		components: {
			yVideoSlide
		},
		data() {
			return {
				// 当前视频下标
				videoIndex: 0,
				// 视频
				videoData: [
				// 	{
				// 	id: '0',
				// 	videoUrl: 'https://v-cdn.zjol.com.cn/276982.mp4'
				// },{
				// 	id:'1',
				// 	videoUrl:'https://v-cdn.zjol.com.cn/276982.mp4'
				// }
				],
				// 照片
				imageList: [],
				// 切换tab
				isImage: false,
				// 导航栏文字
				title: "",
				// 被查看的照片
				checkImg: [],
				background: {
					backgroundColor: "#000"
				}
			};
		},
		onLoad(option) {
			console.log("商品照片", JSON.parse(decodeURIComponent(option.imglist)))
			// console.log("视频", JSON.parse(decodeURIComponent(option.videolist)))
			// 获取视频列表
			
			// this.videoData = JSON.parse(decodeURIComponent(option.videolist))
			// console.log('传过来的视频数量',this.videoData.length);

			
			// 获取照片列表
			this.imageList = JSON.parse(decodeURIComponent(option.imglist))
			// const list = JSON.parse(decodeURIComponent(option.imglist))
			// const img = list.map(i => {
			// 	console.log(i);
			// 	return {
			// 		img: i.img_url
			// 	}
			// })
			// console.log("img",img);
			// this.imageList = img.map(i => i.img).flat()
			// console.log("imagelist",this.imageList);
			// this.$forceUpdate()
		},
	
		methods: {
			toBack() {
				uni.navigateBack()
			},
			checkImage(urls, index) {
				// 预览图片
				uni.previewImage({
					urls: urls.map(i => i),
					current: index,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});

			}

		},
		computed: {
			changeTitle() {
				if (this.isImage) {
					this.title = this.imageList.length
				} else {
					this.title = this.videoIndex + 1 + '/' + this.videoData.length
				}
			},
			checkvideo() {
				if (this.videoData.length === 0) {
					this.isImage = true
				}
				return this.videoData.length
			}
			
		},
	}
</script>
<style scoped lang="scss">
	.store-image-video {
		width: 750rpx;
		min-height: 100vh;
		background-color: black;
	}

	// 导航
	.slot-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 750rpx;

		.wrap-back {
			flex: 1;

			image {
				margin-left: 24rpx;
				width: 40rpx;
				height: 40rpx
			}
		}

		.wrap-center {
			flex: 1;
			text-align: center;
			color: #fff;
			font-family: PingFang SC;
			font-size: 16px;
			font-style: normal;
			font-weight: 500;
			line-height: normal;
			letter-spacing: 0.311px;
		}
	}


	/* 切换 */
	.change-title {
		position: fixed;
		top: 154rpx;
		width: 100%;
		height: 44rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 3;

		view {
			margin: 22rpx;
			width: 66rpx;
			color: #fff;
			font-family: PingFang SC;
			font-size: 32rpx;
			font-style: normal;
			font-weight: 400;
			line-height: normal;
		}

		.no-active {
			color: #fff;
			font-family: PingFang SC;
			font-size: 16px;
			font-style: normal;
			font-weight: 400;
			line-height: normal;
			letter-spacing: 0.311px;
			opacity: 0.4;
		}
	}


	// 图片页
	.show-image {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		margin: 84rpx 14rpx;

		.show-image-dom {
			margin-bottom: 16rpx;
			border-radius: 12rpx;
			background: #d9d9d9;
			height: 410rpx;
			width: 358rpx;

			image {
				border-radius: 6px;
				width: 100%;
				height: 100%;
			}
		}
	}

	// 视频页面
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
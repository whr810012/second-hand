<template>
	<view class="widget-video" :style="{height:videoHeight}">
		<!-- 视频容器 -->
		<view class="scroll-video-box" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd"
			:style="{'marginTop':marginTop+'px','transition':transition}">
			<view ref="videoItemBox" class="video-item-box" v-for="(item, index) in videoList" :key="index"
				:style="{height:videoHeight}">
				<video @click="$event => {pauseVideo($event, item)}" :id="item.id" class="fullscreen-video"
					:src="item.videoUrl" @error="videoError(item,index)" :poster="item.posterUrl" :controls="true"
					:show-progress="true" :show-fullscreen-btn="true" :show-play-btn="true" :loop="true"
					:autoplay="index == 0" :show-center-play-btn="false" :show-mute-btn="true">
				</video>
			</view>
		</view>
	</view>
</template>

<script>
	// #ifdef APP-NVUE
	const dom = weex.requireModule('dom');
	// #endif
	export default {
		props: {
			// 视频容器高度
			videoHeight: {
				type: String,
				default: ''
			},
			// 列表数据
			data: {
				type: Array,
				default: [{
					id: 0,
					videoUrl: ''
				}]
			},
			// 当前视频下标
			videoIndex: {
				type: [Number, String],
				default: '0'
			}
		},
		data() {
			return {
				// 视频列表数据
				videoList: this.data,
				// 视频实际高度，用于滚动计算
				videoRealHeight: 0,
				// 双击点赞记录
				fabulousArr: [],
				// 记录点击时间判断单击还是双击，单击暂停，双击点赞
				clickTimer: null,
				// 记录点击时间
				clickTime: 0,
				// 屏幕高度
				windowHeight: uni.getSystemInfoSync().windowHeight || window.innerHeight,
				// 动画效果
				transition: 'none',
				// 触摸开始值
				startY: 0,
				// 触摸移动值
				moveY: 0,
				// 滑动开始时间
				startTime: 0,
				// 向上滑动距离
				marginTop: 0,
				// 每次向上滑动的距离
				fixMarginTop: 0,
				// 滑动方向
				moveDirection: '',
				// 当前轮播的index
				currentIndex: 0,
				// 当前页的视频对象
				currentVideo: null,
				// 当前视频的评论
				currentComment: [],
				// 视频状态：播放/暂停
				currentStatus: 'play',
				// 是否显示评论
				commontShow: false,
				// 爱心动画双击
				fabulousTime: 0,
				fabulousTimer: null,
				// 显示评论输入框
				showInput: false,


			};
		},
		watch: {
			data: {
				handler(n) {
					this.videoList = n;
				},
				deep: true
			}
		},
		// #ifdef APP-NVUE
		onReady() {
			dom.getComponentRect(this.$refs.videoItemBox, option => {
				this.videoRealHeight = option.size.height;
			});
		},
		// #endif
		mounted() {
			// 初始化视频容器计算高度
			//#ifdef H5
			this.videoRealHeight = this.$refs['videoItemBox'][0].$el.getBoundingClientRect().height;
			//#endif
			//#ifdef MP-WEIXIN
			const query = uni.createSelectorQuery().in(this);
			query.select('.video-item-box').boundingClientRect(data => {
				console.log('------------------');
				console.log(this.data);
				this.videoRealHeight = this.data.length > 1 ? data.height : 0;
				console.log('================');
			}).exec();
			//#endif
			// 初始化第一个视频播放器
			console.log('this.videoList', this.videoList);
			
			this.currentVideo = this.videoList.length>=1?uni.createVideoContext(this.videoList[0].id, this):'';
			// 初始化评论
		},
		methods: {
			// 视频出错
			videoError(item, index) {
				uni.showToast({
					title: '视频出错了!',
					icon: 'none'
				})
			},
			// 触摸开始
			touchStart(e) {
				this.transition = 'none';
				this.startY = e.touches[0].pageY;
				this.startTime = new Date().getTime();
			},
			// 触摸滑动
			touchMove(e) {
				// 如果评论面板打开，禁止滑动
				if (this.commontShow) {
					return;
				}
				this.moveY = e.touches[0].pageY;
				if (this.moveY > this.startY) {
					// 返回上一个视频
					let range = this.fixMarginTop + this.moveY - this.startY;
					if (this.currentIndex == 0) {
						this.marginTop = range > 50 ? 50 : range;
					} else {
						this.marginTop = range;
					}
					this.moveDirection = 'up';
				} else {
					if (this.videoList.length == 0) {
						return;
					}
					// 查看下一个视频
					let range = this.fixMarginTop - this.startY + this.moveY;
					if (this.currentIndex == this.videoList.length - 1) {
						// 最后一个视频的位置
						let lastVideo = -this.currentIndex * this.videoRealHeight + -50;
						this.marginTop = range < lastVideo ? lastVideo : range;
					} else {
						this.marginTop = range;
					}
					this.moveDirection = 'down';
				}
			},
			// 触摸结束
			touchEnd(e) {
				this.transition = 'all .2s';
				if (this.currentIndex == 0 && this.marginTop >= 45) {
					// 下拉刷新
					this.$emit('refresh');
					this.marginTop = 0;
					return;
				}
				if (this.currentIndex == this.videoList.length - 1 && this.marginTop < (this.fixMarginTop - 45)) {
					this.marginTop = this.fixMarginTop;
					// 加载更多
					this.$emit('loadMore');
					return;
				}
				let millisecond = new Date().getTime() - this.startTime;
				let condition1 = this.moveY > 0 && Math.abs(this.moveY - this.startY) > 50 && millisecond < 500;
				let condition2 = this.moveY > 0 && Math.abs(this.moveY - this.startY) > this.videoRealHeight / 3;
				if (condition1 || condition2) {
					if (this.moveDirection == 'up') {
						// 返回上一个
						if (this.currentIndex == 0) {
							this.marginTop = 0;
						} else {
							this.marginTop = this.fixMarginTop + this.videoRealHeight;
							this.currentIndex = this.currentIndex - 1;
							this.$emit('update:videoIndex', this.currentIndex);
							this.currentComment = this.videoList[this.currentIndex].commentObj;
							this.videoPlayChange();
						}
					} else {
						// 查看下一个
						if (this.currentIndex == this.videoList.length - 1) {
							this.marginTop = this.fixMarginTop;
						} else {
							this.marginTop = this.fixMarginTop - this.videoRealHeight;
							this.currentIndex = this.currentIndex + 1;
							this.$emit('update:videoIndex', this.currentIndex);
							this.currentComment = this.videoList[this.currentIndex].commentObj;
							this.videoPlayChange();
						}
					}
				} else {
					this.marginTop = this.fixMarginTop;
				}
				this.fixMarginTop = this.marginTop;
				this.startY = 0;
				this.moveY = 0;
			},
			// 滑动切换
			videoPlayChange() {
				this.stopOtherVideo();
				let video = uni.createVideoContext(this.videoList[this.currentIndex].id, this);
				this.currentVideo = video;
				this.currentVideo.play();
				this.currentStatus = 'play';
			},
			// 暂停其他视频
			stopOtherVideo() {
				this.videoList.map(v => {
					let video = uni.createVideoContext(v.id, this);
					video.seek(1);
					video.pause();
				})
			},
			// 暂停/播放视频/双击点赞事件
			pauseVideo(e, item) {
				// 视频对象为空,返回
				if (!this.currentVideo) return;
				if (this.commontShow) {
					this.commontShow = false;
					return;
				}
				clearTimeout(this.clickTimer);
				let currentTime = new Date().getTime();
				let timeRange = currentTime - this.clickTime;
				if (timeRange < 300) {
					// 双击事件
					if (!item.isFabulous) {
						this.$emit('fabulous', item, true);
					}
					this.dbClickAnimation(e);
				} else {
					// 单击事件
					this.clickTimer = setTimeout(() => {
						e.preventDefault();
						e.stopPropagation();
						if (this.currentStatus == 'play') {
							this.currentVideo.pause();
							this.currentStatus = 'pause';
						} else {
							this.currentVideo.play();
							this.currentStatus = 'play';
						}
					}, 300);
				}
				this.clickTime = new Date().getTime();
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '../../static/css/font.css';

	@keyframes double-fabulous {
		from {
			opacity: 1;
			transform: scale(1);
		}

		to {
			opacity: 0;
			transform: scale(3);
		}
	}

	// 全局容器
	.widget-video {
		width: 100%;
		height: 100%;
		overflow: hidden;
		position: relative;

		.scroll-video-box {
			min-height: 100%;
			position: relative;

		}

		.load-more-box {
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 50px;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		// 视频容器
		.video-item-box {
			position: relative;

			.fullscreen-video {
				bottom: 100rpx;
				width: 100%;
				height: 100%;
				position: relative;
			}

			.video-title {
				position: absolute;
				left: 20rpx;
				bottom: 20rpx;
				width: calc(100% - 160rpx);
				color: white;
				z-index: 1;

				.user-name {
					font-weight: bold;
				}

				.video-content {
					font-size: 24rpx;
				}
			}
		}
	}
</style>
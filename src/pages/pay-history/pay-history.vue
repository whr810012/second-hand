<template>
	<view class="main">
		<view v-for="(item, index) in list" :key="item.id" class="list_box">
			<view class="list_buy">
				购于 {{ item.payDate.slice(0, -3) }}
			</view>
			<view class="list_cent">
				<view>澳淘卡</view>
				<view>-9.9</view>
			</view>
			<view class="list_ex">{{ item.expire === 'before' ? `失效 ${item.expireDate.slice(0, -3)}` : '有效' }}</view>
		</view>
	</view>
</template>

<script>
	 import indexStore from '../../../store/index.js'
	 import { formatDate, currentDate } from '../../../utils/utils.js'
	export default {
		data() {
			return {
				list: []
			};
		},
		onLoad() {
			console.log('查看历史');
			this.getHistory()
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
			async getHistory() {
				const res = await indexStore.dispatch('getAllUserPass')
				console.log(res);
				if (res.user_pass && res.user_pass.length > 0) {
					this.list = res.user_pass.map(i => {
						return {
							...i,
							expire: currentDate(i.expire_at),
							payDate: formatDate(i.purchase_date),
							expireDate: formatDate(i.expire_at)
						}
					})
					console.log(this.list);
				} else {
					uni.showToast({
						icon: 'exception',
						title: '网络错误，请检查网络'
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.main {
		background: #F5F5F5;
		min-height: 100vh;
		padding-top: 20rpx;
	}
.list_box{
	background: #fff;
	border-radius: 20rpx;
	padding: 20rpx 44rpx;
	margin: 0px 26rpx;
	margin-bottom: 20rpx;
	.list_buy,
	.list_ex{
		color: rgba(41, 44, 53, 0.60);
		text-align: left;
		font-family: PingFang SC;
		font-size: 24rpx;
		font-style: normal;
		font-weight: 400;
		line-height: 42rpx; /* 172.68% */
		letter-spacing: 1px;
	}
	.list_cent{
		color: #292C35;
		text-align: center;
		font-family: PingFang SC;
		font-size: 28rpx;
		font-style: normal;
		font-weight: 400;
		line-height: 42rpx; /* 148.012% */
		letter-spacing: 1px;
		
		display: flex;
		justify-content: space-between;
		padding-top: 6rpx;
	}
	.list_ex{
		border-top: 0.5px solid rgba(41, 44, 53, 0.15);
		margin-top: 74rpx;
		padding-top: 14rpx;
	}
}

</style>

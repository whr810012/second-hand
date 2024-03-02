<template>
	<view class="main-box">
		<view class="main">
			<view class="addgoods_top">
				<view class="addgoods_top_text">
					上传照片
				</view>
				<u-upload ref="uUpload" :max-count="3" @on-uploaded="onUploaded" :auto-upload="false"
					:action="action"></u-upload>
			</view>
			<view class="addgoods_top">
				<view class="addgoods_top_class">
					<view class="top_class_text">名称：</view>
					<view class="top_class_bottom">
						<u-input v-model="goods_name" input-align="center" placeholder="请输入商品名称" />
					</view>
				</view>
			</view>

			<view class="addgoods_top" @click="show = true">
				<view class="addgoods_top_class">
					<view class="top_class_text">
						分类：
					</view>
					<view class="top_class_bottom" @click="show = true">
						<u-input v-model="classlist.label" :type="text" :border="true" input-align="center"
							disabled="fasle" />
					</view>
				</view>
				<u-select v-model="show" :list="list" @confirm="confirm"></u-select>
			</view>
			<view class="addgoods_top">
				<view class="addgoods_top_class">
					<view class="top_class_text">
						价格：
					</view>
					<view class="top_class_bottom" @click="priceshow = true">
						￥{{ goods_price || '0.00' }}
						<u-keyboard mode="number" @change="valChange" @backspace="backspace"
							v-model="priceshow"></u-keyboard>
						<!-- <u-button >打开</u-button> -->
					</view>
				</view>
			</view>
			<view class="addgoods_top">
				<view class="addgoods_top_value">
					<view class="top_class_text">
						商品描述：
					</view>
					<view class="top_class_bottom">
						<u-input v-model="goods_value" type="textarea" :border="true" input-align="left"
							placeholder="请输入商品描述" />
					</view>
				</view>
			</view>
			<view class="addgoods_top">
				<view class="addgoods_top_class">
					<view class="top_class_text">
						交易位置：
					</view>
					<view class="top_class_text">
						{{ address }}
					</view>
				</view>
			</view>
			<u-button @click="submit">提交</u-button>


			<u-tabbar class="tabbar" :list="tablist" :mid-button="true" bg-color="rgba(255, 255, 255, 1)"
				inactive-color="rgba(41, 44, 53, 0.30)" mid-button-size="150rpx" icon-size="48rpx" @change="clicktabbar">
			</u-tabbar>
		</view>
	</view>
</template>

<script>
import indexStore from '../../../store/index.js'
export default {
	data() {
		return {
			type: 'textarea',
			border: true,
			height: 100,
			autoHeight: true,
			priceshow: false,
			goods_name: '',
			goods_price: '',
			goods_value: '',
			address:"",
			longitude:'',
			latitude:'',
			classlist: {
				value: '0',
				label: '默认'
			},
			tablist: '',
			action: 'http://www.example.com/upload',
			filesArr: [],
			// show:true,
			show: false,

			list: [{
				value: '0',
				label: '默认'
			},
			{
				value: '1',
				label: '书籍类'
			},
			{
				value: '2',
				label: '衣物类'
			},
			{
				value: '3',
				label: '电子产品'
			},
			{
				value: '4',
				label: '食品类'
			}
			],
		}
	},
	methods: {
		onLoad() {
			this.tablist = indexStore.state.list
			const that = this
			uni.chooseLocation({
				success: function (res) {
					console.log('位置名称：' + res.name);
					console.log('详细地址：' + res.address);
					console.log('纬度：' + res.latitude);
					console.log('经度：' + res.longitude);
					that.address = res.address
					that.latitude = res.latitude
					that.longitude = res.longitude
					console.log(that.address);
				}
			});
		},
		submit() {
			this.$refs.uUpload.upload();
		},
		onUploaded(lists) {
			this.filesArr = lists;
			console.log('asddasd', this.filesArr);
		},
		confirm(e) {
			console.log(e[0]);
			this.classlist = e[0]
			console.log(this.classlist);
		},
		valChange(val) {
			this.goods_price += val;
			// 保留两位小数
			// this.goods_price = this.goods_price.;
		},
		backspace() {
			// 删除value的最后一个字符
			if (this.goods_price.length) this.goods_price = this.goods_price.substr(0, this.goods_price.length - 1);
			// console.log(this.value);
		}
	}
}
</script>

<style scoped lang="scss">
.main-box {
	background-color: #f5f5f5;
}

.main {
	// background-color: rgba(131, 131, 131,0.2);
	min-height: 100vh;
	width: 92%;
	margin-left: 4%;
	background-color: #fff;
	border-radius: 20px;
}

.addgoods_top {
	.addgoods_top_text {
		padding-top: 20rpx;
		margin-bottom: 10rpx;
		font-size: 16px;
		padding-left: 10rpx;
	}

	.addgoods_top_class {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 20rpx;
		padding-bottom: 20rpx;
		font-size: 16px;

		// background-color: #f6f6f6;
		.top_class_text {
			padding-right: 20rpx;
			padding-left: 10rpx;
			// width: 20%;
			font-size: 18px;
			font-weight: 500;
		}

		.top_class_bottom {
			display: flex;
			align-items: center;
			// width: 70%;
			color: #B24949;
			font-size: 25px;
		}

		// .top_class_bottom_a {
		// 	display: flex;
		// 	align-items: center;
		// 	// width: 70%;
		// 	color: #B24949;
		// 	font-size: 25px;
		// }

	}

	.addgoods_top_value {
		display: flex;
		padding-top: 20rpx;
		padding-bottom: 20rpx;
		font-size: 16px;
		padding-left: 10rpx;

		.top_class_text {
			padding-right: 20rpx;
			// padding-left: 10rpx;
			// width: 20%;
			font-size: 18px;
			font-weight: 500;
		}

		.top_class_bottom {
			width: 70%;

			// height: 200px;
			::v-deep .u-input--border.data-v-fdbb9fe6 {
				background-color: white;
				width: 95%;
				// 透明度0.1
				// opacity: 0.8;

				// line-height: 30px;
				.u-input__input.data-v-fdbb9fe6 {
					font-size: 12px;
					// font-weight: 600;
					color: #000;
				}
			}
		}
	}
}



::v-deep .u-input--border.data-v-fdbb9fe6 {
	background-color: #B24949;
	width: 70%;
	// 透明度0.1
	opacity: 0.8;

	// line-height: 30px;
	.u-input__input.data-v-fdbb9fe6 {
		font-size: 20px;
		font-weight: 600;
		color: white;
	}
}

::v-deep .addgoods_top .addgoods_top_class .top_class_bottom.data-v-2245f626 {
	width: 70%;
}
</style>
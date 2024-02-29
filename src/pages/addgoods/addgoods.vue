<template>
	<view>
		<view class="addgoods_top">
			<view class="addgoods_top_text">
				上传照片
			</view>

			<u-upload ref="uUpload" :max-count="3" @on-uploaded="onUploaded" :auto-upload="false"
				:action="action"></u-upload>

		</view>
		<view class="addgoods_top" @click="show = true">
			<view class="addgoods_top_class">
				
				<view class="top_class_text">
					分类：
				</view>
				<view class="top_class_bottom" @click="show = true">
					<u-input v-model="classlist.label" :type="text" :border="true" input-align="center" disabled="fasle"/>
				</view>
				 
			</view>
			<u-select v-model="show" :list="list" @confirm="confirm"></u-select>
		</view>
		<view class="addgoods_top">
			价格
		</view>
		<view class="addgoods_top">
			描述
		</view>
		<view class="addgoods_top">
			发布
		</view>
		<u-button @click="submit">提交</u-button>
		<view class="" @click="show">
			啊实打实大大
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
				action: 'http://www.example.com/upload',
				filesArr: [],
				// show:true,
				show: false,
				classlist: {
					value: '0',
					label: '默认'
				},
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
			}
		}
	}
</script>

<style scoped lang="scss">
	.addgoods_top {
		.addgoods_top_text {
			margin-top: 20rpx;
			margin-bottom: 10rpx;
			font-size: 16px;
			padding-left: 10rpx;
		}
		.addgoods_top_class{
			display: flex;
			align-items: center;
			padding-top: 20rpx;
			padding-bottom: 20rpx;
			font-size: 16px;
			background-color: #f6f6f6;
			.top_class_text{
				padding-right: 20rpx;
				padding-left: 10rpx;
				width: 20%;
			}
			.top_class_bottom{
				width: 70%;
			}
		}
	}
</style>
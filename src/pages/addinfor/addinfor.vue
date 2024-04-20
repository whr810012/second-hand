<template>
	<form @submit="handleEditNickname">
		<div class="text-center">请确认您的个人信息</div>
		<div class="form-item">
			<input class="inp" name="nickname" type="nickname" placeholder="请输入昵称" :value='username' />
			<!-- <input class="inp" name="nickname" type="text" placeholder="请输入昵称" :value="username" showNicknameAccessory="false" /> -->
		</div>
		<button class="submit-btn mt-2" form-type="submit" type="primary">
			保存
		</button>
	</form>
</template>

<script>
import indexStore from "../../../store/index";


export default {
	data() {
		return {

		};
	},


	methods: {
		handleEditNickname(e) {
			console.log(e.detail.value.nickname);
			uni.login({
				success: async (res) => {
					console.log('uni.login', res)
					uni.request({
						url: 'http://localhost:3000/register',
						method: 'post',
						data: {
							code: res.code,
							username: e.detail.value.nickname
						},
						success: (res) => {
							console.log(res.data);
							uni.setStorage({
								key: 'username',
								data: e.detail.value.nickname,
								success: function () {
									console.log('success');
								}
							});
							uni.setStorage({
								key: 'userid',
								data: res.data.userid,
								success: function () {
									console.log('success');
								}
							});
							uni.setStorage({
								key: 'admin',
								data: res.data.isadmin,
								success: function () {
									console.log('success');
									uni.reLaunch({
										url: "/pages/home/home",
										fail: e => {
											console.log(e);
										}
									});
								}
							});
							// this.$store.commit('changadmin', res.data.isadmin);
							this.text = 'request success';
						}
					})
				}
			})
		}

	}
};
</script>

<style lang="scss" scoped>
.text-center {
	text-align: center;
	padding: 30rpx;
}

.inp {
	border: 1px solid #000;
	padding: 20rpx;
	margin: 20rpx;
	border-radius: 30rpx;
}

.submit-btn {
	width: 300rpx;
}
</style>
<template>
	<view class="forget">
	<u-toast ref="uToast"></u-toast>
		<view class="content">
			<!-- 主体 -->
			<view class="main">
				<view class="tips">若你忘记了密码，可在此重置新密码。</view>
				<wInput v-model="email" type="text" maxlength="30" placeholder="请输入邮箱"></wInput>
				<wInput v-model="password" type="password" maxlength="11" placeholder="请输入新密码" isShowPass></wInput>

				<wInput v-model="verCode" type="number" maxlength="6" placeholder="验证码" isShowCode codeText="获取重置码"
					setTime="30" ref="runCode" @setCode="getVerCode()"></wInput>
			</view>

			<wButton class="wbutton" text="重置密码" :rotate="isRotate" @click.native="startRePass()"></wButton>

		</view>
	</view>
</template>

<script>
	import wInput from '../../components/watch-login/watch-input.vue' //input
	import wButton from '../../components/watch-login/watch-button.vue' //button
	import {
		sendEmailVerificationCodeByForget,
		forget
	} from '@/api/login.js';
	export default {
		data() {
			return {
				email: "", //邮箱
				password: "", //密码
				verCode: "", //验证码
				isRotate: false, //是否加载旋转
			}
		},
		components: {
			wInput,
			wButton
		},
		mounted() {

		},
		methods: {
			getVerCode() {
				//获取验证码
				let re = /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/;
				if (!this.email) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '请填写邮箱'
					});
					return false;
				}
				if (!re.test(this.email)) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '邮箱格式错误'
					});
					return false;
				}
				this.$refs.runCode.$emit('runCode'); //触发倒计时（一般用于请求成功验证码后调用）
				let httpData = {
					email: this.email
				}
				sendEmailVerificationCodeByForget(httpData).then((res) => {
					this.$refs.uToast.show({
						type: 'success',
						message: res.data,
						position: 'bottom'
					})
				}).catch((err) =>{
					this.$refs.uToast.show({
						type: 'error',
						message: err.message,
						position: 'bottom'
					})
				})

				setTimeout(function() {
					this.$refs.runCode.$emit('runCode', 0);
					//假装模拟下需要 终止倒计时
				}, 60000)
			},
			startRePass() {
				//重置密码
				if (this.isRotate) {
					//判断是否加载中，避免重复点击请求
					return false;
				}
				let re = /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/;
				if (!this.email) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '请填写邮箱'
					});
					return false;
				}
				if (!re.test(this.email)) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '邮箱格式错误'
					});
					return false;
				}
				if (!this.verCode) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '请填写验证码'
					});
					return false;
				}
				this.isRotate = true
				let httpData = {
					email: this.email,
					password: this.password,
					verificationCode: this.verCode
				}
				forget(httpData).then((res) => {
					this.isRotate = false
					this.$refs.uToast.show({
						type: 'success',
						message: res.data,
						position: 'bottom',
						complete() {
							uni.redirectTo({
								url: './login'
							});
						}

					})
				}).catch((err)=>{
					this.isRotate = false
					this.$refs.uToast.show({
						type: 'error',
						message: err.message,
						position: 'bottom',

					})
				})


			}
		}
	}
</script>

<style>
	@import url("../../components/watch-login/css/icon.css");
	@import url("../../static/css/login/login.css");
</style>

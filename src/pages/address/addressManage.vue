<template>
	<view class="content">
		<u-toast ref="uToast"></u-toast>
		<regionWindow ref="region" :successful="selectAreaSuccessful" ></regionWindow>
		<view class="row b-b">
			<text class="tit">联系人</text>
			<input class="input" type="text" v-model="addressData.contact" placeholder="收货人姓名"
				placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">手机号</text>
			<input class="input" type="number" v-model="addressData.telephone" placeholder="收货人手机号码"
				placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">地区</text>
			<text @click="selectArea" class="input">
				{{regionCombination}}
			</text>
		</view>
		<!-- 		<view class="row b-b">
			<text class="tit">地址</text> 
			<text @click="chooseLocation" class="input">
				{{addressData.addressName}}
			</text>
			<text class="yticon icon-shouhuodizhi"></text>
		</view -->
		<view class="row b-b">
			<text class="tit">门牌号</text>
			<input class="input" type="text" v-model="addressData.address" placeholder="楼号、门牌"
				placeholder-class="placeholder" />
				<text @click="chooseLocation" class="yticon icon-shouhuodizhi"></text>
		</view>

		<view class="row default-row">
			<text class="tit">设为默认</text>
			<switch :checked="addressData.is_default" color="#fa436a" @change="switchChange" />
		</view>
		<button class="add-btn" @click="confirm">提交</button>
	</view>
</template>

<script>
	import regionWindow from '@/components/region-window/index.vue'
	import {
		setAddress
	} from '../../api/user.js'
	export default {
		data() {
			return {
				addressData: {
					contact: '',
					telephone: '',
					province: '', //省
					city: '', //市
					district: '', //区
					address: '',
					is_default: false
				}
			}
		},
		computed: {
			regionCombination(){
				if(this.addressData.province && this.addressData.city && this.addressData.district){
					return this.addressData.province + '-'+ this.addressData.city +'-'+this.addressData.district
				}else{
					return '请选择'
				}
			}
		},
		components: {
			regionWindow
		},
		onLoad(option) {
			let title = '新增收货地址';
			if (option.type === 'edit') {
				title = '编辑收货地址'

				this.addressData = JSON.parse(option.data)
				console.log(this.addressData)
			}
			this.manageType = option.type;
			uni.setNavigationBarTitle({
				title
			})
		},
		methods: {
			switchChange(e) {
				console.log(e)
				this.addressData.is_default = e.detail.value;
			},
			//地图选择地址
			chooseLocation() {
				uni.chooseLocation({
					success: (data) => {
						this.addressData.address = data.name;
					}
				})
			},
			//地区选择
			selectArea() {
				this.$refs.region.open()
			},
			//地区选择成功回调
			selectAreaSuccessful(data){
				this.addressData.province = data.province.name
				this.addressData.city = data.city.name
				this.addressData.district = data.district.name
			},
			//提交
			confirm() {
				let data = this.addressData;
				if (!data.contact) {
					this.$api.msg('请填写收货人姓名');
					return;
				}
				if (!/(^1[3|4|5|7|8][0-9]{9}$)/.test(data.telephone)) {
					this.$api.msg('请输入正确的手机号码');
					return;
				}
				if (!data.province && !data.city && !data.district) {
					this.$api.msg('请选择地区');
					return;
				}
				if (!data.address) {
					this.$api.msg('请填写门牌号信息');
					return;
				}
				//转化类型
				this.addressData.is_default = !!this.addressData.is_default
				console.log(this.addressData)
				setAddress(data).then((res)=>{
					this.$refs.uToast.show({
						type: 'success',
						message: res.data,
						position: 'bottom',
						complete() {
							uni.redirectTo({
								url: './address',
							});
						}
					})
				}).catch((err)=>{
					this.$refs.uToast.show({
						type: 'error',
						message: err.message,
						position: 'bottom',
					})
				})
				//this.$api.prePage()获取上一页实例，可直接调用上页所有数据和方法，在App.vue定义
				// this.$api.prePage().refreshList(data, this.manageType);
				// this.$api.msg(`地址${this.manageType=='edit' ? '修改': '添加'}成功`);
				// setTimeout(() => {
				// 	uni.navigateBack()
				// }, 800)
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-top: 16upx;
	}

	.row {
		display: flex;
		align-items: center;
		position: relative;
		padding: 0 30upx;
		height: 110upx;
		background: #fff;
		
		.tit {
			flex-shrink: 0;
			width: 120upx;
			font-size: 30upx;
			color: $font-color-dark;
		}

		.input {
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
		}

		.icon-shouhuodizhi {
			font-size: 36upx;
			color: red;
		}
	}

	.default-row {
		margin-top: 16upx;

		.tit {
			flex: 1;
		}

		switch {
			transform: translateX(16upx) scale(.9);
		}
	}

	.add-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		margin: 60upx auto;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>

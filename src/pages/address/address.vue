<template>
	<view class="content b-t">
		<u-toast ref="uToast"></u-toast>
		<view class="list b-b" v-for="(item, index) in addressList" :key="index">
			<view class="wrapper">
				<view class="address-box">
					<text v-if="item.is_default" class="tag">默认</text>
					<text class="address">{{item.province}}-{{item.city}}-{{item.district}} {{item.address}}</text>
				</view>
				<view class="u-box">
					<text class="name">{{item.contact}}</text>
					<text class="mobile">{{item.telephone}}</text>
				</view>
			</view>
			<text class="yticon icon-bianji" @click.stop="addAddress('edit', item)"></text>
		</view>
		<button class="add-btn" @click="addAddress('add')">新增地址</button>
	</view>
</template>

<script>
	import {
		getAddressList
	} from '../../api/user.js'
	export default {
		data() {
			return { 
				source: 0,
				addressList: []
			}
		},
		onLoad(option) {
			console.log(option.source);
			this.source = option.source;
		},
		mounted() {
			this.initAddressList()
		},
		methods: {
			initAddressList() {
				getAddressList().then((res) => {
					this.addressList = res.data
				}).catch((err) => {
					this.$refs.uToast.show({
						type: 'error',
						message: err.message,
						position: 'bottom',
					})
				})
			},
			addAddress(type, item) {
				uni.navigateTo({
					url: `/pages/address/addressManage?type=${type}&data=${JSON.stringify(item)}`
				})
			},
			//添加或修改成功之后回调
			refreshList(data, type) {
				//添加或修改后事件，这里直接在最前面添加了一条数据，实际应用中直接刷新地址列表即可
				this.addressList.unshift(data);

				console.log(data, type);
			}
		}
	}
</script>

<style lang='scss'>
	page {
		padding-bottom: 120upx;
	}

	.content {
		position: relative;
	}

	.list {
		display: flex;
		align-items: center;
		padding: 20upx 30upx;
		;
		background: #fff;
		position: relative;
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.address-box {
		display: flex;
		align-items: center;

		.tag {
			font-size: 24upx;
			color: $base-color;
			margin-right: 10upx;
			background: #fffafb;
			border: 1px solid #ffb4c7;
			border-radius: 4upx;
			padding: 4upx 10upx;
			line-height: 1;
		}

		.address {
			font-size: 30upx;
			color: $font-color-dark;
		}
	}

	.u-box {
		font-size: 28upx;
		color: $font-color-light;
		margin-top: 16upx;

		.name {
			margin-right: 30upx;
		}
	}

	.icon-bianji {
		display: flex;
		align-items: center;
		height: 80upx;
		font-size: 40upx;
		color: $font-color-light;
		padding-left: 30upx;
	}

	.add-btn {
		position: fixed;
		left: 30upx;
		right: 30upx;
		bottom: 16upx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		font-size: 32upx;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>

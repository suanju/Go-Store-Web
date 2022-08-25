<template>
	<mlUniPopup type="bottom" percent="63%" ref="popup">
		<view class="region-container">
			<view class="title">
				收货地址
				<image @click="close" class="close" src="/static/image/icon_close.png"></image>
			</view>
			<view class="nav-list">
				<block v-for="addressKey,i in addressKeys" :key="i">
					<view class="item line1" :class="{'selected':navKey==addressKey}" @click="changeNav(addressKey)"
						v-if="selectedAddress[addressKey]!=null">{{selectedAddress[addressKey].name}}</view>
				</block>

				<view class="item line1 selected" v-if="!finish&&selectedAddress.street==null">请选择</view>
			</view>
			<scroll-view class="address-list" scroll-y>
				<block v-for="addressKey,i in addressKeys" :key="i">
					<block v-if="listKey==addressKey">
						<view class="a-item" hover-class="hover"
							:class="{'on':selectedAddress[addressKey]!=null&&item.city_id==selectedAddress[addressKey].city_id}"
							v-for="item,index in addressList[addressKey]" :key="index" @click="selectItem(item)">
							<view class="text line1">{{item.name}}</view>
							<image
								v-if="selectedAddress[addressKey]!=null&&item.city_id==selectedAddress[addressKey].city_id"
								class="selected-icon" src="/static/image/selected_address.png"></image>
						</view>
					</block>

				</block>
			</scroll-view>
		</view>
	</mlUniPopup>
</template>

<script>
	import cache from './static/cache.js'
	import {
		getAddressTable
	} from '../../api/user.js'
	import mlUniPopup from '@/components/ml-uni-popup/ml-uni-popup.vue'
	export default {
		components: {
			mlUniPopup
		},
		created() {

		},
		props: {
			defaultAddress: {
				type: Object,
				default: () => {
					return {
						province: null,
						city: null,
						district: null,
						// street:null
					}
				}
			},
			successful: {
				type: Function,
				default: null
			}
		},
		data() {
			return {
				addressKeys: ['province', 'city', 'district'],
				addressList: {
					province: [],
					city: [],
					district: [],
					// street:[]
				},
				selectedAddress: {
					province: null,
					city: null,
					district: null,
					// street:null
				},
				navKey: null, // 激活的导航列表key
				listKey: 'province', // 激活的地址列表key
				finish: false // 是否已选择完成
			}
		},
		methods: {
			getCitys(city_id) {
				return new Promise((reslove, reject) => {
					let httpDate = {
						city_id: city_id
					}
					getAddressTable(httpDate).then((res) => {
						console.log(res)
						if (res.code == 200) {
							console.log(res.data)
							reslove(res, res);
						} else {
							reject(res.data || '系统错误');
						}

					}).catch((err) => {
						console.log('err')
						if (err.hasOwnProperty('errMsg')) {
							if (err.errMsg == 'request:fail timeout') {
								reject({
									title: '网络超时'
								})
							} else if (err.errMsg == 'request:fail -109:net::ERR_ADDRESS_UNREACHABLE') {
								reject({
									title: '网络异常，请检查您的网络状况'
								})
							} else {
								reject({
									title: err.errMsg.replace('request:fail', '') || '网络异常'
								})
							}
						} else {
							reject({
								title: err.errMsg || '网络异常'
							})
						}
						console.error(err)
						reject('网络异常');
					})
				});
			},
			/** 
			 * 重选地区
			 */
			changeNav(addressKey) {
				// this.finish = false
				this.navKey = addressKey
				this.listKey = addressKey
			},
			/**
			 * 初始化
			 */
			async init() {
				if (this.addressList.province.length == 0 && this.addressList.city.length == 0 && this
					.addressList.district.length == 0) {
					// 遍历defaultAddress，有这填入list，并设置listKey和navKey
					Object.keys(this.defaultAddress).forEach(async (key) => {
						if (this.defaultAddress[key] != null && this.defaultAddress[key] !=
							0) {
							this.navKey = key
							this.listKey = key
							this.finish = true
							var addressList = []
							if (key == 'province') {
								addressList = await this.getCitysInfo(100000)
							} else if (key == 'city') {
								addressList = await this.getCitysInfo(this.defaultAddress[
									'province'])
							} else if (key == 'district') {
								addressList = await this.getCitysInfo(this.defaultAddress[
									'city'])
							} else if (key == 'street') {
								addressList = await this.getCitysInfo(this.defaultAddress[
									'district'])
								console.log(addressList);
							}
							this.addressList[key] = addressList
							addressList.forEach((item) => {
								if (item.city_id == this.defaultAddress[key]) {
									this.selectedAddress[key] = item
								}
							})
						}
					})
					if (!this.finish) {
						this.addressList['province'] = await this.getCitysInfo(100000)
					}
				}
			},
			getCitysInfo(id) {
				return new Promise((resolve, reject) => {
					let key = 'address_' + id
					if (cache.has(key)) {
						resolve(cache.get(key, true))
					} else {
						uni.showLoading()
						this.getCitys(id).then(res => {
							uni.hideLoading()
							if (res.code != 200) {
								return uni.showToast({
									title: res.data,
									icon: 'none'
								})
							}
							cache.set(key, res.data)
							resolve(res.data)
						}).catch(err => {
							uni.hideLoading();
							reject(err)
						})
					}
				})
			},
			/**
			 * 选择地址
			 */
			async selectItem(item) {
				let listKey = this.listKey
				this.selectedAddress[listKey] = item
				console.log(listKey)
				console.log(this.selectedAddress)
				// 重置nav选中值，根据当前选中键值显示下一个地址列表 || 没有下级的话是完成
				// province->city 
				// city->district 
				// district->street 
				// street>完成
				this.navKey = null
				let res = await this.getCitysInfo(item.city_id)
				if (res.length == 0) {
					return this.finishSelect(listKey)
				}
				if (listKey == 'province') {
					this.cleanNavData(['city', 'district'])
					this.addressList['city'] = res
					this.listKey = 'city'
				} else if (listKey == 'city') {
					this.cleanNavData(['district'])
					this.addressList['district'] = res
					this.listKey = 'district'
				} else if (listKey == 'district') {
					this.cleanNavData(['street'])
					this.addressList['street'] = res
					this.listKey = 'street'
				}
			},
			/**
			 * 清除nav头,地址列表和已选中地址信息
			 */
			cleanNavData(addressKeys) {
				addressKeys.forEach((key) => {
					this.addressList[key] = []
					this.selectedAddress[key] = null
				})
			},
			/**
			 * 完成地址选择
			 */
			finishSelect(listKey) {
				console.log('已选地址', this.selectedAddress)
				// #ifdef  H5
				this.successful(this.selectedAddress)
				// #endif
				// #ifdef  MP-WEIXIN
				this.$parent.selectAreaSuccessful(this.selectedAddress);
				// #endif
				this.finish = true
				this.listKey = listKey
				this.navKey = listKey
				this.$emit('finish', this.selectedAddress)
				this.close()
			},
			close() {
				this.$refs.popup.close()
			},
			open() {
				this.$refs.popup.open()
				this.init()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.region-container {
		background-color: #FFFFFF;
		border-radius: 20rpx 20rpx 0 0;
		height: 100%;
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;

		.line1 {
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
		}

		.title {
			color: #333333;
			font-size: 32rpx;
			padding: 30rpx 0;
			text-align: center;
			position: relative;
			font-weight: 500;

			.close {
				width: 48rpx;
				height: 48rpx;
				position: absolute;
				right: 24rpx;
				top: 24rpx;
			}
		}

		.nav-list {
			width: 100%;
			height: 100rpx;
			padding: 0 22rpx;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			box-sizing: border-box;

			.item {
				width: 25%;
				color: #333333;
				font-size: 28rpx;
				position: relative;
				height: 50rpx;
				text-align: center;
				transition: font-weight 0.3s;

				&::after {
					content: '';
					display: block;
					height: 6rpx;
					width: 72rpx;
					position: absolute;
					bottom: 0rpx;
					left: 50%;
					transform: translateX(-50%);
					background-color: transparent;
					transition: background-color 0.3s;
				}

				&.selected {
					font-weight: 500;

					&::after {
						background-color: #FF536B;
					}
				}
			}
		}

		.address-list {
			position: relative;
			flex: 1;
			height: 1px;

			.a-item {
				padding: 0 24rpx;
				height: 88rpx;
				color: #333333;
				transition: background-color 0.1s;
				display: flex;
				justify-content: space-between;
				align-items: center;

				&.on {
					// color: #FF536B;
				}

				.text {
					width: 90%;
				}

				.selected-icon {
					width: 40rpx;
					height: 40rpx;
				}

				&.hover {
					background-color: #e9e9e9;
				}
			}
		}
	}
</style>

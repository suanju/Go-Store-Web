<template>
	<view class="container">
		<view class="carousel">
			<u-toast ref="uToast"></u-toast>
			<swiper indicator-dots circular=true duration="400">
				<swiper-item class="swiper-item" v-for="(item,index) in goodInfo.shuffling_img" :key="index">
					<view class="image-wrapper">
						<image :src="item" class="loaded" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<view class="introduce-section">
			<text class="title">{{goodInfo.name}}</text>
			<view class="price-box">
				<text class="price-tip">¥</text>
				<text class="price">{{goodInfo.price}}</text>
				<!-- 	<text class="m-price">¥488</text>
				<text class="coupon-tip">7折</text> -->
			</view>
			<view class="bot-row">
				<text>销量: {{goodInfo.sales_actual}}</text>
				<text>库存: {{goodInfo.stock}}</text>
				<text>浏览量: {{goodInfo.clicks}}</text>
			</view>
		</view>

		<!--  分享 -->
		<!-- <view class="share-section" @click="share">
			<view class="share-icon">
				<text class="yticon icon-xingxing"></text>
				返
			</view>
			<text class="tit">该商品分享可领49减10红包</text>
			<text class="yticon icon-bangzhu1"></text>
			<view class="share-btn">
				立即分享
				<text class="yticon icon-you"></text>
			</view>

		</view> -->

		<view class="c-list">
			<view class="c-row b-b" @click="toggleSpec">
				<text class="tit">购买类型</text>
				<view class="con">
					<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex"
						v-show="specSelectedLen">
						{{sItem.value}}
					</text>
					<text class="selected-text" v-show="!specSelected.length && isSoldOut">
						待选择
					</text>
					<text class="selected-text" v-show="!isSoldOut">
						已售罄
					</text>
				</view>
				<text class="yticon icon-you"></text>
			</view>
			<!-- <view class="c-row b-b">
				<text class="tit">优惠券</text>
				<text class="con t-r red">领取优惠券</text>
				<text class="yticon icon-you"></text>
			</view>
			<view class="c-row b-b">
				<text class="tit">促销活动</text>
				<view class="con-list">
					<text>新人首单送20元无门槛代金券</text>
					<text>订单满50减10</text>
					<text>订单满100减30</text>
					<text>单笔购买满两件免邮费</text>
				</view>
			</view> -->
			<view class="c-row b-b">
				<text class="tit">服务</text>
				<view class="bz-list con">
					<text v-show="goodInfo.sever_list" v-for="(item, index) in goodInfo.sever_list"
						:key="index">{{item}}</text>
					<text v-show="!goodInfo.sever_list"> 无服务 </text>
				</view>
			</view>
		</view>

		<!-- 评价 -->
		<view class="eva-section" v-if="goodInfo.comments && goodInfo.comments.number">
			<view class="e-header">
				<text class="tit">评价</text>
				<text>({{goodInfo.comments.number}})</text>
				<text class="tip"></text>
				<text class="yticon icon-you"></text>
			</view>
			<view class="eva-box" v-for="(comments, cindex) in goodInfo.comments.list" :key="cindex">
				<image class="portrait" :src="comments.user_info.photo" mode="aspectFill"></image>
				<view class="right">
					<text class="name">{{comments.user_info.userName}}</text>
					<text class="con">{{comments.text}}</text>
					<view class="bot">
						<text class="attr">购买类型：{{querySpecification(comments.spec_value_id)}}</text>
						<text class="time">{{$dayJS(comments.CreatedAt).format('YYYY-MM-DD HH:mm:ss')}}</text>
					</view>
				</view>
			</view>
		</view>

		<view class="detail-desc">
			<view class="d-header">
				<text>图文详情</text>
			</view>
			<rich-text :nodes="goodInfo.content"></rich-text>
		</view>

		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
				<u-icon size="24" name="kefu-ermai"> </u-icon>

				<text>客服</text>
			</navigator>
			<navigator url="/pages/cart/cart" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-gouwuche"></text>
				<text>购物车</text>
			</navigator>
			<view class="p-b-btn" :class="{active: goodInfo.like}" @click="toFavorite">
				<text class="yticon icon-shoucang"></text>
				<text>收藏</text>
			</view>

			<view class="action-btn-group">
				<button type="primary" class=" action-btn no-border add-cart-btn" @click="buy(2)">加入购物车</button>
				<button type="primary" class=" action-btn no-border buy-now-btn" @click="buy(1)">立即购买</button>
			</view>
		</view>


		<!-- 规格-模态层弹窗 -->
		<view class="popup spec" :class="specClass" @touchmove.stop.prevent="stopPrevent" @click="toggleSpec">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content" @click.stop="stopPrevent">
				<view class="a-t">
					<image :src="goodsItem.image">
					</image>
					<view class="right">
						<text class="price">¥{{goodsItem.price}}</text>
						<text class="stock" v-show="goodsItem.isComplete">库存：{{goodsItem.stock}}件</text>
						<text class="stock" v-show="!goodsItem.isComplete">待选</text>
						<view class="selected" v-show="goodsItem.isComplete">
							已选：
							<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">
								{{sItem.value}}
							</text>
						</view>
						<view class="selected" v-show="!goodsItem.isComplete">
							请选：
							<text class="selected-text" v-for="(cl, clindex) in goodsItem.chooseList" :key="clindex">
								{{cl}}
							</text>
						</view>
					</view>
				</view>
				<view v-for="(item,index) in goodInfo.spec" :key="index" class="attr-list">
					<text>{{item.name}}</text>
					<view class="item-list">
						<text v-for="(childItem, childIndex) in goodsSpecValue" v-if="childItem.spec_id === item.id"
							:key="childIndex" class="tit"
							:class="{selected: childItem.selected , isSoldOut:!childItem.is_choose}"
							@click="selectSpec(childIndex, childItem.spec_id)">
							{{childItem.value}}
						</text>
					</view>
				</view>
				<view class="by-number">
					<text class="by-number-text">购买数量</text>
					<u-number-box v-model="quantity">
						<view slot="minus" class="minus">
							<u-icon name="minus" size="12"></u-icon>
						</view>
						<text slot="input" style="width: 50px;text-align: center;" class="input">{{quantity}}</text>
						<view slot="plus" class="plus">
							<u-icon name="plus" color="#FFFFFF" size="12"></u-icon>
						</view>
					</u-number-box>
				</view>
				<button class="btn" @click="treatment">{{buyType.text}}</button>
			</view>
		</view>
		<!-- 分享 -->
		<share ref="share" :contentHeight="580" :shareList="shareList"></share>
	</view>
</template>

<script>
	import share from '@/components/share';
	import {
		getGoodInfo,
		getCollection,
		addShoppingCart
	} from '../../api/goods.js'
	export default {
		components: {
			share
		},
		data() {
			return {
				goods_id: "",
				specClass: 'none',
				goodInfo: {},
				specSelected: [],
				quantity: 1, //购买数量
				buyType: {
					type: 1,
					text: "立即购买"
				},
				specificationsImage: "",
				favorite: false,
				shareList: [],

			};
		},
		computed: {
			goodsItem() {
				let item = [];
				for (let ls of this.specSelected) {
					item = [...item, ls.id.toString()]
				}
				if (this.goodInfo.item) {
					this.goodInfo.item.forEach(list => {
						if (list.spec_value_ids.toString() == item.toString()) {
							this.$set(list, "isComplete", true)
							item = list
						}
					})
				}
				console.log(Object.prototype.toString.call(item) !== '[object Object]')
				if (Object.prototype.toString.call(item) !== '[object Object]') {
					if (this.goodInfo && this.goodInfo.spec_value && this.goodInfo.spec) {
						let hasChosenList = this.goodInfo.spec_value.filter((gsvl) => {
							return item.includes(new String(gsvl.id).toString())
						})
						let hasChosenSpecIdList = [];
						hasChosenList.forEach((hcsil) => {
							hasChosenSpecIdList = [...hasChosenSpecIdList, hcsil.spec_id]
						})
						let hasChosenSpecStrList = [];
						//取出未选的字段、
						this.goodInfo.spec.forEach((sp) => {
							if (!hasChosenSpecIdList.includes(sp.id)) {
								hasChosenSpecStrList = [...hasChosenSpecStrList, sp.name]
							}
						})
						let chooseItem = {
							isComplete: false,
							goods_id: 1,
							id: 1,
							image: this.goodInfo.image,
							price: "待选择",
							//未选择的规格列表
							chooseList: hasChosenSpecStrList,
							stock: "待选择"
						}
						return chooseItem
					}
				}


				return item
			},
			specSelectedLen() {
				let len = Object.keys(this.specSelected)

				return len.length
			},
			goodsSpecValue() {
				let list = this.goodInfo.spec_value
				//添加是否可选属性
				if (this.specSelected.length) {


					list.forEach(ls => {
						this.$set(ls, "is_choose", false)
					})

					let currentSpecSelected = this.specSelected
					//循环当前选择属性判断可选规格
					currentSpecSelected.forEach(cs => {
						let csId = cs.id
						console.log(csId)

						//得到当前规格下级可选规格
						let item = this.goodInfo.item.filter((it) => {
								if (it.spec_value_ids.includes(new String(csId).toString()) && it.stock > 0) {
									it.spec_value_ids.filter((kid) => {
										list.filter((it) => {
											if (it.id == kid) {
												it.is_choose = true
											}
										})
									})
									return true
								}

							}

						)

						console.log(list)
					})
				} else {
					//没有选择的化则都可选
					list.filter((it) => {
						it.is_choose = true
					})
					//规格下级全部没货的情况
					this.goodInfo.spec_value.filter((gsv) => {

						let gsvId = gsv.id
						let is = this.goodInfo.item.filter((it) => {
							return it.spec_value_ids.includes(new String(gsvId).toString()) && it.stock > 0
						})
						gsv.is_choose = is.length == 0 ? false : true

						return gsv
					})
				}
				return list
			},
			//判断是否售罄
			isSoldOut() {
				let is = true
				if (this.goodInfo && this.goodInfo.item) {
					is = this.goodInfo.item.filter((it) => {
						return it.stock > 0
					})
					console.log(is.length == 0)
					if (is.length == 0) {
						is = false
					} else {
						is = true
					}

				} else {
					is = false
				}
				return is
			}

		},
		async onLoad(options) {
			//接收传值,id里面放的是标题，因为测试数据并没写id 
			let id = parseInt(options.id);
			this.goods_id = id;
			await this.init(id);


			// //规格 默认选中第一条
			// this.goodInfo.spec.forEach(item => {
			// 	for (let cItem of this.goodInfo.spec_value) {
			// 		if (cItem.spec_id === item.id) {
			// 			if (cItem.image) {
			// 				this.specificationsImage = cItem.image
			// 			}
			// 			this.$set(cItem, 'selected', true);
			// 			this.specSelected.push(cItem);
			// 			break; //forEach不能使用break
			// 		}
			// 	}
			// })


		},
		methods: {
			async init(id) {

				try {
					let httpData = {
						id
					}
					let goodsInfo = await getGoodInfo(httpData)
					this.goodInfo = goodsInfo.data
				} catch (err) {
					console.log(err)
					this.$refs.uToast.show({
						type: 'error',
						message: "资源请求失败",
						position: 'bottom',
					})
					return;
				}
			},
			//查询规格
			querySpecification(query) {
				let item = [];
				for (let ls of query) {
					item = [...item, ls.toString()]
				}
				this.goodInfo.item.forEach(list => {
					if (list.spec_value_ids.toString() == item.toString()) {
						item = list
					}
				})
				let str = ""
				item.spec_value_str.forEach(st => {
					str = str + " " + st
				})
				return str
			},
			//规格弹窗开关
			toggleSpec() {
				//如果没有规格可选
				if (!this.isSoldOut) {
					return false;
				}
				console.log(this.specSelected)
				if (this.specClass === 'show') {
					this.specClass = 'hide';
					setTimeout(() => {
						this.specClass = 'none';
					}, 250);
				} else if (this.specClass === 'none') {
					this.specClass = 'show';
				}
			},
			//选择了规格进行处理
			treatment() {
				//判断是否选择了规格
				if (this.goodsItem.chooseList) {
					console.log("请选完规格")
					return false
				}
				//判断操作处理
				if (this.buyType.type == 1) {
					//跳转到购买
					this.buyGood()
				} else {
					//加入购物车
					this.shoppingCart()
				}
			},
			//选择规格
			selectSpec(index, spec_id) {

				let list = this.goodInfo.spec_value;

				if (!list[index].is_choose) {
					console.log(123);
					return;
				}
				list.forEach(item => {
					if (item.spec_id === spec_id) {
						this.$set(item, 'selected', false);
					}
				})
				if (list[index].image) {
					this.specificationsImage = list[index].image
				}


				this.$set(list[index], 'selected', true);

				//判断是否已点击
				this.specSelected.filter((sp) => {
					if (sp.id == list[index].id) {
						this.$set(list[index], 'selected', false);
					}
				})

				//存储已选择
				/**
				 * 修复选择规格存储错误
				 * 将这几行代码替换即可
				 * 选择的规格存放在specSelected中
				 */
				this.specSelected = [];
				list.forEach(item => {
					if (item.selected === true) {
						this.specSelected.push(item);
					}
				})

			},

			//分享
			share() {
				this.$refs.share.toggleMask();
			},
			//收藏
			toFavorite() {
				try {
					let httpData = {
						goods_id: this.goods_id,
						is_collection: !this.goodInfo.like
					}
					let is = getCollection(httpData)
					this.goodInfo.like = !this.goodInfo.like
				} catch (err) {
					console.log(err)
					return;
				}

			},
			buy(type) {
				//1是进行购买 2是加入购物车
				if (type == 1) {
					this.buyType = {
						type: 1,
						text: "立即购买",
					}
				} else {
					this.buyType = {
						type: 2,
						text: "加入购物车",
					}
				}
				//未选择规格先选择规格
				if (!this.specSelected.length) {
					this.toggleSpec()
					return
				}
				this.treatment()

			},
			//购买商品
			buyGood() {
				this.specSelected = [];
				uni.navigateTo({
					url: `/pages/order/createOrder`
				})
			},
			shoppingCart() {
				try {
					let httpData = {
						goods_id: this.goods_id,
						item_id: this.goodsItem.id,
						number :this.quantity
					}
					let is = addShoppingCart(httpData)
					this.$refs.uToast.show({
						type: 'primary',
						icon:false,
						message: "收藏成功,在购物车等你嗷!",
						position: 'top',
					})
					this.specSelected = [];
					this.toggleSpec()
				} catch (err) {
					console.log(err)
					return;
				}
			},
			stopPrevent() {}
		},

	}
</script>

<style lang='scss'>
	page {
		background: $page-color-base;
		padding-bottom: 160upx;
	}

	.icon-you {
		font-size: $font-base + 2upx;
		color: #888;
	}

	.carousel {
		height: 722upx;
		position: relative;

		swiper {
			height: 100%;
		}

		.image-wrapper {
			width: 100%;
			height: 100%;
		}

		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}

	}

	/* 标题简介 */
	.introduce-section {
		background: #fff;
		padding: 20upx 30upx;

		.title {
			font-size: 32upx;
			color: $font-color-dark;
			height: 50upx;
			line-height: 50upx;
		}

		.price-box {
			display: flex;
			align-items: baseline;
			height: 64upx;
			padding: 10upx 0;
			font-size: 26upx;
			color: $uni-color-primary;
		}

		.price {
			font-size: $font-lg + 2upx;
		}

		.m-price {
			margin: 0 12upx;
			color: $font-color-light;
			text-decoration: line-through;
		}

		.coupon-tip {
			align-items: center;
			padding: 4upx 10upx;
			background: $uni-color-primary;
			font-size: $font-sm;
			color: #fff;
			border-radius: 6upx;
			line-height: 1;
			transform: translateY(-4upx);
		}

		.bot-row {
			display: flex;
			align-items: center;
			height: 50upx;
			font-size: $font-sm;
			color: $font-color-light;

			text {
				flex: 1;
			}
		}
	}

	/* 分享 */
	.share-section {
		display: flex;
		align-items: center;
		color: $font-color-base;
		background: linear-gradient(to right, #fdf5f6, #fbebf6);
		padding: 12upx 30upx;

		.share-icon {
			display: flex;
			align-items: center;
			width: 70upx;
			height: 30upx;
			line-height: 1;
			border: 1px solid $uni-color-primary;
			border-radius: 4upx;
			position: relative;
			overflow: hidden;
			font-size: 22upx;
			color: $uni-color-primary;

			&:after {
				content: '';
				width: 50upx;
				height: 50upx;
				border-radius: 50%;
				left: -20upx;
				top: -12upx;
				position: absolute;
				background: $uni-color-primary;
			}
		}

		.icon-xingxing {
			position: relative;
			z-index: 1;
			font-size: 24upx;
			margin-left: 2upx;
			margin-right: 10upx;
			color: #fff;
			line-height: 1;
		}

		.tit {
			font-size: $font-base;
			margin-left: 10upx;
		}

		.icon-bangzhu1 {
			padding: 10upx;
			font-size: 30upx;
			line-height: 1;
		}

		.share-btn {
			flex: 1;
			text-align: right;
			font-size: $font-sm;
			color: $uni-color-primary;
		}

		.icon-you {
			font-size: $font-sm;
			margin-left: 4upx;
			color: $uni-color-primary;
		}
	}

	.c-list {
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		background: #fff;

		.c-row {
			display: flex;
			align-items: center;
			padding: 20upx 30upx;
			position: relative;
		}

		.tit {
			width: 140upx;
		}

		.con {
			flex: 1;
			color: $font-color-dark;

			.selected-text {
				margin-right: 10upx;
			}
		}

		.bz-list {
			height: 40upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;

			text {
				display: inline-block;
				margin-right: 30upx;
			}
		}

		.con-list {
			flex: 1;
			display: flex;
			flex-direction: column;
			color: $font-color-dark;
			line-height: 40upx;
		}

		.red {
			color: $uni-color-primary;
		}
	}

	/* 评价 */
	.eva-section {
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background: #fff;
		margin-top: 16upx;

		.e-header {
			display: flex;
			align-items: center;
			height: 70upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;

			.tit {
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				margin-right: 4upx;
			}

			.tip {
				flex: 1;
				text-align: right;
			}

			.icon-you {
				margin-left: 10upx;
			}
		}
	}

	.eva-box {
		display: flex;
		padding: 20upx 0;

		.portrait {
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			border-radius: 100px;
		}

		.right {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-base;
			color: $font-color-base;
			padding-left: 26upx;

			.con {
				font-size: $font-base;
				color: $font-color-dark;
				padding: 20upx 0;
			}

			.bot {
				display: flex;
				justify-content: space-between;
				font-size: $font-sm;
				color: $font-color-light;
			}
		}
	}

	/*  详情 */
	.detail-desc {
		background: #fff;
		margin-top: 16upx;

		.d-header {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			position: relative;

			text {
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
			}

			&:after {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc;
			}
		}
	}

	/* 规格选择弹窗 */
	.attr-content {
		padding: 10upx 30upx;

		.a-t {
			display: flex;

			image {
				width: 170upx;
				height: 170upx;
				flex-shrink: 0;
				margin-top: -40upx;
				border-radius: 8upx;
				;
			}

			.right {
				display: flex;
				flex-direction: column;
				padding-left: 24upx;
				font-size: $font-sm + 2upx;
				color: $font-color-base;
				line-height: 42upx;

				.price {
					font-size: $font-lg;
					color: $uni-color-primary;
					margin-bottom: 10upx;
				}

				.selected-text {
					margin-right: 10upx;
				}
			}
		}

		.attr-list {
			display: flex;
			flex-direction: column;
			font-size: $font-base + 2upx;
			color: $font-color-base;
			padding-top: 30upx;
			padding-left: 10upx;
		}

		.item-list {
			padding: 20upx 0 0;
			display: flex;
			flex-wrap: wrap;

			text {
				display: flex;
				align-items: center;
				justify-content: center;
				background: #eee;
				margin-right: 20upx;
				margin-bottom: 20upx;
				border-radius: 100upx;
				min-width: 60upx;
				height: 60upx;
				padding: 0 20upx;
				font-size: $font-base;
				color: $font-color-dark;
			}

			.selected {
				background: #fbebee;
				color: $uni-color-primary;
			}

			.isSoldOut {
				background: #f8f8f8;
				color: #d2d2d2;
			}
		}

		.by-number {
			display: flex;
			padding-top: 15px;
			padding-left: 5px;
			font-size: 15px;
			color: #606266;

			.by-number-text {
				flex: 1;
			}

			.minus {
				width: 22px;
				height: 22px;
				border-width: 1px;
				background-color: #f8f8f8;
				border-top-left-radius: 100px;
				border-top-right-radius: 100px;
				border-bottom-left-radius: 100px;
				border-bottom-right-radius: 100px;
				@include flex;
				justify-content: center;
				align-items: center;
			}

			.input {
				padding: 0 10px;
			}

			.plus {
				width: 22px;
				height: 22px;
				background-color: #fa436a;
				border-radius: 50%;
				/* #ifndef APP-NVUE */
				display: flex;
				/* #endif */
				justify-content: center;
				align-items: center;
			}
		}
	}

	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 99;

		&.show {
			display: block;

			.mask {
				animation: showPopup 0.2s linear both;
			}

			.layer {
				animation: showLayer 0.2s linear both;
			}
		}

		&.hide {
			.mask {
				animation: hidePopup 0.2s linear both;
			}

			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}

		&.none {
			display: none;
		}

		.mask {
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}

		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 100%;
			min-height: 40vh;
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;

			.btn {
				height: 66upx;
				line-height: 66upx;
				border-radius: 100upx;
				background: $uni-color-primary;
				font-size: $font-base + 2upx;
				color: #fff;
				margin: 30upx auto 20upx;
			}
		}

		@keyframes showPopup {
			0% {
				opacity: 0;
			}

			100% {
				opacity: 1;
			}
		}

		@keyframes hidePopup {
			0% {
				opacity: 1;
			}

			100% {
				opacity: 0;
			}
		}

		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}

			100% {
				transform: translateY(0%);
			}
		}

		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}

			100% {
				transform: translateY(120%);
			}
		}
	}

	/* 底部操作菜单 */
	.page-bottom {
		position: fixed;
		left: 30upx;
		bottom: 30upx;
		z-index: 95;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 690upx;
		height: 100upx;
		background: rgba(255, 255, 255, .9);
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, .5);
		border-radius: 16upx;

		.p-b-btn {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: $font-sm;
			color: $font-color-base;
			width: 96upx;
			height: 80upx;

			.yticon {
				font-size: 40upx;
				line-height: 48upx;
				color: $font-color-light;
			}

			&.active,
			&.active .yticon {
				color: $uni-color-primary;
			}

			.icon-fenxiang2 {
				font-size: 42upx;
				transform: translateY(-2upx);
			}

			.icon-shoucang {
				font-size: 46upx;
			}
		}

		.action-btn-group {
			display: flex;
			height: 76upx;
			border-radius: 100px;
			overflow: hidden;
			box-shadow: 0 20upx 40upx -16upx #fa436a;
			box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
			background: linear-gradient(to right, #ffac30, #fa436a, #F56C6C);
			margin-left: 20upx;
			position: relative;

			&:after {
				content: '';
				position: absolute;
				top: 50%;
				right: 50%;
				transform: translateY(-50%);
				height: 28upx;
				width: 0;
				border-right: 1px solid rgba(255, 255, 255, .5);
			}

			.action-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 180upx;
				height: 100%;
				font-size: $font-base;
				padding: 0;
				border-radius: 0;
				background: transparent;
			}
		}
	}
</style>

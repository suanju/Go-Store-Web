<template>
  <view class="container" @tap="_click">
    <image :src="listItem.image" mode="widthFix" class="img" @load="imgLoaded" @error="imgLoaded"></image>

    <view class="container-box">
      <view>
        <text class="text">{{listItem.title}}</text>
      </view>
      <view>
        <view>



        </view>
        <text class="unit">￥</text> <text class="price">{{listItem.price}}</text>
      </view>
    </view>

  </view>
</template>

<script>
export default {
  props: {
    listItem: {
      type: [Object, String, Number, Array],
      default: ()=> { return {} }
    },
    type: {
      type: String,
      default: ''
    }
  },
  methods: {
    _click() {
        let id = this.listItem.id;
        uni.navigateTo({
          url: `/pages/product/product?id=${id}`
        })
    },
    imgLoaded() {
      this.$emit('imgLoaded')
    }
  }
}
</script>

<style scoped>
@import url("../css/box-sizing-border-box.css");
.container{
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 10rpx;
  overflow: hidden;
  padding: 15rpx;
  background-color: #fff;
}
.image-box{
  width: 100%;
  position: relative;
  height: 0;
  padding-top: 100%;
}
.image{
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
}
.img{
  width: 100%;
  height: auto;
}
.text{
  font-size: 18rpx;
  color: #333333;
  margin-top: 25rpx;
}
.container-box{
  padding-left: 20rpx;
  padding-right: 20rpx;
}
.unit{
  font-size: 10rpx;
  color: #ce4a3d;
}
.price{
  color: #ce4a3d;
}
</style>

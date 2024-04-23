<template>
  <view class="infor">
    <view class="myinfor">
      <!-- <u-avatar :src="src" mode="circle" :size="180"></u-avatar> -->
      <button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
        <image class="avatar" :src="src||'https://th.bing.com/th/id/R.fd81516a06ce33c15b194494272fa6e9?rik=XAfnJ6A9NFvAyA&riu=http%3a%2f%2fimg.touxiangwu.com%2fuploads%2fallimg%2f2022053117%2fivhiashhpu1.jpg&ehk=Yi2aDhWvd0rnBKl1xloJy8F1RfGd8%2bcC75k4ff8dVXk%3d&risl=&pid=ImgRaw&r=0'"></image>
      </button>
      <view class="nihceng_phone">
        <view class="nicheng">昵称：{{ nicheng }}</view>

        <!-- <button open-type="getRealtimePhoneNumber" @getrealtimephonenumber="getrealtimephonenumber"> -->
        <view class="nicheng">电话：{{ phone }}</view>
        <!-- </button> -->
      </view>
    </view>
    <view class="overgoods" @click="goorder"> 正在进行中的订单 > </view>
    <view class="mygoods-box"> 我的商品 </view>
    <view class="mygoods">
      <view class="pubu">
        <!-- <u-button @click="clear">清空列表</u-button> -->
        <u-waterfall v-model="flowList" ref="uWaterfall2">
          <template v-slot:left="{ leftList }">
            <view class="demo-warter" v-for="(item, index) in leftList" :key="item.shopid">
              <!-- 警告：微信小程序中需要hx2.8.11版本才支持在template中结合其他组件，比如下方的lazy-load组件 -->
              <u-lazy-load threshold="-450" border-radius="10" :image="item.img[0]" :index="index"></u-lazy-load>
              <view class="demo-title">
                {{ item.goodsname }}
              </view>
              <view class="demo-price"> {{ item.shopprice }}元 </view>
              <view class="demo-tag">
                <view class="demo-tag-owner"> 自营 </view>
                <view class="demo-tag-text"> 放心购 </view>
              </view>
              <!-- <view class="demo-shop">
								{{ item.shop }}
							</view> -->
              <u-icon name="close-circle-fill" color="#fa3534" size="34" class="u-close"
                @click="remove(item.shopid)"></u-icon>
            </view>
          </template>

          <template v-slot:right="{ rightList }">
            <view class="demo-warter" v-for="(item, index) in rightList" :key="index">
              <u-lazy-load threshold="-450" border-radius="10" :image="item.img[0]" :index="index"></u-lazy-load>
              <view class="demo-title">
                {{ item.goodsname }}
              </view>
              <view class="demo-price"> {{ item.shopprice }}元 </view>
              <view class="demo-tag">
                <view class="demo-tag-owner"> 自营 </view>
                <view class="demo-tag-text"> 放心购 </view>
              </view>
              <!-- <view class="demo-shop">
								{{ item.shop }}
							</view> -->
              <u-icon name="close-circle-fill" color="#fa3534" size="34" class="u-close"
                @click="remove(item.shopid)"></u-icon>
            </view>
          </template>
        </u-waterfall>
        <view v-if="flowList.length === 0" style="margin-top: 100rpx;width: 100%;text-align: center;">您无商品正在出售</view>
      </view>
    </view>
    <u-tabbar class="tabbar" :list="tablist" :mid-button="true" bg-color="rgba(255, 255, 255, 1)"
      inactive-color="rgba(41, 44, 53, 0.30)" mid-button-size="150rpx" icon-size="48rpx">
    </u-tabbar>
  </view>
</template>

<script>
import indexStore from "../../../store/index.js";
import {getAllGoods} from '../../../utils/api.js'
export default {
  data() {
    return {
      userid: '',
      tablist: indexStore.state.list,
      src: "https://th.bing.com/th/id/R.fd81516a06ce33c15b194494272fa6e9?rik=XAfnJ6A9NFvAyA&riu=http%3a%2f%2fimg.touxiangwu.com%2fuploads%2fallimg%2f2022053117%2fivhiashhpu1.jpg&ehk=Yi2aDhWvd0rnBKl1xloJy8F1RfGd8%2bcC75k4ff8dVXk%3d&risl=&pid=ImgRaw&r=0",
      nicheng: "",
      phone: 19861427087,
      // 瀑布
      loadStatus: "loadmore",
      flowList: [],
      list: [],
    };
  },
  onLoad() {
    this.tablist = indexStore.state.list;
    this.addRandomData();
    this.getgoods();
    this.nicheng = uni.getStorageSync('username');
    this.src = uni.getStorageSync('userimg')
  },
  onShow() {
    // this.addRandomData();
    this.getgoods();
    // this.nicheng = uni.getStorageSync('username');
    // console.log(this.nicheng);
  },
  methods: {

    async getgoods() {
      const res = await getAllGoods()
			const goodslist = res.data
      this.userid = uni.getStorageSync('userid');
      this.list = goodslist.filter(item => item.userid == this.userid)
      this.$nextTick( () => {
        this.addRandomData()
      })
      // uni.request({
      //   url: 'http://localhost:3000/getgoods',
      //   method: 'GET',
      //   success: (res) => {
      //     console.log(res.data.data);
      //     const goodslist = res.data.data;
      //     this.userid = uni.getStorageSync('userid');
      //     this.list = goodslist.filter(item => item.userid == this.userid)
      //     this.addRandomData()
      //     // console.log(this.list);
      //     // console.log(this.goodslist);
      //     console.log(this.flowList);
      //   }
      // })
    },
    addRandomData() {
      this.flowList = this.list;
    },
    remove(id) {
      uni.request({
        url: 'http://localhost:3000/deletegoods',
        method: 'POST',
        data: {
          shopid: id
        },
        success: (res) => {
          this.$refs.uWaterfall2.clear()
          this.getgoods()
        }
      })
    },
    goorder() {
      console.log("跳转订单");
      uni.navigateTo({
        url: "/pages/myorder/myorder",
        fail: (e) => {
          console.log(e);
        },
      });
    },
    onChooseAvatar(e) {
      console.log(e);
      uni.setStorageSync("userimg", e.detail.avatarUrl);
      this.src = e.detail.avatarUrl;
    },
    getrealtimephonenumber(e) {
      console.log(e.detail.code)  // 动态令牌
      console.log(e.detail.errMsg) // 回调信息（成功失败都会返回）
      console.log(e.detail.errno)  // 错误码（失败时返回）
    }
  },
};
</script>

<style lang="scss" scoped>
.infor {
  height: 500px;
  z-index: 99999;
  width: 100%;
  height: 100%;
  // background-color: #000;
  .myinfor {
    height: 250rpx;
    background-image: url("https://th.bing.com/th/id/OIP.dxZwOGDCwxKKkXmQVfejmQHaEK?rs=1&pid=ImgDetMain");
    padding-left: 30rpx;
    padding-top: 45rpx;
    display: flex;

    .avatar-wrapper {
      width: 150rpx;
      height: 150rpx;
      border-radius: 50%;
      padding: 0%;
      margin: 0%;

      .avatar {
        width: 100%;
        height: 100%;
        // border-radius: 50%;
      }
    }

    .nihceng_phone {
      .nicheng {
        margin-left: 50rpx;
        padding-top: 20rpx;
        font-size: 20px;
        font-weight: 600;
      }
    }
  }

  .overgoods {
    height: 100rpx;
    text-align: center;
    line-height: 100rpx;
    background-color: beige;
  }

  .mygoods-box {
    background-color: #f6f6f6;
    height: 100rpx;
    text-align: center;
    line-height: 100rpx;
  }

  .mygoods {
    .pubu {
      .demo-warter {
        border-radius: 8px;
        margin: 5px;
        background-color: #ffffff;
        padding: 8px;
        position: relative;
      }

      .u-close {
        position: absolute;
        top: 32rpx;
        right: 32rpx;
      }

      .demo-image {
        width: 100%;
        border-radius: 4px;
      }

      .demo-title {
        font-size: 30rpx;
        margin-top: 5px;
        color: $u-main-color;
      }

      .demo-tag {
        display: flex;
        margin-top: 5px;
      }

      .demo-tag-owner {
        background-color: $u-type-error;
        color: #ffffff;
        display: flex;
        align-items: center;
        padding: 4rpx 14rpx;
        border-radius: 50rpx;
        font-size: 20rpx;
        line-height: 1;
      }

      .demo-tag-text {
        border: 1px solid $u-type-primary;
        color: $u-type-primary;
        margin-left: 10px;
        border-radius: 50rpx;
        line-height: 1;
        padding: 4rpx 14rpx;
        display: flex;
        align-items: center;
        border-radius: 50rpx;
        font-size: 20rpx;
      }

      .demo-price {
        font-size: 30rpx;
        color: $u-type-error;
        margin-top: 5px;
      }

      .demo-shop {
        font-size: 22rpx;
        color: $u-tips-color;
        margin-top: 5px;
      }
    }
  }
}
</style>
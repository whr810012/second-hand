<template>
  <view class="container">
    <!-- head -->
    <view class="head">
      <!-- 绝对路径 -->
      <image class="head_img" src="../../static/index/indextop.svg" mode />
      <view class="head_top_box">
        <div class="head_top">
          <view class="head_top_text">校园二手交易平台</view>
          <view class="haochu">
            <view class="haochuitem">省时</view>——
            <view class="haochuitem">省事</view>——
            <view class="haochuitem">省力</view>
          </view>
          <view class="haochu">
            <view class="haochuitem">
              <u-icon name="clock"></u-icon>
            </view>——
            <view class="haochuitem">
              <u-icon name="chrome-circle-fill"></u-icon>
            </view>——
            <view class="haochuitem">
              <u-icon name="car"></u-icon>
            </view>
          </view>
        </div>
      </view>
    </view>
    <!-- main -->
    <!-- 轮播 -->
    <view class="main">

      <view class="uni-margin-wrap">
        <swiper class="swiper" circular :autoplay="autoplay" :interval="interval" :duration="duration">
          <swiper-item class="swiper-item" v-for="i in 3" :key="i">
            <!-- https://ceshiai-1317989680.cos.ap-nanjing.myqcloud.com/index_main${i + 1}.png -->
            <image class="swiper-image" :src="`https://ceshiai-1317989680.cos.ap-nanjing.myqcloud.com/index_main${i + 1}.png`" />
          </swiper-item>
        </swiper>
      </view>

    </view>
    <!-- foot -->
    <view class="foot">
      <view class="foot-one">校园二手平台创新之处</view>
      <view>
        <scroll-view class="scroll-view_H" scroll-x="true" scroll-left="0">
          <view class="foot-image scroll-view-item_H">
            <view class="foot_item_box">
              <view class="aitext">AI设计</view>
              <image src="https://ceshiai-1317989680.cos.ap-nanjing.myqcloud.com/ai-loading.gif" alt="" />
              <view class="aitext">增加AI自由问答</view>
            </view>
          </view>
          <view class="foot-image scroll-view-item_H">
            <view class="foot_item_box">
              <view class="maptext">校园地图</view>
              <image src="https://ceshiai-1317989680.cos.ap-nanjing.myqcloud.com/map.png"></image>
              <view class="maptext">增加校园地图介绍</view>
            </view>
          </view>

        </scroll-view>
      </view>
    </view>
    <!-- buy -->
    <view class="fixedButton">
      <view class="btn-image" mode @click="toBuy">
        <view class="color_view"></view>
        <view class="btn">开始使用</view>
      </view>
    </view>
  </view>
</template>

<script>
import indexStore from "../../../store/index";

export default {
  data() {
    return {
      autoplay: true,
      interval: 2000,
      duration: 500,
      userInfo: {},
    };
  },
  async onLoad() {
    uni.getStorage({
        key: 'userid',
        success: function (res) {
          console.log(res.data);
          uni.reLaunch({
            url: "/pages/home/home",
            fail: e => {
              console.log(e);
            }
          });
        },
        })
  },
  onShareAppMessage(res) {
    if (res.from === "button") {
      // 来自页面内分享按钮
      console.log(res.target);
    }
    return {
      title: "澳淘卡",
      path: "/pages/index/index",
      imageUrl:
        "https://tutu-aomen.s3.cn-northwest-1.amazonaws.com.cn/poi_icons/澳淘卡.png"
    };
  },
  methods: {
    async toBuy() {
      uni.getStorage({
        key: 'username',
        success: function (res) {
          console.log(res.data);
          uni.reLaunch({
            url: "/pages/home/home",
            fail: e => {
              console.log(e);
            }
          });
        },
        fail: function (err) {
          console.log(err);
          uni.reLaunch({
            url: "/pages/addinfor/addinfor",
            fail: e => {
              console.log(e);
            }
          });
        }
      });


      // console.log("买买买");
      // await indexStore.dispatch("getUserPassStatus", {});
      // if (indexStore.state.userPassStatus.msg === "User has no pass") {
      //   console.log("还没买过");
      //   const res = await indexStore.dispatch("createOrderPay", {
      //     product_id: 123
      //   });
      //   console.log("res===", res);
      //   this.pay(res);
      // } else {
      //   console.log("走");
      //   uni.reLaunch({
      //     url: "/pages/map/map",
      //     fail: e => {
      //       console.log(e);
      //     }
      //   });
      //   return;
      // }


    },

    pay(res) {
      // 仅作为示例，非真实参数信息。
      uni.requestPayment({
        provider: "wxpay",
        timeStamp: res.timeStamp,
        nonceStr: res.nonceStr,
        package: res.package,
        signType: res.signType,
        paySign: res.paySign,
        prepay_id: res.prepay_id,
        success: async res => {
          console.log("支付success:" + JSON.stringify(res));
          await indexStore.dispatch("createPass");
          uni.switchTab({
            url: "/pages/map/map"
          });
        },
        fail: err => {
          console.log("支付fail:" + JSON.stringify(err));
          uni.showToast({
            icon: "none",
            title: "已放弃支付"
          });
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.container {
  width: 750rpx;
  background: rgba($color: #1c1429, $alpha: 0.9);
}

/* 头部照片 */
.head {
  height: 840rpx;
  width: 100%;
  //   background-color: red;
  position: relative;

  // padding-top: -500rpx;
  image {
    // margin-top: -126px;
    // height: 100%;
    width: 750rpx; // 确保图片宽度为屏幕宽度，防止图片变形。
    height: 100%;
  }

  .head_top_box {
    width: 100%;
    display: flex;
    justify-content: center;
    position: absolute;
    top: 600rpx;
    left: 0%;

    .head_top {
      z-index: 10;
      border-radius: 30px;
      //   background-color: #fff;
      background: linear-gradient(180deg,
          #1c1429 0%,
          #5f2c37 38.16%,
          #1c1429 56.27%);
      // 背景色加透明度
      // background: rgba(28, 20, 41, 0.9);
      color: #fff;
      width: 80%;
      height: 400rpx;
      //   display: flex;
      // align-items: center;

      justify-content: center;
      border: 2px solid rgba($color: #edeb48, $alpha: 0.3);

      border-radius: 30px;
      box-shadow: 10px 8px 0px rgba($color: #000000, $alpha: 0.5);

      .head_top_text {
        text-align: center;
        color: #fffdfc;
        text-shadow: 0px 3px 0px #075b8a;
        font-family: FZCuHuoYi-M25S;
        font-size: 18px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        letter-spacing: 0.311px;
        // 文字阴影
        text-shadow: 4px 3px 3px #f5f5f5;
        margin-top: 10rpx;
      }

      .haochu {
        display: flex;
        margin-top: 40rpx;
        justify-content: space-around;
        align-items: center;

        .haochuitem {
          //   text-shadow: 1px 1px 1px #f5f5f5;
          font-family: FZCuHuoYi-M25S;
          // 文字竖着
          writing-mode: vertical-lr;
          font-size: 20px;
          margin-top: 10rpx;
        }
      }
    }
  }
}

/* 轮播图 */
.main {
  height: 800rpx;
  width: 100%;
  position: relative;
  margin-top: 200rpx;

  /* 背景图 */
  .main-bg {
    // margin: -1rpx auto;
    position: absolute;
    top: 0px;
    left: 0px;
    height: 100%;
    // width: 100%;
  }

  .main-text {
    width: 436rpx;
    height: 172rpx;
    position: absolute;
    left: 58rpx;
    bottom: 46rpx;
  }

  // 轮播
  .uni-margin-wrap {
    position: absolute;
    top: 0px;
    left: 0px;
    height: 100%;
    width: 100%;

    .swiper {
      height: 1000rpx;
      width: 100%;

      .swiper-item {
        display: block;
        height: 1440rpx;
        width: 100%;
        line-height: 300rpx;
        text-align: center;

        .swiper-image {
          width: 100%;
          height: 100%;
          border-radius: 30px;
        }
      }
    }
  }
}

/* 底部滑动 */
.foot {
  height: 1200rpx;
  width: 100%;
  background: #1c1429;
  margin-top: 80px;

  // color: #fff;
  .foot-one {
    // background-color: #fff;
    padding-top: 50rpx;
    text-align: center;
    color: #fffdfc;
    text-shadow: 0px 3px 0px #075b8a;
    font-family: FZCuHuoYi-M25S;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 0.311px;
    // 文字阴影
    text-shadow: 4px 3px 2px #f5f5f5;
    margin-top: 10rpx;
  }

  .scroll-view_H {

    margin: -4rpx auto;
    margin-top: 10px;
    // margin-bottom: 20px;
    white-space: nowrap;
    width: 100%;
    height: 100%;

    .scroll-view-item_H {
      border-radius: 10px;
      // background-color: pink;
      // border: 4px solid #075b8a;
      margin: 20rpx 20rpx;
      display: inline-block;
      width: 80%;
      height: 818rpx;

      .scroll-img {
        height: 100%;
        width: 100%;
      }

      .foot_item_box {
        height: 100%;
        width: 100%;
        border-radius: 30px;
        border: 1px solid #d63535;
        background-color: #fff;

        image {
          width: 100%;
          height: calc(100% - 60px);
        }

        .aitext {
          height: 30px;
          width: 100%;
          text-align: center;
          line-height: 30px;
          // color: #87e9ea;
          font-size: 20px;
          -webkit-text-stroke: 1px #87e9ea;
          /*文字描边*/
          -webkit-text-fill-color: transparent;
          /*设置文字的填充颜色*/

        }

        .maptext {
          height: 30px;
          width: 100%;
          text-align: center;
          line-height: 30px;
          color: #ffb405;
          font-size: 20px;
          -webkit-text-stroke: 1px #ffb405;
          /*文字描边*/
          -webkit-text-fill-color: transparent;
          /*设置文字的填充颜色*/
        }
      }
    }
  }
}

/* 购买按钮 */
.fixedButton {
  position: fixed;
  bottom: 0rpx;
  left: 0rpx;
  width: 100%;
  height: 200rpx;

  .btn-image {
    height: 200rpx;
    width: 100%;

    .color_view {
      width: 100%;
      height: 50rpx;
      background-color: rgb(7, 91, 138);
    }

    .btn {
      // 渐变红棕色

      height: 151rpx;
      background: rgb(178, 73, 73);

      // background-color: 
      color: rgba(255, 255, 255, 0.90);
      text-shadow: 0px 1px 0px #B24949;
      font-family: FZChaoCuHei-M10S;
      font-size: 34px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: 0.311px;
      text-align: center;
      -webkit-text-stroke: 1px rgba(255, 255, 255, 0.90);
      /*文字描边*/
      -webkit-text-fill-color: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
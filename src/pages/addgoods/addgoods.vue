<template>
  <view class="main-box">
    <view class="main">
      <view class="addgoods_top">
        <view class="addgoods_top_text"> 上传照片 </view>
        <!-- <img src="http://tmp/FBcUVoYgRv07cb764ec24278261909321f144dd5b5ed.png" alt=""> -->
        <u-upload ref="uUpload" :show-tips="false" :max-count="3" :auto-upload="false" :action="action"
          @on-choose-complete="onchoosecomplete"></u-upload>
      </view>
      <view class="addgoods_top">
        <view class="addgoods_top_class">
          <view class="top_class_text">名称：</view>
          <view class="top_class_bottom">
            <u-input v-model="goods_name" input-align="center" placeholder="请输入商品名称" />
          </view>
        </view>
      </view>

      <view class="addgoods_top" @click="show = true">
        <view class="addgoods_top_class">
          <view class="top_class_text"> 分类： </view>
          <view class="top_class_bottom" @click="show = true">
            <u-input v-model="classlist.label" :type="text" :border="true" input-align="center" disabled="fasle"
              @click="show = true" />
          </view>
        </view>
        <u-select v-model="show" :list="list" @confirm="confirm"></u-select>
      </view>
      <view class="addgoods_top">
        <view class="addgoods_top_class">
          <view class="top_class_text"> 价格： </view>
          <view class="top_class_bottom" @click="priceshow = true">
            ￥{{ goods_price || "0.00" }}
            <u-keyboard mode="number" @change="valChange" @backspace="backspace" v-model="priceshow"></u-keyboard>
            <!-- <u-button >打开</u-button> -->
          </view>
        </view>
      </view>
      <view class="addgoods_top">
        <view class="addgoods_top_value">
          <view class="top_class_text"> 商品描述： </view>
          <view class="top_class_bottom">
            <u-input v-model="goods_value" type="textarea" :border="true" input-align="left" placeholder="请输入商品描述" />
          </view>
        </view>
      </view>
      <view class="aititle">
        <view class="box" @click="aititle">一键生成商品描述</view>
      </view>
      <view class="addgoods_top">
        <view class="addgoods_top_class">
          <view class="top_class_text" @click="checkaddres"> 交易位置： </view>
          <view class="top_class_text" @click="checkaddres">
            {{ address||'点击此处选择交易位置' }}
          </view>
        </view>
      </view>
      <view class="addgoods_top">
        <view class="addgoods_top_class">
          <view class="top_class_text"> 加入存放：
            <p style="font-weight: 300;font-size: 12px;">加入后统一去存放点寻找交易物品</p>
          </view>
          <view class="top_class_text">
            <u-switch v-model="checked" @change="swtichchange"></u-switch>
          </view>
        </view>
      </view>
      <u-button @click="submit">提交</u-button>


      <u-tabbar class="tabbar" :list="tablist" :mid-button="true" bg-color="rgba(255, 255, 255, 1)"
        inactive-color="rgba(41, 44, 53, 0.30)" mid-button-size="150rpx" icon-size="48rpx">
      </u-tabbar>
    </view>
  </view>
</template>

<script>
// https://blog.csdn.net/qq_36901092/article/details/130326103
import CryptoJS from 'crypto-js';
import indexStore from "../../../store/index.js";
import {WebSocket} from 'isomorphic-ws';
export default {
  data() {
    return {
   socket :null,// 声明全局变量保存 WebSocket 对象
   aiResponse : [],// 声明一个数组保存 AI 的回答
      checked: false,
      type: "textarea",
      border: true,
      height: 100,
      autoHeight: true,
      priceshow: false,
      goods_name: "",
      goods_price: "",
      goods_value: "",
      address: "",
      longitude: "",
      latitude: "",
      classlist: {
        value: "0",
        label: "默认",
      },
      tablist: "",
      action: "http://www.example.com/upload",
      filesArr: [],
      // show:true,
      show: false,

      list: [
        {
          value: "0",
          label: "默认",
        },
        {
          value: "1",
          label: "书籍类",
        },
        {
          value: "2",
          label: "衣物类",
        },
        {
          value: "3",
          label: "电子产品",
        },
        {
          value: "4",
          label: "食品类",
        },
      ],
    };
  },
  onPullDownRefresh() {
    // console.log('123'); // 打印 "123"
    this.$forceUpdate()

    // 这里可以添加其他刷新逻辑

    // 调用uni.stopPullDownRefresh()方法停止下拉刷新的状态
    uni.stopPullDownRefresh();
  },

  methods: {
    onLoad() {
      this.connectWebSocket()
      this.tablist = indexStore.state.list;
      const that = this;
      uni.chooseLocation({
        success: function (res) {
          console.log("位置名称：" + res.name);
          console.log("详细地址：" + res.address);
          console.log("纬度：" + res.latitude);
          console.log("经度：" + res.longitude);
          that.address = res.address;
          that.latitude = res.latitude;
          that.longitude = res.longitude;
          console.log(that.address);
        },
      });
    },
    checkaddres() {
      const that = this;
      uni.chooseLocation({
        success: function (res) {
          console.log("位置名称：" + res.name);
          console.log("详细地址：" + res.address);
          console.log("纬度：" + res.latitude);
          console.log("经度：" + res.longitude);
          that.address = res.address;
          that.latitude = res.latitude;
          that.longitude = res.longitude;
          console.log(that.address);
        },
      });
    },
    swtichchange() {
      console.log(this.checked);
      if (this.checked) {
        this.longitude = 117.086583
        this.latitude = 36.664666
        this.address = '交易存放点'
      }
    },
    aititle(){
      const aititle = '商品名称为'+this.goods_name+'的商品,'+'他的价格为'+this.goods_price+'元，'+'他的分类是'+this.classlist.label+',他的交易位置是'+this.address+',请为这件商品生成一段商品描述用于售卖'

      console.log(aititle);
      this.sendQuestion(aititle)

    },
     generateURL() {
      // 生成签名所需的参数
      const APIKey = '1398f259b3fec19a20e02d86aadb86eb';
      const APISecret = 'MDMxYjIzZWI1ZTdlZDE4NTllOTRhYTVk';
      const host = 'spark-api.xf-yun.com';
      const path = '/v3.1/chat';

      // 生成date参数
      const curTime = new Date().toUTCString();
      const date = curTime;

      // 生成authorization参数
      const requestLine = `GET ${path} HTTP/1.1`;
      const tmp = `host: ${host}\ndate: ${date}\n${requestLine}`;
      const tmpSha = CryptoJS.HmacSHA256(tmp, APISecret);
      const signature = CryptoJS.enc.Base64.stringify(tmpSha);
      const authorizationOrigin = `api_key="${APIKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`;
      if (typeof btoa === 'undefined') {
  global.btoa = function(str) {
    return Buffer.from(str, 'binary').toString('base64');
  };
}
      const authorization = btoa(authorizationOrigin);

      // 生成最终url
      const params = {
        authorization: encodeURIComponent(authorization),
        date: encodeURIComponent(date),
        host: encodeURIComponent(host)
      };
      const url = `wss://${host}${path}?authorization=${params.authorization}&date=${params.date}&host=${params.host}`;

      return url;
    },

     connectWebSocket() {
      const url = this.generateURL();
      console.log(url);
      this.socket = new WebSocket(url);

      this.socket.onopen = function (event) {
        console.log("连接成功");
      };

      this.socket.onmessage = function (event) {
        const response = JSON.parse(event.data);
        if (response.payload && response.payload.choices && response.payload.choices.text && response.payload.choices.text.length > 0) {
          const text = response.payload.choices.text[0].content;
          this.aiResponse.push(text);
        } else {
          console.error("服务器返回的数据格式不正确");
          console.log(response);
        }
      };

      this.socket.onclose = function (event) {
        console.log("连接关闭");

        // 在连接关闭后重新连接 WebSocket
        console.log("正在尝试重新连接...");
        this.connectWebSocket();

        // 在连接关闭后将所有的 AI 回答拼接成一个字符串返回给用户
        const aiResponseText = this.aiResponse.join(""); // 将回答数组拼接成一句话
        const chatHistory = '';

        if (aiResponseText === '') {
          return;
        } else {
          console.log(aiResponseText);

        }



        this.aiResponse = []; // 清空回答数组
        chatDiv.scrollTop = chatDiv.scrollHeight


      };
    },

     sendQuestion(item) {
      const userInput = item

      // 将用户的问题添加到聊天历史中

      const chatHistory = document.getElementById("chat-history");
      if(userInput == ''){
        return
      }else{
              chatHistory.innerHTML += `<li class="right">
          <span>${userInput}</span>
          <img src="https://tse2-mm.cn.bing.net/th/id/OIP-C.BQoqXfiYUKT7RJ1JLU5RbAHaJK?rs=1&pid=ImgDetMain" alt="">
        </li>`

        chatDiv.scrollTop = chatDiv.scrollHeight
      }



      // 检查 WebSocket 连接状态，如果已经关闭，就重新连接
      if (this.socket.readyState !== WebSocket.OPEN) {
        console.log("WebSocket 连接已关闭，正在尝试重新连接...");
        connectWebSocket();
      }

      // 发送问题给服务器
      this.socket.send(JSON.stringify({
        header: {
          app_id: "86a192cf"
        },
        parameter: {
          chat: {
            domain: "generalv3",
            temperature: 0.5,
            max_tokens: 2048,
          }
        },
        payload: {
          message: {
            text: [
              { role: "user", content: userInput }
            ]
          }
        }
      }));


    },








    submit() {
      const userid = uni.getStorageSync("userid");
      const shopname = uni.getStorageSync("username");
      const imglst = this.filesArr.map(item => item.url);

      const data = {
        goodsname: this.goods_name,
        goodsprice: this.goods_price,
        goodsclass: this.classlist.label,
        goodstitle: this.goods_value,
        latitude: this.latitude,
        longitude: this.longitude,
        address: this.address,
        goods_img: imglst,
        userid: uni.getStorageSync("userid"),
        shopname: uni.getStorageSync("username"),
      };
      if (
        this.goods_name &&
        this.goods_price &&
        this.classlist.label &&
        this.goods_value &&
        this.address &&
        this.latitude &&
        this.longitude &&
        this.filesArr &&
        userid &&
        shopname
      ) {
        console.log(data);
        uni.request({
          url: "http://localhost:3000/addgoods",
          method: "POST",
          data: data,
          success: (res) => {
            console.log(res);
            this.filesArr = []
            this.goods_name = ''
            this.goods_price = ''
            this.classlist = {
              value: "0",
              label: "默认"
            },
            this.goods_value =''
            this.address = ''
            this.latitude = ''
            this.longitude = ''
            this.checked = false
            this.$refs.uUpload.clear();
            // this.filesArr = []
              uni.showToast({
                title: "发布成功",
                icon: "none",
              });
            setTimeout(() => {
              uni.switchTab({
                url: '/pages/home/home'
              });
            }, 1500);


          }
        })
      } else {
        if (userid && shopname) {
          uni.showToast({
            title: "请填写完整",
            icon: "none",
          });
        } else {
          uni.showToast({
            title: "请先登录",
            icon: "none",
          });
          uni.navigateTo({
            url: "/pages/addinfor/addinfor",
          });
        }
      }
    },
    onchoosecomplete(lists) {
      this.filesArr = lists;
      console.log("asddasd", this.filesArr);
    },

    confirm(e) {
      console.log(e[0]);
      this.classlist = e[0];
      console.log(this.classlist);
    },
    valChange(val) {
      this.goods_price += val;
      // 保留两位小数
      // this.goods_price = this.goods_price.;
    },
    backspace() {
      // 删除value的最后一个字符
      if (this.goods_price.length)
        this.goods_price = this.goods_price.substr(
          0,
          this.goods_price.length - 1
        );
      // console.log(this.value);
    },
  },
};
</script>

<style scoped lang="scss">
.main-box {
  background-color: #f5f5f5;
}

.main {
  // background-color: rgba(131, 131, 131,0.2);
  min-height: 100vh;
  width: 92%;
  margin-left: 4%;
  background-color: #fff;
  border-radius: 20px;
}

.addgoods_top {
  .addgoods_top_text {
    padding-top: 20rpx;
    margin-bottom: 10rpx;
    font-size: 16px;
    padding-left: 10rpx;
  }

  .addgoods_top_class {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 20rpx;
    padding-bottom: 20rpx;
    font-size: 16px;

    // background-color: #f6f6f6;
    .top_class_text {
      padding-right: 20rpx;
      padding-left: 10rpx;
      // width: 20%;
      font-size: 18px;
      font-weight: 500;
      display: flex;
      align-items: center;
    }

    .top_class_bottom {
      display: flex;
      align-items: center;
      // width: 70%;
      color: #b24949;
      font-size: 25px;
    }

    // .top_class_bottom_a {
    // 	display: flex;
    // 	align-items: center;
    // 	// width: 70%;
    // 	color: #B24949;
    // 	font-size: 25px;
    // }
  }

  .addgoods_top_value {
    display: flex;
    padding-top: 20rpx;
    padding-bottom: 20rpx;
    font-size: 16px;
    padding-left: 10rpx;

    .top_class_text {
      padding-right: 20rpx;
      // padding-left: 10rpx;
      // width: 20%;
      font-size: 18px;
      font-weight: 500;
    }

    .top_class_bottom {
      width: 70%;

      // height: 200px;
      ::v-deep .u-input--border.data-v-fdbb9fe6 {
        background-color: white;
        width: 95%;
        // 透明度0.1
        // opacity: 0.8;

        // line-height: 30px;
        .u-input__input.data-v-fdbb9fe6 {
          font-size: 12px;
          // font-weight: 600;
          color: #000;
        }
      }
    }
  }
}
.aititle{

  display: flex;
  justify-content: center;
  margin: 20rpx;

  .box{
    // width: 240rpx;
    border-radius: 20rpx;
  border: 1px solid #b24949;
  text-align: center;
  padding: 20rpx;
  background-color: #b24949;
  color: #fff;
  font-size: 20px;
  font-weight: 500;
  }
}

::v-deep .u-input--border.data-v-fdbb9fe6 {
  background-color: #b24949;
  width: 70%;
  // 透明度0.1
  opacity: 0.8;

  // line-height: 30px;
  .u-input__input.data-v-fdbb9fe6 {
    font-size: 20px;
    font-weight: 600;
    color: white;
  }
}

::v-deep .addgoods_top .addgoods_top_class .top_class_bottom.data-v-2245f626 {
  width: 70%;
}
</style>
<template>
  <view class="main-box">
    <view class="main">
      <view class="addgoods_top">
        <view class="addgoods_top_text"> 上传照片 </view>
        <!-- <img src="http://tmp/FBcUVoYgRv07cb764ec24278261909321f144dd5b5ed.png" alt=""> -->
        <u-upload ref="uUpload" :show-tips="false" :max-count="3" :auto-upload="false" :action="action"
          @on-choose-complete="onchoosecomplete" @on-remove="removeimg"></u-upload>
      </view>
      <!-- <img :src="base64"></img> -->
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
            <u-input v-model="goods_value" type="textarea" :maxlength="10000" :border="true" input-align="left"
              placeholder="请输入商品描述" />
          </view>
        </view>
      </view>
      <view class="addgoods_top">
        <view class="addgoods_top_value">
          <view class="top_class_text"> +关键词: </view>
          <view class="top_class_bottom">
            <u-input v-model="goods_words" type="textarea" :maxlength="10000" :border="true" input-align="left"
              placeholder="如果您想使用一键生成商品描述，可在此处，添加关键词" />
          </view>
        </view>
      </view>
      <view class="aititle">
        <view class="box" @click="aititle">一键生成商品描述</view>
      </view>
      <view class="addgoods_top">
        <view class="addgoods_top_class">
          <view class="top_class_text" @click="checkaddres"> 交易位置： </view>
          <view
            style=" padding-right: 20rpx; padding-left: 10rpx;  font-size: 18px;  font-weight: 500; display: flex; align-items: center;"
            @click="checkaddres">
            {{ address || '点击此处选择交易位置' }}
          </view>
        </view>
      </view>
      <view class="addgoods_top">
        <view class="addgoods_top_class">
          <view class="">
            <view class="top_class_text">加入存放：</view>
            <p style="font-weight: 300;font-size: 12px; padding-left: 10px;">加入后统一去存放点寻找交易物品</p>
          </view>
          <view style="padding-right: 20px;">
            <u-switch v-model="checked" @change="swtichchange"></u-switch>
          </view>
        </view>
      </view>
      <u-button style="margin-bottom: 50px;" @click="submit">提交</u-button>


      <u-tabbar class="tabbar" :list="tablist" :mid-button="true" bg-color="rgba(255, 255, 255, 1)"
        inactive-color="rgba(41, 44, 53, 0.30)" mid-button-size="150rpx" icon-size="48rpx">
      </u-tabbar>
    </view>
  </view>
</template>

<script>
import CryptoJS from 'crypto-js';
import indexStore from "../../../store/index.js";
import {addGoods} from '../../../utils/api.js'
import {fileToBase64} from '../../../utils/utils.js'
// import * as utf8 from "utf8"
// import URL from 'url'
import * as base64 from "base-64"
export default {
  data() {
    return {
      base64:[],
      // ======================================
      TEXT: '',
      // 地址必须填写，代表着大模型的版本号！！！！！！！！！！！！！！！！
      httpUrl: "https://spark-api.xf-yun.com/v3.1/chat",
      modelDomain: '', // V1.1-V3.5动态获取，高于以上版本手动指定
      APISecret: 'MDMxYjIzZWI1ZTdlZDE4NTllOTRhYTVk',
      APIKey: '1398f259b3fec19a20e02d86aadb86eb',
      sparkResult: '',
      historyTextList: [], // 历史会话信息，由于最大token12000,可以结合实际使用，进行移出
      tempRes: '', // 临时答复保存
      // =========================================
      goods_words: '',
      socket: null,// 声明全局变量保存 WebSocket 对象
      aiResponse: [],// 声明一个数组保存 AI 的回答
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
      tablist: indexStore.state.list,
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
  onLoad() {
    this.tablist = indexStore.state.list;
    const that = this;
  },
  methods: {
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
    aititle() {
      let aititle = '商品名称为' + this.goods_name + '的商品,' + '他的价格为' + this.goods_price + '元，' + '他的分类是' + this.classlist.label + ',他的交易位置是' + this.address + ',请为这件二手商品生成一段商品描述用于售卖'
      if (this.goods_words) {
        aititle = aititle + '关键词为' + this.goods_words
      }
      this.TEXT = aititle
      this.tempResv = ''
      this.goods_value = ''
      console.log(aititle);
      // const myUrl = this.getWebSocketUrl()
      this.getWebSocketUrl().then((resolvedUrl) => {
        console.log('======================', resolvedUrl);
        const myUrl = resolvedUrl
        console.log('---------------', myUrl);
        // this.startsocket(url)
        this.tempRes = "";
        // this.sparkResult = "";
        let realThis = this;
        this.socketTask = uni.connectSocket({
          //url: encodeURI(encodeURI(myUrl).replace(/\+/g, '%2B')),
          url: myUrl,
          method: 'GET',
          success: res => {
            console.log(res, "ws成功连接...", myUrl)
            realThis.wsLiveFlag = true;
          },
          fail: err => {
            console.log('err', err);
          }
        })
        realThis.socketTask.onError((res) => {
          console.log("连接发生错误，请检查appid是否填写", res)
        })
        console.log(this.socketTask, '==========');
        realThis.socketTask.onOpen((res) => {
          this.historyTextList.push({
            "role": "user",
            "content": this.TEXT
          })
          console.info("wss的onOpen成功执行...", res)
          // 第一帧..........................................
          console.log('open成功...')
          let params = {
            "header": {
              "app_id": '86a192cf',
              "uid": "aef9f963-7"
            },
            "parameter": {
              "chat": {
                "domain": this.modelDomain,
                "temperature": 0.5,
                "max_tokens": 1024
              }
            },
            "payload": {
              "message": {
                "text": this.historyTextList
              }
            }
          };
          console.log("请求的params：" + JSON.stringify(params))
          this.sparkResult = this.sparkResult + "\r\n我：" + this.TEXT + "\r\n"
          this.sparkResult = this.sparkResult + "大模型："
          console.log("发送第一帧...", params)
          realThis.socketTask.send({ // 发送消息，，都用uni的官方版本
            data: JSON.stringify(params),
            success() {
              console.log('第一帧发送成功')
            }
          });
        });
        realThis.socketTask.onMessage((res) => {
          // console.log('收到API返回的内容：', res.data);
          let obj = JSON.parse(res.data)
          // console.log("我打印的"+obj.payload);
          let dataArray = obj.payload.choices.text;
          for (let i = 0; i < dataArray.length; i++) {
            realThis.sparkResult = realThis.sparkResult + dataArray[i].content
            realThis.tempRes = realThis.tempRes + dataArray[i].content
            console.log("我打印的" + realThis.tempRes);
            this.goods_value = realThis.tempRes;
            console.log(this.goods_value);
          }
          // realThis.sparkResult =realThis.sparkResult+ 
          let temp = JSON.parse(res.data)
          console.log("0726", temp.header.code)
          if (temp.header.code !== 0) {
            console.log(`${temp.header.code}:${temp.message}`);
            realThis.socketTask.close({
              success(res) {
                console.log('关闭成功', res)
                realThis.wsLiveFlag = false;
              },
              fail(err) {
                console.log('关闭失败', err)
              }
            })
          }
          if (temp.header.code === 0) {
            if (res.data && temp.header.status === 2) {
              realThis.sparkResult = realThis.sparkResult +
                "\r\n**********************************************"
              this.historyTextList.push({
                "role": "assistant",
                "content": this.tempRes
              })
              /* let dataArray= obj.payload.choices.text;
              for(let i=0;i<dataArray.length;i++){
                realThis.sparkResult =realThis.sparkResult+ dataArray[i].content
              } */
              setTimeout(() => {
                realThis.socketTask.close({
                  success(res) {
                    console.log('关闭成功', res)
                  },
                  fail(err) {
                    // console.log('关闭失败', err)
                  }
                })
              }, 1000)
            }
          }
        })
        // 在这里可以继续处理 resolvedUrl，比如创建 WebSocket 连接等操作
      }).catch((error) => {
        console.error('获取 WebSocket URL 失败:', error);
      });

    },
    // 鉴权
    getWebSocketUrl() {
      console.log(this.httpUrl)
      var httpUrlHost = (this.httpUrl).substring(8, 28);
      var httpUrlPath = (this.httpUrl).substring(28);
      console.log(httpUrlHost)
      console.log(httpUrlPath)
      switch (httpUrlPath) {
        case "/v1.1/chat":
          this.modelDomain = "general";
          break;
        case "/v2.1/chat":
          this.modelDomain = "generalv2";
          break;
        case "/v3.1/chat":
          this.modelDomain = "generalv3";
          break;
        case "/v3.5/chat":
          this.modelDomain = "generalv3.5";
          break;
      }
      console.log(this.modelDomain)


      return new Promise((resolve, reject) => {
        // https://spark-api.xf-yun.com/v1.1/chat  V1.5 domain general
        // https://spark-api.xf-yun.com/v2.1/chat  V2.0 domain generalv2
        var url = "wss://" + httpUrlHost + httpUrlPath;
        var host = "spark-api.xf-yun.com";
        var apiKeyName = "api_key";
        var date = new Date().toGMTString();
        var algorithm = "hmac-sha256";
        var headers = "host date request-line";
        var signatureOrigin = `host: ${host}\ndate: ${date}\nGET ${httpUrlPath} HTTP/1.1`;
        var signatureSha = CryptoJS.HmacSHA256(signatureOrigin, this.APISecret);
        var signature = CryptoJS.enc.Base64.stringify(signatureSha);
        var authorizationOrigin =
          `${apiKeyName}="${this.APIKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;
        var authorization = base64.encode(authorizationOrigin);
        url = `${url}?authorization=${authorization}&date=${encodeURI(date)}&host=${host}`;

        // console.log(url)
        resolve(url); // 主要是返回地址
      });
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
        global.btoa = function (str) {
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

    startsocket(url) {
      const socketTask = uni.connectSocket({
        url: url,
        success(res) {
          console.log('connectSocket success', res);
        }
      });
      socketTask.onOpen(() => {
        console.log('WebSocket连接已打开！');
      });
      setTimeout(() => {
        socketTask.send({
          data: '你好',
          success() {
            console.log('发送成功');
          },
          fail(error) {
            console.error('发送失败，错误信息：', error);
          }

        });
      }, 1000);

      socketTask.onMessage((message) => {
        const messageData = JSON.parse(message.data);
        console.log('Received message data:', messageData);
      });

      // socketTask.onClose((res) => {
      //   console.log('WebSocket closed:', res);
      // });

      socketTask.onError((error) => {
        console.error('WebSocket error:', error);
      });
    },

    async submit() {
      console.log('filesArr',this.filesArr);
      const userid = uni.getStorageSync("userid");
      const shopname = uni.getStorageSync("username");
      const imglst = this.filesArr.map(item => item.url);
      console.log(this.base64);
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
        const res = await addGoods(data)
        console.log(res);
        // uni.request({
        //   url: "http://localhost:3000/addgoods",
        //   method: "POST",
        //   data: data,
        //   success: (res) => {
            console.log(res);
            this.filesArr = []
            this.goods_name = ''
            this.goods_price = ''
            this.classlist = {
              value: "0",
              label: "默认"
            },
              this.goods_value = ''
            this.address = ''
            this.latitude = ''
            this.longitude = ''
            this.goods_words = ''
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


          // }
        // })
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
      // this.base64 = []
      this.filesArr = lists;
      // const that = this
      // this.filesArr.forEach(async item => {
      //   const base = await fileToBase64(item.file)
      //   that.base64.push(base)
      // })
      // this.base64 = await fileToBase64(lists[0].file)
      // console.log("asddasd", this.base64);
    },
    removeimg(index,lists){
      this.base64 = []
      this.filesArr = lists;
      const that = this
      this.filesArr.forEach(async item => {
        const base = await fileToBase64(item.file)
        that.base64.push(base)
      })
      // this.base64 = await fileToBase64(lists[0].file)
      console.log("asddasd", this.base64);
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
  padding-bottom: 40px;
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
      min-width: 200rpx;
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

.aititle {

  display: flex;
  justify-content: center;
  margin: 20rpx;

  .box {
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
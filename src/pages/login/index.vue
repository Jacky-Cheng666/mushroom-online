<template>
  <view class="login-container">
    <image class="logo" src="/static/images/logo@2x.png" alt />
    <text class="title">蘑菇在线</text>
    <image class="login-tips" src="/static/images/login_tips@2x.png" alt />
    <button open-type="getUserInfo" @getuserinfo="getUserInfo" plain class="wx-login-button">
      <image class="wx-login-img" src="/static/images/wx_login@2x.png" alt />
    </button>
    <text @click="toPhoneLogin" class="phone-login">手机号登录</text>
    <text class="bottom-tip">Copyright © 2019 蘑菇在线</text>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import uniRequest from "../../utils/uniRequest";
export default Vue.extend({
  data() {
    return {};
  },
  methods: {
    // 1，选择微信登录
    getUserInfo(e: any) {
      const { errMsg } = e.detail;
      // 如果用户选择拒绝，阻止程序往下走。
      if (errMsg === "getUserInfo:fail auth deny") return;
      // 用户选择允许
      const { nickName: nickname, avatarUrl: avatar } = e.detail.userInfo;
      // console.log(nickname, avatar);
      // 调用微信登录接口，获取临时code
      uni.login({
        provider: "weixin",
        success: async ({ code }) => {
          // 请求后台接口
          const res: any = await uniRequest({
            url: "user/wxlogin",
            data: {
              avatar,
              nickname,
              code
            },
            method: "POST",
            tipName: "微信授权登录..."
          });
          // console.log(res);
          if (res.data.status == 0) {
            uni.showToast({
              title: "微信授权登录成功",
              duration: 1000,
              icon: "none"
            });
            // 保存token到本地localstorage
            uni.setStorageSync("my_token", res.data.token);
            // 跳转到首页
            uni.reLaunch({
              url: "/pages/home/index"
            });
          }
        }
      });
    },
    // 2，手机号登陆
    toPhoneLogin() {
      uni.navigateTo({
        url: "/pages/phone-login/index"
      });
    }
  }
});
</script>

<style lang="less" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .logo {
    margin-top: 180rpx;
    width: 212rpx;
    height: 212rpx;
  }
  .title {
    color: #333333;
    font-size: 24px;
    margin-top: 20rpx;
  }
  .login-tips {
    margin-top: 30rpx;
    height: 34rpx;
    width: 292rpx;
    position: relative;
  }
  .wx-login-button {
    margin-top: 200rpx;
    width: 568rpx;
    height: 98rpx;
    padding: 0;
    border: none;
  }
  .wx-login-img {
    // margin-top:200rpx;
    width: 568rpx;
    height: 98rpx;
  }
  .phone-login {
    margin-top: 40rpx;
    color: #333333;
    font-size: 15px;
  }
  .bottom-tip {
    color: #a8a8a8;
    font-size: 10px;
    position: absolute;
    bottom: 40rpx;
  }
}
.wx-login-container {
  position: relative;
  .wx-login-tip1 {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 450rpx;
    padding-top: 50rpx;
    img {
      width: 198rpx;
      height: 198rpx;
    }
    p {
      color: #bebebe;
      margin-top: 50rpx;
      font-size: 13px;
    }
  }
  .wx-login-tip1-cover {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    height: 500rpx;
    background: rgba(0, 0, 0, 1);
    opacity: 0.16;
  }
}
</style>
<template>
  <div class="my">
    <van-nav-bar 
    title="我的嗨淘" 
    left-arrow 
    @click-right="onClickRight">
      <template #right>
        <img
          class="auto-img my-home"
          src="../assets/images/my-home.png"
          alt=""
        />
      </template>
    </van-nav-bar>

    <div class="my-box">
      <div class="my-user">
        <van-icon class="user-o" name="user-circle-o" />
        <van-uploader class="upload-box" :after-read="uploadBg" />
      </div>
      <div class="nologin" v-show="false">
        <div class="my-login-register">
          <div class="my-login">
            <a>注册</a>
          </div>
          <div class="separator"></div>
          <div class="register" @click="goLogin">登入</div>
        </div>
      </div>
      <div class="my-desc" v-show="true">
        <div class="user-name">
          <van-field
            v-model="accountInfo.nickName"
            placeholder="请输入昵称（8字以下）"
            input-align="center"
            maxlength="8"
          />

          ID:{{accountInfo.phone}}
        </div>
        <div class='user-indurce'>
          <van-field
            v-model="accountInfo.desc"
            placeholder="请输入简介（19字以内）"
            input-align="center"
            maxlength="19"
          />
        </div>
      </div>
    </div>

    <div class="my-order">
      <div class="my-order-title">
        <van-icon class="my-icon" name="orders-o" />
        我的订单
      </div>

      <div class="my-order-look">
        查看我的全部订单
        <van-icon class="my-icon" name="arrow" />
      </div>
    </div>
    <div class="van-grid van-hairline--top">
      <div
        class="van-grid-item"
        style="flex-basis: 25%"
        v-for="(item, index) in menuOptions"
        :key="index"
      >
        <div
          class="van-grid-item__content van-grid-item__content--center van-hairline"
        >
          <img class="auto-img van-grid-img" :src="item.activeIcon" alt="" />
          <span
            class="van-grid-item__text"
            :class="{ active: menueIndex == index }"
            >{{ item.title }}</span
          >
        </div>
      </div>
    </div>

    <div class="my-money">
      <van-icon class="my-icon" name="balance-o" />
      我的资产
    </div>
    <van-tabs v-model="active" route>
      <van-tab title="现金券" to="/Coupon"></van-tab>
      <van-tab title="红包" to="/Coupon"></van-tab>
      <van-tab title="嗨淘余额" to="/Coupon"></van-tab>
      <van-tab title="礼品卡" to="/Coupon"></van-tab>
    </van-tabs>

    <div class="my-footer-box">
      <div class="my-footer" v-for="(item, index) in myFooter" :key="index">
        <img class="auto-img footImg" :src="item.footIcon" alt="" />
        {{ item.title }}
        <van-icon class="footer-icon fr" name="arrow" />
      </div>
    </div>
    <div class="user-phone">
      客服热线400-123-8888 (9:00-18:00)
      <br />
      拨打前请记录您的UID 0
    </div>
  </div>
</template>

<script>
import "../assets/less/my.less";
export default {
  name: "My",
  data() {
    return {
      active: 0,
      //个人信息
      accountInfo: {
        nickName: "南城下了雪",
        phone: "13763904891",
        desc: "这个人很懒，什么都没留下！",
      },
      //当前选择的下标
      menueIndex: 0,
      //我的订单导航
      menuOptions: [
        {
          title: "待付款",
          activeIcon: require("../assets/images/obligation.png"),
        },
        {
          title: "待收货",
          activeIcon: require("../assets/images/wait_receiving.png"),
        },
        {
          title: "待评价",
          activeIcon: require("../assets/images/evaluated.png"),
        },
        {
          title: "待退货",
          activeIcon: require("../assets/images/return_sales.png"),
        },
      ],

      myFooter: [
        {
          title: "售后服务",
          footIcon: require("../assets/images/service.png"),
        },
        {
          title: "意见反馈",
          footIcon: require("../assets/images/feedback.png"),
        },
        {
          title: "收货地址",
          footIcon: require("../assets/images/address.png"),
        },
        {
          title: "退出登入",
          footIcon: require("../assets/images/quit.png"),
        },
        {
          title: "400-123-8888",
          footIcon: require("../assets/images/tel.png"),
        },
      ],

      
    };
  },
  methods: {
    //跳到登入页面
    goLogin() {
      this.$router.push({ name: "Login" });
    },
    onClickRight() {
      this.$router.push({ name: "Home" });
    },

    //上传背景图
    uploadBg(file) {
      //允许文件类型
      let type = ["gif", "png", "jpg", "jpeg"];
      //允许最大文件大小1MB
      let size = 1;
      //判断文件类型
      let fileType = file.file.type.split("/")[1];
      if (type.indexOf(fileType) === -1) {
        this.$toast(`文件类型只支持${type.join(",")}`);
        return;
      }
      //判断文件大小
      let fileSize = file.file.size / 1024 / 1024;
      if (fileSize > size) {
        this.$toast(`文件类型只支持大小不能超过${size}MB`);
        return;
      }

      //处理base64的标记
      let base64 = file.content.replace(/^data:image\/[A-Za-z]+;base64,/, "");
      //
    },
  },
};
</script>


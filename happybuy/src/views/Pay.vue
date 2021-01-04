<template>
  <div class="pay">
    <!-- 头部导航 -->
    <van-nav-bar
      fixed
      left-text="返回"
      title="商品详情"
      left-arrow
      @click-left="goBack"
    />

    <!-- 选择地址 -->
    <div class="pay-box">
      <div class="select-address">
        <div class="select-add">
          <span class="chose-add" @click="showSelectAddressList">
            <van-icon class="add-icon" name="location-o" />
            选择收获地址
          </span>
          <van-icon class="arrow" name="arrow" />
        </div>
        <div class="user-box">
          <div class="user-info">
            <div class="user-name">{{ currentAddress.name }}</div>
            <div class="user-phone">{{ currentAddress.tel }}</div>
            <div class="default-address" v-if="currentAddress.isDefault">
              默认
            </div>
          </div>
          <div class="detail-address">{{ currentAddress.address }}</div>
        </div>
      </div>

      <div>
       
      </div>
    </div>

    <!-- 订单信息 -->

    <!-- 结算按钮 -->
    <div class="btn-box">
      <van-button type="primary" block round color="#1989FA"
        >立即结算</van-button
      >
    </div>
    <!-- 选择地址弹出框 -->
    <van-popup v-model="isOpen" round closeable position="bottom">
      <div class="address-title">选择地址</div>
      <van-address-list
        v-model="chosenAddressId"
        :list="list"
        default-tag-text="默认"
        @add="newAddress"
        @select="selectAddress"
      />
    </van-popup>
  </div>
</template>

<script>
import "../assets/less/pay.less";


export default {
  name: "Pay",
  
  data() {
    return {
      isOpen: false,
      //选择地址的id
      chosenAddressId: "",
      //地址列表
      list: [],
      //选择当前地址
      currentAddress: {},
      //购物袋sids
      sids: [],
      //需要购买的商品的数据
      products: [],
      //商品数量和订单总价
      productInfo: {
        count: 0,
        total: 0,
      },
    };
  },
  created() {
    //截取查询参数
    //截取详细商品id
    this.goodId = this.$route.params.goodId;
     console.log(this.goodId);
     this.pay();
    //提交订单页面查询需要购买商品
    this.getAddressBySids();
    //获取地址列表数据
    this.getAddressData();
  },
  methods: {
    //返回上一级
    goBack() {
      this.$router.go(-1);
    },

    //新增地址
    newAddress() {
      this.$router.push({ name: "NewAddress" });
    },

    //选择地址时触发
    selectAddress(item, index) {
      //选择后关闭
      this.isOpen = false;
      this.currentAddress = item;
    },

    //展示选择地址列表
    showSelectAddressList() {
      this.isOpen = true;
    },

    //获取地址列表数据
    getAddressData() {
      let addressData = JSON.parse(localStorage.getItem(`address`));
        this.list = addressData;
        // console.log(addressData);
        addressData.map((v) => {
            console.log(v);
          //处理数据，把isdefault变为bool值，把地址进行拼接
          v.isDefault = Boolean(v.isDefault);
          //可以删除
          if (v.isDefault) {
            this.chosenAddressId = v.postalCode;
          }
          v.id = v.postalCode;
          v.address = `${v.province}${v.city}${v.county}${v.addressDetail}`;
        });
    },

    //根据sids获取购物袋数据
    getAddressBySids() {
    //   console.log(22);
    },

    //结算订单
    pay() {
      //启动加载轻提示
      this.$toast.loading({
        message: "加载中...",
        //禁止穿透点击
        forbidClick: true,
        //没有时间限制
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "https://api-hmugo-web.itheima.net/api/public/v1/goods/detail",
        params: {
          goods_id: this.goodId,
        },
      })
        .then((result) => {
          //关闭加载轻提示
          this.$toast.clear();
          let newDetailData = result.data.message;
          //在数据里面构建一个商品规格数组
          let rules = [];
          //遍历需要处理的数据
          newDetailData.attrs.map((v) => {
            //在数组里面创建一个对象保存数据
            let r = {};
            // console.log(r);
            //默认2规格第一项激活
            r.ruleIndex = 0;
            //商品规格
            r.newRule = [];
            // 商品规格标题
            r.newRuleTitle = [];
            //去重去空
            if (
              v.attr_vals !== "" &&
              v.attr_value !== "" &&
              v.attr_vals !== v.attr_value
            ) {
              // console.log(v);
              r.newRule.push(v.attr_vals, v.attr_value);
              r.newRuleTitle.push(v.attr_name);
            }
            // console.log(r);
            //去空
            if (r.newRule.length !== 0) {
              // console.log(r);
              rules.push(r);
            }
          });
          //将处理后的商品规格数据放进原始数据里面
          newDetailData.rules = rules;
          // 将更新后的数据放进原始数组里面
          this.detailData = newDetailData;
          console.log(this.detailData);
        })
        .catch((err) => {
          //关闭加载轻提示
          this.$toast.clear();
          //  请求失败输出
        });
    },

    //结算提示
    payBox() {
      this.$dialog
        .confirm({
          title: "确认提交吗？",
          confirmButtonColor: " #ca6511",
        })
        .then(() => {
          //提交订单
          this.pay();
        })
        .catch((err) => {
          this.$toast("你已取消结算!");
        });
    },
  },
};
</script>

<style lang="less" scoped>
</style>
<template>
  <div class='coupon'>
    <!-- 头部导航 -->
    <van-nav-bar
      fixed
      left-text="返回"
      title="我的优惠券"
      left-arrow
      @click-left="goBack"
    />

    <van-coupon-cell
      :coupons="coupons"
      :chosen-coupon="chosenCoupon"
      @click="showList = true"
    />
    <!-- 优惠券列表 -->
      <van-coupon-list
        :coupons="coupons"
        :chosen-coupon="chosenCoupon"
        :disabled-coupons="disabledCoupons"
        @change="onChange"
        @exchange="onExchange"
      />
  </div>
</template>

<script>
const coupon = {
  available:1,
  condition: '无使用门槛\n最多优惠12元',
  reason: '',
  value: 150,
  name: '优惠券名称',
  startAt:  1607592000,
  endAt: 1608992000,
  valueDesc: '10',
  unitDesc: '元',
};
export default {
  name: "coupon",
  state:{

  },
  data() {
    return {
      chosenCoupon: -1,
      coupons: [coupon],
      disabledCoupons: [coupon],
      showList:true
    };
  },
  methods: {
    //返回上一级
    goBack() {
      this.$router.go(-1);
    },

     onChange(index) {
         
      this.showList = false;
      this.chosenCoupon = index;

    },
    onExchange(code) {
      this.coupons.push(coupon);
    },
  },
};
</script>

<style lang="less" scoped>
.coupon{
   /deep/ .van-coupon__content{
        padding: 0px;
    }
    /deep/.van-coupon-list__list--with-bottom{
        height: 530px !important;
    }
}
</style>
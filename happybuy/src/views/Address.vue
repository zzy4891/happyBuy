<template>
  <div class="address my-address">
    <van-nav-bar
      fixed
      left-text="返回"
      title="地址列表"
      left-arrow
      @click-left="goBack"
    />
   
      <!-- v-model="chosenAddressId"可以删除 -->
      <div v-if="list.length > 0">
        <van-address-list
          v-model="chosenAddressId"
          :list="list"
          default-tag-text="默认"
          @add="add"
          @edit="edit"
        />
      </div>
      <div v-else>
        <van-empty description="没有地址数据" />
      </div>
   
  </div>
</template>

<script>

import { Toast } from "vant";
export default {
  name: "Address",
 
  data() {
    return {
      chosenAddressId: "",
      list: [],
    };
  },
  created() {
    this.getAddressData();
  },
  methods: {
    //返回上一级
    goBack() {
      this.$router.go(-1);
    },

    //新增地址
    add() {
      this.$router.push({ name: "NewAddress" });
    },

    //编辑地址
    edit(item) {
    // console.log(item);
      this.$router.push({ name: "NewAddress", query: { id: item.id } });
    },

    //获取地址列表数据
    getAddressData() {
        let addressData = JSON.parse(localStorage.getItem(`address`));
        this.list = addressData;
        console.log(addressData);
       addressData.map((v) => {
            // console.log(v.postalCode);
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
  },
};
</script>

<style lang="less" scoped>
.address {
  padding-top: 46px;

     /deep/ .van-nav-bar__text {
    color: #1989fa;
  }

  /deep/ .van-nav-bar .van-icon {
    color: #1989fa;
  }

  /deep/ .van-button--danger {
    background-color: #1989fa;
    border: 0;
    color: white;
  }

  /deep/ .van-switch--on {
    background-color: #1989fa;
  }

  .van-tag--danger{
   background-color: #1989fa;
 }

 /deep/.van-address-item 
 .van-radio__icon--checked 
 .van-icon{
    background-color: #1989fa;
    border-color: #1989fa;
 }
}
</style> 
<template>
  <div class="new-address">
    <!-- 新增地址头部导航 -->
    <van-nav-bar
      fixed
      left-text="返回"
      :title="id ? '编辑地址' : '新增地址'"
      left-arrow
      @click-left="goBack"
    />

    <!-- 新增地址部分 -->
    <!-- 
            show-postal:展示邮政编码
            show-set-default：设置默认收货地址
            show-delete：设置删除按钮
            show-search-result：设置详细地址搜索结果
            address-info:收货人信息初始值	
            注意：
            此处的areaList不能直接使用，
            需要找到vant里面的 Area 组件中的Area.json文件下的src文件下的
            address-edit文件下的area.js,才是完整数据
            因为里面的data数据必须从外部导入
         -->
    <van-address-edit
      :area-list="areaList"
      show-set-default
      :show-delete="!!id"
      show-search-result
      save-button-text="保存地址"
      @delete="removeAddress"
      :address-info="addressInfo"
      @save="save"
      :area-columns-placeholder="['选择省', '选择市', '请选择区']"
    />
  </div>
</template>

<script>
//导入全国省份地区数据
import areaList from "../assets/js/area";
export default {
  name: "NewAddress",
  data() {
    return {
      //全国所有省份地区数据
      areaList,

      //地址id
      id: "",

      //地址初始值
      addressInfo: {},
    };
  },

  created() {
    //截取查询参数，存在为编辑地址，否则为新增地址，:(注意此处是route，不是router)
    this.id = this.$route.query.id;

    //判断id是否存在，存在则请求数据
    if (this.id) {
      //根据地址id查询地址数据
      this.getAddressDataByAid();
    }
  },

  methods: {
    //返回上一级
    goBack() {
      this.$router.go(-1);
    },

    //保存地址,注意，此处的content表示你输入的地址值
    save(content) {
      console.log(content);
      //复制地址content
      let addressInfo = Object.assign({}, content);
      //   删除country属性
      delete addressInfo.country;
      //将是否默认参数转化为0和1
      addressInfo.isDefault = Number(addressInfo.isDefault);

      //发起新增地址请求
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 300,
      });

      if (!this.id) {
        //新增地址
        this.address(addressInfo, "/addAddress");
      } else {
        
        //初始地址
        let isModify = false;
        console.log(this.addressInfo);
        for (let key in this.addressInfo) {
          if (content[key] != this.addressInfo[key]) {
            isModify = true;
          }
        }
        if (isModify) {
          //发起请求
          this.address(addressInfo, "/editAddress");
        } else {
          return this.$toast("请修改地址信息");
        }
      }


      //把存储内容放进一个对象
      let addDate = {
        name: content.name,
        tel: content.tel,
        province: content.province,
        city: content.city,
        county: content.county,
        addressDetail: content.addressDetail,
        addressInfo:
          content.province +
          content.city +
          content.county +
          content.addressDetail,
        postalCode: content.areaCode,
        id: content.areaCode,
        isDefault:content.isDefault,
      };
      this.default = content.isDefault;
      this.addDate = addDate;
      console.log(this.addDate);
      this.id = content.areaCode;
      console.log(this.id);
      //存储本地地址
      this.finalItemDetail();
      this.$toast.clear();
    },

    //新增地址与编辑地址
    address(addressInfo, url) {
      // console.log(addressInfo);
      // console.log(url);
      this.axios({
        method: "POST",
        url,
        data: addressInfo,
      })
        .then((result) => {
          this.$toast.clear();
          this.$router.push({ name: "Address" });
          this.$toast("编辑地址成功");
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    //根据地址id查询地址数据
    getAddressDataByAid() {
      let addressData = JSON.parse(localStorage.getItem(`address`));
      let data = addressData[0];
      data.isDefault = Boolean(data.isDefault);
      this.addressInfo = data;
    },

    //移除地址
    removeAddress() {
      let addressData = JSON.parse(localStorage.getItem(`address`));
      // console.log(addressData);
      let deleteData = [];
      addressData.map((v) =>{
        deleteData.push(v);
      })
      console.log(deleteData);
      let newDeleteData = []
      deleteData.map((v1,i) =>{
        deleteData.splice(i,1);
        newDeleteData.push(v1);
      })
      console.log(newDeleteData);
      
    
    },

    //保存本地地址
    finalItemDetail() {
      //从localStorage中获取所用的评论
      let list = JSON.parse(localStorage.getItem("address") || "{}");
      if (this.default) list.unshift(this.addDate);
      else if (this.addDate != {}) list.push(this.addDate);
      //重新保存最新的地址
      localStorage.setItem("address", JSON.stringify(list));
    },
  },
};
</script>

<style lang="less" scoped>
.new-address {
  padding-top: 46px;
  padding-bottom: 145px;

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
 

 
}
</style>
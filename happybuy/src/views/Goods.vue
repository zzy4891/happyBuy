<template>
  <div class="goods">
    <van-nav-bar
      title="商品列表"
      left-text="返回"
      fixed
      left-arrow
      @click-left="goBack"
    />
    
     <div class="goods-box" v-if='this.goodsData.length > 0'>
         <div class="goods-info" 
         v-for='(item,index) in goodsData' 
         :key='index'
         @click="goDetail(item,item.goods_id)"
         >
             <img class="auto-img" :src="item.goods_small_logo" alt="">
            <div class="goods-info-price">
                ￥{{item.goods_price | decimal}}
            </div>
            <div class="goods-info-title">
                {{item.goods_name}}
            </div>
         </div>
         
     </div>
     <div v-else>
         <van-empty description="没有您要的宝贝哦！请先看看其它的吧。" />
     </div>
  </div>
</template>

<script>
export default {
  name: "Goods",
  //接收父组件传来的数据

  data() {
    return {
        //商品cid
        cid:'',
        //保存搜索到的数据
        goodsData:[],
        //没有数据时显示为空

    };
  },
created() {
    //截取cid
    this.cid = this.$route.params.cid;
    // console.log(this.cid);
    this.getGoodData();

},
  methods: {
    //返回上一级
    goBack() {
      this.$router.go(-1);
    },

    //获取商品列表数据
    getGoodData(){
         this.$toast.loading({
        message: "加载中...",
        //禁止穿透点击
        forbidClick: true,
        //没有时间限制
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "https://api-hmugo-web.itheima.net/api/public/v1/goods/search",
        params:{
          cid:this.cid
        }
      })
        .then((result) => {
          //关闭加载轻提示
          this.$toast.clear();
        //   console.log(result.data.message.goods);
          let newGoodData = result.data.message.goods;
          let dealData = []
          newGoodData.map(v =>{
              if(!v.goods_small_logo == '' && v.goods_price !== 0){
                //  console.log(v);
                dealData.push(v)
              }
            //   console.log(v);
          })
        //   console.log("dealData==>",dealData);
          this.goodsData = dealData;
            
        })
        .catch((err) => {
          //关闭加载轻提示
          this.$toast.clear();
          //  请求失败输出
        });

       
    } ,
    goDetail(item){
        console.log(item.goods_id); 
        let goodId = item.goods_id
        this.$router.push({name:'Detail',params:{goodId}})
    }
  },
};
</script>

<style lang="less" scoped>
.goods{
    padding-top: 46px;
    
    .goods-box{
        height: 100%;
        background-color: whitesmoke;
        padding: 10px;
        padding-bottom: 0px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }

    .goods-info{
        width: 48.5%;
        height:265px;
        // border: 1px solid #ccc;
        margin-bottom: 10px;
        background-color: white;
    
    }

    .goods-info-price{
        font-size: 16px;
        color: red;
        padding:10px 10px 0px 10px;
    }

    .goods-info-title{
        height: 30px;
        padding: 10px;
        line-height: 19px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }
}
</style>
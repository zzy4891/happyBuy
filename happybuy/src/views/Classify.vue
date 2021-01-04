<template>
  <div class="classify">
    <form action="/">
      <van-search
        v-model="menueValue"
        shape="round"
        show-action
        placeholder="请输入搜索关键词"
      />
    </form>
    <div class="classify-menu">
      <div class="clearfix">
        <div class="menu-slider fl">
          <van-sidebar v-model="isActive">
            <van-sidebar-item
              @click="onChange(item)"
              :title="item.cat_name"
              :class="{'active':isActive == index}"
              v-for="(item, index) in classifyData"
              :key="index"
            />
          </van-sidebar>
        </div>
      </div>

      <div class="clearfix">
        <div class="menu-right-nav fr">
          <div class="right-content" 
          v-for="(item1, index1) in xuanData "
              :key="index1">
              <div class="right-nav-title">{{item1.cat_name}}</div>
              <div class="right-small-box">
                <div class="right-img" v-for="(item2,index2) in item1.children" :key='index2'>
                    <div class="right-detail-info" @click='getDetail(item2,item2.cat_id)'>
                      <img class="auto-img" :src="item2.cat_icon" alt="">
                      <div class="right-detail-title">{{item2.cat_name}}</div>
                    </div>
                    <div></div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/classify.less";
export default {
  name: "Classify",
  data() {
    return {
      //搜索框
      menueValue: "",
      //侧边导航激活
      isActive: 0,
      //商品分类数据
      classifyData:[],
      //渲染的数据
      xuanData:'',
      //商品列表数据
      newGoodData:[]
    };
  },
  created() {
    this.getClassifyData();
    
  },
  methods: {
    onChange(index) {
      Notify({ type: "primary", message: index });
    },


    //获取商品分类数据
    getClassifyData(){
      //启动加载轻提示
      this.$toast.loading({
        message: "加载中...",
        //禁止穿透点击
        forbidClick: true,
        //没有时间限制
        duration: 0,
        //商品列表数据
        
      });

      this.axios({
        method: "GET",
        url: "https://api-hmugo-web.itheima.net/api/public/v1/categories",
      })
        .then((result) => {
          //关闭加载轻提示
          this.$toast.clear();
          //处理后的数据
          let dealData = result.data.message.slice(0,result.data.message.length-1)
          this.classifyData = dealData;
          // console.log(this.classifyData);
          // console.log(result);
          // console.log(this.classifyData);
          this.classifyData.map(v => {
             this.xuanData = v.children;
            // console.log(v.children);
            
          })

        })
        .catch((err) => {
          //关闭加载轻提示
          this.$toast.clear();
          //  请求失败输出
        });
    },

    //左侧菜单切换
    onChange(item){
      this.xuanData=item.children;
      // console.log(item);
      // console.log(this.xuanData)
    },

    //获取商品详细信息
    getDetail(item2){
      console.log(item2.cat_id);
      let cid = item2.cat_id;

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
        url: "https://api-hmugo-web.itheima.net/api/public/v1/goods/search",
        params:{
          cid:cid
        }
      })
        .then((result) => {
          //关闭加载轻提示
          this.$toast.clear();
          console.log(result);
          this.$router.push({name:'Goods',params:{cid}});
        })
        .catch((err) => {
          //关闭加载轻提示
          this.$toast.clear();
          //  请求失败输出
        });
    }
  },
};
</script>

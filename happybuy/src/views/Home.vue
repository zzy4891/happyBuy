<template>
  <div class="home">
    <div class="clearfix home-box">
      <div class="home-classify" @click="goMenue">
        <img
          class="auto-img"
          src="../assets/images/classify-active.png"
          alt=""
        />
      </div>
      <van-search
        shape="round"
        background="#FFFFFF"
        placeholder="请输入搜索关键词"
        class="home-search"
      />
      <div class="home-goback" @click="goLogin">登入</div>
    </div>
    <!-- 轮播图部分 -->
    <div class="home-banner">
      <van-swipe :autoplay="3000" style="height: auto">
        <van-swipe-item v-for="(image, index) in images" :key="index">
          <img class="auto-img" v-lazy="image.image_src" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <!-- 导航栏部分 -->
    <div class="home-nav">
      <van-grid clickable>
        <van-grid-item
          :icon="item.image_src"
          v-for="(item, index) in classifyNav"
          to="/main/classify"
          :key="index"
        />
      </van-grid>
    </div>
    <!-- 楼层部分 -->
    <div class="home-floor">
     
        <div class="home-floor" v-for="(item,index) in floorData" :key='index'>
         
            <van-divider :style="{ color: '#71BAFE', borderColor: '#71BAFE', padding: '0 16px' }">{{item.floor_title.name}}</van-divider>
         
          <img class='auto-img floor-img' :src="item.floor_title.image_src" alt="">
          <div class="floor-info">
              <div class="clearfix">
                <div class='floor-info-box' 
                v-for="(list,i) in item.product_list" :key='i'
                :class="i == 0 ?'active':''"
                >
                  <img class='auto-img floor-info-small_img' :src="list.image_src" alt="">
                </div>
              </div>
          </div>
        </div>
      
    </div> 
    <div class="home-footer">
      <img class='auto-img' src="../assets/images/bag.png" alt="">
    </div>
  </div>
</template>

<script>
import "../assets/less/home.less";
export default {
  name: "Home",
  data() {
    return {
      //获取轮播图数据
      images: [],
      //导航栏数据
      classifyNav: [],
      //获取楼层数据
      floorData:[],
      //楼层数据
      indexList: [],
     
    };
  },
  created() {
    this.getBanner();
    this.getClassifyNav();
    this.getFloorData();
  },
  methods: {
    //跳转到登入页面
    goLogin(){
      this.$router.push({name:'Login'})
    },
    //跳转到菜单页面
    goMenue(){
      this.$router.push({name:'Classify'})
    },
    //轮播图数据请求
    getBanner() {
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
        url: "https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata",
      })
        .then((result) => {
          //关闭加载轻提示
          this.$toast.clear();
          this.images = result.data.message;
          // console.log(this.images);
          // console.log(result);
        })
        .catch((err) => {
          //关闭加载轻提示
          this.$toast.clear();
          //  请求失败输出
        });
    },

    //获取分类导航栏数据
    getClassifyNav() {
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
        url: "https://api-hmugo-web.itheima.net/api/public/v1/home/catitems",
      })
        .then((result) => {
          //关闭加载轻提示
          this.$toast.clear();
          this.classifyNav = result.data.message;
          // console.log(this.images);
          // console.log(result);
        })
        .catch((err) => {
          //关闭加载轻提示
          this.$toast.clear();
          //  请求失败输出
        });
    },

    //获取楼层数据
    getFloorData(){
      this.$toast.loading({
        message: "加载中...",
        //禁止穿透点击
        forbidClick: true,
        //没有时间限制
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "https://api-hmugo-web.itheima.net/api/public/v1/home/floordata",
      })
        .then((result) => {
          //关闭加载轻提示
          this.$toast.clear();
          this.floorData = result.data.message;
          // console.log(result);
          // console.log(result.data.message);
          let indexList  = [];
          this.floorData.map((v,i)=>{
          //  console.log(v.floor_title.name);
           
           indexList.push(v.floor_title.name);
          //  console.log(indexList);
          })
          this.indexList = indexList;
          
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


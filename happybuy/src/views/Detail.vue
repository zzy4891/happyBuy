<template>
  <div class="detail">
    <van-nav-bar
      title="商品详情"
      left-text="返回"
      fixed
      left-arrow
      @click-left="goBack"
    />
    <div class="detail-box">
      <div class="detail-bg">
        <van-swipe
          class="my-swipe"
          @change="onChange"
          height="auto"
          indicator-color="white"
        >
          <van-swipe-item v-for="(item, index) in detailData.pics" :key="index">
            <img class="auto-img" :src="item.pics_big" alt="" />
          </van-swipe-item>
          <template #indicator>
            <div class="custom-indicator">{{ current + 1 }}/5</div>
          </template>
        </van-swipe>
      </div>
      <!-- v-html解析json数据中的html标签 -->
      <div class="detail-banner">
        <van-goods-action>
          <van-goods-action-icon
          :badge="carCount == 0 ? '' : carCount"
          :color="carCount > 0 ? '#7232DD' : '#646566'"
          icon="cart-o" 
          @click="toggleShopbag"
          text="购物车" />

          <van-goods-action-icon
            icon="like"
            :text="isLike ? '已收藏' : '收藏'"
            :color="isLike ? '#F01126' : '#757677'"
            @click="toggleProduct()"
          />

          <van-goods-action-button 
          type="warning" 
          text="加入购物车" 
          @click="addShopcar(false)"
          />
          <van-goods-action-button 
          @click="buy(true)"
          type="danger" 
          text="立即购买" />
        </van-goods-action>
      </div>
      <div class="detail-info">
        <div class="detail-info-bg">
          <div class="detail-info-price">
            <span class="symbol">￥</span>
            {{ detailData.goods_price | decimal }}
            <div class="fr look-detail" @click="goRules(1)">查看详情</div>
          </div>
          <div class="detail-info-title">
            {{ detailData.goods_name }}
          </div>
          <div class="detail-info-quality" @click="goRules(2)">
            <div class="quality-title">选择参数：</div>
            
            <div class="chosedata">{{chooseData}}</div>
            <van-icon class="fr detail-icon" name="arrow" />
          </div>
          <div class="detail-add-time">
            上架时间：{{ date | format("yyyy-MM-dd hh:mm:ss") }}
          </div>
        </div>
      </div>

      <div class="detail-rule">
        <!-- 弹出层 -->
        <van-popup
          class="register-box"
          v-model="isShow"
          round
          position="bottom"
          :style="{ height: '93%' }"
        >
          <div class="popup-info" v-if="isContent">
            <div class="goods-rule">产品参数</div>
            <div
              class="popup-title"
              v-for="(list, i) in detailData.attrs"
              :key="i"
            >
              <div class="popup-title-name fl">{{ list.attr_name }}</div>
              <div class="popup-title-contain fr">
                {{ list.attr_vals }} / {{ list.attr_value }}
              </div>
            </div>

            <div class="complete">
              <van-button
                class="complete-btn"
                round
                color="linear-gradient(to right, #ff6034, #ee0a24)"
                @click="exit"
              >
                知道了
              </van-button>
            </div>
          </div>
          <div class="popup-rules" v-else>
            <div class="rule-list">
              <div class="rule-img">
                <img
                  class="auto-img"
                  :src="detailData.goods_small_logo"
                  alt=""
                />
              </div>
              <div class="rule-contain">
                <div class="rule-price">
                  ￥ {{ detailData.goods_price | decimal }}
                  <van-icon
                    class="fr close-icon"
                    @click="closeBtn"
                    name="cross"
                  />
                </div>
                <div class="rule-name">
                  
                  {{ detailData.goods_name }}
                </div>
                <div class="rule-size">请选择 颜色分类 商品规格</div>
              </div>
            </div>
            <!-- 分割线 -->
            <van-divider></van-divider>
            <div
              class="rule-color"
              v-for="(v, i1) in detailData.rules"
              :key="i1"
            >
              <p>{{ v.newRuleTitle[0] }}</p>
              <div class="choose-color fl">
                <div
                  :class="['rule', { active: index3 == v.ruleIndex }]"
                  v-for="(item3, index3) in v.newRule"
                  :key="index3"
                  @click="getInfo(v, index3)"
                >
                  {{ item3 }}
                </div>
              </div>
            </div>

            <div class="buy-num">
              <span class="buy-title">购买数量</span>
              <div class="step">
                <van-stepper v-model="product.count" />
              </div>
            </div>
            <van-goods-action>
              <van-goods-action-button 
              type="warning" 
              text="加入购物车" 
              @click="addShopcar(false)"
              />
              <van-goods-action-button
              @click="buy(true)"
              type="danger" 
              text="立即购买" />
            </van-goods-action>
          </div>
        </van-popup>
      </div>
      <div v-html="detailData.goods_introduce"></div>
    </div>
  </div>
</template>

<script>
import "../assets/less/detail.less";
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "Detail",
  data() {
    return {
      //商品详细id
      goodId: "",
      //更新后的商品数据
      detailData: {},
      //轮播图指示器下标
      current: 0,
      //上架时间
      date: new Date(),
      //是否显示弹出框
      isShow: false,
      //弹出框内容切换
      isContent: false,
      //是否收藏商品
      isLike: false,
      //商品数量
      product:{
        count:1
      },
      //选择参数
      chooseData:'',
      // 购物车数量
      carCount:0,
      //本地保存购物袋数据
      shopCarData:[]
    };
  },
  created() {
    //截取详细商品id
    this.goodId = this.$route.params.goodId;
    //   console.log(this.goodId);
    this.getDetail();
    //是否收藏
    this.getLikes();

   
  },
  computed: {
    shopList(){
      return this.$store.state.storeLs
    },

     ...mapGetters(["cartGoodIds"])

  },
  methods: {
    //返回上一级
    goBack() {
      this.$router.go(-1);
    },
    //获取商品详情数据
    getDetail() {
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
          // console.log(this.detailData);
        })
        .catch((err) => {
          //关闭加载轻提示
          this.$toast.clear();
          //  请求失败输出
        });
    },

    //轮播图下标切换
    onChange(index) {
      this.current = index;
    },

    //显示弹出层
    goRules(id) {
      if (id == 1) {
        this.isContent = true;
      } else if (id == 2) {
        this.isContent = false;
      }
      this.isShow = true;
    },

    exit() {
      //关闭示弹出层
      this.isShow = false;
    },

    //关闭价格弹窗
    closeBtn() {
      this.isShow = false;
    },

    //商品规格切换
    getInfo(v, index3) {
      v.ruleIndex = index3;
      console.log(v);
      // console.log(index3);
    },

    //收藏商品
    toggleProduct() {
      this.isLike = !this.isLike;
      // 设置本地存储数据
      this.$store.commit("add",Number(this.goodId));
     
      
      if(this.isLike == true){
        this.$toast("收藏成功")
      }else{
        this.$toast("已取消收藏")
        let b = JSON.parse(localStorage.getItem('list'));
     
        
      }

      
    },

    //是否收藏商品（取消后，未能删除本地存储）
    getLikes(){
      //获取本地存储数据
      var b = JSON.parse(localStorage.getItem('list'));
      var a = JSON.parse(localStorage.getItem(`addshop${this.goodId}`));
     console.log(a);
    //  console.log(b);
      b.map((v,i) => {
        if(v == this.goodId){
          this.isLike = true;
        }
      })

      //加入购物车
      if(a.goods_id == this.goodId){
         this.carCount = a.carCount+1;
      }
    },

    //加入购物车
    addShopcar(isBuy){
      // console.log(this.detailData);
      //关闭示弹出层
      this.isShow = false;
      this.$toast('加入购物车成功');
      let data = {
        goods_id: this.goodId,
        count: this.product.count,
        carCount:this.carCount,

      }
      //把商品规格放进一个数组里面
      let rs = [];
      this.detailData.rules.map(v =>{
        // console.log(v.newRule);
        rs.push(v.newRule[v.ruleIndex]);
      });
      data.rule = rs.join("/");
      this.chooseData = rs.join("/");
      if(!isBuy){
        this.$toast('加入购物车成功');
        this.carCount++;
      }else{
        //立即购买
        this.$toast('正在结算...');
        this.$router.push({name: "Pay"});
      }
      
      this.shopCarData = data;
      //将购物车数据存储在本地
      localStorage.setItem(`addshop${this.goodId}`, JSON.stringify(this.shopCarData))
      
    },

    //立即购买
    buy(isBuy) {
      this.addShopcar(isBuy);
    },
    
    //点击购物袋跳转
    toggleShopbag() {
      //
      this.$router.push({ name: "Shopcar" });
    },


    
  },
};
</script>


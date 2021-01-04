import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  //登入路由
  {
    path:'/login',
    name:'Login',
    component:() => import('../views/Login.vue')
  },
  // 主页路由
  {
    path:'/main',
    name:'Main',
    component:() => import('../views/Main.vue'),
    children:[
      {
        path:'home',
        name:'Home',
        component:() => import('../views/Home.vue')
      },
      {
        path:'classify',
        name:'Classify',
        component:() => import('../views/Classify.vue')
      },
      {
        path:'shopcar',
        name:'Shopcar',
        component:() => import('../views/Shopcar.vue')
      },
      {
        path:'my',
        name:'My',
        component:() => import('../views/My.vue')
      },
    ]
  },
  //优惠券
  {
    path:'/coupon',
    name:'Coupon',
    component:() => import('../views/Coupon.vue')
  },
  //商品列表
  {
    path:'/goods/:cid',
    name:'Goods',
    component:() => import('../views/Goods.vue')
  },
  //商品列表
  {
    path:'/detail/:goodId',
    name:'Detail',
    component:() => import('../views/Detail.vue')
  },
  //订单页面
  {
    path:'/order/:goodId',
    name:'Order',
    component:() => import('../views/Order.vue')
  },
  //支付页面
  {
    path:'/pay/:goodId',
    name:'Pay',
    component:() => import('../views/Pay.vue')
  },
  //新增地址页面
  {
    path:'/newaddress',
    name:'NewAddress',
    component:() => import('../views/NewAddress.vue')
  },
  //查看地址页面
  {
    path:'/address',
    name:'Address',
    component:() => import('../views/Address.vue')
  },
  // 重定向
  {
    path:'*',
    redirect:{
      name:'Home'
    }
  }
]

const router = new VueRouter({

  routes
})

export default router

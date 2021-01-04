import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//导入vant的组件
import { 
Button,
Icon,
NavBar,
Form,
Field,
Popup,
Toast,
Tabbar, 
TabbarItem,
Search,
Swipe, 
SwipeItem,
Lazyload,
Tab, 
Tabs,
Grid, 
GridItem,
IndexBar, 
IndexAnchor,
Cell,
Divider,
Uploader,
CouponCell, 
CouponList,
Sidebar, 
SidebarItem,
Empty,
GoodsAction, 
GoodsActionIcon, 
GoodsActionButton,
Sku ,
Stepper ,
AddressList ,
AddressEdit ,
} from 'vant'

//导入rem适配文件lib-flexible.js
import 'lib-flexible/flexible'

//导入axios和vue-axios
import axios from 'axios'
import VueAxios from 'vue-axios'


// 配置请求(接口)基础路径
axios.defaults.baseURL = ' https://api-hmugo-web.itheima.net/api/public/v1/'


Vue.config.productionTip = false

// 注册vant组件
Vue
.use(Button)
.use(Icon)
.use(NavBar)
.use(Form)
.use(Field)
.use(Popup)
.use(Toast)
.use(Tabbar)
.use(TabbarItem)
.use(Search)
.use(Swipe)
.use(SwipeItem)
.use(Lazyload)
.use(Tab)
.use(Tabs)
.use(Grid)
.use(GridItem)
.use(IndexBar)
.use(IndexAnchor)
.use(Cell)
.use(Divider)
.use(Uploader)
.use(CouponCell)
.use(CouponList)
.use(Sidebar)
.use(SidebarItem)
.use(Empty)
.use(GoodsAction)
.use(GoodsActionButton)
.use(GoodsActionIcon)
.use(Sku)
.use(Stepper)
.use(AddressEdit)
.use(AddressList)
// 注册axios和vue-axios
Vue.use(VueAxios, axios)


//全局过滤器（过滤商品价格,保留小数）
Vue.filter('decimal', (v, n = 2) => {
  //将字符串转化为数字
  v = Number(v)
  return v.toFixed(n);
})


//格式化日期
Vue.filter('format', function (value, arg) {
  function dateFormat(date, format) {
    if (typeof date === 'string') {
      var mts = date.match(/(\/Date\((\d+)\)\/)/);
      // 
      if (mts && mts.length >= 3) {
        date = parseInt(mts[2]);
      }
    }
    date = new Date(date);
    // 
    if (!date || date.toUTCString() == 'Invalid Date') {
      return '';
    }
    var map = {
      'M': date.getMonth() + 1, //月
      'd': date.getDate(),      //日
      'h': date.getHours(),     //时
      'm': date.getMinutes(),   //分
      's': date.getSeconds(),   //秒
      'q': Math.floor(date.getMonth() + 3 / 3),  //季度
      'S': date.getMilliseconds(),  //毫秒
    };
    format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
      var v = map[t];
      if (v != undefined) {
        if (all.length > 1) {
          v = '0' + v;
          v = v.substr(v.length - 2);
        }
        return v;
      } else if (t === 'y') {
        return (date.getFullYear() + '').substr(4 - all.length);
      }
      return all;
    });
    return format;
  }
  return dateFormat(value, arg);
})


//axios拦截器，在请求之前进行拦截
axios.interceptors.request.use(config => {
  //处理POST请求参数
  if (config.method == 'post') {
    //序列化post请求（也就是appkey）参数
    let paramsString = '';
    for (let key in config.data) {
      paramsString += `${key}=${config.data[key]}&`;
    }
    //重新赋值
    config.data = paramsString.slice(0, -1);
    // 
    //  
  }
  //必须返回config
  return config;
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

<template>
  <div class="login">
    <div class="login-nav">
      <van-nav-bar 
      title="登入" 
      right-text="注册" 
      @click-right="toggleRegisterBox"
      @click-left="goBack"
      left-arrow 
      fixed />
    </div>
    <div class="login-bg">
      <img class='auto-img logo-img' src="../assets/images/logo-bg3.png" alt="">
    </div>
    <!-- 登入部分 -->
    <div class="login-info-box">
       
      <van-form>
        <van-field
          v-model="userInfo.phone"
          name="手机号"
          label="手机号"
          maxlength="11"
          placeholder="手机号"
        />
        <van-field
          v-model="userInfo.password"
          name="密码"
          label="密码"
          placeholder="密码"
          :type="isRegisterPassword ? 'password' : 'text'"
          :right-icon="isRegisterPassword ? 'closed-eye' : 'eye-o'"
          @click-right-icon="togglePasswordType"
        />
        <div class="forget fr">
          <span>忘记密码</span>
        </div>
        <div style="margin: 16px">
          <van-button round block type="info" 
          native-type="submit"  
          color="#22A7F2"
          @click='login()'
          >
            登入
          </van-button>
        </div>
      </van-form>
      
      <div class='login-type'>
         <img class='auto-img' src="../assets/images/phone.png" alt="">
         <img class='auto-img' src="../assets/images/QQ.png" alt="">
         <img class='auto-img' src="../assets/images/weixin.png" alt="">
      </div>
        <!-- 注册弹出层 -->
       <van-popup
        class="register-box"
        v-model="isShow"
        position="bottom"
        :style="{ height: '45%' }"
        closeable
      >
        <div class="register-title">注册</div>
        <van-form>
          <van-field
            v-model="userRegisterInfo.phone"
            name="手机号"
            label="手机号"
            maxlength="11"
            placeholder="请输入11位手机号"
            autocomplete="off"
          />

          <van-field
            v-model="userRegisterInfo.password"
            :type="isRegisterPassword ? 'password' : 'text'"
            name="密码"
            label="密码"
            placeholder="支持字母开头数字_组合(6-16位)"
            :right-icon="isRegisterPassword ? 'closed-eye' : 'eye-o'"
            autocomplete="off"
            @click-right-icon="togglePasswordType"
          />

          <van-field
            v-model="userRegisterInfo.nickName"
            name="昵称"
            label="昵称"
            placeholder="支持字母数字_汉字组合(1-10位)"
            autocomplete="off"
          />

          <div class="commit-btn register-btn">
            <van-button round block color="#22A7F2" @click='register'>
              注册
            </van-button>
          </div>
        </van-form>
      </van-popup>

    </div>
  </div>
</template>

<script>
import "../assets/less/login.less";
//导入表单验证js(注意：到处有名函数必须+{}解构)
import { validForm } from "../assets/js/vaildForm";
export default {
  name: "Login",
  data() {
    return {
    //用户登入信息
      userInfo: {
        phone: "",
        password: "",
      },
      //用户注册信息
      userRegisterInfo: {
        phone: "",
        password: "", 
        nickName: "",
      },
      //切换注册密码类型
      isRegisterPassword: true,
      //是否显示注册框
      isShow: false,
    };
  },
 
  methods: {
    //切换注册框（弹出层）
    toggleRegisterBox() {
      this.isShow = true;
    },
    //返回页面
    goBack(){
      this.$router.go(-1);
    },
    //切换密码框类型 (睁眼、闭眼)
    togglePasswordType() {
      this.isRegisterPassword = !this.isRegisterPassword;
    },

    //注册验证
    register() {
      //构造表单验证信息
      //
      //获取注册信息userRegisterInfo的键名
      let keys = Object.keys(this.userRegisterInfo);
      //

      let o = {
        phone: {
          // 注意此处的值跟正则表达式不需要用双引号
          value: this.userRegisterInfo.phone,
          errorMsg: "号码格式不正确",
          reg: /^1[1-8]\d{9}$/,
        },
        password: {
          value: this.userRegisterInfo.password,
          errorMsg: "密码格式不正确",
          reg: /^[A-Za-z]\w{5,15}$/,
        },
        nickName: {
          value: this.userRegisterInfo.nickName,
          errorMsg: "昵称格式不正确",
          reg: /^[\w\u4e00-\u9fa5]{1,10}$/,
        },
      }; 
      let isPass = validForm.valid(o);
      //请求数据
      if (isPass) {
        //如果通过，则发起请求
        //复制用户注册信息,assign表示合并
        let userInfo = Object.assign({}, this.userRegisterInfo);
        // userInfo.appkey = this.appkey;
        // console.log(appkey);

        //启动加载轻提示
        this.$toast.loading({
          message: "加载中...",
          //禁止穿透点击
          forbidClick: true,
          //没有时间限制
          duration: 0,
        });

        this.axios({
          method: "POST",
          url: "user/register",
          //  POST请求参数,Object
          // data:paramsString,
          data: userInfo,
        })
          .then((result) => {
            //关闭加载轻提示
            this.$toast.clear();
            console.log(result);
            this.$toast('注册成功');
            this.isShow = false;
          })
          .catch((err) => {
            //关闭加载轻提示
            this.$toast.clear();
            //  请求失败输出
          });
        //
      }
      validForm.valid(o);
    },

    //登入验证
    login() {
      let o = {
        phone: {
          // 注意此处的值跟正则表达式不需要用双引号
          value: this.userInfo.phone,
          errorMsg: "号码格式不正确",
          reg: /^1[1-8]\d{9}$/,
        },
        password: {
          value: this.userInfo.password,
          errorMsg: "密码格式不正确",
          reg: /^[A-Za-z]\w{5,15}$/,
        },
      };

      let isPass = validForm.valid(o);
      if (isPass) {
        //发起登入请求

        //复制用户注册信息,assign表示合并
        let userInfo = Object.assign({}, this.userInfo);
        // userInfo.appkey = this.appkey;
        //

        //启动加载轻提示
        this.$toast.loading({
          message: "加载中...",
          //禁止穿透点击
          forbidClick: true,
          //没有时间限制
          duration: 0,
        });

        this.axios({
          method: "POST",
          url: "home/swiperdata",
          //  POST请求参数,Object
          // data:paramsString,
          data: userInfo,
        })
          .then((result) => {
            //关闭加载轻提示
            this.$toast.clear();
            //请求成功输出
            console.log(result);

            
              // //登入成功，保存token
              localStorage.setItem("_tk", result.data.token);
              
              this.$toast('登入成功');
              //其他操作(如跳转到首页等)
              this.$router.push({ name: "Home" });
          })
          .catch((err) => {
            //关闭加载轻提示
            this.$toast.clear();
            //  请求失败输出
          });
        //
      }
    },

  },
};
</script>

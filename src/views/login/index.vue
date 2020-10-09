<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">五阿哥后台管理系统</h3>
      </div>
      <el-form-item prop="loginName">
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>
        <el-input
          ref="loginName"
          v-model.trim="loginForm.loginName"
          placeholder="用户名"
          name="loginName"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"/>
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model.trim="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
        </span>
      </el-form-item>
      <div class="captchaItem" v-if="captchashow">
        <el-form-item prop="captcha" class="captcha">
          <span class="svg-container">
             <svg-icon icon-class="captcha"/>
          </span>
          <el-input
            ref="captcha"
            v-model="loginForm.captcha"
            type="text"
            placeholder="验证码"
            name="captcha"
            tabindex="3"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>
        <div class="captchaImg">
          <img :src="imgurl" @click="reflash" :title="altmsg">
        </div>
      </div>
      <div class="rememberMeDiv">    
        <el-checkbox v-model="loginForm.rememberMe" class="rememberMe"  label="记住我" name="rememberMe"></el-checkbox>
        <div v-if="showMode">
          <span style="color:red;font-size:0.12rem;">演示模式</span>
          <span style="color:red;font-size:0.12rem;">账号：test</span>
          <span style="color:red;font-size:0.12rem;">密码:123456</span>
        </div>
      </div> 
      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >登录</el-button>
    </el-form>
  </div>
</template>

<script>

import { getSysLogInConfig } from "@/api/systemConfig";

export default {
  name: "Login",
  data() {

    const validateName = (rule, value, callback) => {
          console.log(value.length)
      if (value === '' || value === undefined) {
            callback(new Error('登录名不能为空'));
      }
      if (value.length > 0 && value.length <= 20) {
         callback();
      } else {
        
        callback(new Error("登录名长度应在0~20个字符之间！"));
      }
    };

    const validatePassword = (rule, value, callback) => {
       if (value === '' || value === undefined) {
            callback(new Error('密码不能为空'));
      }
      if (value.length < 6) {
        callback(new Error("密码格式不正确！"));
      } else {
        callback();
      }
    };

    const validateCaptcha = (rule, value, callback) => {
   
     if (value === '' || value === undefined) {
            callback(new Error('验证码不能为空'));
      }
      if (value.length > 4) {
         
        callback(new Error("验证码错误！"));
      } else {
        callback();
      }
    };

    

    return {
      fit: "fill",
      // fit: ['fill', 'contain', 'cover', 'none', 'scale-down'],
      imgurl: process.env.VUE_APP_TARGET_IP+"/wuage/captchaImage",
      altmsg: "点击更换",
      loginForm: {
        loginName: "",
        password: "",
        captcha: "",
        rememberMe: false
      },
      captchashow:false,
      showMode:false,
      Config:{
        CAPTCHA_SWITCH:1,
        SYSTEM_MODE:0,
        LOGIN_SWITCH:1,
      },
      loginRules: {

       loginName: [
          { required: true, trigger: "blur", validator: validateName }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ],
        captcha: [
          { required: true, trigger: "blur", validator: validateCaptcha }
        ]
      },
      loading: false,
      passwordType: "password",
      redirect: undefined
    };
  },
  
  created(){
    this.getConfig()
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  methods: {

    getConfig(){
      getSysLogInConfig().then((responce)=>{
     
          this.Config = responce.data;

        if(responce.data.SYSTEM_MODE === 1){
          this.loginForm.loginName = "test" 
          this.loginForm.password = "123456"
          this.showMode  = true
        }

         if(responce.data.CAPTCHA_SWITCH === 1){
         this.captchashow = true
        }

     
      })
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    reflash() {
      this.imgurl = this.imgurl + "?date=" + new Date();
      //  this.$nextTick(() => {
      //  this.$refs["dataForm"].clearValidate();
      // });
    },
    // checkMe(){
    //   console.log(this.loginForm.rememberMe);
    // },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        console.log(valid)
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            // .then(() => {
            //   return this.$store.dispatch("user/getInfo");
            // })
            .then(() => {
            
              this.$router.push({ path: this.redirect || "/" });
              this.loading = false;
            })
            .catch((error) => {
              this.reflash()
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return 
        }
      });
    }
  }
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .captchaItem {
    width: auto;
    height: 47px;
    display: flex;
    line-height: 40px;
    flex-wrap: nowrap;
    margin-bottom: 5px;
    justify-content: space-between;
  }
  .captcha {
    width: 60%;
    height: 47px;
  }
  .captchaImg {
    width: 30%;
    height: 47px;
    line-height: 40px;
  }

  .rememberMeDiv{
     width: auto;
    height: 10px;
    display: flex;
    line-height: 40px;
    flex-wrap: nowrap;
     margin-top: 10px;
    margin-bottom: 30px;
    justify-content: space-between;
  }
  .remerberMe {
    color: white;
    margin-bottom: 5px;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>

<template>
  <div class="site-wrapper site-page--login">
    <div class="site-content__wrapper">
      <div class="site-content">
        <div class="brand-info">
          <h2 class="brand-info__text">传递科学运动，健康天下人！</h2>
          <p class="brand-info__intro">黑格力斯-教务系统</p>
        </div>
        <div class="login-main">
          <img class="login-title" style="width:283px;height:68px;" src="~@/assets/img/login_log.png" alt="黑格力斯"/>
          <!--<h3 class="login-title">欢迎登陆</h3>-->
          <el-form style="margin:20px;"  :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-icon>
            <el-form-item prop="mobile">
              <el-input v-model="dataForm.mobile" placeholder="手机号码"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { login } from '@/api/sys'
  import { saveUserSchoolId, setToken } from '@/utils/userInfoUtil'

  export default {
    data () {
      return {
        dataForm: {
          mobile: '',
          password: ''
        },
        dataRule: {
          mobile: [
            { required: true, message: '手机号码不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    created () {
    },
    methods: {
      // 提交表单
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            login(this.dataForm).then(({data}) => {
              if (data && data.code === 0) {
                setToken(data.token)
                saveUserSchoolId(data.schoolId)
                this.$router.replace({ name: 'home' })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .site-wrapper.site-page--login {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    /*background-color: rgba(38, 50, 56, .6);*/
    overflow: hidden;
    &:before {
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      content: "";
      background-image: url(~@/assets/img/login_bg.jpg);
      background-size: cover;
    }
    .site-content__wrapper {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      padding: 0;
      margin: 0;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: transparent;
    }
    .site-content {
      min-height: 100%;
      padding: 30px 500px 30px 30px;
    }
    .brand-info {
      margin: 220px 100px 0 90px;
      color: #fff;
    }
    .brand-info__text {
      margin:  0 0 22px 0;
      font-size: 60px;
      /*font-weight: 400;*/
      text-transform : uppercase;
      font-weight: bold;
    }
    .brand-info__intro {
      margin: 10px 0;
      font-size: 40px;
      line-height: 1.58;
      opacity: .6;
    }
    .login-main {
      position: absolute;
      top: 0;
      right: 0;
      padding: 150px 60px 180px;
      width: 400px;
      min-height: 100%;
      background-color: #fff;
    }
    .login-title {
      font-size: 16px;
    }
    .login-captcha {
      overflow: hidden;
      > img {
        width: 100%;
        cursor: pointer;
      }
    }
    .login-btn-submit {
      width: 100%;
      margin-top: 5px;
    }
  }
</style>

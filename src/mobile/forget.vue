<template>
  <ul class="form" id="form">
    <li>
      <xd-input @getValue="getPhone" @blur="isPhone" @focus="isPhone(1)" :info="info.phoneInfo" :infoType="type.phoneType" placeholder="请输入手机号"></xd-input>
    </li>
    <li class="message">
      <xd-captcha :info="info.captInfo" :upload="isload" :infoType="type.captType" @value="getValue"></xd-captcha>
    </li>
    <li class="message">
      <xd-input @getValue="getCodeValue" @focus="isCodeNull(1)" @blur="isCodeNull" :info="info.msgInfo" :infoType="type.msgType" placeholder="请输入验证码"></xd-input>
      <input @click="getCode" :disabled="btnEabale" type="button" :value="text">
    </li>
    <li>

      <xd-input @getValue="getPassword" @blur="isPassword" @focus="isPassword(1)" type="password" :info="info.pwdInfo" :infoType="type.pwdType" placeholder="请输入新密码(8-16位数字和字母)"></xd-input>
    </li>
    <li>
      <xd-input @getValue="getSecondPwd" @blur="isSecondPwd" @focus="isSecondPwd(1)" type="password" :info="info.SecondInfo" :infoType="type.SecondType" placeholder="请再次输入密码(8-16位数字和字母)"></xd-input>
    </li>
    <li class="btn"><input @click.13="changePassword" type="button" value="确认修改"></li>
    <v-alert :type="alert_options.type" :info="alert_options.info" ref="alert"></v-alert>
  </ul>
</template>
<script>
import xdCaptcha from '@/components/user/captcha';
import xdInput from '@/components/user/input';
import vAlert from '@/components/global/alert';
import reg from '@/common/js/reg';
import md5 from 'md5';
export default {
  components: {
    xdCaptcha,
    xdInput,
    vAlert,
  },
  data() {
    return {
      info: { phoneInfo: '', captInfo: '', msgInfo: '', pwdInfo: '', SecondInfo: '' }, // 提示信息
      type: { phoneType: '', captType: '', msgType: '', pwdType: '', SecondType: '' }, // 提示类型
      code: '', // 图片验证码
      msgCode: '', // 短信验证码
      phone: '', // 电话号码
      password: '', // 密码
      secondPwd: '',
      time: 60,
      btnEabale: false,
      text: '点击获取',
      isload: '', // 是否重新加载图片验证码
      alert_options: { type: 'success', info: '' }, // 提示框设置
    }
  },
  created() {
    let user = JSON.parse(sessionStorage.getItem('temp'));
    if (user && user.tempPhone) {
      this.phone = user.tempPhone;
    }
  },
  methods: {
    getValue(v) { // 获取用户输入图片验证码
      this.code = v;
      this.isNull(1);
    },
    getPhone(phone) { // 获取用户输入手机号
      this.phone = phone;
    },
    getPassword(v) { // 获取密码
      this.password = v;
    },
    getSecondPwd(v) { // 获取用户再次输入的密码
      this.secondPwd = v;
    },
    getCodeValue(v) { // 获取用户输入验证码
      this.msgCode = v;
    },
    isPhone(n) { // 手机号验证
      if (n === 1) {  // 获取焦点,移除错误提示
        this.info.phoneInfo = '';
        this.type.phoneType = '';
      } else {
        this.type.phoneType = 'error';
        if (this.phone && !reg.isPhone(this.phone)) {
          this.info.phoneInfo = '手机号格式错误';
          return false;
        } else if (!this.phone) {
          this.info.phoneInfo = '手机号不能为空';
          return false;
        } else {
          this.info.phoneInfo = '';
          this.type.phoneType = '';
          return true;
        }
      }
    },
    isPassword(n) { // 密码验证
      if (n === 1) {  // 获取焦点,移除错误提示
        this.info.pwdInfo = '';
        this.type.pwdType = '';
      } else {
        this.type.pwdType = 'error';
        if (this.password && !reg.isPassword(this.password)) {
          this.info.pwdInfo = '密码格式错误';
          return false;
        } else if (!this.password) {
          this.info.pwdInfo = '密码不能为空';
          return false;
        } else {
          this.info.pwdInfo = '';
          this.type.pwdType = '';
          return true;
        }
      }
    },
    isSecondPwd(n) { // 重复输入密码验证
      if (n === 1) {  // 获取焦点,移除错误提示
        this.info.SecondInfo = '';
        this.type.SecondType = '';
      } else {
        this.type.SecondType = 'error';
        if (this.password && this.password !== this.secondPwd) {
          this.info.SecondInfo = '两次输入密码不一致';
          return false;
        } else if (!this.password) {
          this.info.SecondInfo = '再次输入密码不能为空';
          return false;
        } else {
          this.info.SecondInfo = '';
          this.type.SecondType = '';
          return true;
        }
      }
    },
    isNull(n) { // 判断图片验证码是否为空
      if (n === 1) {
        this.info.captInfo = '';
        this.type.captType = '';
      } else {
        if (!this.code) {
          this.type.captType = 'error';
          this.info.captInfo = '请输入验证码';
          return false;
        } else {
          return true;
        }
      }
    },
    isCodeNull(n) { // 判断短信验证码是否为空
      if (n === 1) {
        this.info.msgInfo = '';
        this.type.msgType = '';
      } else {
        if (!this.code) {
          this.type.msgType = 'error';
          this.info.msgInfo = '请输入验证码';
          return false;
        } else {
          return true;
        }
      }
    },
    getCode(v) { // 点击获取验证码
      if (this.isPhone() && this.isNull()) {
        // 发送请求
        this.$http.post('/register/sendsms', { cellphone: this.phone, smsType: 2, imgCode: this.code })
          .then((res) => {
            if (res.status === 1) {
              this.info.captInfo = res.msg;
              this.type.captType = 'success';
              this.btnEabale = true; // 禁用按钮
              this.alert_options.type = 'success';
              this.alert_options.info = res.msg;
              this.$refs.alert.alert();
              // 启动读秒进度
              this.text = this.time + 's';
              let t = setInterval(() => {
                this.text = (this.time -= 1) + 's';
                if (this.time == 0) {
                  clearInterval(t);
                  this.time = 60;
                  this.text = '点击获取';
                  this.btnEabale = false;
                }
              }, 1000);
            } else {
              this.info.captInfo = res.msg;
              this.type.captType = 'error';
              this.isload = Math.random().toString().substr(2, 4);
            }
          });
      }
    },
    changePassword() { // 修改密码
      if (this.isPhone() && this.isNull() && this.isCodeNull() && this.isPassword() && this.isSecondPwd()) {
        this.$http.post('/register/findpas', { cellphone: this.phone, smsType: 2, validCode: this.msgCode, password: md5(this.password) })
          .then((res) => {
            this.alert_options.info = res.msg;
            if (res.status === 1) {
              this.alert_options.type = 'success';
              this.$refs.alert.alert().then(() => {
                localStorage.setItem('temp', JSON.stringify({ tempPhone: this.phone }));
                this.$router.push('login');
              });
            } else {
              this.alert_options.type = 'error';
              this.$refs.alert.alert();
            }
          })
      }
    },
  }
}
</script>

<style lang="less">
#form{
    width: 2.75rem;
    margin: 0 auto;
    margin-top: .55rem;
    .message{
        input[type="text"]{
            width: 1.375rem;
        }
        input[type="button"]{
            width: 1.12rem;
            height: .35rem;
            border: 0;
            border-radius: .03rem;
            background-color: #2693d4;
            color: #fff;
            outline: none;
        }
    }
    .btn{
        input{
            width: 2.75rem;
            height: 0.35rem;
            border: 0;
            border-radius: .03rem;
            background-color: #2693d4;
            color: #fff;
            outline: none; 
        }
    }
}
</style>
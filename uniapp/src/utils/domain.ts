const accountInfo = wx.getAccountInfoSync();
let envVersion = accountInfo.miniProgram.envVersion;

let domain = 'https://dsjedu.com.cn/prod-api/'
switch (envVersion) {
  // 开发和体验版走测试环境，正式版走生产环境
  case 'develop':
    // domain = 'http://47.116.172.140:8912/'
    break;
  case 'trial':
    // domain = 'http://47.116.172.140:8912/'
    break;
}

export default domain;
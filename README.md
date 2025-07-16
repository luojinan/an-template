# AN Template

前端项目模板集合，包含管理后台、H5 和 UniApp 模板。

## 可用模板

### 1. Admin Vue Template

```bash
npx degit luojinan/an-template/admin-vue your-project-name
```

### 2. H5 Vue Template

```bash
npx degit luojinan/an-template/h5-vue your-project-name
```

### 3. UniApp Template

```bash
npx degit luojinan/an-template/uniapp your-project-name
```

### 4. Vue MVP Template

```bash
npx degit luojinan/an-template/vue-mvp your-project-name
```

### 5. React MVP Template

```bash
npx degit luojinan/an-template/react-mvp your-project-name
```

## 使用方法

1. 使用 degit 命令创建项目
2. 安装依赖
3. 按照模板 README 开始开发

## 小程序与 H5 混合开发指南

在实际业务开发中，经常需要小程序和 H5 项目配合使用。以下是混合开发的最佳实践指南。

### 1. 项目分配原则

#### 使用小程序 (UniApp) 开发的场景

- 核心主页面 (首页、分类页、个人中心等)
- 需要调用微信原生能力的页面 (支付、分享、地理位置等)
- 交互较为简单的列表、详情页面
- 需要离线缓存的页面
- 频繁访问的高性能要求页面

#### 使用 H5 开发的场景

- 富交互的复杂页面 (复杂的可视化、动画效果)
- 需要频繁更新的营销活动页面
- 临时性的活动页面
- 包含复杂表单的页面
- 第三方系统集成页面
- 内容展示为主的页面 (文章详情、帮助中心等)

### 2. 项目通信方案

#### 2.1 登录态同步

小程序和 H5 项目之间需要同步登录状态，推荐以下方案：

##### 2.1.1 小程序端 (UniApp 项目)

```javascript
// /store/modules/user.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    userInfo: null,
    isLogin: false
  }),
  
  actions: {
    // 微信登录
    async wxLogin() {
      try {
        // 1. 获取微信登录code
        const [err, loginRes] = await uni.login({
          provider: 'weixin'
        });
        
        if (err) throw new Error('微信登录失败');
        
        // 2. 调用后端接口获取token
        const { data: loginData } = await uni.request({
          url: '/api/login/wx',
          data: {
            code: loginRes.code
          }
        });
        
        // 3. 保存登录态
        this.setToken(loginData.token);
        this.setUserInfo(loginData.userInfo);
        
        // 4. 同步到本地存储
        uni.setStorageSync('token', loginData.token);
        uni.setStorageSync('userInfo', loginData.userInfo);
        
        return loginData;
      } catch (error) {
        console.error('登录失败:', error);
        throw error;
      }
    },
    
    // 设置token
    setToken(token) {
      this.token = token;
      this.isLogin = !!token;
    },
    
    // 设置用户信息
    setUserInfo(userInfo) {
      this.userInfo = userInfo;
    },
    
    // 登出
    logout() {
      this.token = '';
      this.userInfo = null;
      this.isLogin = false;
      uni.removeStorageSync('token');
      uni.removeStorageSync('userInfo');
    }
  }
});

// /utils/webview-manager.js
export class WebViewManager {
  constructor() {
    this.webviewRef = null;
  }
  
  // 初始化WebView
  initWebView(webviewRef) {
    this.webviewRef = webviewRef;
    
    // 监听H5页面消息
    this.webviewRef.onMessage((event) => {
      const { type, data } = event.detail;
      this.handleMessage(type, data);
    });
  }
  
  // 处理H5消息
  async handleMessage(type, data) {
    switch(type) {
      case 'GET_TOKEN':
        // 发送token到H5
        this.sendTokenToH5();
        break;
      case 'LOGOUT':
        // 处理登出请求
        await this.handleLogout();
        break;
      // 其他消息类型...
    }
  }
  
  // 发送token到H5
  sendTokenToH5() {
    const token = uni.getStorageSync('token');
    const userInfo = uni.getStorageSync('userInfo');
    
    this.webviewRef.postMessage({
      type: 'LOGIN_STATE',
      data: {
        token,
        userInfo
      }
    });
  }
  
  // 处理登出
  async handleLogout() {
    const userStore = useUserStore();
    await userStore.logout();
    
    // 通知H5页面
    this.webviewRef.postMessage({
      type: 'LOGOUT_SUCCESS'
    });
  }
}
```

##### 2.1.2 H5 端实现

```javascript
// /utils/mini-program-bridge.js
class MiniProgramBridge {
  constructor() {
    this.callbacks = new Map();
    this.init();
  }
  
  init() {
    // 监听小程序消息
    window.addEventListener('message', (event) => {
      const { type, data } = event.data;
      this.handleMessage(type, data);
    });
  }
  
  // 处理小程序消息
  handleMessage(type, data) {
    switch(type) {
      case 'LOGIN_STATE':
        this.handleLoginState(data);
        break;
      case 'LOGOUT_SUCCESS':
        this.handleLogout();
        break;
    }
    
    // 执行注册的回调
    if(this.callbacks.has(type)) {
      this.callbacks.get(type).forEach(callback => callback(data));
    }
  }
  
  // 处理登录态
  handleLoginState(data) {
    const { token, userInfo } = data;
    
    // 存储token
    localStorage.setItem('token', token);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    
    // 设置请求头
    if(token) {
      this.setRequestHeader(token);
    }
  }
  
  // 处理登出
  handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    // 清除请求头
    this.removeRequestHeader();
  }
  
  // 设置请求头
  setRequestHeader(token) {
    // 如果使用axios
    if(window.axios) {
      window.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }
  
  // 移除请求头
  removeRequestHeader() {
    if(window.axios) {
      delete window.axios.defaults.headers.common['Authorization'];
    }
  }
  
  // 请求登录态
  requestLoginState() {
    window.parent.postMessage({
      type: 'GET_TOKEN'
    }, '*');
  }
  
  // 注册消息回调
  on(type, callback) {
    if(!this.callbacks.has(type)) {
      this.callbacks.set(type, new Set());
    }
    this.callbacks.get(type).add(callback);
  }
  
  // 移除消息回调
  off(type, callback) {
    if(this.callbacks.has(type)) {
      this.callbacks.get(type).delete(callback);
    }
  }
}

// 创建全局实例
window.mpBridge = new MiniProgramBridge();
```

##### 2.1.3 使用示例

```javascript
// H5项目中使用
// main.js 或具体业务组件
const mpBridge = window.mpBridge;

// 监听登录态变化
mpBridge.on('LOGIN_STATE', (data) => {
  console.log('登录态已更新:', data);
  // 更新页面状态
});

// 页面加载时请求登录态
onMounted(() => {
  mpBridge.requestLoginState();
});
```

##### 2.1.4 安全性考虑

- Token 传输时最好进行加密
- 设置合适的 token 过期时间
- 使用 HTTPS 协议
- 验证 WebView 域名的合法性

##### 2.1.5 性能优化

- 避免频繁的登录态同步
- 合理利用本地存储
- 实现 token 自动刷新机制

#### 2.2 状态管理建议

- 小程序端使用 Pinia/Vuex 管理状态
- H5 端独立状态管理
- 关键状态通过 WebView 通信同步
- 采用增量更新策略

### 3. 性能优化策略

#### 3.1 预加载机制

```javascript
// 智能预加载示例
class PrefetchManager {
  shouldPrefetch(resource) {
    // 1. 检查网络状况
    if(networkType === 'slow') return false;
    
    // 2. 检查资源大小
    if(resource.size > 1000000) return false;
    
    // 3. 检查用户行为模式
    return this.analyzeUserBehavior();
  }
}
```

#### 3.2 缓存策略

- 小程序端：利用本地存储缓存关键数据
- H5 端：合理使用浏览器缓存
- WebView 预加载关键页面

### 4. 开发注意事项

#### 4.1 安全性考虑

- 所有 WebView 页面必须使用 HTTPS
- 实现域名白名单机制
- 敏感数据传输需要加密
- Token 管理需要考虑过期和刷新机制

#### 4.2 用户体验

- 统一的错误处理机制
- 完善的加载状态展示
- 平滑的页面切换动画
- 统一的视觉和交互设计

#### 4.3 调试方法

- 使用 vconsole 进行 H5 调试
- 完善的日志系统
- 监控页面切换性能
- 跟踪用户行为数据

### 5. 项目结构建议

```
project/
├── uniapp/                # 小程序项目
│   ├── src/
│   │   ├── pages/        # 小程序页面
│   │   ├── webview/      # WebView组件和管理器
│   │   └── store/        # 状态管理
│   └── package.json
│
├── h5/                    # H5项目
│   ├── src/
│   │   ├── pages/        # H5页面
│   │   ├── bridge/       # 小程序通信桥接
│   │   └── store/        # 状态管理
│   └── package.json
│
└── shared/               # 共享资源和工具
    ├── api/             # API定义
    ├── constants/       # 常量定义
    └── utils/          # 通用工具
```

### 6. 发布流程

1. H5 项目部署
   - 构建并部署到 CDN
   - 更新版本号
   - 配置缓存策略

2. 小程序发布
   - 更新 H5 域名配置
   - 提交审核
   - 灰度发布

### 7. 监控和统计

- 接入小程序数据统计
- 配置 H5 页面埋点
- 监控页面切换性能
- 跟踪用户行为数据
- 统计 WebView 加载性能

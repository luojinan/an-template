## 项目介绍

基于 uni-app + Vue 3 + TypeScript 移动端跨平台开发模板，集成了 Biome、Stylelint 等工具，确保代码规范与质量

[blog](https://www.cnblogs.com/haoxianrui/p/18684753)

- 移除 husky gitcz commitlint
- 移除不需要的小程序渠道编译包
- 移除 prettier
- 移除 eslint
- 安装 biome
- 移除 autoimport.d.ts

## 项目文档

[从0到1构建 UniApp + Vue3 + TypeScript 移动端跨平台开源脚手架](https://juejin.cn/post/7448963032993038376)

## 项目启动

安装依赖

```bash
pnpm i
```

```bash
# 微信小程序启动
pnpm dev
# h5启动
pnpm dev:h5

# 微信小程序部署
pnpm build
```

微信小程序run dev后输出产物在 `dist/dev/mp-weixin/` 中，使用微信开发者工具打开的目录要选到 `mp-weixin/`，同时本地watch整个目录热更新

发布微信小程序要使用 build 的产物 `dist/build/mp-weixin/`

> 有相关的 uniapp 插件自动调起微信开发者工具，但是手动操作不麻烦，因此不使用

## 生态

### VSCode Plugin

- vue official
- unocss
- biome(替代 Eslint、Prettier)(如同时使用其他格式化工具出错请手动禁用其他格式化工具)

css 建议尽可能使用 [unocss](https://www.cnblogs.com/haoxianrui/p/18684753#%E6%95%B4%E5%90%88-unocss)

### 组件库

[nutui-uniapp](https://nutui-uniapp.pages.dev/guide/faq.html)

> vue3 + vite生态似乎完全依赖auto import component VitePlugin, 每找到合适的手动import方式，因此只能使用第三方组件库 auto import component
>
> 即：在 template 标签中直接使用横杠命名的组件如 `<nut-button>`，在 script 中完全不体现

### uniapp

1. 写 `<view>`、`<image>` 或者 `<div>`、`<img>`，没有区别，在编译时都会被转化为目标平台的语法。（如果uniapp项目更多的用于小程序，可以考虑都写 `view` 等小程序语法来优化小程序的编译速度，相应的 web 编译会慢点，但是这点编译耗时感觉可以忽略不计... 还是写熟悉的 web 语法心智负担更低）
2. 使用 `uni.xx()` 代替 `wx.xx()`
3. TODO: webview 集成，除了 首页、支付、登录 等依赖微信小程序内置功能的页面使用 uniapp 开发外，其他页面理论上都应该用 webview，在 H5项目 开发而不是 uniapp项目
4. TODO: `<nut-button class="mb-2">` 在组件上使用 class/style 无效

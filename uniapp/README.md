## 项目介绍

基于 uni-app + Vue 3 + TypeScript 移动端跨平台开发模板，集成了 Biome、Stylelint 等工具，确保代码规范与质量

[blog](https://www.cnblogs.com/haoxianrui/p/18684753)

- 移除 husky gitcz commitlint
- 移除不需要的小程序编译包
- 移除 prettier
- 移除 eslint
- 安装 biome
- 移除 autoimpor.d.ts

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

## 生态

VSCode Plugin:

- vue official
- unocss
- biome

css 建议尽可能使用 [unocss](https://www.cnblogs.com/haoxianrui/p/18684753#%E6%95%B4%E5%90%88-unocss)

组件库 [nutui-uniapp](https://nutui-uniapp.pages.dev/guide/faq.html)

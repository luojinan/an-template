# AN Admin Template

前端项目模板-管理后台

```bash
npx degit luojinan/an-template/admin-vue your-project-name
```

## 使用方法

1. 使用 degit 命令创建项目
2. 安装依赖
3. git init

## 项目简介

[vue3-element-admin](https://github.com/youlaitech/vue3-element-admin) 是基于 Vue3 + Vite5+ TypeScript5 + Element-Plus + Pinia 等主流技术栈构建的免费开源的后台管理前端模板（配套 [后端源码](https://gitee.com/youlaiorg/youlai-boot)）。

## 项目文档

- [基于 Vue3 + Vite + TypeScript + Element-Plus 从 0 到 1 搭建后台管理系统](https://juejin.cn/post/7228990409909108793)

## 项目启动

```bash
# 安装依赖
pnpm install

# 启动运行
pnpm run dev
```

## 项目部署

```bash
# 项目打包
pnpm run build-only
```

将打包生成在 `dist` 目录下的文件拷贝至远程服务器 `/usr/share/nginx/html` 目录

```text
# nginx.cofig 配置
server {
 listen     80;
 server_name  localhost;
 location / {
   root /usr/share/nginx/html;
   index index.html index.htm;
 }
 # 反向代理配置
 location /prod-api/ {
   proxy_pass http://vapi.youlai.tech/; # vapi.youlai.tech 替换成你的后端 API 地址
 }
}
```

## 项目特色

- **权限管理**：用户、角色、菜单、字典、部门等完善的权限系统功能。

- **基础设施**：动态路由、按钮权限、国际化、代码规范、Git 提交规范、常用组件封装。

## 后端接口

> 如果您具备 Java 开发基础，按照以下步骤将在线接口转为本地后端接口，创建企业级前后端分离开发环境，助您走向全栈之路。

1. 获取基于 `Java` 和 `SpringBoot` 开发的后端 [youlai-boot](https://gitee.com/youlaiorg/youlai-boot.git) 源码。
2. 根据后端工程的说明文档 [README.md](https://gitee.com/youlaiorg/youlai-boot#%E9%A1%B9%E7%9B%AE%E8%BF%90%E8%A1%8C) 完成本地启动。
3. 修改 `.env.development` 文件中的 `VITE_APP_API_URL` 的值，将其从 <http://vapi.youlai.tech> 更改为 <http://localhost:8989。>

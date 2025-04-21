import uni from "@dcloudio/vite-plugin-uni";
import UniComponents from "@uni-helper/vite-plugin-uni-components";
import { NutResolver } from "nutui-uniapp";

import { type ConfigEnv, defineConfig, loadEnv, type UserConfig } from "vite";

export default defineConfig(async ({ mode }: ConfigEnv): Promise<UserConfig> => {
  const UnoCss = await import("unocss/vite").then((i) => i.default);
  const env = loadEnv(mode, process.cwd());

  return {
    server: {
      host: "0.0.0.0",
      port: +env.VITE_APP_PORT,
      open: true,
      // 代理配置只在 H5（浏览器）开发时生效。 其他平台（如小程序、App）在开发时不使用 Vite 的开发服务器，它们直接运行在各自的环境中。
      proxy: {
        [env.VITE_APP_BASE_API]: {
          changeOrigin: true,
          target: env.VITE_APP_API_URL,
          rewrite: (path) => path.replace(new RegExp("^" + env.VITE_APP_BASE_API), ""),
        },
      },
    },
    plugins: [
      // https://github.com/unocss/unocss
      UnoCss(),
      // 确保放在 `Uni()` 之前，官方文档没有找到手动引入组件的示例，都默认使用auto component 😡
      UniComponents({
        resolvers: [
          NutResolver()
        ]
      }),
      uni(),
    ],
  };
});

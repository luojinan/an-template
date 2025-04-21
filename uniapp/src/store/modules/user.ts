import { defineStore } from "pinia";
import type { UserInfo } from "@/api/system/user";
import { getUserInfo, setToken, setUserInfo } from "@/utils/cache";
import { postWechatCustGetopenid } from "@/utils/proApi/wx";

export const useUserStore = defineStore("user", () => {
  const userInfo = ref<UserInfo | undefined>(getUserInfo());

  // 计算属性
  const level = computed(() => userInfo.value?.level || 0);
  const hasUser = computed(() => !!userInfo.value?.token);

  // 微信登录
  const loginByWechat = async () => {
    // // 获取微信登录的临时 code
    const { code } = await uni.login({
      provider: "weixin",
    });

    // 调用后端接口进行登录认证
    const data = await postWechatCustGetopenid({ code });

    setToken(data.accessToken);
    setUserInfo(data)
    return data
  };
  return {
    userInfo,
    level,
    hasUser,
    loginByWechat,
  };
});

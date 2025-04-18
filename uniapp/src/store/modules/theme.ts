import { defineStore } from "pinia";
import { ref } from "vue";

// 从缓存获取主题色
const getThemeColor = (): string => {
  const savedColor = uni.getStorageSync("themeColor");
  return savedColor || "#165DFF"; // 默认Arco蓝色
};

// 保存主题色到缓存
const setThemeColorCache = (color: string) => {
  uni.setStorageSync("themeColor", color);
};

export const useThemeStore = defineStore("theme", () => {
  // 主题色
  const primaryColor = ref<string>(getThemeColor());

  // 设置主题色
  const setPrimaryColor = (color: string) => {
    primaryColor.value = color;
    setThemeColorCache(color);

    // 设置CSS变量，方便全局使用
    document.documentElement.style.setProperty("--primary-color", color);

    // 计算衍生色
    const lighterColor = getLighterColor(color, 0.8);
    const darkerColor = getDarkerColor(color, 0.8);
    document.documentElement.style.setProperty("--primary-color-light", lighterColor);
    document.documentElement.style.setProperty("--primary-color-dark", darkerColor);
  };

  // 获取浅色版本主题色
  const getLighterColor = (hexColor: string, factor: number): string => {
    // 去掉#前缀
    const hex = hexColor.replace("#", "");

    // 解析RGB值
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // 调亮颜色
    r = Math.min(255, Math.floor(r + (255 - r) * factor));
    g = Math.min(255, Math.floor(g + (255 - g) * factor));
    b = Math.min(255, Math.floor(b + (255 - b) * factor));

    // 转回16进制
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  };

  // 获取深色版本主题色
  const getDarkerColor = (hexColor: string, factor: number): string => {
    // 去掉#前缀
    const hex = hexColor.replace("#", "");

    // 解析RGB值
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // 调暗颜色
    r = Math.max(0, Math.floor(r * factor));
    g = Math.max(0, Math.floor(g * factor));
    b = Math.max(0, Math.floor(b * factor));

    // 转回16进制
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  };

  // 初始化，应用主题色
  const initTheme = () => {
    setPrimaryColor(primaryColor.value);
  };

  return {
    primaryColor,
    setPrimaryColor,
    initTheme,
  };
});

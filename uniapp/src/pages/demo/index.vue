<template>
  <view class="p-5">
    <view class="text-2xl font-bold mb-2 text-center">示例中心</view>
    <view class="text-gray-500 text-center mb-8">这里展示了各种功能示例，点击卡片可查看详情</view>
    
    <!-- 示例列表 -->
    <view class="space-y-4">
      <!-- 导航示例 -->
      <view class="p-4 bg-white rounded-lg shadow" @tap="navigateTo('navigate')">
        <view class="text-lg font-bold mb-2">页面导航示例</view>
        <view class="text-gray-500 text-sm">
          演示uni-app的页面跳转、重定向、返回等功能，包含参数传递和页面间通信
        </view>
      </view>
      
      <!-- 组件示例 -->
      <view class="p-4 bg-white rounded-lg shadow" @tap="navigateTo('component')">
        <view class="text-lg font-bold mb-2">组件开发示例</view>
        <view class="text-gray-500 text-sm">
          演示组件开发的基础知识，包括props、插槽、样式覆盖等
        </view>
      </view>

      <!-- CSS导入示例 -->
      <view class="demo-card" @tap="navigateTo('css-import')">
        <view class="demo-card-title">CSS导入示例</view>
        <view class="demo-card-desc">
          演示如何在Vue3中使用import方式引入外部CSS文件，实现样式模块化
        </view>
      </view>
      
      <!-- 预留更多示例入口 -->
      <view class="p-4 bg-gray-100 rounded-lg text-center text-gray-500">
        更多示例正在开发中...
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
// 跳转到示例页面
const navigateTo = async (page: string) => {
  try {
    await uni.navigateTo({
      url: `/pages/demo/${page}`,
    });
  } catch (err) {
    console.error("跳转失败", err);
    uni.showToast({
      title: "跳转失败",
      icon: "none",
    });
  }
};
</script>

<style lang="scss">
// 导入外部CSS文件
@import './styles/demo-card.css';

// 添加点击效果
.shadow {
  transition: all 0.3s;
  &:active {
    transform: scale(0.98);
    opacity: 0.9;
  }
}
</style>

<template>
  <view class="p-5">
    <view class="text-2xl font-bold mb-5 text-center">页面跳转示例</view>
    
    <!-- 基础跳转 -->
    <view class="mb-8 p-4 bg-gray-100 rounded-lg">
      <view class="text-lg font-bold mb-4">基础跳转</view>
      <nut-button type="primary" block @click="navigateToPage" customClass="mb-2">普通跳转 (navigateTo)</nut-button>
      <nut-button type="primary" block @click="redirectToPage" customClass="mb-2">重定向跳转 (redirectTo)</nut-button>
      <nut-button type="primary" block @click="navigateBack" customClass="mb-2">返回上一页 (navigateBack)</nut-button>
    </view>

    <!-- 带参数跳转 -->
    <view class="mb-8 p-4 bg-gray-100 rounded-lg">
      <view class="text-lg font-bold mb-4">带参数跳转</view>
      <nut-button type="primary" block @click="navigateWithParams" customClass="mb-2">带参数跳转</nut-button>
    </view>
  </view>
</template>

<script setup lang="ts">
// 普通跳转
const navigateToPage = async () => {
  try {
    await uni.navigateTo({
      url: "/pages/demo/navigate-target",
    });
    console.log("跳转成功");
  } catch (err) {
    console.error("跳转失败", err);
  }
};

// 重定向跳转
const redirectToPage = async () => {
  try {
    await uni.redirectTo({
      url: "/pages/demo/navigate-target",
    });
    console.log("重定向成功");
  } catch (err) {
    console.error("重定向失败", err);
  }
};

// 返回上一页
const navigateBack = async () => {
  try {
    await uni.navigateBack({
      delta: 1,
    });
    console.log("返回成功");
  } catch (err) {
    console.error("返回失败", err);
  }
};

// 带参数跳转
const navigateWithParams = async () => {
  const params = {
    id: 123,
    name: "测试参数",
    timestamp: new Date().getTime(),
  };

  try {
    await uni.navigateTo({
      url: `/pages/demo/navigate-target?params=${encodeURIComponent(JSON.stringify(params))}`,
    });
    console.log("带参数跳转成功");
  } catch (err) {
    console.error("带参数跳转失败", err);
  }
};
</script>

<style lang="scss">
.mb-2 {
  margin-top: 20px;
}
.container {
  padding: 20px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.section {
  margin-bottom: 30px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.subtitle {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
}
</style>

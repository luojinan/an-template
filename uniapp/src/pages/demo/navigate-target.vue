<template>
  <view class="p-5">
    <view class="text-2xl font-bold mb-5 text-center">目标页面</view>
    
    <!-- 显示接收到的参数 -->
    <view v-if="params" class="mb-8 p-4 bg-gray-100 rounded-lg">
      <view class="text-lg font-bold mb-4">接收到的参数</view>
      <view class="mb-2 p-2 bg-white rounded">
        <text>ID: {{ params.id }}</text>
      </view>
      <view class="mb-2 p-2 bg-white rounded">
        <text>名称: {{ params.name }}</text>
      </view>
      <view class="mb-2 p-2 bg-white rounded">
        <text>时间戳: {{ params.timestamp }}</text>
      </view>
    </view>

    <!-- 返回按钮 -->
    <nut-button type="primary" block @click="goBack" class="mt-5">返回上一页</nut-button>
  </view>
</template>

<script setup>
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";

const params = ref(null);

// 解析URL参数
const parseParams = (options) => {
  if (options.params) {
    try {
      params.value = JSON.parse(decodeURIComponent(options.params));
    } catch (e) {
      console.error("参数解析错误", e);
    }
  }
};

// 返回上一页
const goBack = () => {
  uni.navigateBack({
    delta: 1,
  });
};

// 页面加载时解析参数
onLoad((options) => {
  parseParams(options);
});
</script>

<style>
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

.param-item {
  margin-bottom: 10px;
  padding: 8px;
  background-color: #fff;
  border-radius: 4px;
}
</style> 
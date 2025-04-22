<template>
  <view class="work p-4 bg-gray-100">
    <nut-button type="primary" block class="mt-4! mb-4!">按钮1</nut-button>

    <!-- UnoCSS 示例 -->
    <view class="bg-blue-50 rounded-lg">
      <view class="text-xl font-bold text-blue-500 text-center">UnoCSS 样式示例</view>
    </view>
    
    <!-- Flex 布局示例 -->
    <view class="mt-4 p-4 bg-white rounded-lg">
      <view class="text-lg font-bold mb-2">Flex 布局示例</view>
      <view class="flex flex-between bg-gray-50 p-3 mb-2 rounded">
        <view class="bg-blue-100 p-2 rounded">左侧</view>
        <view class="bg-blue-100 p-2 rounded">右侧</view>
      </view>
      <view class="flex flex-center bg-gray-50 p-3 mb-2 rounded">
        <view class="bg-green-100 p-2 mx-1 rounded">居中项目1</view>
        <view class="bg-green-100 p-2 mx-1 rounded">居中项目2</view>
      </view>
      <view class="flex flex-start bg-gray-50 p-3 rounded">
        <view class="bg-purple-100 p-2 mr-2 rounded">开始</view>
        <view class="bg-purple-100 p-2 rounded">项目</view>
      </view>
    </view>
    
    <!-- 颜色和排版示例 -->
    <view class="mt-4 p-4 bg-white rounded-lg">
      <view class="text-lg font-bold mb-2">颜色和排版示例</view>
      <view class="grid grid-cols-2 gap-2">
        <view class="bg-red-100 text-red-600 p-3 rounded">红色样式</view>
        <view class="bg-blue-100 text-blue-600 p-3 rounded">蓝色样式</view>
        <view class="bg-green-100 text-green-600 p-3 rounded">绿色样式</view>
        <view class="bg-yellow-100 text-yellow-600 p-3 rounded">黄色样式</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { reactive } from "vue";

</script>

<style lang="scss" scoped>
.a {
  margin-bottom: 16px;
}
/* stylelint-disable selector-type-no-unknown */
page {
  background: #f8f8f8;
}
/* stylelint-enable selector-type-no-unknown */

.work {
  /* UnoCSS 已替代这里的内边距 */
  /* padding: 40rpx 0; */
}
</style>

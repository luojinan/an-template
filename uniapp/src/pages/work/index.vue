<template>
  <view class="work p-4 bg-gray-100">
    <template v-for="(item, index) in gridList" :key="index">
      <nut-card :title="item.title" class="mb-4 rounded-lg shadow-sm">
        <nut-grid clickable :column-num="4" class="gap-2">
          <nut-grid-item
            v-for="(child, index) in item.children"
            :key="index"
            :v-has-perm="child.prem"
            use-slot
            link-type="navigateTo"
            :url="child.url"
            class="p-2 bg-gray-50 hover:bg-gray-100"
          >
            <view class="text text-center font-medium text-gray-700">{{ child.title }}</view>
          </nut-grid-item>
        </nut-grid>
      </nut-card>
    </template>
    
    <!-- UnoCSS 示例 -->
    <view class="mt-6 p-4 bg-blue-50 rounded-lg">
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

const gridList = reactive([
  {
    title: "系统管理",
    children: [
      {
        title: "用户管理",
        url: "/pages/work/user/index",
        prem: "sys:user:query",
      },
    ],
  },
]);
</script>

<style lang="scss" scoped>
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

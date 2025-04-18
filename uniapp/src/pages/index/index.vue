<template>
  <view style="width: 100%; height: var(--status-bar-height)" />
  <view class="home">
    <wd-swiper
      v-model:current="current"
      :list="swiperList"
      autoplay
      @click="handleClick"
      @change="onChange"
    />

    <!-- 快捷导航 -->
    <wd-grid clickable :column="4" class="mt-2">
      <wd-grid-item
        v-for="(item, index) in navList"
        :key="index"
        use-slot
        link-type="navigateTo"
        :url="item.url"
      >
        <view class="p-2">
          <image class="w-72rpx h-72rpx rounded-8rpx" :src="item.icon" />
        </view>
        <view class="text">{{ item.title }}</view>
      </wd-grid-item>
    </wd-grid>

    <!-- 通知公告 -->
    <wd-notice-bar
      text="vue-uniapp-template 是一个基于 Vue3 + UniApp 的前端模板项目，提供了一套完整的前端解决方案，包括登录、权限、字典、接口请求、状态管理、页面布局、组件封装等功能。"
      color="#34D19D"
      type="info"
    >
      <template #prefix>
        <wd-tag color="#FAA21E" bg-color="#FAA21E" plain custom-style="margin-right:10rpx">
          通知公告
        </wd-tag>
      </template>
    </wd-notice-bar>

    <!-- 数据统计 -->
    <wd-grid :column="2" :gutter="2">
      <wd-grid-item use-slot custom-class="custom-item">
        <view class="flex justify-start pl-5">
          <view class="flex-center">
            <image class="w-80rpx h-80rpx rounded-8rpx" src="/static/icons/visitor.png" />
            <view class="ml-5 text-left">
              <view class="font-bold">访客数</view>
              <view class="mt-2">{{ visitStatsData.todayUvCount }}</view>
            </view>
          </view>
        </view>
      </wd-grid-item>
      <wd-grid-item use-slot custom-class="custom-item">
        <view class="flex justify-start pl-5">
          <view class="flex-center">
            <image class="w-80rpx h-80rpx rounded-8rpx" src="/static/icons/browser.png" />
            <view class="ml-5 text-left">
              <view class="font-bold">浏览量</view>
              <view class="mt-2">{{ visitStatsData.todayPvCount }}</view>
            </view>
          </view>
        </view>
      </wd-grid-item>
    </wd-grid>
  </view>
</template>

<script setup lang="ts">
import { VisitStatsVO } from "@/api/system/log";

const current = ref<number>(0);

const visitStatsData = ref<VisitStatsVO>({
  todayUvCount: 0,
  uvGrowthRate: 0,
  totalUvCount: 0,
  todayPvCount: 0,
  pvGrowthRate: 0,
  totalPvCount: 0,
});

const swiperList = ref(["https://www.youlai.tech/storage/blog/banner9.png"]);

// 快捷导航列表
const navList = reactive([
  {
    icon: "/static/icons/user.png",
    title: "用户管理",
    url: "/pages/work/user/index",
    prem: "sys:user:query",
  },
]);

function handleClick(e: any) {
  console.log(e);
}
function onChange(e: any) {
  console.log(e);
}

onReady(() => {});
</script>

<style setup lang="scss">
.home {
  padding: 10rpx 10rpx;
  :deep(.custom-item) {
    height: 80px !important;
  }
  :deep(.wd-card) {
    margin: 10rpx 0 !important;
  }
}
</style>

<template>
  <view class="work">
    <template v-for="(item, index) in gridList" :key="index">
      <nut-card :title="item.title">
        <nut-grid clickable :column-num="4">
          <nut-grid-item
            v-for="(child, index) in item.children"
            :key="index"
            :v-has-perm="child.prem"
            use-slot
            link-type="navigateTo"
            :url="child.url"
          >
            <view class="text">{{ child.title }}</view>
          </nut-grid-item>
        </nut-grid>
      </nut-card>
    </template>
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
  padding: 40rpx 0;
}
</style>

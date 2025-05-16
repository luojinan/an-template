<script setup lang="ts">
import { showToast } from '@nutui/nutui';
import { useRouter } from 'vue-router';
const router = useRouter();
const handleClick = () => {
  showToast.success('按钮被点击了');
};
const handleGo = () => {
  router.push('/about');
};
</script>

<template>
  <main>
    <nut-button type="primary" @click="handleClick">按钮</nut-button>
    <nut-button type="primary" @click="handleGo">跳转</nut-button>
  </main>
</template>

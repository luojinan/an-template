<script setup lang="ts">
import { useRouter } from 'vue-router'

defineOptions({
  name: 'Demo',
})

const router = useRouter()
</script>

<template>
  <div class="demo">
    <p class="title">
      demo
      <span class="title_a">
        title_a
      </span>
    </p>
    <van-button type="primary" class="demo-btn">
      按钮
    </van-button>

    <van-button
      type="success"
      size="large"
      class="caas-btn"
      @click="router.push('/caas/index')"
    >
      开始CAAS性格测试
    </van-button>
  </div>
</template>

<style scoped>
.demo {
  .title {
    color: red;
    &_a {
      color: green;
    }
  }

  .demo-btn {
    margin-right: 12px;
  }

  .caas-btn {
    margin-top: 16px;
  }
}
</style>

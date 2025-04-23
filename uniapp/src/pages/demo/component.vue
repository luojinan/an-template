<template>
  <div class="p-5">
    <nut-cell custom-class="cell">
      <nut-rate v-model="value" />
    </nut-cell>
    <h1 class="text-2xl font-bold mb-2 text-center">组件开发示例</h1>
    <p class="text-gray-500 text-center mb-8">这里展示了组件开发的基础知识，包括props、插槽、样式覆盖等</p>
    
    <!-- 基础使用 -->
    <div class="mb-8">
      <MyComponent title="1. 基础使用" highlight>123</MyComponent>
    </div>
    
    <!-- 插槽使用 -->
    <div class="mb-8">
      <MyComponent>
        <template #header>
          <h2 class="text-xl font-bold mb-2 text-red-500">2. 具名插槽使用</h2>
        </template>
        
        <div class="text-gray-600">
          这是通过默认插槽传递的内容
        </div>
        
        <template #footer>
          <div class="flex justify-between">
            <button class="px-4 py-2 bg-gray-200 rounded">取消</button>
            <button class="px-4 py-2 bg-blue-500 text-white rounded">确定</button>
          </div>
        </template>
      </MyComponent>
    </div>
    
    <!-- 样式覆盖 -->
    <div class="mb-8">
      <MyComponent 
        class="bg-red! p-0! custom-component"
        title="3. 样式覆盖"
      />
    </div>
    
    <!-- 组件通信 -->
    <div class="mb-8">
      <h2 class="text-xl font-bold mb-4">4. 组件通信</h2>
      <p v-if="clickMessage" class="mt-4 text-green-500">{{ clickMessage }}</p>
      <MyComponent
        title="点击事件示例"
        @click="handleComponentClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import MyComponent from "@/components/demo/MyComponent.vue";

const clickMessage = ref("");
const value = ref(3);

const handleComponentClick = (message: string) => {
  clickMessage.value = message;
  setTimeout(() => {
    clickMessage.value = "";
  }, 2000);
};
</script>

<style lang="scss" scoped>
:deep(.custom-component) {
  .footer {
    button{
      background: red !important;
    }
  }
}
</style> 
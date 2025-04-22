<template>
  <div class="my-component">
    <!-- 标题插槽 -->
    <slot name="header">
      <h2 class="text-xl font-bold mb-2">{{ title }}</h2>
    </slot>
    
    <!-- 内容区域 -->
    <div class="content" :class="{ 'highlight': highlight }">
      <!-- 默认插槽 -->
      <slot></slot>
    </div>
    
    <!-- 底部插槽 -->
    <slot name="footer">
      <div class="footer">
        <button @click="handleClick">点击我</button>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
// defineOptions 是编译宏，只能在 <script setup> 中使用，不需要导入
defineOptions({
  options: { virtualHost: true },
});

// defineProps、defineEmits 也是编译宏，不需要导入
const { title = "默认标题", highlight = false } = defineProps<{
  title?: string;
  highlight?: boolean;
}>();

const emit = defineEmits(["click"]);
const handleClick = () => {
  emit("click", "组件被点击了！");
};
</script>

<style lang="scss" scoped>
.my-component {
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fff;
  
  .content {
    padding: 10px;
    margin: 10px 0;
    
    &.highlight {
      background: #f0f9ff;
      border: 1px solid #bae0ff;
    }
  }
  
  .footer {
    margin-top: 10px;
    text-align: right;
    
    button {
      padding: 5px 15px;
      background: #1890ff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      
      &:hover {
        background: #40a9ff;
      }
    }
  }
}
</style> 
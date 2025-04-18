<template>
  <view class="todo-container">
    <view class="page-header">
      <text class="page-title">待办事项</text>
      <wd-button size="small" type="primary" icon="add" @click="showAddTodoPopup = true">
        新建待办
      </wd-button>
    </view>

    <view class="filter-tabs">
      <wd-tabs v-model="activeTab" sticky>
        <wd-tab title="全部" name="all" />
        <wd-tab title="未完成" name="active" />
        <wd-tab title="已完成" name="completed" />
      </wd-tabs>
    </view>

    <TodoList :todos="filteredTodos" @update="handleUpdateTodo" @delete="handleDeleteTodo" />

    <!-- 新增待办弹窗 -->
    <wd-popup
      v-model="showAddTodoPopup"
      position="bottom"
      close-on-click-modal
      :style="{ height: '65%' }"
    >
      <view class="popup-header">
        <text class="popup-title">新建待办</text>
        <wd-icon name="close" @click="showAddTodoPopup = false" />
      </view>
      <view class="popup-form">
        <wd-input
          v-model="newTodo.title"
          placeholder="请输入待办标题"
          :rules="[{ required: true, message: '请输入标题' }]"
        />
        <wd-textarea
          v-model="newTodo.description"
          placeholder="请输入详细描述"
          rows="3"
          autosize
          class="mt-20"
        />
        <wd-cell title="截止日期" is-link @click="showDatePicker = true">
          <text v-if="newTodo.deadline">{{ formatDate(newTodo.deadline) }}</text>
          <text v-else class="text-placeholder">请选择</text>
        </wd-cell>
        <wd-cell title="优先级">
          <wd-radio-group v-model="newTodo.priority" shape="button">
            <wd-radio value="low">低</wd-radio>
            <wd-radio value="medium">中</wd-radio>
            <wd-radio value="high">高</wd-radio>
          </wd-radio-group>
        </wd-cell>
        <view class="form-actions">
          <wd-button
            block
            type="primary"
            :loading="loading"
            :disabled="!newTodo.title"
            @click="handleAddTodo"
          >
            保存
          </wd-button>
        </view>
      </view>
    </wd-popup>

    <!-- 日期选择器 -->
    <wd-datetime-picker
      v-model="showDatePicker"
      v-model:value="newTodo.deadline"
      label="截止日期"
      type="date"
      confirm-button-text="确认"
      cancel-button-text="取消"
      title="选择截止日期"
    />

    <wd-toast />
  </view>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useToast } from "wot-design-uni";
import { Todo } from "@/types/todo";
import TodoList from "@/components/todo/TodoList.vue";

const toast = useToast();
const loading = ref(false);
const showAddTodoPopup = ref(false);
const showDatePicker = ref(false);
const activeTab = ref("all");

// 待办列表
const todos = ref<Todo[]>([
  {
    id: "1",
    title: "完成个人资料填写",
    description: "包括上传头像、填写基本信息等",
    completed: false,
    priority: "high",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "阅读使用指南",
    description: "熟悉系统功能和操作流程",
    completed: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]);

// 新增待办表单
const newTodo = ref<Partial<Todo>>({
  title: "",
  description: "",
  priority: "medium",
  deadline: "",
});

// 根据标签筛选待办
const filteredTodos = computed(() => {
  switch (activeTab.value) {
    case "active":
      return todos.value.filter((todo) => !todo.completed);
    case "completed":
      return todos.value.filter((todo) => todo.completed);
    default:
      return todos.value;
  }
});

// 格式化日期
const formatDate = (date: string) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// 生成唯一ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// 添加待办
const handleAddTodo = () => {
  if (!newTodo.value.title) {
    toast.error("请输入待办标题");
    return;
  }

  loading.value = true;

  // 模拟API调用
  setTimeout(() => {
    const now = new Date().toISOString();
    const todo: Todo = {
      id: generateId(),
      title: newTodo.value.title!,
      description: newTodo.value.description,
      completed: false,
      deadline: newTodo.value.deadline,
      priority: newTodo.value.priority as "low" | "medium" | "high",
      createdAt: now,
    };

    todos.value.unshift(todo);
    resetForm();
    loading.value = false;
    showAddTodoPopup.value = false;
    toast.success("待办创建成功");
  }, 500);
};

// 更新待办
const handleUpdateTodo = (todo: Todo) => {
  const index = todos.value.findIndex((item) => item.id === todo.id);
  if (index !== -1) {
    todos.value[index] = {
      ...todo,
      updatedAt: new Date().toISOString(),
    };
    toast.success(todo.completed ? "已完成" : "已取消完成");
  }
};

// 删除待办
const handleDeleteTodo = (id: string) => {
  uni.showModal({
    title: "提示",
    content: "确认删除该待办事项？",
    success: (res) => {
      if (res.confirm) {
        todos.value = todos.value.filter((todo) => todo.id !== id);
        toast.success("删除成功");
      }
    },
  });
};

// 重置表单
const resetForm = () => {
  newTodo.value = {
    title: "",
    description: "",
    priority: "medium",
    deadline: "",
  };
};
</script>

<style lang="scss" scoped>
.todo-container {
  min-height: 100vh;
  padding: 30rpx;
  background-color: #f5f7fa;

  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30rpx;

    .page-title {
      font-size: 36rpx;
      font-weight: 600;
      color: #333;
    }
  }

  .filter-tabs {
    margin-bottom: 20rpx;
    overflow: hidden;
    background-color: #fff;
    border-radius: 12rpx;
  }

  .popup-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30rpx;
    border-bottom: 1rpx solid #eee;

    .popup-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }
  }

  .popup-form {
    padding: 30rpx;

    .form-actions {
      margin-top: 40rpx;
    }
  }

  .text-placeholder {
    color: #999;
  }

  .mt-20 {
    margin-top: 20rpx;
  }
}
</style>

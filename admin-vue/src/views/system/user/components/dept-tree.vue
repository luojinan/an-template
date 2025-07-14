<!-- 部门树 -->
<script setup lang="ts">
import { ElCard, ElInput, ElTree } from 'element-plus'
import DeptAPI from '@/api/dept'

const props = defineProps({
  modelValue: {
    type: [Number],
    default: undefined,
  },
})

// 部门名称

const emits = defineEmits(['node-click'])
const deptList = ref<OptionType[]>() // 部门列表
const deptTreeRef = ref(ElTree) // 部门树
const deptName = ref()
const deptId = useVModel(props, 'modelValue', emits)

watchEffect(
  () => {
    deptTreeRef.value.filter(deptName.value)
  },
  {
    flush: 'post', // watchEffect会在DOM挂载或者更新之前就会触发，此属性控制在DOM元素更新后运行
  },
)

/** 部门筛选 */
function handleFilter(value: string, data: any) {
  if (!value) { return true }

  return data.label.includes(value)
}

/** 部门树节点 Click */
function handleNodeClick(data: { [key: string]: any }) {
  deptId.value = data.value
  emits('node-click')
}

onBeforeMount(() => {
  DeptAPI.getOptions().then((data) => {
    deptList.value = data
  })
})
</script>

<template>
  <ElCard shadow="never">
    <ElInput v-model="deptName" placeholder="部门名称" clearable>
      <template #prefix>
        <i-ep-search />
      </template>
    </ElInput>

    <ElTree
      ref="deptTreeRef"
      class="mt-2"
      :data="deptList"
      :props="{ children: 'children', label: 'label', disabled: '' }"
      :expand-on-click-node="false"
      :filter-node-method="handleFilter"
      default-expand-all
      @node-click="handleNodeClick"
    />
  </ElCard>
</template>

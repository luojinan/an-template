<script setup lang="ts">
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

// API 引用

const props = defineProps({
  modelValue: {
    type: [String],
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const modelValue = useVModel(props, 'modelValue', emit)

const editorRef = shallowRef() // 编辑器实例，必须用 shallowRef
const mode = ref('default') // 编辑器模式
const toolbarConfig = ref({ excludeKeys: ['insertVideo', 'redo', 'group-indent', 'todo', 'bulletedList', 'insertTable', 'numberedList', 'group-more-style', 'group-video', 'codeBlock', 'blockquote'] }) // 工具条配置
// 编辑器配置
const editorConfig = ref({
  placeholder: '请输入内容...',
  // maxLength: 1000,
  MENU_CONF: {
    uploadVideo: null,
    fontFamily: {
      fontFamilyList: [
        // 元素支持两种形式
        //   1. 字符串；
        //   2. { name: 'xxx', value: 'xxx' }

        '黑体',
        '楷体',
        { name: '仿宋', value: '仿宋' },
        'Arial',
        'Tahoma',
        'Verdana',
      ],
    },
    uploadImage: {
      fieldName: 'your-fileName',
      base64LimitSize: 10 * 1024 * 1024, // 10M 以下插入 base64
    },
  },
})

function handleCreated(editor: any) {
  editorRef.value = editor // 记录 editor 实例，重要！
}

function handleChange(editor: any) {
  modelValue.value = editor.getHtml()
}
function destroy() {
  const editor = editorRef.value
  editor.setHtml('')
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) { return }
  editor.setHtml('')
  editor.destroy()
})
// defineExpose({ destroy })
</script>

<template>
  <div class="editor-wrapper">
    <!-- 工具栏 -->
    <Toolbar
      id="toolbar-container"
      :editor="editorRef"
      :default-config="toolbarConfig"
      :mode="mode"
    />
    <!-- 编辑器 -->
    <Editor
      id="editor-container"
      v-model="modelValue"
      :default-config="editorConfig"
      :mode="mode"
      @on-change="handleChange"
      @on-created="handleCreated"
    />
  </div>
</template>

<style src="@wangeditor/editor/dist/css/style.css"></style>

<style lang="scss">
.editor-wrapper{
  min-height: 250px;
  border: 1px solid #ebeef5;
}
</style>

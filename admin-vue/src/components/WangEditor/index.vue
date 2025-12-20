<script setup lang="ts">
// TODO: 从有值切换到无值，仍显示上次的值
import '@wangeditor-next/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor-next/editor-for-vue'
import type { IEditorConfig, IToolbarConfig } from '@wangeditor-next/editor'
import { onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import { ElEmpty } from 'element-plus'
import { uploadOss } from '@/utils'

const { needClear, disabled } = defineProps<{ needClear?: boolean, disabled?: boolean }>()

// 上传图片回调函数类型
type InsertFnType = (_url: string, _alt: string, _href: string) => void

// 双向绑定
const modelValue = defineModel<string>()

const editorRef = shallowRef() // 编辑器实例，必须用 shallowRef

// 工具栏配置
const toolbarConfig = ref<Partial<IToolbarConfig>>({ excludeKeys: ['insertVideo', 'redo', 'group-indent', 'todo', 'bulletedList', 'insertTable', 'numberedList', 'group-more-style', 'group-video', 'codeBlock', 'blockquote'] }) // 工具条配置

// 编辑器配置
const editorConfig = ref<Partial<IEditorConfig>>({
  placeholder: '请输入内容...',
  MENU_CONF: {
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
      customUpload(file: File, insertFn: InsertFnType) {
        uploadOss(file).then((url) => {
          insertFn(url, file.name, url)
        })
      },
    },
  },
})

function handleCreated(editor: any) {
  editorRef.value = editor // 记录 editor 实例，重要！
}

// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) { return }
  editor.destroy()
})

watch(() => needClear, (newVal) => {
  if (newVal) {
    // 弹窗内使用editor问题 https://github.com/wangeditor-team/wangEditor/issues/5855#issuecomment-2146526159
    editorRef.value.destroy() // clear 无效 改为使用v-if重新渲染，并手动销毁
  }
})
</script>

<template>
  <!-- 禁用时直接渲染富文本内容 -->
  <div v-if="disabled" class="editor-preview">
    <div v-if="modelValue" v-html="modelValue" />
    <ElEmpty v-else description="暂无内容" />
  </div>
  <!-- 编辑模式 -->
  <div v-else class="editor-wrapper">
    <!-- 工具栏 -->
    <Toolbar
      :editor="editorRef"
      :default-config="toolbarConfig"
      mode="default"
    />
    <!-- 编辑器 -->
    <Editor
      v-if="!needClear"
      v-model="modelValue"
      :default-config="editorConfig"
      mode="default"
      @on-created="handleCreated"
    />
  </div>
</template>

<style lang="scss">
.editor-wrapper{
  min-height: 250px;
  border: 1px solid #ebeef5;
}

.editor-preview {
  padding: 10px;
  line-height: 1.6;

  img {
    max-width: 100%;
  }
}
</style>

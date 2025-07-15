<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, ref, watch } from 'vue'
import { useFullscreen } from '@vueuse/core'
import { ElButton, ElIcon, ElMessage, ElMessageBox, ElPopover, ElTooltip } from 'element-plus'
import {
  useAppStore,
  useSettingsStore,
  useTagsViewStore,
  useUserStore,
} from '@/store'
import defaultSettings from '@/settings'
import { DeviceEnum } from '@/enums/DeviceEnum'
import { putApiV1UsersChangepassword } from '@/utils/proApi/system'
import { ProForm } from '@/components/ProComponent'

const appStore = useAppStore()
const tagsViewStore = useTagsViewStore()
const userStore = useUserStore()
const settingStore = useSettingsStore()

const route = useRoute()
const router = useRouter()

const isMobile = computed(() => appStore.device === DeviceEnum.MOBILE)

const { isFullscreen, toggle } = useFullscreen()

/**
 * 注销
 */
function logout() {
  ElMessageBox.confirm('确定退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    lockScroll: false,
  }).then(() => {
    userStore
      .logout()
      .then(() => {
        tagsViewStore.delAllViews()
      })
      .then(() => {
        router.push(`/login?redirect=${route.fullPath}`)
      })
  })
}

const openResetPassword = ref(false)
const passwordFormRef = ref()
function onShowResetPassword() {
  openResetPassword.value = true
  passwordFormRef.value.resetFormData()
}

async function onPasswordSubmit(data: any) {
  await putApiV1UsersChangepassword(data)
  ElMessage.success(`密码重置成功，新密码是：${data.newPassword}`)
  openResetPassword.value = false
}

</script>

<template>
  <div class="flex mr-3">
    <template v-if="!isMobile">
      <!-- 全屏 -->
      <div class="setting-item" @click="toggle">
        <div :class="`i-svg:${isFullscreen ? 'fullscreen-exit' : 'fullscreen'}`" />
      </div>

      <!-- 布局大小 -->
      <ElTooltip content="sizeSelect.tooltip" effect="dark" placement="bottom">
        <size-select class="setting-item" />
      </ElTooltip>
    </template>

    <!-- 设置 -->
    <template v-if="defaultSettings.showSettings">
      <div class="setting-item" @click="settingStore.settingsVisible = true">
        <div class="i-svg:setting" />
      </div>
    </template>

    <!-- 用户头像 -->
    <ElPopover
      :width="200"
      trigger="hover"
      popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 10px 10px 16px; border-radius: 10px;"
    >
      <template #reference>
        <div class="h100% p10px setting-item">
          <img :src="`${userStore.user.avatar}?x-oss-process=image/format,webp/resize,w_80`" class="rounded-full w-full h100%">
        </div>
      </template>
      <template #default>
        <div class="flex-x-end font-bold">
          {{ userStore.user.username }}
        </div>
        <div class="flex-y-center rounded mb-6px py-4px cursor-pointer hover:bg-black hover:bg-opacity-10" @click="onShowResetPassword">
          <div class="i-svg:lock mx-2" /> 修改密码
        </div>
        <ElButton plain class="w-full" @click="logout">
          退出登录
        </ElButton>
      </template>
    </ElPopover>

    <ProForm
      ref="passwordFormRef"
      v-model:open="openResetPassword"
      type="drawer"
      :drawer-props="{ title: '修改密码' }"
      :columns="[
        {
          prop: 'srcPassword',
          label: '原密码',
          rules: [
            { required: true, trigger: 'blur' },
            { min: 6, message: '密码至少需要6位字符，请重新输入', trigger: 'blur' },
          ],
        },
        {
          prop: 'newPassword',
          label: '新密码',
          attrs: {
            type: 'password',
            showPassword: true,
          },
          rules: [
            { required: true, trigger: 'blur' },
            { min: 6, message: '密码至少需要6位字符，请重新输入', trigger: 'blur' },
          ],
        },
      ]"
      :on-submit="onPasswordSubmit"
    />
  </div>
</template>

<style lang="scss" scoped>
.setting-item {
  display: inline-block;
  min-width: 40px;
  height: $navbar-height;
  line-height: $navbar-height;
  color: var(--el-text-color);
  text-align: center;
  cursor: pointer;

  &:hover {
    background: rgb(0 0 0 / 10%);
  }
}

.layout-top,
.layout-mix {
  .setting-item,
  .el-icon {
    color: var(--el-color-white);
  }
}

.dark .setting-item:hover {
  background: rgb(255 255 255 / 20%);
}
</style>

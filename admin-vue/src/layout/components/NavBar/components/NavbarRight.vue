<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, ref, watch } from 'vue'
import { useFullscreen } from '@vueuse/core'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  useAppStore,
  useSettingsStore,
  useTagsViewStore,
  useUserStore,
} from '@/store'
import defaultSettings from '@/settings'
import { DeviceEnum } from '@/enums/DeviceEnum'
import CalendarDrawer from '@/components/CalendarDrawer/CalendarDrawer.vue'
import { putApiV1UsersChangepassword } from '@/proApi'
import { getApiV1DictBytypecodeOptions, getApiV1UsersGetwxacodeunlimit } from '@/utils/proProApi/admin'
import { ProForm } from '@/components/ProComponent'

const appStore = useAppStore()
const tagsViewStore = useTagsViewStore()
const userStore = useUserStore()
const settingStore = useSettingsStore()

const route = useRoute()
const router = useRouter()

const isMobile = computed(() => appStore.device === DeviceEnum.MOBILE)

const { isFullscreen, toggle } = useFullscreen()

const showCalendar = ref(false)
function onShowCalendar() {
  showCalendar.value = true
}

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

const openQrcode = ref(false)
const qrcodeFormRef = ref()
const qrcodeImage = ref('')

function onShowQrcode() {
  openQrcode.value = true
  qrcodeFormRef.value.resetFormData()
}

watch(() => openQrcode.value, () => {
  if (!openQrcode.value) {
    qrcodeImage.value = ''
  }
})

async function onQrcodeSubmit(data: any) {
  const res = await getApiV1UsersGetwxacodeunlimit(data)
  qrcodeImage.value = `data: image/jpeg;base64,${res}`
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
      <el-tooltip content="sizeSelect.tooltip" effect="dark" placement="bottom">
        <size-select class="setting-item" />
      </el-tooltip>
    </template>

    <!-- 设置 -->
    <template v-if="defaultSettings.showSettings">
      <div class="setting-item" @click="settingStore.settingsVisible = true">
        <div class="i-svg:setting" />
      </div>
    </template>

    <!-- 用户头像 -->
    <el-popover
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
        <div class="flex-y-center rounded mb-6px py-4px cursor-pointer hover:bg-black hover:bg-opacity-10" @click="onShowQrcode">
          <el-icon class="mx-2">
            <Share />
          </el-icon>
          小程序邀请码
        </div>
        <el-button plain class="w-full" @click="logout">
          退出登录
        </el-button>
      </template>
    </el-popover>

    <CalendarDrawer v-model:open="showCalendar" />

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

    <ProForm
      ref="qrcodeFormRef"
      v-model:open="openQrcode"
      type="drawer"
      :drawer-props="{ title: '获取小程序邀请码' }"
      :columns="[
        {
          prop: 'qRCodeUseFor',
          label: '邀请码用途',
          valueType: 'select',
          initFn: async (formItem) => {
            formItem.valueEnum = await getApiV1DictBytypecodeOptions({ typeCode: 'QRCodeUseFor' })
          },
          rules: [{ required: true, trigger: 'change' }],
        },
        {
          prop: '',
          label: '',
          valueType: 'custom',
          slotName: 'img',
        },
      ]"
      :on-submit="onQrcodeSubmit"
    >
      <template v-if="qrcodeImage" #img>
        <img :src="qrcodeImage" class="w-full">
      </template>
    </ProForm>
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

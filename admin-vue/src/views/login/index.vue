<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import type { LocationQuery, LocationQueryValue } from 'vue-router'
import { useRoute } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { ElButton, ElCard, ElForm, ElFormItem, ElImage, ElInput, ElSwitch, ElTag, ElTooltip } from 'element-plus'
import { useSettingsStore, useUserStore } from '@/store'
import AuthAPI from '@/api/auth'
import type { LoginData } from '@/api/auth/model'
import router from '@/router'
import defaultSettings from '@/settings'
import { ThemeEnum } from '@/enums/ThemeEnum'

// Stores
const userStore = useUserStore()
const settingsStore = useSettingsStore()

// Reactive states
const isDark = ref(settingsStore.theme === ThemeEnum.DARK)
const loading = ref(false) // 按钮loading
const isCapslock = ref(false) // 是否大写锁定
const captchaBase64 = ref() // 验证码图片Base64字符串
const loginFormRef = ref<FormInstance>() // 登录表单ref

const login = ref({
  username: '请输入用户名',
  password: '请输入密码',
  captchaCode: '请输入验证码',
  login: '登录',
})

const loginData = ref<LoginData>({
  username: '',
  password: '',
})

const loginRules = computed(() => {
  return {
    username: [
      {
        required: true,
        trigger: 'blur',
        message: '用户名不能为空',
      },
    ],
    password: [
      {
        required: true,
        trigger: 'blur',
        message: '密码不能为空',
      },
      {
        min: 6,
        message: '密码长度不能少于6位',
        trigger: 'blur',
      },
    ],
    captchaCode: [
      {
        required: true,
        trigger: 'blur',
        message: '验证码不能为空',
      },
    ],
  }
})

/** 获取验证码 */
function getCaptcha() {
  AuthAPI.getCaptcha().then((data) => {
    loginData.value.captchaKey = data.captchaKey
    captchaBase64.value = data.captchaBase64
  })
}

/** 登录 */
const route = useRoute()
function handleLogin() {
  loginFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      loading.value = true
      userStore
        .login(loginData.value)
        .then(() => {
          const query: LocationQuery = route.query
          const redirect = (query.redirect as LocationQueryValue) ?? '/'
          const otherQueryParams = Object.keys(query).reduce(
            (acc: any, cur: string) => {
              if (cur !== 'redirect') { acc[cur] = query[cur] }

              return acc
            },
            {},
          )

          router.push({ path: redirect, query: otherQueryParams })
        })
        .catch(() => {
          getCaptcha()
        })
        .finally(() => {
          loading.value = false
        })
    }
  })
}

/** 主题切换 */
function toggleTheme() {
  const newTheme
    = settingsStore.theme === ThemeEnum.DARK ? ThemeEnum.LIGHT : ThemeEnum.DARK
  settingsStore.changeTheme(newTheme)
}

/** 检查输入大小写 */
function checkCapslock(event: KeyboardEvent) {
  // 防止浏览器密码自动填充时报错
  if (event instanceof KeyboardEvent) { isCapslock.value = event.getModifierState('CapsLock') }
}

onMounted(() => {
  getCaptcha()
})
</script>

<template>
  <div class="wh-full flex-center flex-col login-container">
    <!-- 顶部 -->
    <div class="absolute-lt flex-x-end p-3 w-full">
      <ElSwitch v-model="isDark" inline-prompt active-icon="Moon" inactive-icon="Sunny" @change="toggleTheme" />
    </div>
    <!-- 登录表单 -->
    <ElCard class="!border-none !bg-transparent !rounded-4% w-100 <sm:w-85">
      <div class="text-center relative">
        <h2>{{ defaultSettings.title }}</h2>
        <ElTag class="ml-2 absolute-rt">
          {{ defaultSettings.version }}
        </ElTag>
      </div>

      <ElForm ref="loginFormRef" :model="loginData" :rules="loginRules" class="login-form">
        <!-- 用户名 -->
        <ElFormItem prop="username">
          <div class="flex-y-center w-full">
            <div class="i-svg:user mx-2" />
            <ElInput
              ref="username" v-model="loginData.username" :placeholder="login.username" name="username"
              size="large" class="h-[48px]"
            />
          </div>
        </ElFormItem>

        <!-- 密码 -->
        <ElTooltip :visible="isCapslock" content="login.capsLock" placement="right">
          <ElFormItem prop="password">
            <div class="flex-y-center w-full">
              <div class="i-svg:lock mx-2" />
              <ElInput
                v-model="loginData.password" :placeholder="login.password" type="password" name="password"
                size="large" class="h-[48px] pr-2" show-password @keyup="checkCapslock" @keyup.enter="handleLogin"
              />
            </div>
          </ElFormItem>
        </ElTooltip>

        <!-- 验证码 -->
        <ElFormItem prop="captchaCode">
          <div class="flex-y-center w-full">
            <div class="i-svg:captcha mx-2" />
            <ElInput
              v-model="loginData.captchaCode" auto-complete="off" size="large" class="flex-1"
              :placeholder="login.captchaCode" @keyup.enter="handleLogin"
            />

            <ElImage
              :src="captchaBase64" class="rounded-tr-md rounded-br-md cursor-pointer h-[48px]"
              @click="getCaptcha"
            />
          </div>
        </ElFormItem>

        <!-- 登录按钮 -->
        <ElButton :loading="loading" type="primary" size="large" class="w-full" @click.prevent="handleLogin">
          {{ login.login }}
        </ElButton>
      </ElForm>
    </ElCard>
    <!-- ICP备案 -->
    <div class="absolute bottom-0 w-full text-center text-12px">
      <p>
        Copyright © 2021 - 2025 上海MZY教育科技有限公司.
        <a
          href="https://beian.miit.gov.cn/#/Integrated/index"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:underline"
        >
          沪ICP备2024041709号-1
        </a>
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  overflow-y: auto;
  background: url("@/assets/images/login-bg.svg");
  background-size: cover;

  .login-form {
    padding: 30px 10px;
  }
}

.el-form-item {
  background: var(--el-input-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 5px;
}

:deep(.el-input) {
  .el-input__wrapper {
    padding: 0;
    background-color: transparent;
    box-shadow: none;

    &.is-focus,
    &:hover {
      box-shadow: none !important;
    }

    input:-webkit-autofill {
      /* 通过延时渲染背景色变相去除背景颜色 */
      transition: background-color 1000s ease-in-out 0s;
    }
  }
}
</style>

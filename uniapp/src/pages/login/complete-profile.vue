<template>
  <view class="complete-profile-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <wd-icon name="arrow-left" size="20" color="#fff" @click="goBack" />
      <text class="nav-title">完善个人信息</text>
      <view style="width: 20px"></view>
    </view>

    <!-- 蓝色区域内容 -->
    <view class="top-content">
      <view class="title">完善个人信息</view>
      <view class="subtitle">完善您的个人信息以获得更好的使用体验</view>
    </view>

    <!-- 白色区域 -->
    <view class="bottom-content">
      <!-- 头像上传 -->
      <view class="avatar-section">
        <view class="avatar-wrapper" @click="chooseAvatar">
          <image v-if="userForm.avatar" :src="userForm.avatar" class="avatar" />
          <view v-else class="avatar-placeholder">
            <wd-icon name="fill-camera" size="28" color="#999" />
          </view>
          <view class="avatar-upload">
            <wd-icon name="camera" size="16" color="#fff" />
          </view>
        </view>
        <view class="avatar-tip">点击更换头像</view>
      </view>

      <!-- 表单部分 -->
      <view class="form-section">
        <wd-form ref="formRef" :model="userForm">
          <!-- 昵称输入框 -->
          <view class="input-wrap">
            <text class="input-label">昵称</text>
            <input
              v-model="userForm.nickname"
              class="form-input"
              placeholder="请输入您的昵称"
              placeholder-style="color: #999; font-weight: normal;"
            />
            <wd-icon
              v-if="userForm.nickname"
              name="close-fill"
              size="18"
              color="#999"
              class="clear-icon"
              @click="userForm.nickname = ''"
            />
          </view>
          <view class="divider"></view>

          <!-- 性别选择 -->
          <view class="gender-wrap">
            <text class="input-label">性别</text>
            <view class="gender-options">
              <view
                class="gender-option"
                :class="userForm.gender === 1 ? 'gender-selected' : ''"
                @click="userForm.gender = 1"
              >
                <text>男</text>
              </view>
              <view
                class="gender-option"
                :class="userForm.gender === 2 ? 'gender-selected' : ''"
                @click="userForm.gender = 2"
              >
                <text>女</text>
              </view>
            </view>
          </view>
          <view class="divider"></view>

          <!-- 提交按钮 -->
          <view class="button-wrap">
            <button
              class="submit-button"
              :disabled="submitting"
              :style="submitting ? 'opacity: 0.7;' : ''"
              @click="handleSubmit"
            >
              提交
            </button>
          </view>

          <!-- 微信获取信息按钮 -->
          <view v-if="isWechatEnv" class="button-wrap mt-20">
            <button
              class="wechat-button"
              :disabled="wxAuthing"
              :style="wxAuthing ? 'opacity: 0.7;' : ''"
              @click="handleGetWechatInfo"
            >
              <image src="/static/icons/weixin.png" class="wechat-icon" />
              <text>一键获取微信头像昵称</text>
            </button>
          </view>
        </wd-form>
      </view>
    </view>

    <!-- 头像裁剪 -->
    <wd-img-cropper v-model="avatarShow" :img-src="originalSrc" @confirm="handleAvatarConfirm" />

    <!-- 弹窗 -->
    <wd-toast />
  </view>
</template>

<script lang="ts" setup>
import { onLoad } from "@dcloudio/uni-app";
import { useToast } from "wot-design-uni";
import { useUserStore } from "@/store/modules/user";
import FileAPI, { type FileInfo } from "@/api/file";
import UserAPI, { type UserProfileForm } from "@/api/system/user";
import { ref } from "vue";

const toast = useToast();
const formRef = ref();
const userStore = useUserStore();
const submitting = ref(false);
const wxAuthing = ref(false);
const avatarShow = ref(false);
const originalSrc = ref("");
const redirectPath = ref("/pages/index/index");

// 用户表单数据
const userForm = ref<UserProfileForm>({
  nickname: "",
  gender: 1,
  avatar: "",
});

// 判断是否微信环境
const isWechatEnv = ref(false);

// 获取参数
onLoad((options) => {
  // 读取用户信息
  if (userStore.userInfo) {
    userForm.value.nickname = userStore.userInfo.nickname || "";
    userForm.value.gender = userStore.userInfo.gender || 1;
    userForm.value.avatar = userStore.userInfo.avatar || "";
  }

  // 保存跳转路径
  if (options.redirect) {
    redirectPath.value = decodeURIComponent(options.redirect);
  }

  // 检测环境
  // #ifdef MP-WEIXIN
  isWechatEnv.value = true;
  // #endif
});

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

// 选择头像
const chooseAvatar = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      originalSrc.value = res.tempFilePaths[0];
      avatarShow.value = true;
    },
  });
};

// 头像裁剪完成
const handleAvatarConfirm = (event: any) => {
  const { tempFilePath } = event;
  // 显示上传中
  uni.showLoading({ title: "上传中..." });

  // 上传头像
  FileAPI.upload(tempFilePath)
    .then((fileInfo: FileInfo) => {
      userForm.value.avatar = fileInfo.url;
      uni.hideLoading();
    })
    .catch(() => {
      uni.hideLoading();
      toast.error("头像上传失败，请重试");
    });
};

// 一键获取微信信息
const handleGetWechatInfo = () => {
  wxAuthing.value = true;

  // #ifdef MP-WEIXIN
  // @ts-ignore
  uni.getUserProfile({
    desc: "用于完善用户资料",
    success: (res) => {
      const { userInfo } = res;
      // 填充表单
      userForm.value.nickname = userInfo.nickName;
      userForm.value.gender = userInfo.gender;

      // 如果有头像，下载并上传头像
      if (userInfo.avatarUrl) {
        uni.showLoading({ title: "获取头像中..." });

        // 下载微信头像
        uni.downloadFile({
          url: userInfo.avatarUrl,
          success: (res) => {
            if (res.statusCode === 200) {
              // 上传到服务器
              FileAPI.upload(res.tempFilePath)
                .then((fileInfo: FileInfo) => {
                  userForm.value.avatar = fileInfo.url;
                  uni.hideLoading();
                })
                .catch(() => {
                  uni.hideLoading();
                  toast.error("头像上传失败");
                });
            }
          },
          fail: () => {
            uni.hideLoading();
            toast.error("获取微信头像失败");
          },
        });
      }
    },
    fail: () => {
      toast.error("获取微信信息失败，请手动填写");
    },
    complete: () => {
      wxAuthing.value = false;
    },
  });
  // #endif

  // 非微信环境
  // #ifndef MP-WEIXIN
  toast.error("当前环境不支持获取微信信息");
  wxAuthing.value = false;
  // #endif
};

// 提交表单
const handleSubmit = () => {
  if (submitting.value) return;

  // 简单验证
  if (!userForm.value.nickname.trim()) {
    toast.error("请填写昵称");
    return;
  }

  submitting.value = true;

  // 更新用户信息
  UserAPI.updateProfile(userForm.value)
    .then(async () => {
      // 更新本地存储的用户信息
      await userStore.getInfo();
      toast.success("信息已更新");

      // 延迟跳转
      setTimeout(() => {
        uni.reLaunch({
          url: redirectPath.value,
        });
      }, 1500);
    })
    .catch(() => {
      toast.error("更新失败，请重试");
    })
    .finally(() => {
      submitting.value = false;
    });
};
</script>

<style lang="scss" scoped>
.complete-profile-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #0063ff;
}

.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  padding-top: calc(30rpx + var(--status-bar-height, 0px));
}

.nav-title {
  font-size: 36rpx;
  font-weight: 500;
  color: #fff;
}

.top-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 0 60rpx;
}

.top-content .title {
  margin-bottom: 20rpx;
  font-size: 36rpx;
  font-weight: 500;
  color: #fff;
}

.top-content .subtitle {
  padding: 0 60rpx;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
}

.bottom-content {
  flex: 1;
  padding: 40rpx 30rpx;
  overflow-y: auto;
  background-color: #fff;
  border-radius: 30rpx 30rpx 0 0;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40rpx;
}

.avatar-section .avatar-wrapper {
  position: relative;
  width: 160rpx;
  height: 160rpx;
  margin-bottom: 20rpx;
}

.avatar-section .avatar-wrapper .avatar {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
}

.avatar-section .avatar-wrapper .avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 160rpx;
  height: 160rpx;
  background-color: #f5f7fa;
  border-radius: 50%;
}

.avatar-section .avatar-wrapper .avatar-upload {
  position: absolute;
  right: 5rpx;
  bottom: 5rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40rpx;
  height: 40rpx;
  background-color: #4080ff;
  border: 2rpx solid #fff;
  border-radius: 50%;
}

.avatar-section .avatar-tip {
  font-size: 26rpx;
  color: #666;
}

.form-section .input-wrap {
  position: relative;
  display: flex;
  align-items: center;
  padding: 20rpx 0;
}

.form-section .input-wrap .input-label {
  width: 100rpx;
  font-size: 28rpx;
  color: #333;
}

.form-section .input-wrap .form-input {
  flex: 1;
  height: 60rpx;
  font-size: 28rpx;
  line-height: 60rpx;
  color: #333;
}

.form-section .input-wrap .clear-icon {
  padding: 10rpx;
}

.form-section .gender-wrap {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
}

.form-section .gender-wrap .input-label {
  width: 100rpx;
  font-size: 28rpx;
  color: #333;
}

.form-section .gender-wrap .gender-options {
  display: flex;
  flex: 1;
  gap: 20rpx;
  justify-content: flex-end;
}

.form-section .gender-wrap .gender-options .gender-option {
  padding: 10rpx 30rpx;
  font-size: 28rpx;
  color: #666;
  background-color: #f5f7fa;
  border-radius: 10rpx;
}

.form-section .gender-wrap .gender-options .gender-option.gender-selected {
  color: #fff;
  background-color: #4080ff;
}

.form-section .divider {
  height: 1px;
  margin: 0 0 10rpx 0;
  background-color: #e8e8e8;
}

.form-section .button-wrap {
  margin-top: 60rpx;
}

.form-section .button-wrap .submit-button {
  width: 100%;
  height: 90rpx;
  font-size: 32rpx;
  line-height: 90rpx;
  color: #fff;
  background-color: #4080ff;
  border: none;
  border-radius: 45rpx;
}

.form-section .button-wrap .wechat-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 90rpx;
  font-size: 30rpx;
  color: #fff;
  background-color: #07c160;
  border: none;
  border-radius: 45rpx;
}

.form-section .button-wrap .wechat-button .wechat-icon {
  width: 36rpx;
  height: 36rpx;
  margin-right: 10rpx;
}

.mt-20 {
  margin-top: 20rpx;
}
</style>

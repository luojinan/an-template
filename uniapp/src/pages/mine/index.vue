<template>
  <view class="mine-container">
    <!-- 用户信息区域 -->
    <view class="user-info">
      <view class="user-left">
        <view class="avatar-container">
          <nut-avatar size="large">
            <image src="https://dsjedu-assets.oss-cn-shanghai.aliyuncs.com/head_moren@2x.png" />
          </nut-avatar>
          
          <image 
            v-if="level == 1" 
            class="avatar-logo" 
            src="https://dsjedu-assets.oss-cn-shanghai.aliyuncs.com/vip_kuang1@2x.png" 
            mode="widthFix" 
          />
          <image 
            v-if="level == 2" 
            class="avatar-logo" 
            src="https://dsjedu-assets.oss-cn-shanghai.aliyuncs.com/vip_kuang2@2x.png" 
            mode="widthFix" 
          />
          <image 
            v-if="level == 3" 
            class="avatar-logo" 
            src="https://dsjedu-assets.oss-cn-shanghai.aliyuncs.com/vip_kuang3@2x.png" 
            mode="widthFix" 
          />
          <image 
            v-if="level == 4" 
            class="avatar-logo" 
            src="https://dsjedu-assets.oss-cn-shanghai.aliyuncs.com/vip_kuang4@2x.png" 
            mode="widthFix" 
          />
        </view>

        <view class="nickname-container">
          <view @click="turnToLogin" v-if="!hasUser">点击登录</view>
          <view v-else>{{ nickname || (phoneTail ? "游客"+phoneTail : "") }}</view>
          <view v-if="level" class="level-container" @click="turnToVIP">
            <image 
              v-if="level == 1" 
              class="vip-logo" 
              src="https://dsjedu-assets.oss-cn-shanghai.aliyuncs.com/Group 1779@2x.png" 
            />
            <image 
              v-if="level == 2" 
              class="vip-logo" 
              src="https://dsjedu-assets.oss-cn-shanghai.aliyuncs.com/Group 1780@2x.png" 
            />
            <image 
              v-if="level == 3" 
              class="vip-logo" 
              src="https://dsjedu-assets.oss-cn-shanghai.aliyuncs.com/Group 1785@2x.png" 
            />
            <image 
              v-if="level == 4" 
              class="vip-logo" 
              src="https://dsjedu-assets.oss-cn-shanghai.aliyuncs.com/Group 1786@2x.png" 
            />
            <view 
              class="level-name" 
              :class="{
                'gray': level == 1,
                'orange': level == 2,
                'purple': level == 3,
                'green': level == 4
              }"
            >
              {{ levelName }}
            </view>
          </view>
        </view>
      </view>

      <view class="user-right">
        <view class="notice-container" v-if="isVip">
          <nut-icon name="notice" size="20" />
          <view class="notice-num" v-if="noticeNum > 0">{{ noticeNum }}</view>
        </view>
        <nut-icon name="setting" size="20" @click="turnToSettings" />
      </view>
    </view>

    <!-- 钱包区域 -->
    <view class="wallet-container">
      <view class="wallet-card" @click="turnToDo(walletItem)">
        <view class="wallet-header">
          <text>我的钱包</text>
          <nut-icon name="right" size="12" />
        </view>
        <image class="wallet-bg" src="https://dsjedu-assets.oss-cn-shanghai.aliyuncs.com/center_bg@2x.png" mode="widthFix" />
        <view class="wallet-content" @click.stop="turnToDo(pointItem)">
          <view class="amount-title">积分</view>
          <view class="amount">{{ formatPoint(point) }}</view>
        </view>
      </view>

      <!-- 菜单区域 -->
      <view class="menu-grid">
        <nut-grid :column-num="4">
          <nut-grid-item 
            v-for="item in menu" 
            :key="item.name"
            @click="turnToDo(item)"
          >
            <image class="menu-icon" :src="'https://dsjedu-assets.oss-cn-shanghai.aliyuncs.com/'+item.src" />
            <text class="menu-text">{{ item.name }}</text>
          </nut-grid-item>
        </nut-grid>
      </view>
    </view>

    <!-- 操作列表 -->
    <view class="operation-list">
      <nut-cell-group>
        <nut-cell 
          v-for="item in operationList" 
          :key="item.name"
          :title="item.name"
          :icon="item.src"
          is-link
          @click="turnToDo(item)"
        />
      </nut-cell-group>
    </view>

    <!-- 底部空白区域 -->
    <view class="bottom-blank"></view>

    <!-- 公众号提示 -->
    <view class="official-tip" v-if="showToOfficial">
      <view class="tip-content">
        <nut-icon name="close" @click="closeShowToOfficial" />
        <text>关注公众号，及时接收订单最新消息</text>
      </view>
      <nut-button type="primary" @click="turnToOfficial">去关注</nut-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import CommonAPI from "@/api/common";
// import { useAppStore } from "@/stores/app";
import { useUserStore } from "@/store/index";
import { getWechatCustomerCustGetpoints } from "@/utils/proApi/wx";

// const appStore = useAppStore();
const userStore = useUserStore();

// 数据定义
const menu = ref([
  {
    src: "icon_center_order@2x.png",
    name: "我的订单",
    path: "/pages/orderList/orderList",
  },
  {
    src: "icon_center_quan@2x.png",
    name: "优惠券",
    path: "/pages/coupon/coupon",
  },
  {
    src: "icon_center_point@2x.png",
    name: "我的积分",
    path: "/pages/points/points",
  },
  {
    src: "icon_center_favor@2x.png",
    name: "我的收藏",
    path: "/pages/myCollections/myCollections",
  },
]);

const operationList = ref([
  {
    src: "icon_center_feedback@2x.png",
    name: "我的课表",
    path: "/pages/mySchedule/mySchedule",
  },
  {
    src: "icon_center_class@2x.png",
    name: "我的课程",
    path: "/pages/myCourse/myCourse",
  },
  {
    src: "icon_center_account@2x.png",
    name: "亲子账号",
    path: "/pages/childAccounts/childAccounts",
  },
  {
    src: "icon_center_add@2x.png",
    name: "邀请好友",
    path: "/pages/myInvite/myInvite",
  },
  {
    src: "icon_center_feedback@2x.png",
    name: "意见反馈",
    path: "/pages/feedback/feedback",
  },
]);

const pointItem = {
  name: "积分",
  path: "/pages/points/points",
};

const walletItem = {
  name: "我的钱包",
  path: "/pages/myWallet/myWallet",
};

// 用户信息
const nickname = ref("");
const phoneTail = ref("");
const avatar = ref("");
const isVip = ref(false);
const level = ref(0);
const levelName = ref("");
const noticeNum = ref(0);
const point = ref("");
const hasUser = ref(false);
const showToOfficial = ref(true);
const officialUrl = ref("");

// 方法定义
const formatPoint = (value: string) => {
  if (!value) return "";
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const turnToOfficial = () => {
  uni.navigateTo({
    url: `/pages/officialAccount/officialAccount?src=${encodeURIComponent(officialUrl.value)}`,
  });
};

const getCustMsg = () => {
  const userInfo = userStore.userInfo;
  nickname.value = userInfo?.nickname || "";
  avatar.value = userInfo?.avatar || "";
  phoneTail.value = userInfo?.phone?.slice(7) || "";
  hasUser.value = userStore.hasUser;

  if (userStore.hasUser) {
    isVip.value = true;
    level.value = userInfo?.level || 0;
    levelName.value = userInfo?.levelName || "";
    // getCustomPoint();
  }
};

const getCustomPoint = async () => {
  const points = await getWechatCustomerCustGetpoints();
  point.value = points;
};

const turnToSettings = () => {
  if (!userStore.hasUser) {
    turnToLogin();
    return;
  }

  uni.navigateTo({
    url: "/pages/settings/settings",
    events: {
      updateUserInfo: (data: UserInfo) => {
        userStore.userInfo = data;
      },
      clearUserInfo: () => {
        userStore.userInfo = undefined;
      },
    },
  });
};

interface UserInfo {
  nickname?: string;
  avatar?: string;
  phone?: string;
  level?: number;
  levelName?: string;
  isChild?: boolean;
}

interface MenuItem {
  src: string;
  name: string;
  path: string;
}

const turnToDo = (item: MenuItem) => {
  if (!userStore.hasUser) {
    turnToLogin();
    return;
  }

  const path = item.path;
  if (
    userStore.isChild &&
    ![
      "/pages/myCourse/myCourse",
      "/pages/mySchedule/mySchedule",
      "/pages/myInvite/myInvite",
    ].includes(path)
  ) {
    uni.showToast({
      icon: "none",
      title: "暂无权限，请用主账号查看",
    });
    return;
  }

  if (path) {
    uni.navigateTo({ url: path });
  }
};

const turnToLogin = () => {
  uni.navigateTo({
    url: "/pages/login/login",
    events: {
      refresh: () => {
        getCustMsg();
      },
    },
  });
};

const turnToVIP = () => {
  uni.navigateTo({
    url: "/pages/vip/vip",
  });
};

const closeShowToOfficial = () => {
  showToOfficial.value = false;
};

// 生命周期
onMounted(() => {
  CommonAPI.login()
  
    // // 获取微信登录的临时 code
    // const { code } = await uni.login({
    //   provider: "weixin",
    // });

    // // 调用后端接口进行登录认证
    // const result = await userStore.loginByWechat(code);

    // if (result) {
    //   // 获取用户信息
    //   await userStore.getInfo();
    //   toast.success("登录成功");
    // }
});
</script>

<style lang="scss">
.mine-container {
  min-height: 100vh;
  background-color: #f5f6f7;
  padding-bottom: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 13px;
  height: 60px;
  position: relative;
  z-index: 1;
}

.user-left,
.user-right,
.notice-container {
  display: flex;
  align-items: center;
}

.notice-container {
  margin-right: 25px;
  position: relative;
}

.notice-num {
  position: absolute;
  top: -50%;
  left: 50%;
  padding: 2px 4px;
  background: #f49843;
  border-radius: 30px;
  font-weight: bold;
  font-size: 12px;
  color: #ffffff;
  line-height: 14px;
  text-align: center;
}

.avatar-container {
  position: relative;
  height: 60px;
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;

  .avatar-logo {
    position: absolute;
    top: -1px;
    left: -1px;
    height: 60px;
    width: 60px;
  }
}

.nickname-container {
  margin-left: 7px;
  font-weight: bold;
  font-size: 16px;
  color: #333333;
  line-height: 22px;
}

.level-container {
  position: relative;
  margin-left: -3px;

  .vip-logo {
    width: 104px;
    height: 28px;
  }

  .level-name {
    position: absolute;
    bottom: 6px;
    left: 31px;
    font-weight: bold;
    font-size: 13px;
    line-height: 18px;

    &.gray {
      color: #444444;
    }

    &.orange {
      color: #865418;
    }

    &.purple {
      color: #984396;
    }

    &.green {
      color: #4A854F;
    }
  }
}

.wallet-container {
  margin: 10px 0 0 13px;
  height: 175px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02),
              0 7px 7px rgba(0, 0, 0, 0.02),
              0 15px 9px rgba(0, 0, 0, 0.01),
              0 27px 11px rgba(0, 0, 0, 0),
              0 43px 12px rgba(0, 0, 0, 0);
}

.wallet-card {
  position: relative;
  z-index: 1;
  width: 350px;
  height: 96px;
}

.wallet-bg {
  width: 350px;
  position: absolute;
  z-index: 12;
}

.wallet-header {
  background: #7d5728;
  border-radius: 15px 15px 0 0;
  position: absolute;
  z-index: 11;
  top: 5px;
  width: 100%;
  height: 45px;
  font-weight: bold;
  font-size: 12px;
  color: #ffffff;
  line-height: 14px;
  display: flex;
  justify-content: flex-end;
  padding-right: 24px;
  padding-top: 7px;
  box-sizing: border-box;
}

.wallet-content {
  width: 65%;
  position: relative;
  z-index: 13;
  padding: 14px 0 0 22px;
}

.amount-title {
  font-weight: bold;
  font-size: 15px;
  color: #FFFFFF;
  line-height: 21px;
}

.amount {
  font-weight: 500;
  font-size: 24px;
  color: #FFFFFF;
  line-height: 29px;
  margin-top: 3px;
}

.menu-grid {
  width: 350px;
  height: 97px;
  background: #ffffff;
  border-radius: 15px;
  position: relative;
  top: -18px;
  z-index: 13;
}

.menu-icon {
  width: 40px;
  height: 40px;
}

.menu-text {
  font-weight: 500;
  font-size: 15px;
  color: #333333;
  line-height: 21px;
  margin-top: 6px;
}

.operation-list {
  margin-top: 15px;
  width: 350px;
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02),
              0 7px 7px rgba(0, 0, 0, 0.02),
              0 15px 9px rgba(0, 0, 0, 0.01),
              0 27px 11px rgba(0, 0, 0, 0),
              0 43px 12px rgba(0, 0, 0, 0);
  border-radius: 15px;
  margin-left: 13px;
}

.bottom-blank {
  height: 20px;
}

.official-tip {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .tip-content {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}
</style>

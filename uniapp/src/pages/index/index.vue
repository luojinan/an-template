<template>
  <view class="mine-container">
    <!-- 顶部区域 -->
    <view class="header">
      <view class="region-select" @tap="showSelect">
        {{regionItem.name || '全球'}}
        <nut-icon name="arrow-down" size="14" color="#333" />
      </view>
      <view class="search-box" @tap="turnToSearch">
        <nut-icon name="search" size="16" color="#999" />
        <swiper class="search-swiper" autoplay vertical circular :interval="interval" @change="searchTermsChange">
          <swiper-item v-for="(item, index) in searchTerms" :key="index">
            <text class="search-text">{{item}}</text>
          </swiper-item>
        </swiper>
      </view>
    </view>

    <!-- 数据统计 -->
    <view class="stats">
      <view class="stat-item">
        <nut-icon name="clock" size="24" />
        <view class="stat-content">
          <text class="value">{{history}}</text>
          <text class="label">年专注国际教育</text>
        </view>
      </view>
      <view class="stat-item">
        <nut-icon name="user" size="24" />
        <view class="stat-content">
          <text class="value">{{trainees}}</text>
          <text class="label">名服务学员</text>
        </view>
      </view>
      <view class="stat-item">
        <nut-icon name="star" size="24" />
        <view class="stat-content">
          <text class="value">{{goodRatings}}%</text>
          <text class="label">好评率</text>
        </view>
      </view>
    </view>

    <!-- 轮播图 -->
    <nut-swiper
      v-if="swiperList.length"
      :list="swiperList"
      :height="320"
      :loop="true"
      :autoplay="3000"
      @change="onSwiperChange"
    />

    <!-- 课程分类 -->
    <view class="category">
      <view 
        v-for="(item, index) in line4Data" 
        :key="index"
        class="category-item"
        @tap="turnToClassify(item, index)"
      >
        <image class="category-icon" :src="line4ImageList[index]" mode="aspectFit" />
        <text class="category-name">{{item.name}}</text>
      </view>
    </view>

    <!-- 优秀导师 -->
    <view v-if="teacherList.length" class="section">
      <view class="section-header">
        <text class="section-title">优秀导师</text>
        <view class="more" @tap="turnToMoreTeacher">
          <text>查看更多</text>
          <nut-icon name="arrow-right" size="14" color="#999" />
        </view>
      </view>
      <view class="teacher-list">
        <view 
          v-for="(item, index) in teacherList" 
          :key="index"
          class="teacher-item"
          @tap="turnToShowTeacher(item, index)"
        >
          <image class="teacher-avatar" :src="item.avatarUrl" mode="aspectFill" />
          <text class="teacher-name">{{item.displayName}}</text>
          <text class="teacher-major">{{item.teachingMajor || ''}}</text>
          <text class="teacher-slogan">{{item.homeSlogan || ''}}</text>
          <view v-if="index === showServiceTipsIndex" class="service-tips">
            <nut-icon name="service" size="16" color="#fff" />
            <text>查看导师详情请联系客服</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 优质课程 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">优质课程</text>
        <view class="more" @tap="turnToMoreCourse">
          <text>查看更多</text>
          <nut-icon name="arrow-right" size="14" color="#999" />
        </view>
      </view>
      <view class="course-list">
        <view 
          v-for="(item, index) in courseList" 
          :key="index"
          class="course-item"
          @tap="turnToShowCourse(item)"
        >
          <image class="course-cover" :src="item.cover" mode="aspectFill" />
          <view class="course-info">
            <text class="course-name">{{item.name}}</text>
            <text class="course-desc">{{item.description}}</text>
            <view class="course-tags">
              <text class="tag">{{ageRange[item.ageRange]}}</text>
              <text class="tag">{{TeachingMethods[item.teachingMethod]}}</text>
              <text class="tag">{{teachLanguage[item.language]}}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 学习指南 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">学习指南</text>
        <view class="more" @tap="turnToMoreMsg">
          <text>查看更多</text>
          <nut-icon name="arrow-right" size="14" color="#999" />
        </view>
      </view>
      <view class="article-list">
        <view 
          v-for="(item, index) in articleList" 
          :key="index"
          class="article-item"
          @tap="showArticeDetail(item)"
        >
          <image v-if="index === 0" class="article-image" :src="item.mainPicture" mode="aspectFill" />
          <view class="article-content">
            <text class="article-title">{{item.title}}</text>
            <text class="article-desc">{{item.articleDesc}}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 合作机构 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">合作机构和学校</text>
        <view class="more" @tap="turnToMoreInstitution">
          <text>查看更多</text>
          <nut-icon name="arrow-right" size="14" color="#999" />
        </view>
      </view>
      <view class="institution-list">
        <view 
          v-for="(item, index) in schoolList" 
          :key="index"
          class="institution-item"
        >
          <image class="institution-logo" :src="item.logo" mode="aspectFit" />
          <text class="institution-name">{{item.name}}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

// 数据定义
const regionItem = ref({ name: "" });
const searchTerms = ref<string[]>([]);
const interval = ref(3000);
const history = ref(0);
const trainees = ref(0);
const goodRatings = ref(0);
const swiperList = ref<string[]>([]);
const line4Data = ref<any[]>([]);
const line4ImageList = ref<string[]>([]);
const teacherList = ref<any[]>([]);
const showServiceTipsIndex = ref(-1);
const courseList = ref<any[]>([]);
const articleList = ref<any[]>([]);
const schoolList = ref<any[]>([]);

// 枚举数据
const ageRange = {
  1: "3-6岁",
  2: "7-12岁",
  3: "13-18岁",
  4: "成人",
};

const TeachingMethods = {
  1: "一对一",
  2: "小班课",
  3: "大班课",
};

const teachLanguage = {
  1: "中文",
  2: "英文",
  3: "双语",
};

// 方法定义
const showSelect = () => {
  // TODO: 实现地区选择
};

const turnToSearch = () => {
  // TODO: 跳转到搜索页面
};

const searchTermsChange = (e: any) => {
  console.log("search terms change", e);
};

const onSwiperChange = (e: any) => {
  console.log("swiper change", e);
};

const turnToClassify = (item: any, index: number) => {
  // TODO: 跳转到分类页面
};

const turnToMoreTeacher = () => {
  // TODO: 跳转到更多导师页面
};

const turnToShowTeacher = (item: any, index: number) => {
  // TODO: 跳转到导师详情页面
};

const turnToMoreCourse = () => {
  // TODO: 跳转到更多课程页面
};

const turnToShowCourse = (item: any) => {
  // TODO: 跳转到课程详情页面
};

const turnToMoreMsg = () => {
  // TODO: 跳转到更多文章页面
};

const showArticeDetail = (item: any) => {
  // TODO: 跳转到文章详情页面
};

const turnToMoreInstitution = () => {
  // TODO: 跳转到更多机构页面
};
</script>

<style lang="scss" scoped>
.mine-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding-bottom: 100rpx;
}

.header {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #fff;

  .region-select {
    display: flex;
    align-items: center;
    margin-right: 20rpx;
    font-size: 28rpx;
    color: #333;
  }

  .search-box {
    flex: 1;
    display: flex;
    align-items: center;
    height: 72rpx;
    padding: 0 20rpx;
    background-color: #f5f5f5;
    border-radius: 36rpx;

    .search-swiper {
      flex: 1;
      height: 72rpx;
      margin-left: 10rpx;

      .search-text {
        font-size: 26rpx;
        color: #999;
        line-height: 72rpx;
      }
    }
  }
}

.stats {
  display: flex;
  padding: 30rpx;
  background-color: #fff;
  margin-bottom: 20rpx;

  .stat-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    .stat-content {
      margin-left: 10rpx;

      .value {
        font-size: 36rpx;
        font-weight: bold;
        color: #333;
      }

      .label {
        font-size: 24rpx;
        color: #666;
      }
    }
  }
}

.category {
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx;
  background-color: #fff;
  margin-bottom: 20rpx;

  .category-item {
    width: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx 0;

    .category-icon {
      width: 80rpx;
      height: 80rpx;
      margin-bottom: 10rpx;
    }

    .category-name {
      font-size: 24rpx;
      color: #333;
    }
  }
}

.section {
  background-color: #fff;
  margin-bottom: 20rpx;
  padding: 30rpx;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;

    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }

    .more {
      display: flex;
      align-items: center;

      text {
        font-size: 24rpx;
        color: #999;
        margin-right: 6rpx;
      }
    }
  }
}

.teacher-list {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -10rpx;

  .teacher-item {
    width: 33.33%;
    padding: 10rpx;
    position: relative;

    .teacher-avatar {
      width: 100%;
      height: 200rpx;
      border-radius: 8rpx;
      margin-bottom: 10rpx;
    }

    .teacher-name {
      font-size: 28rpx;
      color: #333;
      font-weight: bold;
    }

    .teacher-major {
      font-size: 24rpx;
      color: #666;
    }

    .teacher-slogan {
      font-size: 22rpx;
      color: #999;
    }

    .service-tips {
      position: absolute;
      top: 10rpx;
      left: 10rpx;
      right: 10rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 40rpx;
      background-color: rgba(0, 0, 0, 0.6);
      border-radius: 4rpx;

      text {
        font-size: 22rpx;
        color: #fff;
        margin-left: 6rpx;
      }
    }
  }
}

.course-list {
  .course-item {
    display: flex;
    margin-bottom: 20rpx;

    .course-cover {
      width: 200rpx;
      height: 150rpx;
      border-radius: 8rpx;
      margin-right: 20rpx;
    }

    .course-info {
      flex: 1;

      .course-name {
        font-size: 28rpx;
        color: #333;
        font-weight: bold;
        margin-bottom: 10rpx;
      }

      .course-desc {
        font-size: 24rpx;
        color: #666;
        margin-bottom: 10rpx;
      }

      .course-tags {
        display: flex;
        flex-wrap: wrap;

        .tag {
          font-size: 22rpx;
          color: #666;
          background-color: #f5f5f5;
          padding: 4rpx 12rpx;
          border-radius: 4rpx;
          margin-right: 10rpx;
          margin-bottom: 10rpx;
        }
      }
    }
  }
}

.article-list {
  .article-item {
    display: flex;
    margin-bottom: 20rpx;

    .article-image {
      width: 200rpx;
      height: 150rpx;
      border-radius: 8rpx;
      margin-right: 20rpx;
    }

    .article-content {
      flex: 1;

      .article-title {
        font-size: 28rpx;
        color: #333;
        font-weight: bold;
        margin-bottom: 10rpx;
      }

      .article-desc {
        font-size: 24rpx;
        color: #666;
      }
    }
  }
}

.institution-list {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -10rpx;

  .institution-item {
    width: 25%;
    padding: 10rpx;
    display: flex;
    flex-direction: column;
    align-items: center;

    .institution-logo {
      width: 120rpx;
      height: 120rpx;
      margin-bottom: 10rpx;
    }

    .institution-name {
      font-size: 24rpx;
      color: #333;
      text-align: center;
    }
  }
}
</style>

<script setup lang="ts">
import type { EpPropMergeType } from 'element-plus/es/utils/vue/props/types'
import { ElCard, ElCol, ElEmpty, ElRow } from 'element-plus'
import { TransitionPresets, useTransition } from '@vueuse/core'
import { useUserStore } from '@/store/modules/user'

defineOptions({
  name: 'Dashboard',
  inheritAttrs: false,
})

const imgSrc = ref(new URL(`../../assets/welcome.png`, import.meta.url).href)

const userStore = useUserStore()
const date: Date = new Date()

const greetings = computed(() => {
  const hours = date.getHours()
  if (hours >= 6 && hours < 8) { return '晨起披衣出草堂，轩窗已自喜微凉🌅！' }
  else if (hours >= 8 && hours < 12) { return `上午好，${userStore.user.nickname}！` }
  else if (hours >= 12 && hours < 18) { return `下午好，${userStore.user.nickname}！` }
  else if (hours >= 18 && hours < 24) { return `晚上好，${userStore.user.nickname}！` }
  else { return '偷偷向银河要了一把碎星，只等你闭上眼睛撒入你的梦中，晚安🌛！' }
})

const duration = 5000

// 销售额
const amount = ref(0)
const amountOutput = useTransition(amount, {
  duration,
  transition: TransitionPresets.easeOutExpo,
})
amount.value = 2000

// 销售额
const visitCount = ref(0)
const visitCountOutput = useTransition(visitCount, {
  duration,
  transition: TransitionPresets.easeOutExpo,
})
visitCount.value = 2000

// 订单量
const dauCount = ref(0)
const dauCountOutput = useTransition(dauCount, {
  duration,
  transition: TransitionPresets.easeOutExpo,
})
dauCount.value = 2000

// 订单量
const orderCount = ref(0)
const orderCountOutput = useTransition(orderCount, {
  duration,
  transition: TransitionPresets.easeOutExpo,
})
orderCount.value = 2000

// 右上角数量
const statisticData = ref([
  {
    value: 99,
    iconClass: 'message',
    title: '消息',
    key: 'message',
  },
  {
    value: 50,
    iconClass: 'todolist',
    title: '待办',
    suffix: '/100',
    key: 'upcoming',
  },
  {
    value: 10,
    iconClass: 'project',
    title: '项目',
    key: 'project',
  },
])

interface CardProp {
  title: string
  tagType: EpPropMergeType<
    StringConstructor,
    'primary' | 'success' | 'info' | 'warning' | 'danger',
    unknown
  >
  tagText: string
  count: any
  dataDesc: string
  iconClass: string
}
// 卡片数量
const cardData = ref<CardProp[]>([
  {
    title: '销售额',
    tagType: 'success',
    tagText: '日',
    count: visitCountOutput,
    dataDesc: '总销售额',
    iconClass: 'money',
  },
  {
    title: '订单量',
    tagType: 'success',
    tagText: '日',
    count: dauCountOutput,
    dataDesc: '总订单量',
    iconClass: 'order',
  },
  {
    title: '新用户',
    tagType: 'primary',
    tagText: '日',
    count: amountOutput,
    dataDesc: '总新用户',
    iconClass: 'visit',
  },
  {
    title: '访问量',
    tagType: 'danger',
    tagText: '日',
    count: orderCountOutput,
    dataDesc: '总访问量',
    iconClass: 'ip',
  },
])
// 图表数据
// const chartData = ref(['BarChart', 'PieChart', 'RadarChart'])
// function chartComponent(item: string) {
//   return defineAsyncComponent(() => import(`./components/${item}.vue`))
// }
</script>

<template>
  <div class="dashboard-container">
    <ElCard shadow="never">
      <ElRow justify="space-between">
        <ElCol :span="18" :xs="24">
          <div class="flex h-full items-center">
            <img
              class="w-20 h-20 mr-5 rounded-full"
              :src="`${userStore.user.avatar}?imageView2/1/w/80/h/80`"
            >
            <div>
              <p>{{ greetings }}</p>
            </div>
          </div>
        </ElCol>

        <ElCol :span="6" :xs="24">
          <div class="flex h-full items-center justify-around" />
        </ElCol>
      </ElRow>
    </ElCard>

    <ElCard shadow="never">
      <ElEmpty
        description="欢迎来到MZY"
      >
        <template #image>
          <img :src="imgSrc" alt="本地图片">
        </template>
      </ElEmpty>
    </ElCard>
  </div>
</template>

<style lang="scss" scoped>
::v-deep{
  .el-empty__image{
    width: 500px;
  }

  .el-empty__description p{
    font-size: 30px;
    font-weight: bold;
    color: black;
  }
}

.dashboard-container {
  position: relative;
  height: 100%;
  padding: 24px;
  overflow-y: auto;

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .github-corner {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    border: 0;
  }

  .data-box {
    display: flex;
    justify-content: space-between;
    padding: 20px;
    font-weight: bold;
    color: var(--el-text-color-regular);
    background: var(--el-bg-color-overlay);
    border-color: var(--el-border-color);
    box-shadow: var(--el-box-shadow-dark);
  }

  .svg-icon {
    fill: currentcolor !important;
  }
}
</style>

<script setup lang="ts">
import { ElButton } from 'element-plus'
import { Draggable } from '@fullcalendar/interaction'
import type { ProFormColumn } from '../ProComponent'
import type { FormRules } from 'element-plus'
import { ProForm } from '../ProComponent'
import CalendarCore from './CalendarCore.vue'
import { adminFormColumns, isInstitutionFormColumns, userStore } from './const'
import { usePredefineColors } from './useCalendar'
import { deleteAdminStudentbookingconfigByid,postAdminStudentbookingCopy, getAdminStudentbookingconfigList, postAdminStudentbookingconfig, postAdminStudentbookingconfigEdit } from '@/utils/proProApi/admin'
import type { StudentBookingConfigForm } from '@/utils/proProApi/apiTypes'
import {
  useSettingsStore
} from '@/store'
const settingStore = useSettingsStore()
import html2canvas from "html2canvas"
import DictAPI from '@/api/dict'
const props = defineProps(['studentId', 'orderId'])
// dayjs.extend(customParseFormat)
const open = defineModel<boolean>('open')

const calendarCore = ref()

function onClose() {
  calendarCore.value.closePopover()
}

watch(
  () => open.value,
  async (val) => {
    await nextTick()
    nextTick(() => {
      document.getElementsByClassName('fc-dayGridWeek-button')[0].innerHTML = '周排表'
      document.getElementsByClassName('fc-dayGridWeek-button')[0].title='周排表'
    })
    val && props.studentId && calendarCore.value.refetchEvents(props.studentId, props.orderId)
    queryList()
    timeData.value = await DictAPI.getDictOptions('timeZone')
    timeName.value=timeData.value.find(x=>x.value===value.value).label||''
  },
)

const formColumns = userStore.user.dept.isInstitution ? isInstitutionFormColumns : adminFormColumns

let draggableIns: any = null
function setDrag() {
  draggableIns?.destroy?.()

  const containerEl = document.getElementById('draggable-list')
  draggableIns = new Draggable(containerEl!, {
    itemSelector: '.draggable-item',
    eventData: {
      duration: '00:30:00',
      create: false,
    },
  })
}

const preList = ref<StudentBookingConfigForm[]>([])
async function queryList() {
  const res = await getAdminStudentbookingconfigList({
    pageNum: '1',
    pageSize: '9999',
    studentId:props.studentId

  })
  preList.value = res.list
  nextTick(() => {
    setDrag()
  })
}

const preTimeFormRef = ref()
const preTimeOpen = ref(false)
function onAddPreTime() {

  calendarCore.value.closePopover()
  preTimeOpen.value = true
  preTimeFormRef.value.resetFormData()
}
function onEditPreTime(row: StudentBookingConfigForm) {
  calendarCore.value.closePopover()
  preTimeOpen.value = true
  preTimeFormRef.value.resetFormData()
  preTimeFormRef.value?.setFormData(row)
}
const copyPre = () => {
  modalVisible.value=true
}
async function deletePreTime(row: StudentBookingConfigForm) {
  console.log(row)

  await ElMessageBox.confirm(`确认删除当前常用课程吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  await deleteAdminStudentbookingconfigByid({ id: row.id })
  preTimeOpen.value = false
  ElMessage.success('删除成功')
  queryList()
}
async function onPreTimeSubmit(data: StudentBookingConfigForm) {
  console.log(data)
  data['studentId']=props.studentId
  if (data.id)
    await postAdminStudentbookingconfigEdit(data)
  else
    await postAdminStudentbookingconfig(data)

  preTimeOpen.value = false
  ElMessage.success('操作成功')
  queryList()
}
const formData = ref({
  time:''as any
})
const timeName=ref('')
const modalVisible=ref(false)
const formRef=ref()
const formRules: FormRules = {
  time: [{ required: true, message: '请选择要复制到的起始日期' }],
}
// 关闭弹窗
function handleCloseModal() {
  formRef.value && formRef.value.resetFields()
  modalVisible.value = false
}
// 提交产品
function handleSubmit() {
  formRef.value.validate((valid: any) => {
    if (valid) {
      const params = {
        idList: settingStore.ykList.map((x: { id: any }) => x.id),
        studentId: props.studentId,
        copyToStartTime:formData.value.time.getTime()
      }
      console.log(params);

      postAdminStudentbookingCopy(params).then(res => {
        ElMessage.success('复制成功')
        queryList()
        calendarCore.value.refetchEvents(props.studentId, props.orderId)
        handleCloseModal()
      })
    }
  })
}
const status = ref(1)
const timeData=ref([] as any)
const value=ref('Asia/Shanghai')
const isYkList = computed(() => settingStore.ykList.length > 0)
const changeTimeStatus = (v: string) => {
    calendarCore.value.setOption('timeZone',v)
  nextTick(() => {
      document.getElementsByClassName('fc-dayGridWeek-button')[0].innerHTML = '周排表'
    document.getElementsByClassName('fc-dayGridWeek-button')[0].title = '周排表'
  timeName.value = timeData.value.find(x => x.value == v).label || ''
  calendarCore.value.updateTime(timeName.value)
    })
  //   debugger
  // timeName.value = timeData.value.find(x => x.value == v).label || ''
  //   console.log(timeName.value);

}
const changeStatus = (v: number) => {
 console.log(v);
  if (v === 1) {
    calendarCore.value.setOption('slotDuration','00:30:00')
  } else if (v === 0) {
    calendarCore.value.setOption('slotDuration','00:15:00')
  } else {
    calendarCore.value.setOption('slotDuration','01:00:00')
  }
  nextTick(() => {
      document.getElementsByClassName('fc-dayGridWeek-button')[0].innerHTML = '周排表'
      document.getElementsByClassName('fc-dayGridWeek-button')[0].title='周排表'
    })
}
const saveImg=()=>{
  // 设置为 document.querySelectorAll('.fc-button-group') display none
  const shareContent = document.querySelectorAll('.fc-button-group')
  shareContent.forEach(item => {
    item.style.opacity = 0
  })

  html2canvas(document.getElementsByClassName('fc')[0],{
                    logging: false,
                    allowTaint: true,
                    // scale: window.devicePixelRatio,
                    // width:100,
                    // width: shareContent.clientWidth, //dom 原始宽度
                    // height: shareContent.clientHeight,
                    scrollY: 0,
                    scrollX: 0,
                    useCORS: true,
                    backgroundColor: '#ffffff',
                }).then(function(canvas){
                    // console.log(canvas);
                    shareContent.forEach(item => {
                      item.style.opacity = 1
                    })
                    let imgUrl = canvas.toDataURL( "image/png" );
                    var tempLink = document.createElement('a');// 创建一个a标签
                    tempLink.style.display = 'none';
                    tempLink.href = imgUrl;
                    tempLink.setAttribute('download', `(${document.getElementsByClassName('fc-toolbar-title')[0].textContent})课表`);// 给a标签添加下载属性
                    if (typeof tempLink.download === 'undefined') {
                        tempLink.setAttribute('target', '_blank');
                    }
                    document.body.appendChild(tempLink);// 将a标签添加到body当中
                    tempLink.click();// 启动下载
                    document.body.removeChild(tempLink);// 下载完毕删除a标签
                    window.URL.revokeObjectURL(imgUrl);
                });
}
const { colors } = usePredefineColors()
</script>

<template>
  <el-drawer
    v-model="open"
    :append-to-body="true"
    size="70%"
    class="calendar-drawer-consumer"
    style="padding-top: 0;

--el-drawer-padding-primary: 20px 10px 10px 20px;"
    :with-header="false"
    @close="onClose"
  >
    <div class="flex h-full">
      <div class="flex-1" style="position: relative;">
        <CalendarCore ref="calendarCore" :student-id="studentId" :timeName="timeName" @to-other-page="open = false" />
        <!-- <div class="qhContainer">
          <el-select
            v-model="status"
            placeholder="全部"
            @change="changeStatus"
            class="!w-[100px]"
            v-if="settingStore.isShow==='timeGridWeek'"
          >
            <el-option :value="0" label="00:15:00" />
            <el-option :value="1" label="00:30:00" />
            <el-option :value="2" label="01:00:00" />
          </el-select>
          <ElButton  type="primary" @click="saveImg"   v-if="settingStore.isShow==='dayGridWeek'&&settingStore.ykList.length">
             下载课表
          </ElButton>
        </div> -->
      </div>
      <div id="draggable-list" class="w-[180px] h-full flex flex-col items-center ml-4 shadow-lg rounded-lg p-2 bg-gray-100">
        <div class="flex-none">
          <div class="mb-1">
            <!-- <el-select
            v-model="timeStatus"
            placeholder="全部"
            @change="changeTimeStatus"
            class="!w-[100px]"
          >{}-->
        <el-select  class="!w-[200px]" v-model="value" filterable placeholder="Select" style="width: 240px" @change="changeTimeStatus">
          <el-option v-for="item in timeData" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
          </div>
          <div class="mb-1">
            <el-select
            v-model="status"
            placeholder="全部"
            @change="changeStatus"
            class="!w-[200px]"
            v-if="settingStore.isShow==='timeGridWeek'"
          >
            <el-option :value="0" label="00:15:00" />
            <el-option :value="1" label="00:30:00" />
            <el-option :value="2" label="01:00:00" />
          </el-select>
          </div>
          <div>
            <ElButton class="mb-1"  type="primary" @click="saveImg"   v-if="(settingStore.isShow==='dayGridWeek'||settingStore.isShow==='dayGridDay')&&isYkList">
             下载课表
          </ElButton>
          <ElButton class="mb-1" type="primary" @click="copyPre" v-if="settingStore.isShow==='timeGridWeek'&&isYkList">
             复制课程
          </ElButton>
          </div>
          <ElButton class="mb-1" type="success" @click="onAddPreTime">
            新增常用课程
          </ElButton>
        </div>
        <div v-if="preList.length" class="flex-1 w-full h-full overflow-y-auto flex flex-col items-center">
          <div
            v-for="({ id, ...item }) in preList" :key="id" :data-eventdata="JSON.stringify(item)"
            class="draggable-item text-14px mb-1 cursor-move rounded px-2 py-1 flex-none w-full text-ellipsis overflow-x-hidden whitespace-nowrap"
            :style="{ backgroundColor: item.background || 'rgb(55, 136, 216)', color: 'white' }"
            @click="onEditPreTime({ ...item, id })"
          >
            <el-tooltip effect="dark" :content="item.selectedCourseName || item.courseName" placement="top">
              <div class="text-ellipsis overflow-x-hidden whitespace-nowrap">
                {{ item.selectedCourseName || item.courseName }}
              </div>
            </el-tooltip>
          </div>
        </div>
        <el-empty v-else description="暂无常用课程" />
      </div>
    </div>
  </el-drawer>
  <el-dialog
    v-model="modalVisible"
    title="复制当前周的约课"
    :align-center="true"
    :append-to-body="true"
    width="400"
    @close="handleCloseModal"
  >
    <!-- 滚动 -->
    <el-scrollbar max-height="70vh">
      <!-- 表单 -->
      <el-form
        ref="formRef"
        label-width="100px"
        style="padding-right: var(--el-dialog-padding-primary)"
        :model="formData"
        :rules="formRules"
      >
        <el-form-item label="选择日期" prop="time">
          <el-date-picker
        v-model="formData.time"
        :style="{ width: '100%', flex: 1 }"
        placeholder="请选择要复制到的起始日期"
      type="date"
      />
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <!-- 弹窗底部操作按钮 -->
    <template #footer>
      <div style="padding-right: var(--el-dialog-padding-primary)">
        <el-button @click="handleCloseModal">
          取 消
        </el-button>
        <el-button type="primary" @click="handleSubmit">
          提 交
        </el-button>
      </div>
    </template>
  </el-dialog>
  <ProForm
    ref="preTimeFormRef"
    v-model:open="preTimeOpen"
    type="drawer"
    :drawer-props="{ title: '常用课程' }"
    :columns="[...formColumns]"
    :on-submit="onPreTimeSubmit"
  >
    <template #drawer-before-form>
      <el-tag type="danger">
        注意：修改、删除常用课程不会影响已预约的课程
      </el-tag>
    </template>
    <template #colorPicker="scope">
      <el-color-picker :model-value="scope.formData[scope.prop]" :predefine="colors" @active-change="(v) => scope.formData[scope.prop] = v" />
    </template>
    <template #drawer-footer-btn="{ formData }">
      <ElButton v-if="formData.id" type="danger" @click="deletePreTime(formData)">
        删除
      </ElButton>
    </template>
  </ProForm>
</template>

<style lang="scss" scoped>
 .qhContainer{
  position: absolute;
  top:10px;
  right:100px;
 }
</style>
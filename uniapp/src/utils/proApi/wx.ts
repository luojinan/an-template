// Generated by Node.js script

import type {
  AccountReqParam,
  AgreementForm,
  BasePageQuery,
  BaseQueryDto,
  CityEntity,
  CountryAreaPageVO,
  CouponForm,
  CouponListQuery,
  CourseAvailVO,
  CourseBookingForm,
  CourseDetailVO,
  CourseEvaluationForm,
  CourseForm,
  DataConsumptionRecordsDto,
  DataCouponPageVO,
  DataCourseEvaluationPageVO,
  DataCourseQueryPageVO,
  DataMemberRuleVO,
  DataRichTextSimplePageVO,
  DataSchoolForm,
  DataStudentOrderCoursePageVO,
  DataTeacherCourseVO,
  DataTeacherInfoVO,
  DataWechatOrderDto,
  DataWechatUserCouponDTO,
  DeleteWechatCouponsByidsRequestParams,
  ExcellentTeacherQuery,
  FeedbackForm,
  GetAgreementsByidFormRequestParams,
  GetApiV1CityDetailRequestParams,
  GetApiV1CityPageRequestParams,
  GetApiV1CitySearchRequestParams,
  GetApiV1CityTreelazyRequestParams,
  GetApiV1CountryareaListRequestParams,
  GetApiV1CoursesByidDetailRequestParams,
  GetApiV1CoursesByidFormRequestParams,
  GetApiV1CoursesNameSuggestionsRequestParams,
  GetApiV1CoursesPagebysectorRequestParams,
  GetApiV1CoursesProceduresPageRequestParams,
  GetApiV1KsTeacherinfoByidRequestParams,
  GetApiV1KsTeacherinfoCoursesRequestParams,
  GetApiV1KsTeacherinfoSimilarByteacheridRequestParams,
  GetApiV1OrdersByidFormRequestParams,
  GetApiV1OrdersByidRefundRequestParams,
  GetApiV1OrdersCancelRequestParams,
  GetApiV1OrdersRefundDetailRequestParams,
  GetApiV1OrdersUserCouponRequestParams,
  GetApiV1OrdersWechatPageRequestParams,
  GetApiV1StudentCoursebookingCoursedetailRequestParams,
  GetApiV1StudentCoursebookingGetcourseavailRequestParams,
  GetApiV1StudentCoursebookingListRequestParams,
  GetApiV1StudentCoursebookingSublistRequestParams,
  GetApiV1StudentCoursebookingUnbindListRequestParams,
  GetApiV1StudentScheduleGetstudentschedulemouthcountRequestParams,
  GetApiV1StudentScheduleListRequestParams,
  GetCourseevaluationsByidFormRequestParams,
  GetCourseevaluationsJudge_authRequestParams,
  GetCourseevaluationsPageRequestParams,
  GetRichtextsByidFormRequestParams,
  GetRichtextsPageRequestParams,
  GetSchoolsListRequestParams,
  GetStudentLevelRuleListRequestParams,
  GetWechatCouponsByidRequestParams,
  GetWechatCouponsPageRequestParams,
  GetWechatCouponsReceiveRequestParams,
  GetWechatCouponsUserPageRequestParams,
  GetWechatCustLoginoutRequestParams,
  GetWechatCustomerCustByidRequestParams,
  GetWechatCustomerCustGetwxacodeunlimitRequestParams,
  GetWechatCustomerCustInvitationRequestParams,
  GetWechatCustomerCustValidinvitationRequestParams,
  IObject,
  InstitutionPaymentInfoVO,
  InvitationCustVo,
  KsCustForm,
  KsCustQueryDto,
  KsCustVO,
  OpenIdQueryDto,
  OrderCourseBindForm,
  OrderCreateForm,
  OrderForm,
  PreCalculatePriceForm,
  RichTextForm,
  SOAPayDto,
  SOAPayReqParam,
  ServedCustomerForm,
  StudentBookingForm,
  StudentCourseDetailVO,
  StudentCourseOperationForm,
  StudentScheduleMouthCountVO,
  TeacherInfoDto,
  TeacherInfoQuery,
  TreeNodeObject,
  WxPayRefundReqParam,
  WxPayReqParam
} from './apiTypes'
import request from '../request'

type RequestOptions = {
  requestType?: 'GET' | 'POST' | 'PUT' | 'DELETE',
  showLoading?: boolean,
  showError?: boolean
}

/**
 * 修改用户表
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/用户接口/updateKsCust
 **/
export function postWechatCustomerCustEdit(data: KsCustForm, options?: RequestOptions) {
  return request<any, IObject>(
    'wechat/customer/cust/edit',
    data,
    { requestType: 'POST', ...options }
  ).then(res => res.data)
}
/**
 * 查询用户子集
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/用户接口/childList
 **/
export function postWechatCustomerCustChild(data: KsCustQueryDto, options?: RequestOptions) {
  return request<any, KsCustVO[]>(
    'wechat/customer/cust/child',
    data,
    { requestType: 'POST', ...options }
  ).then(res => res.data)
}
/**
 * 新增用户表
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/用户接口/saveKsCust
 **/
export function postWechatCustomerCustAdd(data: KsCustForm, options?: RequestOptions) {
  return request<any, IObject>(
    'wechat/customer/cust/add',
    data,
    { requestType: 'POST', ...options }
  ).then(res => res.data)
}
/**
 * 获取电话号码
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/100.小程序用户登录/getPhoneNumber
 **/
export function postWechatCustGetphonenumber(data: OpenIdQueryDto, options?: RequestOptions) {
  return request<any, IObject>(
    'wechat/cust/getPhoneNumber',
    data,
    { requestType: 'POST', ...options }
  ).then(res => res.data)
}
/**
 * 获取openId
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/100.小程序用户登录/getOpenId
 **/
export function postWechatCustGetopenid(data: OpenIdQueryDto, options?: RequestOptions) {
  return request<any, IObject>(
    'wechat/cust/getOpenId',
    data,
    { requestType: 'POST', ...options }
  ).then(res => res.data)
}
/**
 * 获取支付订单所需要的优惠券
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/小程序优惠劵接口/getCouponListByUserId
 **/
export function postWechatCouponsOrderList(data: CouponListQuery, options?: RequestOptions) {
  return request<any, IObject>(
    'wechat/coupons/order/list',
    data,
    { requestType: 'POST', ...options }
  ).then(res => res.data)
}
/**
 * 微信预支付
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/vx-pay-controller/wxPay
 **/
export function postVxpayVxv3pay(data: WxPayReqParam, options?: RequestOptions) {
  return request<any, IObject>(
    'vxPay/vxv3pay',
    data,
    { requestType: 'POST', ...options }
  ).then(res => res.data)
}
/**
 * undefined
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/vx-pay-controller/payRefund
 **/
export function postVxpayVxpayrefund(data: WxPayRefundReqParam, options?: RequestOptions) {
  return request<any, IObject>(
    'vxPay/vxPayRefund',
    data,
    { requestType: 'POST', ...options }
  ).then(res => res.data)
}
/**
 * undefined
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/vx-pay-controller/refundWechatCallback
 **/
export function postVxpayRefundwechatcallback(options?: RequestOptions) {
  return request<any, any>(
    'vxPay/refundWechatCallback',
    {},
    { requestType: 'POST', ...options }
  ).then(res => res.data)
}
/**
 * 获取收款码
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/vx-pay-controller/getAccount
 **/
export function postVxpayPaymentqrcode(data: AccountReqParam, options?: RequestOptions) {
  return request<any, InstitutionPaymentInfoVO>(
    'vxPay/paymentQrCode',
    data,
    { requestType: 'POST', ...options }
  ).then(res => res.data)
}
/**
 * 微信下单
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/vx-pay-controller/payNotify
 **/
export function postVxpayPaynotify(options?: RequestOptions) {
  return request<any, IObject>(
    'vxPay/payNotify',
    {},
    { requestType: 'POST', ...options }
  ).then(res => res.data)
}
/**
 * 拉卡拉创建订单
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/soa-pay-controller/createSOAOrder
 **/
export function postSoapayCreatesoaorder(data: SOAPayReqParam, options?: RequestOptions) {
  return request<any, SOAPayDto>(
    'soaPay/createSOAOrder',
    data,
    { requestType: 'POST', ...options }
  ).then(res => res.data)
}
/**
 * 新增意见反馈
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/意见反馈接口/saveFeedback
 **/
export function postFeedbacks(data: FeedbackForm, options?: RequestOptions) {
  return request<any, IObject>(
    'feedbacks',
    data,
    { requestType: 'POST', ...options }
  ).then(res => res.data)
}
/**
 * 新增课程评价表
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/小程序课程评价表接口/saveCourseEvaluation
 **/
export function postCourseevaluations(data: CourseEvaluationForm, options?: RequestOptions) {
  return request<any, IObject>(
    'courseEvaluations',
    data,
    { requestType: 'POST', ...options }
  ).then(res => res.data)
}
/**
 * 学生拒绝讲师取消约课
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/学生约课接口/rejectCancel
 **/
export function postApiV1StudentCoursebookingRejectcancel(data: StudentCourseOperationForm, options?: RequestOptions) {
  return request<any, IObject>(
    'api/v1/student/courseBooking/rejectCancel',
    data,
    { requestType: 'POST', ...options }
  ).then(res => res.data)
}
/**
 * 学生约课
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/学生约课接口/bookCourse
 **/
export function postApiV1StudentCoursebookingBook(data: CourseBookingForm, options?: RequestOptions) {
  return request<any, IObject>(
    'api/v1/student/courseBooking/book',
    data,
    { requestType: 'POST', ...options }
  ).then(res => res.data)
}
/**
 * 学生客户端课程绑定学生
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/学生约课接口/bindOrderCourse
 **/
export function postApiV1StudentCoursebookingBind(data: OrderCourseBindForm, options?: RequestOptions) {
  return request<any, IObject>(
    'api/v1/student/courseBooking/bind',
    data,
    { requestType: 'POST', ...options }
  ).then(res => res.data)
}
/**
 * 学生同意讲师取消约课
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/学生约课接口/approvalCancel
 **/
export function postApiV1StudentCoursebookingApprovalcancel(data: StudentCourseOperationForm, options?: RequestOptions) {
  return request<any, IObject>(
    'api/v1/student/courseBooking/approvalCancel',
    data,
    { requestType: 'POST', ...options }
  ).then(res => res.data)
}
/**
 * 申请取消约课（学生约课后，未上课）
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/学生约课接口/applyCancellation
 **/
export function postApiV1StudentCoursebookingApplycancellation(data: StudentCourseOperationForm, options?: RequestOptions) {
  return request<any, IObject>(
    'api/v1/student/courseBooking/applyCancellation',
    data,
    { requestType: 'POST', ...options }
  ).then(res => res.data)
}
/**
 * 预先计算价格
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/小程序订单表接口/preCalculatePrice
 **/
export function postApiV1OrdersWechatPreCalculate(data: PreCalculatePriceForm, options?: RequestOptions) {
  return request<any, IObject>(
    'api/v1/orders/wechat/pre-calculate',
    data,
    { requestType: 'POST', ...options }
  ).then(res => res.data)
}
/**
 * 微信下单V2
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/小程序订单表接口/createOrder
 **/
export function postApiV1OrdersWechatCreate(data: OrderCreateForm, options?: RequestOptions) {
  return request<any, IObject>(
    'api/v1/orders/wechat/create',
    data,
    { requestType: 'POST', ...options }
  ).then(res => res.data)
}
/**
 * 消费记录
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/小程序订单表接口/consumptionRecords
 **/
export function postApiV1OrdersConsumptionRecords(data: BasePageQuery, options?: RequestOptions) {
  return request<any, DataConsumptionRecordsDto>(
    'api/v1/orders/consumption-records',
    data,
    { requestType: 'POST', ...options }
  ).then(res => res.data)
}
/**
 * 讲师信息分页搜索接口
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/小程序端讲师信息接口/selectPage
 **/
export function postApiV1KsTeacherinfoPage(data: TeacherInfoQuery, options?: RequestOptions) {
  return request<any, DataTeacherInfoVO>(
    'api/v1/ks/teacherInfo/page',
    data,
    { requestType: 'POST', ...options }
  ).then(res => res.data)
}
/**
 * 优秀讲师信息分页列表
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/小程序端讲师信息接口/selectExcellentPage
 **/
export function postApiV1KsTeacherinfoExcellentPage(data: ExcellentTeacherQuery, options?: RequestOptions) {
  return request<any, DataTeacherInfoVO>(
    'api/v1/ks/teacherInfo/excellent-page',
    data,
    { requestType: 'POST', ...options }
  ).then(res => res.data)
}
/**
 * undefined
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/地区管理接口/stop
 **/
export function postApiV1CityStop(data: BaseQueryDto, options?: RequestOptions) {
  return request<any, any>(
    'api/v1/city/stop',
    data,
    { requestType: 'POST', ...options }
  ).then(res => res.data)
}
/**
 * undefined
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/地区管理接口/start
 **/
export function postApiV1CityStart(data: BaseQueryDto, options?: RequestOptions) {
  return request<any, any>(
    'api/v1/city/start',
    data,
    { requestType: 'POST', ...options }
  ).then(res => res.data)
}
/**
 * undefined
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/地区管理接口/edit
 **/
export function postApiV1CityEdit(data: CityEntity, options?: RequestOptions) {
  return request<any, any>(
    'api/v1/city/edit',
    data,
    { requestType: 'POST', ...options }
  ).then(res => res.data)
}
/**
 * undefined
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/地区管理接口/delete
 **/
export function postApiV1CityDelete(data: BaseQueryDto, options?: RequestOptions) {
  return request<any, any>(
    'api/v1/city/delete',
    data,
    { requestType: 'POST', ...options }
  ).then(res => res.data)
}
/**
 * undefined
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/地区管理接口/add
 **/
export function postApiV1CityAdd(data: CityEntity, options?: RequestOptions) {
  return request<any, any>(
    'api/v1/city/add',
    data,
    { requestType: 'POST', ...options }
  ).then(res => res.data)
}
/**
 * 用户表表单数据
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/用户接口/getKsCustForm
 **/
export function getWechatCustomerCustByid(params: GetWechatCustomerCustByidRequestParams, options?: RequestOptions) {
  return request<any, KsCustForm>(
    `wechat/customer/cust/${params.id}`,
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 校验验证码是否存在
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/用户接口/validInvitation
 **/
export function getWechatCustomerCustValidinvitation(params: GetWechatCustomerCustValidinvitationRequestParams, options?: RequestOptions) {
  return request<any, boolean>(
    'wechat/customer/cust/validInvitation',
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 查询邀请用户
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/用户接口/queryInvitationList
 **/
export function getWechatCustomerCustInvitation(params: GetWechatCustomerCustInvitationRequestParams, options?: RequestOptions) {
  return request<any, InvitationCustVo[]>(
    'wechat/customer/cust/invitation',
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 获取小程序邀请码
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/用户接口/getWxaCodeUnLimit
 **/
export function getWechatCustomerCustGetwxacodeunlimit(params: GetWechatCustomerCustGetwxacodeunlimitRequestParams, options?: RequestOptions) {
  return request<any, IObject>(
    'wechat/customer/cust/getWxaCodeUnLimit',
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 获取小程序邀请码
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/用户接口/getPoints
 **/
export function getWechatCustomerCustGetpoints(options?: RequestOptions) {
  return request<any, IObject>(
    'wechat/customer/cust/getPoints',
    {},
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 退出
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/100.小程序用户登录/loginOut
 **/
export function getWechatCustLoginout(params: GetWechatCustLoginoutRequestParams, options?: RequestOptions) {
  return request<any, IObject>(
    'wechat/cust/loginOut',
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 优惠劵表表单数据
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/小程序优惠劵接口/getCouponForm
 **/
export function getWechatCouponsByid(params: GetWechatCouponsByidRequestParams, options?: RequestOptions) {
  return request<any, CouponForm>(
    `wechat/coupons/${params.id}`,
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 用户优惠劵分页列表
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/小程序优惠劵接口/listPagedCoupons
 **/
export function getWechatCouponsUserPage(params: GetWechatCouponsUserPageRequestParams, options?: RequestOptions) {
  return request<any, DataWechatUserCouponDTO>(
    'wechat/coupons/user/page',
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 领取优惠券
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/小程序优惠劵接口/receive
 **/
export function getWechatCouponsReceive(params: GetWechatCouponsReceiveRequestParams, options?: RequestOptions) {
  return request<any, IObject>(
    'wechat/coupons/receive',
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 优惠劵表分页列表
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/小程序优惠劵接口/listPagedCoupons_1
 **/
export function getWechatCouponsPage(params: GetWechatCouponsPageRequestParams, options?: RequestOptions) {
  return request<any, DataCouponPageVO>(
    'wechat/coupons/page',
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 会员等级规则分页列表
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/会员等级规则接口/list
 **/
export function getStudentLevelRuleList(params: GetStudentLevelRuleListRequestParams, options?: RequestOptions) {
  return request<any, DataMemberRuleVO>(
    'student/level/rule/list',
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 服务过的客户分页列表
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/服务过的客户信息接口/list_1
 **/
export function getServedcustomerList(options?: RequestOptions) {
  return request<any, ServedCustomerForm[]>(
    'servedCustomer/list',
    {},
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 学校信息分页列表
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/学校信息接口/list_2
 **/
export function getSchoolsList(params: GetSchoolsListRequestParams, options?: RequestOptions) {
  return request<any, DataSchoolForm>(
    'schools/list',
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 富文本表表单数据
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/富文本表接口/getRichTextForm
 **/
export function getRichtextsByidForm(params: GetRichtextsByidFormRequestParams, options?: RequestOptions) {
  return request<any, RichTextForm>(
    `richTexts/${params.id}/form`,
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 富文本表分页列表
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/富文本表接口/listPagedRichTexts
 **/
export function getRichtextsPage(params: GetRichtextsPageRequestParams, options?: RequestOptions) {
  return request<any, DataRichTextSimplePageVO>(
    'richTexts/page',
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 课程评价表表单数据
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/小程序课程评价表接口/getCourseEvaluationForm
 **/
export function getCourseevaluationsByidForm(params: GetCourseevaluationsByidFormRequestParams, options?: RequestOptions) {
  return request<any, CourseEvaluationForm>(
    `courseEvaluations/${params.id}/form`,
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 课程评价表分页列表
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/小程序课程评价表接口/listPagedCourseEvaluations
 **/
export function getCourseevaluationsPage(params: GetCourseevaluationsPageRequestParams, options?: RequestOptions) {
  return request<any, DataCourseEvaluationPageVO>(
    'courseEvaluations/page',
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 判断用户是否有评价权限
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/小程序课程评价表接口/judgeAuth
 **/
export function getCourseevaluationsJudge_auth(params: GetCourseevaluationsJudge_authRequestParams, options?: RequestOptions) {
  return request<any, IObject>(
    'courseEvaluations/judge_auth',
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 学生客户端查看课程列表
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/学生课表接口/getStudentScheduleList
 **/
export function getApiV1StudentScheduleList(params: GetApiV1StudentScheduleListRequestParams, options?: RequestOptions) {
  return request<any, StudentBookingForm[]>(
    'api/v1/student/schedule/list',
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 小程序端学生课表月度计数查询
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/学生课表接口/getStudentScheduleMouthCount
 **/
export function getApiV1StudentScheduleGetstudentschedulemouthcount(params: GetApiV1StudentScheduleGetstudentschedulemouthcountRequestParams, options?: RequestOptions) {
  return request<any, StudentScheduleMouthCountVO[]>(
    'api/v1/student/schedule/getStudentScheduleMouthCount',
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 学生客户端查看未绑定的课程列表
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/学生约课接口/getUnbindOrderCoursesPage
 **/
export function getApiV1StudentCoursebookingUnbindList(params: GetApiV1StudentCoursebookingUnbindListRequestParams, options?: RequestOptions) {
  return request<any, DataStudentOrderCoursePageVO>(
    'api/v1/student/courseBooking/unbind-list',
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 学生客户端查看子账号课程列表
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/学生约课接口/getSubUserOrderCoursesPage
 **/
export function getApiV1StudentCoursebookingSublist(params: GetApiV1StudentCoursebookingSublistRequestParams, options?: RequestOptions) {
  return request<any, DataStudentOrderCoursePageVO>(
    'api/v1/student/courseBooking/sublist',
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 学生客户端查看课程列表
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/学生约课接口/getOrderCourseList
 **/
export function getApiV1StudentCoursebookingList(params: GetApiV1StudentCoursebookingListRequestParams, options?: RequestOptions) {
  return request<any, DataStudentOrderCoursePageVO>(
    'api/v1/student/courseBooking/list',
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 查看某课程某时间段内可约课时间
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/学生约课接口/getCourseAvail
 **/
export function getApiV1StudentCoursebookingGetcourseavail(params: GetApiV1StudentCoursebookingGetcourseavailRequestParams, options?: RequestOptions) {
  return request<any, CourseAvailVO[]>(
    'api/v1/student/courseBooking/getCourseAvail',
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 学生客户端查看上课状态详情
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/学生约课接口/getCourseDetailList
 **/
export function getApiV1StudentCoursebookingCoursedetail(params: GetApiV1StudentCoursebookingCoursedetailRequestParams, options?: RequestOptions) {
  return request<any, StudentCourseDetailVO[]>(
    'api/v1/student/courseBooking/courseDetail',
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 退单
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/小程序订单表接口/refundOrder
 **/
export function getApiV1OrdersByidRefund(params: GetApiV1OrdersByidRefundRequestParams, options?: RequestOptions) {
  return request<any, IObject>(
    `api/v1/orders/${params.id}/refund`,
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 订单表表单数据
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/小程序订单表接口/getOrderForm
 **/
export function getApiV1OrdersByidForm(params: GetApiV1OrdersByidFormRequestParams, options?: RequestOptions) {
  return request<any, OrderForm>(
    `api/v1/orders/${params.id}/form`,
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 订单表分页列表
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/小程序订单表接口/wechatPagedOrders
 **/
export function getApiV1OrdersWechatPage(params: GetApiV1OrdersWechatPageRequestParams, options?: RequestOptions) {
  return request<any, DataWechatOrderDto>(
    'api/v1/orders/wechat-page',
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 获取订单可用的优惠券列表
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/小程序订单表接口/userCoupon
 **/
export function getApiV1OrdersUserCoupon(params: GetApiV1OrdersUserCouponRequestParams, options?: RequestOptions) {
  return request<any, IObject>(
    'api/v1/orders/user-coupon',
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 退单详情
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/小程序订单表接口/refundList
 **/
export function getApiV1OrdersRefundDetail(params: GetApiV1OrdersRefundDetailRequestParams, options?: RequestOptions) {
  return request<any, IObject>(
    'api/v1/orders/refund/detail',
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 取消订单
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/小程序订单表接口/cancelOrder
 **/
export function getApiV1OrdersCancel(params: GetApiV1OrdersCancelRequestParams, options?: RequestOptions) {
  return request<any, IObject>(
    'api/v1/orders/cancel',
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 获取讲师详情信息
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/小程序端讲师信息接口/getTeacherForm
 **/
export function getApiV1KsTeacherinfoByid(params: GetApiV1KsTeacherinfoByidRequestParams, options?: RequestOptions) {
  return request<any, TeacherInfoDto>(
    `api/v1/ks/teacherInfo/${params.id}`,
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 分页查询相似领域的讲师列表
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/小程序端讲师信息接口/getSimilarTeachers
 **/
export function getApiV1KsTeacherinfoSimilarByteacherid(params: GetApiV1KsTeacherinfoSimilarByteacheridRequestParams, options?: RequestOptions) {
  return request<any, DataTeacherInfoVO>(
    `api/v1/ks/teacherInfo/similar/${params.teacherId}`,
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 根据讲师id分页获取其课程列表
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/小程序端讲师信息接口/getCourses
 **/
export function getApiV1KsTeacherinfoCourses(params: GetApiV1KsTeacherinfoCoursesRequestParams, options?: RequestOptions) {
  return request<any, DataTeacherCourseVO>(
    'api/v1/ks/teacherInfo/courses',
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 课程主表表单数据
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/小程序课程主表接口/getCourseForm
 **/
export function getApiV1CoursesByidForm(params: GetApiV1CoursesByidFormRequestParams, options?: RequestOptions) {
  return request<any, CourseForm>(
    `api/v1/courses/${params.id}/form`,
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 课程主表表单数据V2
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/小程序课程主表接口/getCourseDetail
 **/
export function getApiV1CoursesByidDetail(params: GetApiV1CoursesByidDetailRequestParams, options?: RequestOptions) {
  return request<any, CourseDetailVO>(
    `api/v1/courses/${params.id}/detail`,
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 课程列表分页-小程序V2
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/小程序课程主表接口/listPagedCourses
 **/
export function getApiV1CoursesProceduresPage(params: GetApiV1CoursesProceduresPageRequestParams, options?: RequestOptions) {
  return request<any, DataCourseQueryPageVO>(
    'api/v1/courses/procedures-page',
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 板块课程列表分页
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/小程序课程主表接口/getListPagedCoursesBySector
 **/
export function getApiV1CoursesPagebysector(params: GetApiV1CoursesPagebysectorRequestParams, options?: RequestOptions) {
  return request<any, DataCourseQueryPageVO>(
    'api/v1/courses/pageBySector',
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 课程名称关键词联想
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/小程序课程主表接口/getNameSuggestions
 **/
export function getApiV1CoursesNameSuggestions(params: GetApiV1CoursesNameSuggestionsRequestParams, options?: RequestOptions) {
  return request<any, string[]>(
    'api/v1/courses/name-suggestions',
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 获取国家地区表
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/国家地区表接口/listCourseClassifications
 **/
export function getApiV1CountryareaList(params: GetApiV1CountryareaListRequestParams, options?: RequestOptions) {
  return request<any, CountryAreaPageVO[]>(
    'api/v1/countryArea/list',
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 地区树
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/地区管理接口/tree
 **/
export function getApiV1CityTree(options?: RequestOptions) {
  return request<any, TreeNodeObject[]>(
    'api/v1/city/tree',
    {},
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * undefined
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/地区管理接口/treeLazy
 **/
export function getApiV1CityTreelazy(params: GetApiV1CityTreelazyRequestParams, options?: RequestOptions) {
  return request<any, TreeNodeObject[]>(
    'api/v1/city/treeLazy',
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * undefined
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/地区管理接口/search
 **/
export function getApiV1CitySearch(params: GetApiV1CitySearchRequestParams, options?: RequestOptions) {
  return request<any, any>(
    'api/v1/city/search',
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * undefined
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/地区管理接口/page
 **/
export function getApiV1CityPage(params: GetApiV1CityPageRequestParams, options?: RequestOptions) {
  return request<any, IObject>(
    'api/v1/city/page',
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * undefined
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/地区管理接口/detail
 **/
export function getApiV1CityDetail(params: GetApiV1CityDetailRequestParams, options?: RequestOptions) {
  return request<any, IObject>(
    'api/v1/city/detail',
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 协议表表单数据
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/协议表接口小程序/getAgreementForm
 **/
export function getAgreementsByidForm(params: GetAgreementsByidFormRequestParams, options?: RequestOptions) {
  return request<any, AgreementForm>(
    `agreements/${params.id}/form`,
    params,
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * 删除优惠劵表
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/小程序优惠劵接口/deleteCoupons
 **/
export function deleteWechatCouponsByids(params: DeleteWechatCouponsByidsRequestParams, options?: RequestOptions) {
  return request<any, IObject>(
    `wechat/coupons/${params.ids}`,
    params,
    { requestType: 'DELETE', ...options }
  ).then(res => res.data)
}
/**
 * undefined
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/soa-pay-controller/backNoticeDemo
 **/
export function getSoapayBacknotice(options?: RequestOptions) {
  return request<any, IObject>(
    'soaPay/backNotice',
    {},
    { requestType: 'GET', ...options }
  ).then(res => res.data)
}
/**
 * undefined
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/soa-pay-controller/backNoticeDemo_3
 **/
export function putSoapayBacknotice(options?: RequestOptions) {
  return request<any, IObject>(
    'soaPay/backNotice',
    {},
    { requestType: 'PUT', ...options }
  ).then(res => res.data)
}
/**
 * undefined
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/soa-pay-controller/backNoticeDemo_2
 **/
export function postSoapayBacknotice(options?: RequestOptions) {
  return request<any, IObject>(
    'soaPay/backNotice',
    {},
    { requestType: 'POST', ...options }
  ).then(res => res.data)
}
/**
 * undefined
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/soa-pay-controller/backNoticeDemo_5
 **/
export function deleteSoapayBacknotice(options?: RequestOptions) {
  return request<any, IObject>(
    'soaPay/backNotice',
    {},
    { requestType: 'DELETE', ...options }
  ).then(res => res.data)
}
/**
 * undefined
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/soa-pay-controller/backNoticeDemo_6
 **/
export function optionsSoapayBacknotice(options?: RequestOptions) {
  return request<any, IObject>(
    'soaPay/backNotice',
    {},
    { requestType: 'OPTIONS', ...options }
  ).then(res => res.data)
}
/**
 * undefined
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/soa-pay-controller/backNoticeDemo_1
 **/
export function headSoapayBacknotice(options?: RequestOptions) {
  return request<any, IObject>(
    'soaPay/backNotice',
    {},
    { requestType: 'HEAD', ...options }
  ).then(res => res.data)
}
/**
 * undefined
 * 
 * 接口文档: https://dsjedu.com.cn/prod-api/doc.html#/小程序端/soa-pay-controller/backNoticeDemo_4
 **/
export function patchSoapayBacknotice(options?: RequestOptions) {
  return request<any, IObject>(
    'soaPay/backNotice',
    {},
    { requestType: 'PATCH', ...options }
  ).then(res => res.data)
}

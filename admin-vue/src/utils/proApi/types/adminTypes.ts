// Generated by Node.js script
// !!!!! DO NOT EDIT !!!!!

import { IObject } from './commonTypes'

export interface ResultObject {
  code: string
  data: IObject
  msg: string
}

export interface RotationChartForm {
  /**
   * 主键
   */
  id: string
  /**
   * 活动名称
   */
  name: string
  /**
   * 轮播图
   */
  bannerPicture: string
  /**
   * 跳转地址
   */
  jumpUrl: string
  /**
   * 显示顺序
   */
  sort: number
  /**
   * 状态(1:启用;0:停用)
   */
  status: number
  /**
   * 创建时间
   */
  createTime: string
  /**
   * 更新时间
   */
  updateTime: string
  /**
   * 创建人ID
   */
  createUser: string
  /**
   * 修改人ID
   */
  updateUser: string
  /**
   * 类型编码
   */
  typeCode: string
  /**
   * 类型名称
   */
  typeName: string
}

export interface PassEditVO {
  /**
   * 卡名称
   */
  name: string
  /**
   * 卡类型（次卡/额度卡）
   */
  type: string
  /**
   * 购买价格
   */
  purchasePrice: number
  /**
   * 可用额度（类型为额度卡时必填）
   */
  availableAmount: number
  /**
   * 可用次数（类型为次卡时必填）
   */
  availableTimes: number
  /**
   * 有效期开始时间戳
   */
  validStartTime: number
  /**
   * 有效期结束时间戳
   */
  validEndTime: number
  /**
   * 适用范围（全局通用/指定课程）
   */
  scope: string
  /**
   * 适用课程ID列表（scope为指定课程时必填）
   */
  courseIds: string[]
  /**
   * 卡ID
   */
  id: string
}

export interface HotWordRecordForm {
  /**
   * 主键
   */
  id: string
  /**
   * 热词
   */
  name: string
  /**
   * 显示顺序
   */
  count: number
  /**
   * 创建时间
   */
  createTime: string
  /**
   * 更新时间
   */
  updateTime: string
}

export interface CourseEditVO {
  /**
   * 课程中文名
   */
  chineseName: string
  /**
   * 课程英文名
   */
  englishName: string
  /**
   * 课程图片 URL
   */
  imageUrl: string
  /**
   * 课程所属的门店 ID
   */
  storeId: string
  /**
   * 课程规则类型，瑜伽课程或团课
   */
  type: string
  /**
   * 课班规模，大班课，小班课，私教课
   */
  size: string
  /**
   * 价格
   */
  price: number
  /**
   * 课程状态
   */
  status: string
  /**
   * 课程主要训练目标
   */
  mainTrainingGoal: string
  /**
   * 课程次要训练目标
   */
  secondaryTrainingGoal: string[]
  /**
   * 开课时间-开始
   */
  startTime: number
  /**
   * 开课时间-结束
   */
  startEnd: number
  /**
   * 排序号
   */
  sortNumber: number
  /**
   * 难度星级
   */
  difficultyRate: string
  /**
   * 课程描述
   */
  description: string
  /**
   * 课程 ID
   */
  id: string
}

export interface CountryAreaForm {
  id: string
  /**
   * 名称
   */
  name: string
  /**
   * 英文名称
   */
  nameEn: string
  /**
   * 级别1,2,3,4
   */
  level: number
  /**
   * 父级id
   */
  parentId: string
  /**
   * id全路径
   */
  idPath: string
  /**
   * 是否在小程序展示(0-不展示，1-展示)
   */
  isShowMiniapp: number
  createTime: string
  createUser: string
  updateTime: string
  updateUser: string
  createUserName: string
  updateUserName: string
}

export interface ArticleManagementForm {
  /**
   * 主键
   */
  id: string
  /**
   * 文章名称
   */
  title: string
  /**
   * 文章内容
   */
  articleDesc: string
  /**
   * 链接地址
   */
  linkUrl: string
  /**
   * 创建时间
   */
  createTime: string
  /**
   * 更新时间
   */
  updateTime: string
  /**
   * 创建人ID
   */
  createUser: string
  createUserName: string
  updateUserName: string
  /**
   * 主图
   */
  mainPicture: string
  /**
   * 修改人ID
   */
  updateUser: string
  /**
   * 文章分类
   */
  articleType: string
}

export interface AgreementForm {
  /**
   * 主键
   */
  id: string
  /**
   * 标题
   */
  title: string
  /**
   * 内容
   */
  contentData: string
  /**
   * 创建时间
   */
  createTime: string
  /**
   * 更新时间
   */
  updateTime: string
  /**
   * 创建人ID
   */
  createUser: string
  /**
   * 修改人ID
   */
  updateUser: string
  /**
   * 是否展示
   */
  isDisplay: number
}

export interface RichTextForm {
  /**
   * 主键
   */
  id: number
  /**
   * 标题
   */
  title: string
  /**
   * 内容
   */
  contentData: string
  /**
   * 创建时间
   */
  createTime: string
  /**
   * 更新时间
   */
  updateTime: string
  /**
   * 创建人ID
   */
  createUser: string
  /**
   * 修改人ID
   */
  updateUser: string
  /**
   * 图片url
   */
  mainPicture: string
  /**
   * 是否展示
   */
  isDisplay: number
}

export interface PointRuleForm {
  /**
   * 积分规则ID
   */
  id: number
  /**
   * 规则名称
   */
  ruleName: string
  /**
   * 积分增加比例
   */
  pointAddRatio: number
  /**
   * 积分兑换比例
   */
  pointRedemptionRatio: number
  /**
   * 积分有效时长(分钟)
   */
  ruleValidit: number
  /**
   * 是否启用(0否 1是)
   */
  ruleStatus: number
}

export interface LevelRuleForm {
  /**
   * 会员等级规则ID
   */
  id: number
  /**
   * 等级
   */
  level: number
  /**
   * 等级名称
   */
  levelName: string
  /**
   * 等级积分
   */
  levelRule: number
  /**
   * 邀请加分比例
   */
  invitedRatio: number
  /**
   * 消费加分比例
   */
  consumeRatio: number
  /**
   * 积分兑换比例
   */
  exchangeRatio: number
  /**
   * 积分有效时长(天)
   */
  duration: number
  /**
   * 会员折扣
   */
  discount: number
  /**
   * 能否查看讲师详情，0不可以，1可以
   */
  isShowTeacherDetail: number
  /**
   * 能否查看课程价格，0不可以，1可以
   */
  isShowCoursePrice: number
  /**
   * 权益说明
   */
  interestsStatement: string
  /**
   * 积分获取
   */
  integralGain: string
  /**
   * 权益规则
   */
  equityRules: string
  /**
   * 可查看的课程数量，-1表示不限制
   */
  viewableCourseCount: number
  /**
   * 可查看的讲师数量，-1表示不限制
   */
  viewableTeacherCount: number
}

export interface PassAddVO {
  /**
   * 卡名称
   */
  name: string
  /**
   * 卡类型（次卡/额度卡）
   */
  type: string
  /**
   * 购买价格
   */
  purchasePrice: number
  /**
   * 可用额度（类型为额度卡时必填）
   */
  availableAmount: number
  /**
   * 可用次数（类型为次卡时必填）
   */
  availableTimes: number
  /**
   * 有效期开始时间戳
   */
  validStartTime: number
  /**
   * 有效期结束时间戳
   */
  validEndTime: number
  /**
   * 适用范围（全局通用/指定课程）
   */
  scope: string
  /**
   * 适用课程ID列表（scope为指定课程时必填）
   */
  courseIds: string[]
}

export interface CourseAddVO {
  /**
   * 课程中文名
   */
  chineseName: string
  /**
   * 课程英文名
   */
  englishName: string
  /**
   * 课程图片 URL
   */
  imageUrl: string
  /**
   * 课程所属的门店 ID
   */
  storeId: string
  /**
   * 课程规则类型，瑜伽课程或团课
   */
  type: string
  /**
   * 课班规模，大班课，小班课，私教课
   */
  size: string
  /**
   * 价格
   */
  price: number
  /**
   * 课程状态
   */
  status: string
  /**
   * 课程主要训练目标
   */
  mainTrainingGoal: string
  /**
   * 课程次要训练目标
   */
  secondaryTrainingGoal: string[]
  /**
   * 开课时间-开始
   */
  startTime: number
  /**
   * 开课时间-结束
   */
  startEnd: number
  /**
   * 排序号
   */
  sortNumber: number
  /**
   * 难度星级
   */
  difficultyRate: string
  /**
   * 课程描述
   */
  description: string
}

export interface CountryAreaPageQuery {
  /**
   * 页码
   */
  pageNum: number
  /**
   * 每页记录数
   */
  pageSize: number
  /**
   * 分类名称
   */
  name: string
  /**
   * 分类名称
   */
  keywords: string
  /**
   * 父级id
   */
  parentId: string
  /**
   * 多个名称用，隔开
   */
  parentName: string
  /**
   * 多个名称用，隔开
   */
  names: string
}

export interface CountryAreaVO {
  /**
   * id
   */
  id: string
  /**
   * 名称
   */
  name: string
  /**
   * 英文名称
   */
  nameEn: string
  /**
   * 级别1,2,3,4
   */
  level: number
  /**
   * 父级id
   */
  parentId: string
  /**
   * id全路径
   */
  idPath: string
  /**
   * 是否在小程序展示(0-不展示，1-展示)
   */
  isShowMiniapp: number
  /**
   * 创建时间
   */
  createTime: string
  /**
   * 创建人
   */
  createUser: string
  /**
   * 创建人姓名
   */
  createUserName: string
  /**
   * 编辑时间
   */
  updateTime: string
  /**
   * 编辑人
   */
  updateUser: string
  /**
   * 编辑人姓名
   */
  updateUserName: string
  /**
   * 子部门
   */
  children: CountryAreaVO[]
}

export interface LoginResult {
  /**
   * 访问token
   */
  accessToken: string
  /**
   * token 类型
   */
  tokenType: string
  /**
   * 刷新token
   */
  refreshToken: string
  /**
   * 过期时间(单位：毫秒)
   */
  expires: number
}

export interface KsCustForm {
  /**
   * 用户id
   */
  id: string
  /**
   * 用户头像
   */
  avatar: string
  /**
   * 用户昵称
   */
  nickname: string
  /**
   * 用户账户
   */
  username: string
  /**
   * 用户密码
   */
  password: string
  /**
   * 真实姓名
   */
  realName: string
  /**
   * 性别
   */
  gender: string
  /**
   * 用户备注
   */
  mark: string
  /**
   * 父级id
   */
  parentId: string
  /**
   * 用户ID
   */
  userId: number
  registerFrom: string
  /**
   * 手机号码
   */
  phone: string
  /**
   * 用户余额
   */
  balance: number
  /**
   * 用户剩余金币
   */
  goldBalance: number
  /**
   * 用户剩余积分
   */
  integralBalance: number
  /**
   * 1为正常，0为禁止
   */
  status: boolean
  /**
   * 颜色
   */
  preferenceColor: string
  /**
   * 亲子账户人数
   */
  familyMemberCount: number
  /**
   * 常住地
   */
  addres: string
  /**
   * 微信用户json信息
   */
  wxProfile: string
  deleted: number
  /**
   * 注册时间
   */
  createTime: string
  /**
   * 最后一次登录时间
   */
  updateTime: string
  /**
   * 生日
   */
  birthday: string
  /**
   * 用户等级
   */
  level: number
  /**
   * wechat openID
   */
  openId: string
  /**
   * 性别 1 男  2 女
   */
  sex: boolean
  /**
   * 爱好
   */
  hobbies: string
  /**
   * 希望学习的课程
   */
  courses: string
  /**
   * 积分
   */
  points: number
  addresList: string[]
  childNum: number
  /**
   * 邀请他人的邀请码
   */
  invitationCustCode: string
  invitationCust: string
  custId: string
  /**
   * 自身邀请码
   */
  invitationCode: string
  /**
   * 邀请时间
   */
  invitationTime: string
  /**
   * 渠道，OnLine-线上小程序，OffLine-线下后台
   */
  channel: string
  /**
   * 是否白名单(0否 1是)
   */
  isWhitelist: number
}

export interface CustGoldDto {
  id: string
  addGold: number
}

export interface CustCouponQueryDto {
  couponIds: string[]
  id: string
}

export interface DistributionQuery {
  /**
   * 待分配的用户
   */
  id: string
  /**
   * 待分配的用户的父级id
   */
  parentId: string
  /**
   * 分配的后台管理人员
   */
  userIds: string
}

export interface KsCustQueryDto {
  parentId: string
}

export interface KsCustVO {
  /**
   * 用户id
   */
  id: string
  /**
   * 用户头像
   */
  avatar: string
  /**
   * 用户昵称
   */
  nickname: string
  /**
   * 用户账户
   */
  username: string
  /**
   * 用户密码
   */
  password: string
  /**
   * 真实姓名
   */
  realName: string
  /**
   * 性别
   */
  gender: string
  /**
   * 用户备注
   */
  mark: string
  /**
   * 父级id
   */
  parentId: string
  /**
   * 用户ID
   */
  userId: number
  registerFrom: string
  /**
   * 手机号码
   */
  phone: string
  /**
   * 用户余额
   */
  balance: number
  /**
   * 用户剩余金币
   */
  goldBalance: number
  /**
   * 用户剩余积分
   */
  integralBalance: number
  /**
   * 1为正常，0为禁止
   */
  status: boolean
  /**
   * 颜色
   */
  preferenceColor: string
  /**
   * 亲子账户人数
   */
  familyMemberCount: number
  /**
   * 常住地
   */
  addres: string
  /**
   * 微信用户json信息
   */
  wxProfile: string
  deleted: number
  /**
   * 注册时间
   */
  createTime: string
  /**
   * 最后一次登录时间
   */
  updateTime: string
  /**
   * 生日
   */
  birthday: string
  /**
   * 用户等级
   */
  level: number
  /**
   * wechat openID
   */
  openId: string
  /**
   * 性别 1 男  2 女
   */
  sex: boolean
  /**
   * 爱好
   */
  hobbies: string
  /**
   * 希望学习的课程
   */
  courses: string
  courseId: string
  childNum: number
  /**
   * 管理人员，多个用，隔开
   */
  managerPerson: string
  createUser: string
  createUserName: string
  /**
   * 黑名单  0 否  1  是
   */
  disallowLogin: number
}

export interface KsCustChannelChangeDto {
  /**
   * 会员账号id
   */
  id: string
  /**
   * 渠道，OnLine-线上小程序，OffLine-线下后台
   */
  channel: string
}

export interface KsCustAttachDto {
  /**
   * 目标父账号id
   */
  targetId: string
  /**
   * 待挂靠的会员id，挂靠后成为子账号
   */
  toAttachId: string
}

export interface IPagePointsRulesVO {
  size: number
  current: number
  records: PointsRulesVO[]
  pages: number
  total: number
}

export interface PointsRulesVO {
  /**
   * 积分规则ID
   */
  id: number
  /**
   * 积分规则名称
   */
  ruleName: string
  /**
   * 积分增加比例
   */
  pointAddRatio: number
  /**
   * 积分兑换比例
   */
  pointRedemptionRatio: number
  /**
   * 积分有效时长(分钟)
   */
  ruleValidit: number
  /**
   * 是否启用(0否 1是)
   */
  ruleStatus: number
  /**
   * 是否删除(0否 1是)
   */
  delFlag: number
  /**
   * 创建时间
   */
  createTime: string
  /**
   * 创建人
   */
  createUser: string
  /**
   * 编辑时间
   */
  updateTime: string
  /**
   * 编辑人
   */
  updateUser: string
}

export interface IPageMemberRuleVO {
  size: number
  current: number
  records: MemberRuleVO[]
  pages: number
  total: number
}

export interface MemberRuleVO {
  /**
   * 会员等级规则ID
   */
  id: number
  /**
   * 会员等级规则ID
   */
  level: number
  /**
   * 会员等级名称
   */
  levelName: string
  /**
   * 会员等级规则ID
   */
  levelRule: number
  /**
   * 邀请加分比例
   */
  invitedRatio: number
  /**
   * 消费加分比例
   */
  consumeRatio: number
  /**
   * 积分兑换比例
   */
  exchangeRatio: number
  /**
   * 积分有效时长(天)
   */
  duration: number
  /**
   * 会员折扣
   */
  discount: number
  /**
   * 创建时间
   */
  createTime: string
  /**
   * 创建人
   */
  createUser: string
  /**
   * 编辑时间
   */
  updateTime: string
  /**
   * 编辑人
   */
  updateUser: string
  /**
   * 是否删除(0否 1是)
   */
  delFlag: number
  /**
   * 能否查看讲师详情，0不可以，1可以
   */
  isShowTeacherDetail: number
  /**
   * 可查看的课程数量，-1表示不限制
   */
  viewableCourseCount: number
  /**
   * 可查看的讲师数量，-1表示不限制
   */
  viewableTeacherCount: number
  /**
   * 能否查看课程价格，0不可以，1可以
   */
  isShowCoursePrice: number
  /**
   * 权益说明
   */
  interestsStatement: string
  /**
   * 积分获取
   */
  integralGain: string
  /**
   * 权益规则
   */
  equityRules: string
}

export interface BaseDto {
  level: number
  name: string
}

export interface IPageRotationChartPageVO {
  size: number
  current: number
  records: RotationChartPageVO[]
  pages: number
  total: number
}

export interface RotationChartPageVO {
  /**
   * 主键
   */
  id: string
  /**
   * 活动名称
   */
  name: string
  /**
   * 轮播图
   */
  bannerPicture: string
  /**
   * 跳转地址
   */
  jumpUrl: string
  /**
   * 显示顺序
   */
  sort: number
  /**
   * 状态(1:启用;0:停用)
   */
  status: number
  /**
   * 创建时间
   */
  createTime: string
  /**
   * 更新时间
   */
  updateTime: string
  /**
   * 创建人ID
   */
  createUser: string
  /**
   * 修改人ID
   */
  updateUser: string
  /**
   * 类型编码
   */
  typeCode: string
  /**
   * 类型名称
   */
  typeName: string
}

export interface RotationChart {
  createTime: string
  updateTime: string
  id: string
  name: string
  bannerPicture: string
  jumpUrl: string
  sort: number
  status: number
  createUser: string
  updateUser: string
  /**
   * 类型编码
   */
  typeCode: string
  /**
   * 类型名称
   */
  typeName: string
}

export interface PassCourseVO {
  /**
   * 课程ID
   */
  courseId: string
  /**
   * 课程名称
   */
  name: string
}

export interface PassDetailVO {
  /**
   * 卡ID
   */
  id: string
  /**
   * 卡名称
   */
  name: string
  /**
   * 卡类型
   */
  type: string
  /**
   * 购买价格
   */
  purchasePrice: number
  /**
   * 可用额度
   */
  availableAmount: number
  /**
   * 可用次数
   */
  availableTimes: number
  /**
   * 有效期开始时间戳
   */
  validStartTime: number
  /**
   * 有效期结束时间戳
   */
  validEndTime: number
  /**
   * 创建时间
   */
  createTime: string
  /**
   * 更新时间
   */
  updateTime: string
  /**
   * 卡关联的课程列表
   */
  courseList: PassCourseVO[]
}

export interface OrderItem {
  column: string
  asc: boolean
}

export interface PagePassPageVO {
  records: PassPageVO[]
  total: number
  size: number
  current: number
  orders: OrderItem[]
  optimizeCountSql: PagePassPageVO
  searchCount: PagePassPageVO
  optimizeJoinOfCountSql: boolean
  maxLimit: number
  countId: string
  pages: number
}

export interface PassPageVO {
  /**
   * 卡ID
   */
  id: string
  /**
   * 卡名称
   */
  name: string
  /**
   * 卡类型
   */
  type: string
  /**
   * 购买价格
   */
  purchasePrice: number
  /**
   * 可用额度
   */
  availableAmount: number
  /**
   * 可用次数
   */
  availableTimes: number
  /**
   * 有效期开始时间戳
   */
  validStartTime: number
  /**
   * 有效期结束时间戳
   */
  validEndTime: number
  /**
   * 创建时间
   */
  createTime: string
  /**
   * 更新时间
   */
  updateTime: string
}

export interface HotWordRecordPageVO {
  /**
   * 主键
   */
  id: string
  /**
   * 热词
   */
  name: string
  /**
   * 显示顺序
   */
  count: number
  /**
   * 创建时间
   */
  createTime: string
  /**
   * 更新时间
   */
  updateTime: string
}

export interface IPageHotWordRecordPageVO {
  size: number
  current: number
  records: HotWordRecordPageVO[]
  pages: number
  total: number
}

export interface CourseDetailVO {
  /**
   * 课程中文名
   */
  chineseName: string
  /**
   * 课程英文名
   */
  englishName: string
  /**
   * 课程图片 URL
   */
  imageUrl: string
  /**
   * 课程所属的门店 ID
   */
  storeId: string
  /**
   * 课程规则类型，瑜伽课程或团课
   */
  type: string
  /**
   * 课班规模，大班课，小班课，私教课
   */
  size: string
  /**
   * 价格
   */
  price: number
  /**
   * 课程状态
   */
  status: string
  /**
   * 课程主要训练目标
   */
  mainTrainingGoal: string
  /**
   * 课程次要训练目标
   */
  secondaryTrainingGoal: string[]
  /**
   * 开课时间-开始
   */
  startTime: number
  /**
   * 开课时间-结束
   */
  startEnd: number
  /**
   * 排序号
   */
  sortNumber: number
  /**
   * 难度星级
   */
  difficultyRate: string
  /**
   * 课程描述
   */
  description: string
  /**
   * 课程 ID
   */
  id: string
  /**
   * 创建者id
   */
  createUserId: string
  /**
   * 创建时间
   */
  createTime: string
  /**
   * 更新者id
   */
  updateUserId: string
  /**
   * 更新时间
   */
  updateTime: string
}

export interface IPageCourseDetailVO {
  size: number
  current: number
  records: CourseDetailVO[]
  pages: number
  total: number
}

export interface CountryAreaPageVO {
  /**
   * id
   */
  id: string
  /**
   * 名称
   */
  name: string
  /**
   * 英文名称
   */
  nameEn: string
  /**
   * 级别1,2,3,4
   */
  level: number
  /**
   * 父级id
   */
  parentId: string
  /**
   * id全路径
   */
  idPath: string
  /**
   * 是否在小程序展示(0-不展示，1-展示)
   */
  isShowMiniapp: number
  /**
   * 创建时间
   */
  createTime: string
  /**
   * 创建人
   */
  createUser: string
  /**
   * 创建人姓名
   */
  createUserName: string
  /**
   * 编辑时间
   */
  updateTime: string
  /**
   * 编辑人
   */
  updateUser: string
  /**
   * 编辑人姓名
   */
  updateUserName: string
}

export interface IPageCountryAreaPageVO {
  size: number
  current: number
  records: CountryAreaPageVO[]
  pages: number
  total: number
}

export interface CaptchaResult {
  /**
   * 验证码缓存key
   */
  captchaKey: string
  /**
   * 验证码图片Base64字符串
   */
  captchaBase64: string
}

export interface ArticleManagementPageVO {
  /**
   * 主键
   */
  id: string
  /**
   * 文章名称
   */
  title: string
  /**
   * 文章内容
   */
  articleDesc: string
  /**
   * 链接地址
   */
  linkUrl: string
  /**
   * 创建时间
   */
  createTime: string
  /**
   * 更新时间
   */
  updateTime: string
  /**
   * 创建人ID
   */
  createUser: string
  createUserName: string
  updateUserName: string
  /**
   * 主图
   */
  mainPicture: string
  /**
   * 修改人ID
   */
  updateUser: string
  /**
   * 文章分类
   */
  articleType: string
}

export interface IPageArticleManagementPageVO {
  size: number
  current: number
  records: ArticleManagementPageVO[]
  pages: number
  total: number
}

export interface AgreementPageVO {
  /**
   * 主键
   */
  id: string
  /**
   * 标题
   */
  title: string
  /**
   * 内容
   */
  contentData: string
  /**
   * 创建时间
   */
  createTime: string
  /**
   * 更新时间
   */
  updateTime: string
  /**
   * 创建人ID
   */
  createUser: string
  /**
   * 修改人ID
   */
  updateUser: string
  /**
   * 是否展示
   */
  isDisplay: number
}

export interface IPageAgreementPageVO {
  size: number
  current: number
  records: AgreementPageVO[]
  pages: number
  total: number
}

export interface IPageRichTextPageVO {
  size: number
  current: number
  records: RichTextPageVO[]
  pages: number
  total: number
}

export interface RichTextPageVO {
  /**
   * 主键
   */
  id: number
  /**
   * 标题
   */
  title: string
  /**
   * 内容
   */
  contentData: string
  /**
   * 图片url
   */
  mainPicture: string
  /**
   * 是否展示
   */
  isDisplay: number
  /**
   * 创建时间
   */
  createTime: string
  /**
   * 更新时间
   */
  updateTime: string
  /**
   * 创建人ID
   */
  createUser: string
  /**
   * 修改人ID
   */
  updateUser: string
}

export interface IPageKsCustPageVO {
  size: number
  current: number
  records: KsCustPageVO[]
  pages: number
  total: number
}

export interface KsCustPageVO {
  /**
   * 用户id
   */
  id: string
  /**
   * 用户头像
   */
  avatar: string
  /**
   * 用户昵称
   */
  nickname: string
  /**
   * 用户账户
   */
  username: string
  /**
   * 用户密码
   */
  password: string
  /**
   * 真实姓名
   */
  realName: string
  /**
   * 性别
   */
  gender: string
  /**
   * 用户备注
   */
  mark: string
  /**
   * 父级id
   */
  parentId: string
  /**
   * 用户ID
   */
  userId: number
  registerFrom: string
  /**
   * 手机号码
   */
  phone: string
  /**
   * 用户余额
   */
  balance: number
  /**
   * 用户剩余金币
   */
  goldBalance: number
  /**
   * 用户剩余积分
   */
  integralBalance: number
  /**
   * 1为正常，0为禁止
   */
  status: boolean
  /**
   * 颜色
   */
  preferenceColor: string
  /**
   * 子账户人数
   */
  childNum: number
  /**
   * 常住地
   */
  addres: string
  /**
   * 微信用户json信息
   */
  wxProfile: string
  deleted: number
  /**
   * 注册时间
   */
  createTime: string
  /**
   * 最后一次登录时间
   */
  updateTime: string
  /**
   * 生日
   */
  birthday: string
  /**
   * 用户等级
   */
  level: number
  /**
   * wechat openID
   */
  openId: string
  /**
   * 性别 1 男  2 女
   */
  sex: boolean
  /**
   * 爱好
   */
  hobbies: string
  /**
   * 希望学习的课程
   */
  courses: string
  courseId: string
  /**
   * 总积分
   */
  points: number
  /**
   * 渠道，OnLine-线上小程序，OffLine-线下后台
   */
  channel: string
  /**
   * 用户来源取自字典小程序码用途
   */
  userSource: string
  /**
   * 邀请人名称
   */
  invitationCust: string
  /**
   * 黑名单  0 否  1  是
   */
  disallowLogin: number
}

export interface KsCustBaseDto {
  id: string
  name: string
  nickName: string
  phone: string
}

export interface KsCust {
  id: string
  avatar: string
  nickname: string
  username: string
  password: string
  realName: string
  gender: string
  mark: string
  parentId: string
  userId: number
  registerFrom: string
  phone: string
  balance: number
  goldBalance: number
  integralBalance: number
  status: boolean
  preferenceColor: string
  familyMemberCount: number
  addres: string
  wxProfile: string
  deleted: number
  createTime: string
  updateTime: string
  birthday: string
  level: number
  points: number
  effectivePoints: number
  availablePoints: number
  expiredPoints: number
  usedPoints: number
  openId: string
  sex: boolean
  hobbies: string
  courses: string
  courseId: string
  childNum: number
  invitationCode: string
  custId: string
  /**
   * 邀请时间
   */
  invitationTime: string
  channel: string
  managerPerson: string
  createUser: string
  createUserName: string
  unlimitCode: string
  /**
   * 用户来源取自字典小程序码用途
   */
  userSource: string
  /**
   * 邀请人名称
   */
  invitationCust: string
  /**
   * 邀请人类型  1 员工  2 会员
   */
  invitationType: number
  /**
   * 黑名单  0 否  1  是
   */
  disallowLogin: number
  isWhitelist: number
  /**
   * 邀请人部门id
   */
  invitationCustDeptId: number
}


export interface TeacherQuery extends PageQuery {
  keywords?: string
}

export interface TeacherForm {
  /* */
  id?: number

  /* 讲师姓名 */
  name: string

  /* 展示名称 */
  displayName?: string

  /* 英文名 */
  englishName?: string

  /* 国籍 */
  nationality?: string

  /* 讲师头像 */
  avatarUrl?: string

  /* 性别 */
  gender?: string

  /* 年龄 */
  age?: number

  /* 教学年限，教龄 */
  teachingExperience?: number

  /* 生日，格式为yyyy-MM-dd */
  birthday?: string

  /* 所属机构id */
  institutionId: number

  /* 毕业院校 */
  graduationSchool?: string

  /* 最高学历 */
  highestDegree?: string

  /* 所学专业 */
  major?: string

  /* 宣传语 */
  slogan?: string

  /* 讲师信息证明资料 */
  proofMaterials?: {
    /* 身份证正面 */
    idCardFront?: string

    /* 身份证反面 */
    idCardBack?: string

    /* 社会保障卡正面 */
    socialSecurityCardFront?: string

    /* 社会保障卡反面 */
    socialSecurityCardBack?: string

    /* 驾照 */
    driverLicense?: string

    /* 护照 */
    passport?: string

    /* 学历证明 */
    degreeCertificate?: string
  }

  /* 讲师表单自我介绍对象 */
  introduction?: {
    /* 详细介绍 */
    detailedIntroduction?: string

    /* 视频介绍地址 */
    videoIntroductionUrl?: string
  }

  /* 讲师信息教育履历表单对象 */
  experienceList?: {
    /* 职务名称 */
    jobTitle?: string

    /* 机构名称 */
    institutionName?: string

    /* 在职时间 */
    employmentPeriod?: string

    /* 教学内容 */
    teachingContent?: string

    /* 获得成就奖项 */
    achievements?: string
  }[]

  /* 讲师信息教育背景表单对象 */
  educationBackgroundList?: {
    /* 学校名称 */
    schoolName?: string

    /* 所在国家 */
    country?: string

    /* 专业名称 */
    major?: string

    /* 学历 */
    degree?: string

    // /* 学习开始时间 */
    // studyStartDate?: string

    // /* 学习结束时间 */
    // studyEndDate?: string
  }[]
}

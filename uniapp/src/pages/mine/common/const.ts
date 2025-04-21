export interface MenuItem {
  src: string;
  name: string;
  path: string;
}

export const menu: MenuItem[] = [
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
];

export const operationList: MenuItem[] = [
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
];

export const pointItem: MenuItem = {
  src: "icon_center_point@2x.png",
  name: "积分",
  path: "/pages/points/points",
};

export const walletItem: MenuItem = {
  src: "icon_center_wallet@2x.png",
  name: "我的钱包",
  path: "/pages/myWallet/myWallet",
};

export interface VipLevelConfig {
  level: number;
  avatarFrame: string;
  vipLogo: string;
  levelName: string;
  levelColor: string;
}

export const vipLevels: VipLevelConfig[] = [
  {
    level: 1,
    avatarFrame: "vip_kuang1@2x.png",
    vipLogo: "Group 1779@2x.png",
    levelName: "普通会员",
    levelColor: "gray"
  },
  {
    level: 2,
    avatarFrame: "vip_kuang2@2x.png",
    vipLogo: "Group 1780@2x.png",
    levelName: "白银会员",
    levelColor: "orange"
  },
  {
    level: 3,
    avatarFrame: "vip_kuang3@2x.png",
    vipLogo: "Group 1785@2x.png",
    levelName: "黄金会员",
    levelColor: "purple"
  },
  {
    level: 4,
    avatarFrame: "vip_kuang4@2x.png",
    vipLogo: "Group 1786@2x.png",
    levelName: "钻石会员",
    levelColor: "green"
  }
];

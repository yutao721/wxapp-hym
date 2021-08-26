import { IMGPATH } from './config/config';
import { Log } from './lib/log';
import { Interaction } from './utils/interaction';
import { promiseWXApi } from './utils/index';
import Event from './lib/eventBus';
import { Util } from './utils/util';

const IA = new Interaction();
const U = new Util();
const E = new Event();

App({
  $IA: IA,
  $util: U,
  $event: E,
  $imgPath: IMGPATH,
  $menuButton: wx.getMenuButtonBoundingClientRect(),
  $system: wx.getSystemInfoSync(),

  onLaunch() {
    this.setPromiseForWXApi();
    let that = this;
    // 获取系统信息
    try {
      const deviceInfo = wx.getSystemInfoSync();
      let isIphonex = false;
      if (deviceInfo.safeArea) isIphonex = deviceInfo.safeArea.top > 20
      that.globalData.deviceInfo = deviceInfo;
      that.globalData.isIphonex = isIphonex;
    } catch (e) {
      // Do something when catch error
    }

  },

  globalData: {
    isIphonex: false,
    deviceInfo: {},
    tempParams: {},
    wxp: {}, //全局微信api-Promise化管理器
    tabBar: {
      backgroundColor: '#ffffff',
      color: '#C5C5C5',
      selectedColor: '#FDD040',
      list: []
    },
    userInfo: null
  },

  /**
   * @description 设置全局promise化微信小程序api
   * @author YoKa_zhangxm
   * @date 2021-01-11
   */
  setPromiseForWXApi() {
    this.globalData.wxp = promiseWXApi();
  },

  /**
   * @description 监听用户选择tabbar
   * @author YoKa_zhangxm
   * @date 2020-12-31
   */
  changeTabbar() {
    let tabbar = this.globalData.tabBar;
    let currentPages = getCurrentPages();
    let _this = currentPages[currentPages.length - 1];
    let pagePath = _this.route;
    pagePath.indexOf('/') != 0 && (pagePath = '/' + pagePath);
    for (let i in tabbar.list) {
      tabbar.list[i].selected = false;
      tabbar.list[i].pagePath == pagePath && (tabbar.list[i].selected = true);
    }
    _this.setData({ tabbar });
  }

});
